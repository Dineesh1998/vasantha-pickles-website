resource "azurerm_postgresql_flexible_server" "postgresql" {
  name                   = var.name
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = var.db_version
  delegated_subnet_id    = var.subnet_id
  private_dns_zone_id    = var.private_dns_zone_id
  administrator_login    = var.admin_username
  administrator_password = var.admin_password
  zone                   = var.zone
  storage_mb             = var.storage_mb
  sku_name               = var.sku_name
  backup_retention_days  = 7
  tags                   = var.tags

  dynamic "high_availability" {
    for_each = var.high_availability_mode == null ? [] : [1]
    content {
      mode = var.high_availability_mode
    }
  }
}

resource "azurerm_postgresql_flexible_server_database" "appdb" {
  name      = "appdb"
  server_id = azurerm_postgresql_flexible_server.this.id
  collation = "en_US.utf8"
  charset   = "UTF8"
}