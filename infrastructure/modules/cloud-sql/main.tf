resource "google_sql_database_instance" "postgres" {
  name             = var.instance_name
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_size         = var.disk_size
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled                        = var.backup_enabled
      point_in_time_recovery_enabled = var.pitr_enabled
      start_time                     = "03:00"
      transaction_log_retention_days = var.transaction_log_retention_days
      backup_retention_settings {
        retained_backups = var.backup_retention_count
        retention_unit   = "COUNT"
      }
    }

    # tfsec:ignore:google-sql-encrypt-in-transit-data SSL enforced via ssl_mode
    ip_configuration {
      ipv4_enabled    = false  # Disable public IP for security - use Cloud SQL Proxy only
      private_network = null
      # SSL/TLS is enforced via ssl_mode (require_ssl attribute not available in provider)
      ssl_mode        = "ENCRYPTED_ONLY"  # All connections must use SSL/TLS

      # With ipv4_enabled=false, authorized_networks is not needed
      # Cloud Run connects via Unix socket using Cloud SQL connection
    }

    database_flags {
      name  = "max_connections"
      value = var.max_connections
    }

    database_flags {
      name  = "log_connections"
      value = "on"  # Enable connection logging for audit trail
    }

    database_flags {
      name  = "log_disconnections"
      value = "on"  # Enable disconnection logging
    }

    insights_config {
      query_insights_enabled  = var.query_insights_enabled
      query_string_length     = 1024
      record_application_tags = false
      record_client_address   = false
    }
  }

  deletion_protection = var.deletion_protection
}

resource "google_sql_database" "database" {
  name     = var.database_name
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "user" {
  name     = var.database_user
  instance = google_sql_database_instance.postgres.name
  password = var.database_password
}
