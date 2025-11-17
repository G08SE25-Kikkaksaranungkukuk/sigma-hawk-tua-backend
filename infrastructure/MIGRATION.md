# 🔄 Migration Guide: Old Terraform → New Terraform

## 📊 ภาพรวมการเปลี่ยนแปลง

```
terraform/ (old)                  →    terraform-new/ (new)
├── main.tf (462 lines)          →    ├── modules/ (5 modules)
├── variables.tf                  →    ├── environments/
├── outputs.tf                    →    │   ├── dev/
└── terraform.tfvars.example      →    │   └── prod/
                                       ├── README.md (comprehensive)
                                       ├── QUICKSTART.md
                                       └── setup.sh (automated)
```

---

## 🎯 สิ่งที่แก้ไขตามความต้องการ

### ✅ **1. Database Networking: Private IP → Public IP**

**เดิม (terraform/):**
```hcl
# มี VPC Network + VPC Connector
resource "google_compute_network" "vpc_network" { ... }
resource "google_vpc_access_connector" "connector" {
  ip_cidr_range = "10.8.0.0/28"
}

# Cloud SQL ใช้ Private IP
ip_configuration {
  private_network = google_compute_network.vpc_network.id
}

# Cloud Run ต้องเชื่อมต่อ VPC
vpc_access {
  connector = google_vpc_access_connector.connector.id
}
```

**ใหม่ (terraform-new/):**
```hcl
# ไม่มี VPC (ประหยัดค่าใช้จ่าย)
# Cloud SQL ใช้ Public IP + SSL

ip_configuration {
  ipv4_enabled    = true
  private_network = null
  require_ssl     = true  # SSL เป็นตัวป้องกัน
  
  # ตัวเลือก: จำกัด IP ที่เข้าถึงได้
  authorized_networks = var.authorized_networks
}

# Cloud Run ไม่ต้องเชื่อมต่อ VPC
# (ไม่มี vpc_access block)
```

**ผลลัพธ์:**
- ✅ ประหยัด ~$20/month (VPC Connector cost)
- ✅ Setup ง่ายกว่า (ไม่ต้อง manage VPC)
- ✅ ยังปลอดภัยด้วย SSL + authorized_networks

---

### ✅ **2. Database Tier: Custom → Standard**

**เดิม:**
```hcl
variable "db_tier" {
  default = "db-custom-2-7680"  # Custom 2 vCPU, 7680MB RAM
}
```

**ใหม่:**
```hcl
variable "db_tier" {
  default = "db-g1-small"  # Standard 1 shared vCPU, 1.7GB RAM
}
```

**เปรียบเทียบ:**

| Tier | vCPU | RAM | Cost/month | Use Case |
|------|------|-----|------------|----------|
| db-custom-2-7680 | 2 | 7.5 GB | ~$130 | Large apps |
| **db-g1-small** | 1 shared | 1.7 GB | ~$25 (ZONAL)<br>~$50 (REGIONAL) | **Small-medium apps** |

**ผลลัพธ์:**
- ✅ ประหยัด ~$80-100/month per environment
- ✅ เพียงพอสำหรับ backend ขนาดกลาง
- ✅ Scale up ได้เมื่อจำเป็น

---

### ✅ **3. Cloud Build: None → Hybrid CI/CD**

**เดิม:**
```
❌ ไม่มี Cloud Build configuration
❌ Deploy ด้วย GitHub Actions เท่านั้น
```

**ใหม่:**
```hcl
# modules/cloud-build/main.tf
resource "google_cloudbuild_trigger" "main_trigger" {
  name = "${var.app_name}-deploy-${var.environment}"
  
  github {
    owner = "G08SE25-Kikkaksaranungkukuk"
    name  = "sigma-hawk-tua-backend"
    push {
      branch = "^main$"
    }
  }
  
  filename = "cloudbuild.${var.environment}.yaml"
  service_account = google_service_account.cloud_build_sa.id
}
```

**Flow:**
```
GitHub Push → GitHub Actions (CI)
                  ├─ Tests
                  ├─ SonarQube
                  └─ Snyk
                      ↓
                   ✅ PASS
                      ↓
            Manual Trigger (Cloud Build)
                      ↓
            Cloud Build (CD)
                  ├─ Build Image
                  ├─ Push to GAR
                  └─ Deploy to Cloud Run
```

**ผลลัพธ์:**
- ✅ แยก CI (quality) และ CD (deployment)
- ✅ Manual approval ก่อน deploy production
- ✅ Build เร็วกว่า (ใกล้ GCP infrastructure)

---

### ✅ **4. Environments: Single → Dev + Prod**

**เดิม:**
```
terraform/
└── main.tf  # Production only (or mixed)
```

**ใหม่:**
```
terraform-new/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
```

**เปรียบเทียบ:**

| Feature | Development | Production |
|---------|------------|------------|
| **Database** | db-g1-small ZONAL | db-g1-small REGIONAL |
| **Backups** | 3 days | 30 days |
| **PITR** | ❌ No | ✅ Yes |
| **Min Instances** | 0 (cold start) | 1 (always warm) |
| **Max Instances** | 5 | 10 |
| **Deletion Protection** | ❌ No | ✅ Yes |
| **Query Insights** | ❌ No | ✅ Yes |
| **Health Checks** | ❌ No | ✅ Yes |

**ผลลัพธ์:**
- ✅ แยก state files อิสระ
- ✅ Config ต่างกันตามความเหมาะสม
- ✅ Deploy แยกกัน (ปลอดภัย)

---

## 🐛 Bugs ที่แก้ไข

### **Bug 1: Secret References ผิด**

**เดิม:**
```hcl
# ❌ ใช้ secret name ผิด
google_secret_manager_secret.database_url.secret_id     # ไม่มี resource นี้
google_secret_manager_secret.jwt_access.secret_id       # ควรเป็น jwt_access_secret
google_secret_manager_secret.jwt_refresh.secret_id      # ควรเป็น jwt_refresh_secret
```

**ใหม่:**
```hcl
# ✅ ใช้ module output
module.secrets.secret_ids["${var.app_name}-database-url-${var.environment}"]
module.secrets.secret_ids["${var.app_name}-jwt-access-secret-${var.environment}"]
module.secrets.secret_ids["${var.app_name}-jwt-refresh-secret-${var.environment}"]
```

---

### **Bug 2: Service Account References ผิด**

**เดิม:**
```hcl
# ❌ Resource name inconsistent
resource "google_service_account" "run_sa" { ... }
resource "google_service_account" "cloud_run_sa" { ... }

# ❌ ใช้ผิด
service_account_name = google_service_account.cloud_run_sa.email  # ไม่มี resource นี้
```

**ใหม่:**
```hcl
# ✅ Consistent naming
module "cloud_run" {
  source = "../../modules/cloud-run"
  # Creates service account internally
}

# ✅ ใช้ module output
service_account_name = module.cloud_run.service_account_email
```

---

### **Bug 3: Frontend Section Incomplete**

**เดิม:**
```hcl
# ❌ มี frontend resource แต่ไม่สมบูรณ์
resource "google_cloud_run_service" "frontend" {
  # Reference artifact registry ที่ไม่มี
  image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.repository_id}"
  #                                                                          ↑ ไม่มี resource นี้
}
```

**ใหม่:**
```
# ✅ ลบ frontend section ออกทั้งหมด
# (ทำแค่ backend ตามที่ร้องขอ)
```

---

## 📈 การปรับปรุงโครงสร้าง

### **1. Modular Design**

**เดิม (Monolithic):**
```hcl
# All resources in one file (462 lines)
resource "google_artifact_registry_repository" "backend_repo" { ... }
resource "google_sql_database_instance" "postgres" { ... }
resource "google_cloud_run_service" "backend" { ... }
# ... everything mixed together
```

**ใหม่ (Modular):**
```hcl
# environments/prod/main.tf
module "artifact_registry" {
  source = "../../modules/artifact-registry"
  # ... config
}

module "database" {
  source = "../../modules/cloud-sql"
  # ... config
}

module "cloud_run" {
  source = "../../modules/cloud-run"
  # ... config
}
```

**ข้อดี:**
- ✅ นำโมดูลกลับมาใช้ได้ (dev + prod)
- ✅ แก้ไขง่าย (แยกเป็น files เล็กๆ)
- ✅ Test แยกส่วนได้
- ✅ เข้าใจง่าย

---

### **2. Documentation**

**เดิม:**
```
terraform/
└── README.md (basic, ~100 lines)
```

**ใหม่:**
```
terraform-new/
├── README.md (~400 lines)
│   ├── Architecture diagram
│   ├── Cost estimation
│   ├── Deployment guide
│   ├── Troubleshooting
│   └── Best practices
├── QUICKSTART.md
│   ├── Fast track deployment
│   ├── Command reference
│   └── Verification steps
├── SUMMARY.md
│   └── Complete feature list
└── setup.sh
    └── Interactive deployment
```

---

## 💰 Cost Comparison

### **Monthly Costs:**

| Component | Old Terraform | New Terraform | Savings |
|-----------|--------------|---------------|---------|
| **Cloud Run** | ~$15-25 | ~$10-20 | ~$5 |
| **Cloud SQL** | ~$130 (custom tier) | ~$50 (g1-small REGIONAL) | ~$80 |
| **VPC Connector** | ~$10 | **$0** (removed) | ~$10 |
| **Artifact Registry** | ~$1-2 | ~$1-2 | $0 |
| **Cloud Build** | $0 (not configured) | $0 (free tier) | $0 |
| **Total (Prod)** | **~$156-167** | **~$61-72** | **~$95** 💰 |

**ประหยัด ~57% ต่อ environment!**

---

## 🚀 Migration Steps

### **Option 1: Clean Slate (Recommended)**

```bash
# 1. Deploy new infrastructure
cd terraform-new/environments/prod
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars
terraform init
terraform apply

# 2. Migrate database
# Export from old:
gcloud sql export sql OLD_INSTANCE gs://BUCKET/backup.sql --database=sigmadb

# Import to new:
gcloud sql import sql NEW_INSTANCE gs://BUCKET/backup.sql --database=sigmadb

# 3. Update DNS/Load Balancer to new Cloud Run URL

# 4. Verify everything works

# 5. Destroy old infrastructure
cd ../../terraform-old  # (old folder)
terraform destroy
```

---

### **Option 2: Incremental Migration**

```bash
# 1. Deploy dev environment first
cd terraform-new/environments/dev
terraform apply

# 2. Test thoroughly in dev

# 3. Deploy prod (new infrastructure)
cd ../prod
terraform apply

# 4. Run parallel (old + new) for testing

# 5. Switch traffic gradually

# 6. Destroy old after confirmation
```

---

## ✅ Validation Checklist

### **After Migration:**

- [ ] Service URL accessible
- [ ] Health check passing: `/healthz`
- [ ] API docs available: `/api-docs`
- [ ] Database connection working
- [ ] Migrations ran successfully
- [ ] Secrets accessible from Cloud Run
- [ ] Cloud Build trigger created
- [ ] Logs visible in Cloud Logging
- [ ] No errors in Cloud Run logs
- [ ] Cost within expected range

---

## 🎓 Key Learnings

### **What Worked Well:**

1. ✅ **Modular Design** - ง่ายต่อการ maintain
2. ✅ **Public IP** - ถูกกว่า Private IP significantly
3. ✅ **Separate Environments** - แยก state, ปลอดภัยกว่า
4. ✅ **Comprehensive Docs** - ใครก็เริ่มต้นได้ง่าย
5. ✅ **Setup Script** - ลด human error

### **What to Watch:**

1. ⚠️ **Public IP Security** - ควรตั้ง `authorized_networks`
2. ⚠️ **Manual Triggers** - ต้อง train ทีมให้รู้วิธีใช้
3. ⚠️ **Cost Monitoring** - Monitor actual usage vs estimate
4. ⚠️ **Backup Strategy** - ตั้งค่า automated backups ให้ดี

---

## 📞 Support

หากมีปัญหาระหว่าง migration:

1. **Check Logs:**
   ```bash
   terraform plan  # ดู changes ที่จะเกิด
   terraform show  # ดู state ปัจจุบัน
   ```

2. **Rollback:**
   ```bash
   terraform destroy  # Destroy new
   # Keep using old infrastructure
   ```

3. **Compare State:**
   ```bash
   # Old
   cd terraform
   terraform show

   # New  
   cd terraform-new/environments/prod
   terraform show
   ```

**Happy Migrating! 🚀**
