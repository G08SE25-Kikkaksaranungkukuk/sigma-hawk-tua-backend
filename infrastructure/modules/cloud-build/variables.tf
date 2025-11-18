variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "service_account_id" {
  description = "Service account ID for Cloud Build"
  type        = string
}

variable "service_account_display_name" {
  description = "Display name for Cloud Build service account"
  type        = string
}

variable "trigger_name" {
  description = "Name of the Cloud Build trigger"
  type        = string
}

variable "trigger_description" {
  description = "Description of the trigger"
  type        = string
  default     = "Automated build and deploy trigger"
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "trigger_branch" {
  description = "Branch to trigger on"
  type        = string
  default     = "^main$"
}

variable "cloudbuild_yaml_path" {
  description = "Path to cloudbuild.yaml file"
  type        = string
  default     = "cloudbuild.yaml"
}

variable "substitutions" {
  description = "Substitution variables for Cloud Build"
  type        = map(string)
  default     = {}
}
