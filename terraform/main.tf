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
resource "google_project_service" "cloud_run_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_build_api" {
  service            = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifact_registry_api" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "sql_admin_api" {
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "compute_api" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "vpc_access_api" {
  service            = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

# Create Artifact Registry for Docker images
resource "google_artifact_registry_repository" "backend_repo" {
  location      = var.region
  repository_id = "${var.app_name}-repo"
  description   = "Docker repository for ${var.app_name}"
  format        = "DOCKER"

  depends_on = [google_project_service.artifact_registry_api]
}

# Cloud SQL PostgreSQL instance
resource "google_sql_database_instance" "postgres" {
  name             = "${var.app_name}-db-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = var.db_tier
    availability_type = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_size         = var.db_disk_size
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      start_time                     = "03:00"
      transaction_log_retention_days = 7
    }

    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.vpc_network.id
      require_ssl     = true
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }

  deletion_protection = var.environment == "production" ? true : false

  depends_on = [
    google_project_service.sql_admin_api,
    google_service_networking_connection.private_vpc_connection
  ]
}

# Database
resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.postgres.name
}

# Database user
resource "google_sql_user" "db_user" {
  name     = var.db_user
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

# VPC Network
resource "google_compute_network" "vpc_network" {
  name                    = "${var.app_name}-vpc-${var.environment}"
  auto_create_subnetworks = false

  depends_on = [google_project_service.compute_api]
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "${var.app_name}-subnet-${var.environment}"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc_network.id
}

# VPC Access Connector for Cloud Run to access Cloud SQL
resource "google_vpc_access_connector" "connector" {
  name          = "${var.app_name}-vpc-connector"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.vpc_network.name

  depends_on = [google_project_service.vpc_access_api]
}

# Private IP for Cloud SQL
resource "google_compute_global_address" "private_ip_address" {
  name          = "${var.app_name}-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc_network.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]

  depends_on = [google_project_service.compute_api]
}

# Secret Manager for sensitive data
resource "google_secret_manager_secret" "db_connection_string" {
  secret_id = "${var.app_name}-db-connection-string-${var.environment}"

  replication {
    auto {}
  }

  depends_on = [google_project_service.sql_admin_api]
}

resource "google_secret_manager_secret_version" "db_connection_string" {
  secret = google_secret_manager_secret.db_connection_string.id
  secret_data = "postgresql://${var.db_user}:${var.db_password}@${google_sql_database_instance.postgres.private_ip_address}:5432/${var.db_name}?schema=public"
}

resource "google_secret_manager_secret" "jwt_access_secret" {
  secret_id = "${var.app_name}-jwt-access-secret-${var.environment}"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "jwt_access_secret" {
  secret      = google_secret_manager_secret.jwt_access_secret.id
  secret_data = var.jwt_access_secret
}

resource "google_secret_manager_secret" "jwt_refresh_secret" {
  secret_id = "${var.app_name}-jwt-refresh-secret-${var.environment}"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "jwt_refresh_secret" {
  secret      = google_secret_manager_secret.jwt_refresh_secret.id
  secret_data = var.jwt_refresh_secret
}

# Cloud Run Service
resource "google_cloud_run_service" "backend" {
  name     = "${var.app_name}-${var.environment}"
  location = var.region

  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.backend_repo.repository_id}/${var.app_name}:${var.image_tag}"

        ports {
          container_port = 8080
        }

        resources {
          limits = {
            cpu    = var.cloud_run_cpu
            memory = var.cloud_run_memory
          }
        }

        env {
          name  = "NODE_ENV"
          value = var.environment
        }

        env {
          name  = "PORT"
          value = "8080"
        }

        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.db_connection_string.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "ACCESSTOKEN_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.jwt_access_secret.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "REFRESHTOKEN_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.jwt_refresh_secret.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name  = "PASSWORD_SALT_ROUNDS"
          value = "10"
        }

        env {
          name  = "FILE_SERVER_URL"
          value = var.file_server_url
        }
      }

      service_account_name = google_service_account.cloud_run_sa.email

      # Connect to VPC for Cloud SQL access
      vpc_access {
        connector = google_vpc_access_connector.connector.id
        egress    = "private-ranges-only"
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale"      = var.min_instances
        "autoscaling.knative.dev/maxScale"      = var.max_instances
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.postgres.connection_name
        "run.googleapis.com/client-name"        = "terraform"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [
    google_project_service.cloud_run_api,
    google_sql_database_instance.postgres,
    google_vpc_access_connector.connector
  ]
}

# Service Account for Cloud Run
resource "google_service_account" "cloud_run_sa" {
  account_id   = "${var.app_name}-run-sa-${var.environment}"
  display_name = "Service Account for Cloud Run ${var.app_name}"
}

# IAM bindings for Service Account
resource "google_project_iam_member" "cloud_run_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "cloud_run_secret_accessor" {
  for_each = toset([
    google_secret_manager_secret.db_connection_string.secret_id,
    google_secret_manager_secret.jwt_access_secret.secret_id,
    google_secret_manager_secret.jwt_refresh_secret.secret_id,
  ])

  secret_id = each.value
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Allow public access (or restrict with IAM)
resource "google_cloud_run_service_iam_member" "public_access" {
  count = var.allow_public_access ? 1 : 0

  service  = google_cloud_run_service.backend.name
  location = google_cloud_run_service.backend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Cloud Scheduler for health checks (optional)
resource "google_cloud_scheduler_job" "health_check" {
  count = var.enable_health_check_scheduler ? 1 : 0

  name             = "${var.app_name}-health-check"
  description      = "Health check for ${var.app_name}"
  schedule         = "*/5 * * * *" # Every 5 minutes
  time_zone        = "UTC"
  attempt_deadline = "320s"

  http_target {
    http_method = "GET"
    uri         = "${google_cloud_run_service.backend.status[0].url}/healthz"
  }
}
