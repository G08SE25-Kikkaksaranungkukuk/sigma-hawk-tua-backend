output "instance_name" {
  description = "The name of the Cloud SQL instance"
  value       = google_sql_database_instance.postgres.name
}

output "instance_connection_name" {
  description = "The connection name of the instance"
  value       = google_sql_database_instance.postgres.connection_name
}

output "public_ip_address" {
  description = "The public IP address of the instance"
  value       = google_sql_database_instance.postgres.public_ip_address
}

output "database_name" {
  description = "The name of the database"
  value       = google_sql_database.database.name
}

output "database_user" {
  description = "The database user"
  value       = google_sql_user.user.name
}

output "connection_string" {
  description = "PostgreSQL connection string optimized for Cloud Run"
  value       = "postgresql://${google_sql_user.user.name}:${var.database_password}@localhost/${google_sql_database.database.name}?host=/cloudsql/${google_sql_database_instance.postgres.connection_name}&connection_limit=1&pool_timeout=60&connect_timeout=30"
  sensitive   = true
}
