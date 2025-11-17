# Terraform Infrastructure for Sigma Hawk Tua Backend

This directory contains Terraform configurations for deploying the backend application to Google Cloud Platform with separate environments (dev and production).

## 📁 Directory Structure

```
terraform-new/
├── modules/                    # Reusable Terraform modules
│   ├── artifact-registry/     # Docker registry
│   ├── cloud-build/           # CI/CD triggers
│   ├── cloud-run/             # Serverless containers
│   ├── cloud-sql/             # PostgreSQL database
│   └── secrets/               # Secret Manager
├── environments/
│   ├── dev/                   # Development environment
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── terraform.tfvars.example
│   └── prod/                  # Production environment
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── terraform.tfvars.example
```

## 🏗️ Infrastructure Components

### **Development Environment**
- **Cloud Run**: Backend service (0-5 instances)
- **Cloud SQL**: PostgreSQL 15 with `db-g1-small` tier (ZONAL)
- **Artifact Registry**: Docker image repository
- **Secret Manager**: Secure storage for secrets
- **Cloud Build**: Manual deployment trigger

### **Production Environment**
- **Cloud Run**: Backend service (1-10 instances, always warm)
- **Cloud SQL**: PostgreSQL 15 with `db-g1-small` tier (**REGIONAL** high availability)
- **Artifact Registry**: Docker image repository  
- **Secret Manager**: Secure storage for secrets
- **Cloud Build**: Manual deployment trigger
- **Cloud Scheduler**: Health check every 5 minutes

## 🔧 Key Differences: Dev vs Prod

| Feature | Development | Production |
|---------|------------|------------|
| **Database Tier** | db-g1-small | db-g1-small |
| **Availability** | ZONAL | REGIONAL (HA) |
| **Backups** | 3 days | 30 days |
| **PITR** | Disabled | Enabled |
| **Min Instances** | 0 (cold start) | 1 (always warm) |
| **Max Instances** | 5 | 10 |
| **Deletion Protection** | No | Yes |
| **Query Insights** | No | Yes |
| **Health Checks** | No | Yes (5 min) |
| **Database IP** | Public | Public with SSL |

## 🚀 Quick Start

### **Prerequisites**

1. **Install Tools:**
   ```bash
   # Install Terraform
   brew install terraform  # macOS
   # or download from https://www.terraform.io/downloads
   
   # Install gcloud CLI
   brew install google-cloud-sdk  # macOS
   ```

2. **Authenticate with GCP:**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable Required APIs:**
   ```bash
   gcloud services enable \
     run.googleapis.com \
     cloudbuild.googleapis.com \
     artifactregistry.googleapis.com \
     sqladmin.googleapis.com \
     secretmanager.googleapis.com \
     cloudscheduler.googleapis.com
   ```

4. **Connect GitHub Repository to Cloud Build:**
   - Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
   - Click "Connect Repository"
   - Select GitHub and authorize
   - Choose `G08SE25-Kikkaksaranungkukuk/sigma-hawk-tua-backend`

### **Deploy Development Environment**

```bash
# Navigate to dev environment
cd terraform-new/environments/dev

# Copy and edit configuration
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Fill in your values

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply
```

### **Deploy Production Environment**

```bash
# Navigate to prod environment
cd terraform-new/environments/prod

# Copy and edit configuration
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Fill in your production values

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes (be careful in production!)
terraform apply
```

## 📝 Configuration Guide

### **Required Variables**

Edit `terraform.tfvars` in each environment:

```hcl
# GCP Configuration
project_id = "your-gcp-project-id"
region     = "asia-southeast1"

# Database Configuration
db_password = "STRONG_RANDOM_PASSWORD"  # Generate with: openssl rand -base64 32

# JWT Secrets (DO NOT commit these!)
jwt_access_secret  = "RANDOM_ACCESS_SECRET"   # Generate with: openssl rand -base64 32
jwt_refresh_secret = "RANDOM_REFRESH_SECRET"  # Generate with: openssl rand -base64 32
```

### **Generate Secure Secrets**

```bash
# Generate strong passwords
openssl rand -base64 32

# Or use this one-liner to generate all secrets
echo "DB_PASSWORD=$(openssl rand -base64 32)"
echo "JWT_ACCESS=$(openssl rand -base64 32)"
echo "JWT_REFRESH=$(openssl rand -base64 32)"
```

## 🔨 Cloud Build Deployment (Hybrid CI/CD)

### **How It Works**

```
GitHub Actions (CI)           Cloud Build (CD)
├─ Run Tests                  ├─ Build Docker Image
├─ SonarQube Quality Gate     ├─ Push to Artifact Registry
└─ Snyk Security Scan         └─ Deploy to Cloud Run
         ↓                              ↑
    ✅ Pass  ─────(Manual Trigger)──────┘
```

### **Trigger Cloud Build (Manual)**

```bash
# For Development
gcloud builds submit \
  --config=cloudbuild.dev.yaml \
  --project=YOUR_PROJECT_ID

# For Production
gcloud builds submit \
  --config=cloudbuild.production.yaml \
  --project=YOUR_PROJECT_ID
```

### **Or via Console:**
1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Find your trigger (e.g., `sigma-hawk-tua-backend-deploy-production`)
3. Click "Run Trigger"
4. Select branch: `main`

## 🗄️ Database Management

### **Connect to Cloud SQL**

```bash
# Development
gcloud sql connect sigma-hawk-tua-backend-db-dev --user=sigma --database=sigmadb_dev

# Production
gcloud sql connect sigma-hawk-tua-backend-db-production --user=sigma --database=sigmadb
```

### **Run Migrations**

Migrations run automatically on Cloud Run startup. To run manually:

```bash
# Get Cloud Run service URL
SERVICE_URL=$(gcloud run services describe sigma-hawk-tua-backend-production \
  --region=asia-southeast1 \
  --format='value(status.url)')

# Migrations are embedded in Dockerfile.cloudrun startup command
# Check logs:
gcloud run services logs read sigma-hawk-tua-backend-production --region=asia-southeast1
```

### **Backup Database**

```bash
# Create manual backup
gcloud sql backups create \
  --instance=sigma-hawk-tua-backend-db-production

# List backups
gcloud sql backups list --instance=sigma-hawk-tua-backend-db-production

# Restore from backup
gcloud sql backups restore BACKUP_ID \
  --backup-instance=sigma-hawk-tua-backend-db-production \
  --backup-id=BACKUP_ID
```

## 🔍 Monitoring & Debugging

### **View Cloud Run Logs**

```bash
# Tail logs
gcloud run services logs tail sigma-hawk-tua-backend-production --region=asia-southeast1

# Read recent logs
gcloud run services logs read sigma-hawk-tua-backend-production --region=asia-southeast1 --limit=100
```

### **Check Service Status**

```bash
# Get service URL
gcloud run services describe sigma-hawk-tua-backend-production \
  --region=asia-southeast1 \
  --format='value(status.url)'

# Test health endpoint
curl https://YOUR_SERVICE_URL/healthz

# Test API docs
curl https://YOUR_SERVICE_URL/api-docs
```

### **Check Cloud Build History**

```bash
# List recent builds
gcloud builds list --limit=10

# View specific build
gcloud builds describe BUILD_ID
```

## 💰 Cost Estimation

### **Development (~$25-30/month)**
- Cloud Run: ~$0-5/month (0 min instances)
- Cloud SQL (db-g1-small, ZONAL): ~$25/month
- Artifact Registry: ~$0.10/GB
- Cloud Build: Free (120 builds/day)

### **Production (~$60-80/month)**
- Cloud Run: ~$10-20/month (1 min instance)
- Cloud SQL (db-g1-small, REGIONAL): ~$50/month
- Artifact Registry: ~$1-2/month
- Cloud Build: Free
- Cloud Scheduler: ~$0.10/month

### **Total: ~$85-110/month** for both environments

## 🔒 Security Best Practices

✅ **Implemented:**
- Secrets in Secret Manager (not in code)
- SSL required for database connections
- Public IP with authorized networks option
- Deletion protection for production database
- Service accounts with least privilege
- Separate environments (dev/prod isolation)

⚠️ **Additional Recommendations:**
- Restrict Cloud SQL `authorized_networks` to office/VPN IPs
- Enable Cloud Armor for DDoS protection
- Set up VPC Service Controls
- Rotate secrets regularly
- Enable audit logging

## 🧹 Cleanup

### **Destroy Development Environment**

```bash
cd terraform-new/environments/dev
terraform destroy
```

### **Destroy Production Environment**

```bash
cd terraform-new/environments/prod

# Remove deletion protection first
terraform apply -var="deletion_protection=false"

# Then destroy
terraform destroy
```

⚠️ **Warning:** This will permanently delete all resources including databases!

## 📚 Additional Resources

- [Terraform Google Provider Docs](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Best Practices](https://cloud.google.com/sql/docs/postgres/best-practices)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)

## 🐛 Troubleshooting

### **Issue: "API not enabled"**
```bash
# Enable all required APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com
```

### **Issue: "Permission denied"**
```bash
# Check your account has necessary roles
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:YOUR_EMAIL"
```

### **Issue: "Cloud Build trigger not working"**
1. Check GitHub connection: [Cloud Build Settings](https://console.cloud.google.com/cloud-build/settings)
2. Verify repository is connected
3. Check trigger configuration matches branch name

### **Issue: "Database connection failed"**
```bash
# Check if database is running
gcloud sql instances describe INSTANCE_NAME

# Verify connection string in Secret Manager
gcloud secrets versions access latest --secret="SECRET_NAME"

# Check Cloud Run service account has cloudsql.client role
```

## 📧 Support

For issues or questions, contact the DevOps team or create an issue in the repository.
