locals {
  common_tags ={
    project     = var.name
    environment = var.environment
    owner       = var.owner
    managed_by  = "terraform"
  }
}