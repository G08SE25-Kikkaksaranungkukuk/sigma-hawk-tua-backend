# 🚀 Quick Start Guide - Terraform Deployment

## 📋 Prerequisites Checklist

- [ ] GCP Project created
- [ ] Billing enabled on GCP Project
- [ ] `terraform` installed ([Download](https://www.terraform.io/downloads))
- [ ] `gcloud` CLI installed ([Download](https://cloud.google.com/sdk/docs/install))
- [ ] GitHub repository connected to Cloud Build

## ⚡ Fast Track Deployment

### **Option 1: Using Setup Script (Recommended)**

```bash
# Run the interactive setup script
cd terraform-new
./setup.sh
```

The script will:
1. ✅ Check prerequisites
2. ✅ Let you choose environment (dev/prod)
3. ✅ Enable required APIs
4. ✅ Initialize Terraform
5. ✅ Create infrastructure
6. ✅ Show deployment URLs

---

### **Option 2: Manual Deployment**

#### **Step 1: Authenticate**

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

#### **Step 2: Connect GitHub to Cloud Build**

1. Go to https://console.cloud.google.com/cloud-build/triggers
2. Click "Connect Repository"
3. Select GitHub → Authorize → Choose `G08SE25-Kikkaksaranungkukuk/sigma-hawk-tua-backend`

#### **Step 3: Deploy Development**

```bash
# Navigate to dev environment
cd terraform-new/environments/dev

# Create configuration
cp terraform.tfvars.example terraform.tfvars

# Generate secrets
echo "db_password = \"$(openssl rand -base64 32)\"" >> terraform.tfvars
echo "jwt_access_secret = \"$(openssl rand -base64 32)\"" >> terraform.tfvars
echo "jwt_refresh_secret = \"$(openssl rand -base64 32)\"" >> terraform.tfvars

# Edit with your project ID
nano terraform.tfvars  # Change project_id

# Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com sqladmin.googleapis.com \
  secretmanager.googleapis.com cloudscheduler.googleapis.com

# Deploy
terraform init
terraform plan
terraform apply
```

#### **Step 4: Deploy Production**

```bash
# Navigate to prod environment
cd terraform-new/environments/prod

# Create configuration
cp terraform.tfvars.example terraform.tfvars

# Generate secrets
echo "db_password = \"$(openssl rand -base64 32)\"" >> terraform.tfvars
echo "jwt_access_secret = \"$(openssl rand -base64 32)\"" >> terraform.tfvars
echo "jwt_refresh_secret = \"$(openssl rand -base64 32)\"" >> terraform.tfvars

# Edit with your project ID
nano terraform.tfvars  # Change project_id

# Deploy
terraform init
terraform plan
terraform apply
```

---

## 🔨 Triggering Cloud Build Deployment

### **Option A: Via Console (Easiest)**

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Find trigger: `sigma-hawk-tua-backend-deploy-dev` or `sigma-hawk-tua-backend-deploy-production`
3. Click "RUN" button
4. Select branch: `main`
5. Click "RUN TRIGGER"

### **Option B: Via Command Line**

```bash
# Deploy to Development
gcloud builds submit --config=cloudbuild.dev.yaml

# Deploy to Production  
gcloud builds submit --config=cloudbuild.production.yaml
```

### **Option C: Via GitHub Actions (Hybrid)**

The existing GitHub Actions workflow (`.github/workflows/cd.yml`) runs tests and quality checks. After passing:

1. Go to Cloud Build console
2. Manually trigger deployment
3. This provides quality gate before production deployment

---

## 📊 Verify Deployment

### **Check Service Status**

```bash
# Get service URL (Dev)
cd terraform-new/environments/dev
terraform output cloud_run_url

# Get service URL (Prod)
cd terraform-new/environments/prod
terraform output cloud_run_url
```

### **Test Endpoints**

```bash
# Replace with your actual URL
SERVICE_URL="YOUR_CLOUD_RUN_URL"

# Health check
curl $SERVICE_URL/healthz

# API documentation
curl $SERVICE_URL/api-docs
```

### **View Logs**

```bash
# Development
gcloud run services logs tail sigma-hawk-tua-backend-dev --region=asia-southeast1

# Production
gcloud run services logs tail sigma-hawk-tua-backend-production --region=asia-southeast1
```

---

## 🗄️ Database Access

### **Connect to Database**

```bash
# Development
gcloud sql connect sigma-hawk-tua-backend-db-dev --user=sigma

# Production
gcloud sql connect sigma-hawk-tua-backend-db-production --user=sigma
```

### **Get Connection String**

```bash
# Development
cd terraform-new/environments/dev
terraform output -raw database_public_ip

# Production
cd terraform-new/environments/prod
terraform output -raw database_public_ip
```

---

## 💰 Cost Summary

### **After Deployment:**

| Environment | Monthly Cost | Components |
|-------------|--------------|------------|
| **Development** | ~$25-30 | Cloud Run (on-demand) + Cloud SQL (db-g1-small ZONAL) |
| **Production** | ~$60-80 | Cloud Run (1 instance) + Cloud SQL (db-g1-small REGIONAL HA) |
| **Total** | **~$85-110** | Both environments |

---

## 🔍 Troubleshooting

### **Error: "API not enabled"**

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com sqladmin.googleapis.com \
  secretmanager.googleapis.com
```

### **Error: "GitHub repository not connected"**

1. Visit https://console.cloud.google.com/cloud-build/settings
2. Enable "Cloud Build API"
3. Go to https://console.cloud.google.com/cloud-build/triggers
4. Connect repository manually

### **Error: "Permission denied"**

```bash
# Check your roles
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:YOUR_EMAIL"

# You need these roles:
# - roles/editor (or equivalent)
# - roles/cloudsql.admin
# - roles/run.admin
```

### **Error: "Cloud Build trigger not found"**

The trigger is created by Terraform. If missing:

```bash
cd terraform-new/environments/dev  # or prod
terraform apply -target=module.cloud_build
```

---

## 🎯 Quick Commands Reference

```bash
# Deploy infrastructure
cd terraform-new && ./setup.sh

# Trigger build
gcloud builds submit --config=cloudbuild.dev.yaml

# View logs
gcloud run services logs tail SERVICE_NAME --region=asia-southeast1

# Get service URL
terraform output cloud_run_url

# Connect to database
gcloud sql connect INSTANCE_NAME --user=sigma

# Destroy infrastructure (careful!)
terraform destroy
```

---

## 📚 Next Steps

1. ✅ **Test the deployed service**
   ```bash
   curl $(terraform output -raw cloud_run_url)/healthz
   ```

2. ✅ **Run database migrations** (automatic on first deploy)
   - Check logs: `gcloud run services logs read SERVICE_NAME --region=asia-southeast1`

3. ✅ **Seed database** (if needed)
   ```bash
   # Connect to Cloud Run instance
   gcloud run services proxy SERVICE_NAME --region=asia-southeast1 &
   # Run seed command
   ```

4. ✅ **Setup monitoring** (optional)
   - Enable Cloud Monitoring in GCP Console
   - Create alerts for errors/latency

5. ✅ **Configure custom domain** (optional)
   - Map domain to Cloud Run service
   - Update DNS records

---

## 🆘 Need Help?

- **Terraform Issues**: See [terraform-new/README.md](./README.md)
- **GCP Console**: https://console.cloud.google.com
- **Cloud Build Triggers**: https://console.cloud.google.com/cloud-build/triggers
- **Cloud Run Services**: https://console.cloud.google.com/run

**Happy Deploying! 🚀**
