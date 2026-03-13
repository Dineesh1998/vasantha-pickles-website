variable "subscription_id" {
  type = string
}

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "owner" {
  type = string
}

variable "location" {
  type = string
}

variable "location_short" {
  type = string
}
variable "app_name" {
  type = string
}
variable "app_service_plan_name" {
  type = string
}

variable "tenant_id" {
  type = string
}

variable "db_admin_username" {
  type = string
}

variable "db_admin_password" {
  type      = string
  sensitive = true
}
