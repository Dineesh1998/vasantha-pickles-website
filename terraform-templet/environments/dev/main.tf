terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.57.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

locals {
  common_tags = {
    project     = var.project_name
    environment = var.environment
    owner       = var.owner
    managed_by  = "terraform"
  }

  name_prefix = "${var.project_name}-${var.environment}-${var.location_short}"
}

resource "random_string" "storage_suffix" {
  length  = 6
  lower   = true
  upper   = false
  numeric = true
  special = false
}

module "rg" {
  source   = "../../modules/resource_group"
  name     = "rg-${local.name_prefix}-001"
  location = var.location
  tags     = local.common_tags
}

module "network" {
  source              = "../../modules/network"
  resource_group_name = module.rg.name
  location            = var.location
  vnet_name           = "vnet-${local.name_prefix}-001"
  address_space       = ["190.160.0.0/16"]
  web_subnet_name     = "snet-web"
  web_subnet_prefixes = ["190.160.0.0/24"]
  app_subnet_name     = "snet-app"
  app_subnet_prefixes = ["190.160.1.0/24"]
  db_subnet_name      = "snet-db"
  db_subnet_prefixes  = ["190.160.2.0/24"]
  tags                = local.common_tags
}
module "app_service_plan" {
  source              = "../../modules/app_service_plan"
  name                = var.app_service_plan_name
  location            = var.location
  resource_group_name = module.rg.name
  sku_name            = "B1"
  tags                = local.common_tags
}
module "app_service" {
  source              = "../../modules/app_service"
  app_name            = var.app_name
  resource_group_name = module.rg.name
  location            = var.location
  app_subnet_id       = module.network.app_subnet_id
  service_plan_id     = module.app_service_plan.id
}
