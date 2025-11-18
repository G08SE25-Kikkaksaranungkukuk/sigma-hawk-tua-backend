output "cloud_run_url" {
  description = "Cloud Run service URL"
  value       = module.cloud_run.service_url
}

output "cloud_run_service_name" {
  description = "Cloud Run service name"
  value       = module.cloud_run.service_name
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = module.database.instance_connection_name
}

output "database_public_ip" {
  description = "Cloud SQL public IP"
  value       = module.database.public_ip_address
  sensitive   = true
}

output "artifact_registry_url" {
  description = "Artifact Registry repository URL"
  value       = module.artifact_registry.repository_url
}

output "cloud_build_trigger_id" {
  description = "Cloud Build trigger ID"
  value       = module.cloud_build.trigger_id
}

output "api_docs_url" {
  description = "API documentation URL"
  value       = "${module.cloud_run.service_url}/api-docs"
}

output "health_check_url" {
  description = "Health check URL"
  value       = "${module.cloud_run.service_url}/healthz"
}

output "service_account_email" {
  description = "Cloud Run service account email"
  value       = module.cloud_run.service_account_email
}
