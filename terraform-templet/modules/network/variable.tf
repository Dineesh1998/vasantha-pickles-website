variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "vnet_name" {
  type = string
}

variable "address_space" {
  type = list(string)
}

variable "web_subnet_name" {
  type = string
}

variable "web_subnet_prefixes" {
  type = list(string)
}

variable "app_subnet_name" {
  type = string
}

variable "app_subnet_prefixes" {
  type = list(string)
}

variable "db_subnet_name" {
  type = string
}

variable "db_subnet_prefixes" {
  type = list(string)
}

variable "tags" {
  type    = map(string)
  default = {}
}