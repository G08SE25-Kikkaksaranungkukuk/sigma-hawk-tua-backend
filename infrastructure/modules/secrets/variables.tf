variable "secrets" {
  description = "Map of secret names to secret values"
  type        = map(string)
  # Note: Do not mark as sensitive here to allow use in for_each
  # The secret values themselves will still be handled securely
}

variable "labels" {
  description = "Labels to apply to secrets"
  type        = map(string)
  default     = {}
}
