variable "region" {
  description = "GCP region"
  type        = string
}

variable "repository_id" {
  description = "Artifact Registry repository ID"
  type        = string
}

variable "description" {
  description = "Repository description"
  type        = string
  default     = "Docker repository"
}

variable "labels" {
  description = "Labels for the repository"
  type        = map(string)
  default     = {}
}
