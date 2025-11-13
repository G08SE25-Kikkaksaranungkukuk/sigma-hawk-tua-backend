output "repository_id" {
  description = "The ID of the created repository"
  value       = google_artifact_registry_repository.repo.repository_id
}

output "repository_url" {
  description = "The full URL of the repository"
  value       = "${var.region}-docker.pkg.dev/${google_artifact_registry_repository.repo.project}/${google_artifact_registry_repository.repo.repository_id}"
}

output "name" {
  description = "The name of the repository"
  value       = google_artifact_registry_repository.repo.name
}