# CD Workflow Setup Guide

This guide explains how to set up the Continuous Deployment (CD) workflow that builds Docker images to Google Artifact Registry and backs up databases to Cloud Storage.

## 🔐 Required GitHub Secrets

Set up the following secrets in your GitHub repository (`Settings > Secrets and variables > Actions`):

### **Required Secrets:**

1. **`GCP_SA_KEY`** (Required)
   - Service Account JSON key with necessary permissions
   - Create service account with roles:
     - `Artifact Registry Writer`
     - `Cloud Run Admin`
     - `Cloud SQL Admin`
     - `Storage Admin`
     - `Service Account User`
   
   ```bash
   # Create service account
   gcloud iam service-accounts create github-actions-cd \
     --display-name="GitHub Actions CD"
   
   # Grant roles
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions-cd@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/artifactregistry.writer"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions-cd@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions-cd@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/cloudsql.admin"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions-cd@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions-cd@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   
   # Create and download key
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions-cd@YOUR_PROJECT_ID.iam.gserviceaccount.com
   
   # Copy the entire content of key.json as GCP_SA_KEY secret
   ```

2. **`GCP_PROJECT_ID`** (Required)
   - Your Google Cloud Project ID
   - Example: `sigma-hawk-tua-prod`

3. **`GCP_REGION`** (Optional, defaults to `asia-southeast1`)
   - GCP region for resources
   - Options: `asia-southeast1`, `us-central1`, `europe-west1`, etc.

4. **`DB_BACKUP_BUCKET`** (Required)
   - Cloud Storage bucket name for database backups
   - Example: `sigma-hawk-tua-db-backups`
   - Bucket will be created automatically if it doesn't exist

5. **`CLOUD_SQL_INSTANCE_NAME`** (Optional, for database backup)
   - Cloud SQL instance name
   - Example: `sigma-hawk-tua-db-production`
   - Format: `instance-name` (not the connection name)

6. **`DB_NAME`** (Optional, defaults to `sigmadb`)
   - Database name to backup
   - Example: `sigmadb`

7. **`SNYK_TOKEN`** (Optional, for security scanning)
   - Snyk API token for security scanning
   - Get from: https://app.snyk.io/account

### **Secrets for Cloud Run Deployment:**

These should be stored in Google Secret Manager and referenced in the workflow:

8. **`DATABASE_URL`** (in Secret Manager)
   - PostgreSQL connection string
   - Example: `postgresql://user:pass@host:5432/dbname`

9. **`ACCESSTOKEN_SECRET`** (in Secret Manager)
   - JWT access token secret

10. **`REFRESHTOKEN_SECRET`** (in Secret Manager)
    - JWT refresh token secret

## 📋 Workflow Jobs

### **1. Build and Test**
- Installs dependencies
- Runs database migrations
- Executes tests
- Builds the application

### **2. Security Scan**
- Runs Snyk SAST analysis
- Uploads results to GitHub Security

### **3. Build and Push Image to GAR**
- Generates unique image tags
- Builds Docker image using `Dockerfile.cloudrun`
- Pushes to Google Artifact Registry with multiple tags:
  - `{branch}-{short-sha}-{timestamp}` (unique)
  - `latest`
  - `{branch-name}`

### **4. Backup Database to Cloud Storage**
- Creates Cloud Storage bucket if needed
- Exports Cloud SQL database to `.sql` file
- Backs up Prisma schema
- Archives and uploads migrations
- Applies 30-day retention policy

### **5. Deploy to Cloud Run** (Optional)
- Deploys the new image to Cloud Run
- Configures environment variables
- Sets up autoscaling

## 🚀 How to Use

### **Automatic Deployment:**
Push to `main` branch:
```bash
git push origin main
```

### **Manual Deployment:**
Go to `Actions > Continuous Deployment > Run workflow`

## 📦 Image Tags Created

Each build creates 3 tags:
1. **Unique tag**: `main-a1b2c3d-20251110-143022`
2. **Latest tag**: `latest`
3. **Branch tag**: `main`

Access your images:
```
{region}-docker.pkg.dev/{project-id}/sigma-hawk-tua-backend-repo/sigma-hawk-tua-backend:latest
```

## 💾 Database Backup Structure

Cloud Storage bucket structure:
```
gs://{bucket-name}/
├── backups/
│   ├── backup-20251110-143022.sql
│   └── backup-20251109-120000.sql
├── schemas/
│   ├── latest.prisma
│   ├── schema-20251110-143022.prisma
│   └── schema-20251109-120000.prisma
└── migrations/
    ├── migrations-20251110-143022.tar.gz
    └── migrations-20251109-120000.tar.gz
```

## 🔄 Restore Database from Backup

### **Restore from Cloud Storage:**
```bash
# List available backups
gsutil ls gs://{bucket-name}/backups/

# Download backup
gsutil cp gs://{bucket-name}/backups/backup-TIMESTAMP.sql ./backup.sql

# Import to Cloud SQL
gcloud sql import sql INSTANCE_NAME gs://{bucket-name}/backups/backup-TIMESTAMP.sql \
  --database=sigmadb
```

### **Restore locally:**
```bash
# Download backup
gsutil cp gs://{bucket-name}/backups/backup-TIMESTAMP.sql ./backup.sql

# Restore to local PostgreSQL
psql -U postgres -d sigmadb < backup.sql
```

## ⚙️ Customization

### **Change backup retention (default 30 days):**
Edit the lifecycle rule in the workflow:
```yaml
"condition": {"age": 30}  # Change to desired days
```

### **Change Cloud Run configuration:**
Edit the deploy step:
```yaml
--cpu=2 \
--memory=1Gi \
--min-instances=1 \
--max-instances=20
```

### **Skip deployment:**
Remove or comment out the `deploy-to-cloud-run` job

## 🔍 Monitoring

### **View workflow runs:**
`Actions > Continuous Deployment`

### **View built images:**
```bash
gcloud artifacts docker images list \
  {region}-docker.pkg.dev/{project-id}/sigma-hawk-tua-backend-repo/sigma-hawk-tua-backend
```

### **View backups:**
```bash
gsutil ls -lh gs://{bucket-name}/backups/
```

### **Check Cloud Run service:**
```bash
gcloud run services describe sigma-hawk-tua-backend-production \
  --region={region} \
  --format=yaml
```

## 🐛 Troubleshooting

### **Authentication errors:**
- Verify `GCP_SA_KEY` secret is correct JSON
- Check service account has required roles
- Ensure APIs are enabled in GCP project

### **Image push fails:**
- Verify Artifact Registry API is enabled
- Check repository name matches
- Ensure service account has `artifactregistry.writer` role

### **Database backup fails:**
- Verify `CLOUD_SQL_INSTANCE_NAME` is correct (instance name only)
- Check service account has `cloudsql.admin` role
- Ensure Cloud SQL Admin API is enabled

### **Cloud Storage errors:**
- Verify bucket name is globally unique
- Check service account has `storage.admin` role
- Ensure Storage API is enabled

## 📚 Additional Resources

- [Google Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)
- [Cloud SQL Backup Documentation](https://cloud.google.com/sql/docs/postgres/backup-recovery)
- [Cloud Storage Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle)
- [Cloud Run Deployment](https://cloud.google.com/run/docs/deploying)

## 🔒 Security Best Practices

1. ✅ Use service accounts with minimal required permissions
2. ✅ Store secrets in GitHub Secrets, never in code
3. ✅ Enable bucket versioning for backups
4. ✅ Use Secret Manager for application secrets
5. ✅ Regularly rotate service account keys
6. ✅ Enable audit logging in GCP
7. ✅ Review security scan results before deployment
