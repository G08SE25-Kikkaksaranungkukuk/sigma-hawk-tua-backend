variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-southeast1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "sigma-hawk-tua-backend"
}

# Database variables
variable "db_name" {
  description = "Database name"
  type        = string
  default     = "sigmadb"
}

variable "db_user" {
  description = "Database user"
  type        = string
  default     = "sigma"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_tier" {
  description = "Cloud SQL tier"
  type        = string
  default     = "db-g1-small"
}

variable "db_disk_size" {
  description = "Database disk size in GB"
  type        = number
  default     = 20
}

variable "authorized_networks" {
  description = "List of authorized networks for Cloud SQL"
  type = list(object({
    name  = string
    value = string
  }))
  default = []  # Empty = allow all
}

# Cloud Run variables
variable "cloud_run_cpu" {
  description = "CPU allocation for Cloud Run"
  type        = string
  default     = "1"
}

variable "cloud_run_memory" {
  description = "Memory allocation for Cloud Run"
  type        = string
  default     = "512Mi"
}

variable "min_instances" {
  description = "Minimum number of Cloud Run instances"
  type        = string
  default     = "1"  # Keep 1 instance warm in production
}

variable "max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = string
  default     = "10"
}

variable "allow_public_access" {
  description = "Allow public access to Cloud Run"
  type        = bool
  default     = true
}

# Application variables
variable "image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
}

variable "jwt_access_secret" {
  description = "JWT access token secret"
  type        = string
  sensitive   = true
}

variable "jwt_refresh_secret" {
  description = "JWT refresh token secret"
  type        = string
  sensitive   = true
}

variable "file_server_url" {
  description = "File server URL"
  type        = string
  default     = ""
}

variable "enable_health_check" {
  description = "Enable Cloud Scheduler health check"
  type        = bool
  default     = true
}

# GitHub variables for Cloud Build
variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "G08SE25-Kikkaksaranungkukuk"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "sigma-hawk-tua-backend"
}
