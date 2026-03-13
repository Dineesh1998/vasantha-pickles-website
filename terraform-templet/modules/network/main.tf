resource "azurerm_virtual_network" "this" {
  name                = var.vnet_name
  location            = var.location
  resource_group_name = var.resource_group_name
  address_space       = var.address_space
  tags                = var.tags
}

resource "azurerm_subnet" "web" {
  name                 = var.web_subnet_name
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = var.web_subnet_prefixes
}

resource "azurerm_subnet" "app" {
  name                 = var.app_subnet_name
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = var.app_subnet_prefixes

  delegation {
    name = "appservice-delegation"

    service_delegation {
      name = "Microsoft.Web/serverFarms"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/action"
      ]
    }
  }
}

resource "azurerm_subnet" "db" {
  name                 = var.db_subnet_name
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = var.db_subnet_prefixes

  delegation {
    name = "psql-delegation"

    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action"
      ]
    }
  }
}

# resource "azurerm_subnet" "gatewaysubnet" {
#   name                 = var.gatewaysubnet_name
#   resource_group_name  = var.resource_group_name
#   virtual_network_name = azurerm_virtual_network.this.name
#   address_prefixes     = var.gatewaysubnet_prefixes
# }

# resource "azurerm_virtual_network_gateway" "gatway" {
#   name                = var.gatewaysubnet_name
#   location            = var.location
#   resource_group_name = var.resource_group_name
#   type                = "Vpn" 
#   sku                 = "VpnGw1"
#   ip_configuration {
#     name                 = "vnetGatewayConfig"
#     subnet_id            = azurerm_subnet.gatewaysubnet.id
#     public_ip_address_id = azurerm_public_ip.vnet_gateway_public_ip.id
#   }
# }
