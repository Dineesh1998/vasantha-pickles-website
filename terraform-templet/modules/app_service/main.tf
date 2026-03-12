resource "azurerm_linux_web_app" "node_app" {

  name                = var.app_name
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = var.service_plan_id

  https_only = true

  identity {
    type = "SystemAssigned"
  }

  site_config {

    always_on                         = true
    health_check_path                 = "/health"
    health_check_eviction_time_in_min = 5

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    NODE_ENV = "production"

    WEBSITE_NODE_DEFAULT_VERSION = "~20"

    PORT = "8080"

    SCM_DO_BUILD_DURING_DEPLOYMENT = "true"

    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
  }
}
resource "azurerm_app_service_virtual_network_swift_connection" "vnet_integration" {

  app_service_id = azurerm_linux_web_app.node_app.id
  subnet_id      = var.app_subnet_id
}

resource "azurerm_linux_web_app_slot" "staging" {

  name           = "staging"
  app_service_id = azurerm_linux_web_app.node_app.id

  https_only = true

  site_config {

    always_on = true

    application_stack {
      node_version = "18-lts"
    }

    health_check_path                 = "/health"
    health_check_eviction_time_in_min = 5
  }

  app_settings = {
    NODE_ENV = "staging"

    WEBSITE_NODE_DEFAULT_VERSION = "~18"

    PORT = "8080"

    SCM_DO_BUILD_DURING_DEPLOYMENT = "true"

    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
  }
}
