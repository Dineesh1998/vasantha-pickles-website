variable "name" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "private_dns_zone_id" {
  type = string
}

variable "admin_username" {
  type = string
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "sku_name" {
  type = string
}

variable "storage_mb" {
  type = number
}

variable "db_version" {
  type    = string
  default = "16"
}

variable "zone" {
  type    = string
  default = "1"
}

variable "high_availability_mode" {
  type    = string
  default = null
}

variable "tags" {
  type = map(string)
}