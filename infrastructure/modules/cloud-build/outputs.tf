output "trigger_id" {
  description = "The ID of the Cloud Build trigger"
  value       = google_cloudbuild_trigger.main_trigger.id
}

output "trigger_name" {
  description = "The name of the Cloud Build trigger"
  value       = google_cloudbuild_trigger.main_trigger.name
}

output "service_account_email" {
  description = "The service account email for Cloud Build"
  value       = google_service_account.cloud_build_sa.email
}
