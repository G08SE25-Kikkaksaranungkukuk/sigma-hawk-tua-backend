# Service Account for Cloud Build
resource "google_service_account" "cloud_build_sa" {
  account_id   = var.service_account_id
  display_name = var.service_account_display_name
}

# IAM roles for Cloud Build service account
resource "google_project_iam_member" "cloud_build_sa_builder" {
  project = var.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_project_iam_member" "cloud_build_sa_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_project_iam_member" "cloud_build_sa_artifact_registry" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_project_iam_member" "cloud_build_sa_service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

resource "google_project_iam_member" "cloud_build_sa_logs_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.cloud_build_sa.email}"
}

# Cloud Build Trigger for main branch
resource "google_cloudbuild_trigger" "main_trigger" {
  name        = var.trigger_name
  description = var.trigger_description

  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = var.trigger_branch
    }
  }

  filename = var.cloudbuild_yaml_path

  service_account = google_service_account.cloud_build_sa.id

  substitutions = var.substitutions

  depends_on = [
    google_project_iam_member.cloud_build_sa_builder,
    google_project_iam_member.cloud_build_sa_run_admin,
    google_project_iam_member.cloud_build_sa_artifact_registry,
    google_project_iam_member.cloud_build_sa_service_account_user
  ]
}
