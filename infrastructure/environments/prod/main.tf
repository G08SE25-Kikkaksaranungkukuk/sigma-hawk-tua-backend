terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudscheduler.googleapis.com"
  ])
  service            = each.value
  disable_on_destroy = false
}

# Artifact Registry
module "artifact_registry" {
  source = "../../modules/artifact-registry"

  region        = var.region
  repository_id = "${var.app_name}-repo-${var.environment}"
  description   = "Docker repository for ${var.app_name} (${var.environment})"
  
  labels = {
    environment = var.environment
    app         = var.app_name
  }

  depends_on = [google_project_service.required_apis]
}

# Cloud SQL Database (Production with REGIONAL availability)
module "database" {
  source = "../../modules/cloud-sql"

  instance_name     = "${var.app_name}-db-${var.environment}"
  region            = var.region
  tier              = var.db_tier
  availability_type = "REGIONAL"  # High availability for production
  disk_size         = var.db_disk_size

  database_name     = var.db_name
  database_user     = var.db_user
  database_password = var.db_password

  backup_enabled                 = true
  pitr_enabled                   = true  # Point-in-time recovery for production
  transaction_log_retention_days = 7
  backup_retention_count         = 30     # Keep 30 backups

  max_connections        = "100"
  query_insights_enabled = true
  deletion_protection    = true  # Protect production database

  # Restrict access to specific IPs if needed (empty = allow all)
  authorized_networks = var.authorized_networks

  depends_on = [google_project_service.required_apis]
}

# Secret Manager
module "secrets" {
  source = "../../modules/secrets"

  secrets = {
    "${var.app_name}-database-url-${var.environment}"        = module.database.connection_string
    "${var.app_name}-jwt-access-secret-${var.environment}"   = var.jwt_access_secret
    "${var.app_name}-jwt-refresh-secret-${var.environment}"  = var.jwt_refresh_secret
  }

  labels = {
    environment = var.environment
    app         = var.app_name
  }

  depends_on = [google_project_service.required_apis]
}

# Cloud Run Service (Production)
module "cloud_run" {
  source = "../../modules/cloud-run"

  project_id                    = var.project_id
  region                        = var.region
  service_name                  = "${var.app_name}-${var.environment}"
  service_account_id            = "${var.app_name}-run-sa-${var.environment}"
  service_account_display_name  = "Cloud Run SA for ${var.app_name} (${var.environment})"

  image          = "${var.region}-docker.pkg.dev/${var.project_id}/${module.artifact_registry.repository_id}/${var.app_name}:${var.image_tag}"
  container_port = 8080

  cpu    = var.cloud_run_cpu
  memory = var.cloud_run_memory

  min_instances = var.min_instances  # Keep at least 1 instance warm
  max_instances = var.max_instances

  env_vars = {
    NODE_ENV = "production"
    PORT     = "8080"
    PASSWORD_SALT_ROUNDS = "10"
    FILE_SERVER_URL = var.file_server_url
  }

  secret_env_vars = {
    DATABASE_URL = {
      secret_name = module.secrets.secret_ids["${var.app_name}-database-url-${var.environment}"]
      secret_key  = "latest"
    }
    ACCESSTOKEN_SECRET = {
      secret_name = module.secrets.secret_ids["${var.app_name}-jwt-access-secret-${var.environment}"]
      secret_key  = "latest"
    }
    REFRESHTOKEN_SECRET = {
      secret_name = module.secrets.secret_ids["${var.app_name}-jwt-refresh-secret-${var.environment}"]
      secret_key  = "latest"
    }
  }

  secret_ids = [
    module.secrets.secret_ids["${var.app_name}-database-url-${var.environment}"],
    module.secrets.secret_ids["${var.app_name}-jwt-access-secret-${var.environment}"],
    module.secrets.secret_ids["${var.app_name}-jwt-refresh-secret-${var.environment}"]
  ]

  cloudsql_connection_name = module.database.instance_connection_name
  allow_public_access      = var.allow_public_access

  depends_on = [
    google_project_service.required_apis,
    module.database,
    module.secrets
  ]
}

# Cloud Build (Manual trigger for production)
module "cloud_build" {
  source = "../../modules/cloud-build"

  project_id                   = var.project_id
  service_account_id           = "${var.app_name}-build-sa-${var.environment}"
  service_account_display_name = "Cloud Build SA for ${var.app_name} (${var.environment})"

  trigger_name        = "${var.app_name}-deploy-${var.environment}"
  trigger_description = "Deploy ${var.app_name} to ${var.environment} (manual trigger from main branch)"
  
  github_owner   = var.github_owner
  github_repo    = var.github_repo
  trigger_branch = "^main$"

  cloudbuild_yaml_path = "cloudbuild.${var.environment}.yaml"

  substitutions = {
    _ENVIRONMENT        = var.environment
    _REGION             = var.region
    _SERVICE_NAME       = module.cloud_run.service_name
    _ARTIFACT_REGISTRY  = module.artifact_registry.repository_url
    _IMAGE_NAME         = var.app_name
  }

  depends_on = [google_project_service.required_apis]
}

# Health check scheduler (Production only)
resource "google_cloud_scheduler_job" "health_check" {
  count = var.enable_health_check ? 1 : 0

  name             = "${var.app_name}-health-check-${var.environment}"
  description      = "Health check for ${var.app_name} ${var.environment}"
  schedule         = "*/5 * * * *"  # Every 5 minutes
  time_zone        = "Asia/Bangkok"
  attempt_deadline = "60s"

  http_target {
    http_method = "GET"
    uri         = "${module.cloud_run.service_url}/healthz"
  }

  depends_on = [
    google_project_service.required_apis,
    module.cloud_run
  ]
}
