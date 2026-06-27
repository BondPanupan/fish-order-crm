-- =====================================================================
-- gen_random_uuid() is built-in since PostgreSQL 13 — no extension needed
-- =====================================================================

-- ---- Reference / master data ----------------------------------------

CREATE TABLE customers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         VARCHAR UNIQUE NOT NULL,
  name         VARCHAR,
  credit_limit DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
  created_by   VARCHAR,
  updated_by   VARCHAR,
  is_deleted   BOOLEAN       NOT NULL DEFAULT FALSE
);

CREATE TABLE items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR UNIQUE NOT NULL,
  name       VARCHAR,
  unit       VARCHAR   NOT NULL DEFAULT 'kg',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR,
  updated_by VARCHAR,
  is_deleted BOOLEAN   NOT NULL DEFAULT FALSE
);

-- percentage = price-tier multiplier: EMERGENCY 125 / OVER_DUE 100 / DAILY 90
CREATE TABLE order_types (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       VARCHAR UNIQUE NOT NULL,
  name       VARCHAR,
  priority   INTEGER       NOT NULL,
  percentage DECIMAL(6,2)  NOT NULL
);

CREATE TABLE suppliers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR UNIQUE NOT NULL,
  name        VARCHAR,
  is_wildcard BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by  VARCHAR,
  updated_by  VARCHAR,
  is_deleted  BOOLEAN   NOT NULL DEFAULT FALSE
);

CREATE TABLE warehouses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR UNIQUE NOT NULL,
  name        VARCHAR,
  is_wildcard BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by  VARCHAR,
  updated_by  VARCHAR,
  is_deleted  BOOLEAN   NOT NULL DEFAULT FALSE
);

-- ---- Stock & pricing ------------------------------------------------

-- Wildcard resolution (SP-000 / WH-000): pick rows ordered by remaining_quantity DESC
CREATE TABLE inventory (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id        UUID          NOT NULL REFERENCES suppliers(id),
  warehouse_id       UUID          NOT NULL REFERENCES warehouses(id),
  item_id            UUID          NOT NULL REFERENCES items(id),
  remaining_quantity DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at         TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMP     NOT NULL DEFAULT NOW(),
  created_by         VARCHAR,
  updated_by         VARCHAR,
  is_deleted         BOOLEAN       NOT NULL DEFAULT FALSE,
  UNIQUE (supplier_id, warehouse_id, item_id)
);

CREATE INDEX idx_inventory_remaining ON inventory(remaining_quantity);

-- order_type_id NULL  = base price (× order_types.percentage at runtime)
-- order_type_id !NULL = explicit override for that tier
CREATE TABLE prices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id       UUID          NOT NULL REFERENCES items(id),
  supplier_id   UUID          NOT NULL REFERENCES suppliers(id),
  order_type_id UUID          REFERENCES order_types(id),
  unit_price    DECIMAL(14,2) NOT NULL
);

-- PostgreSQL treats NULL != NULL in UNIQUE constraints, so use partial indexes
CREATE UNIQUE INDEX idx_prices_base ON prices (item_id, supplier_id)
  WHERE order_type_id IS NULL;
CREATE UNIQUE INDEX idx_prices_tier ON prices (item_id, supplier_id, order_type_id)
  WHERE order_type_id IS NOT NULL;

-- ---- Orders (header) & sub-orders (lines) ---------------------------

CREATE TABLE orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR UNIQUE NOT NULL,
  customer_id UUID      NOT NULL REFERENCES customers(id),
  remark      VARCHAR,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Each sub-order is one line: a specific item + type + source request under an order
CREATE TABLE sub_orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code             VARCHAR UNIQUE NOT NULL,
  order_id         UUID          NOT NULL REFERENCES orders(id),
  item_id          UUID          NOT NULL REFERENCES items(id),
  warehouse_id     UUID          NOT NULL REFERENCES warehouses(id),
  supplier_id      UUID          NOT NULL REFERENCES suppliers(id),
  request_quantity DECIMAL(14,2) NOT NULL,
  order_type_id    UUID          NOT NULL REFERENCES order_types(id),
  create_date      DATE          NOT NULL,
  status           VARCHAR       NOT NULL DEFAULT 'pending'
);

CREATE INDEX idx_sub_orders_order_id      ON sub_orders(order_id);
CREATE INDEX idx_sub_orders_item_id       ON sub_orders(item_id);
CREATE INDEX idx_sub_orders_order_type_id ON sub_orders(order_type_id);
CREATE INDEX idx_sub_orders_create_date   ON sub_orders(create_date);
CREATE INDEX idx_sub_orders_status        ON sub_orders(status);
CREATE INDEX idx_sub_orders_code          ON sub_orders(code);

-- A sub-order can be filled from multiple inventory sources -> one sub_order : many rows
CREATE TABLE allocations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_order_id       UUID          NOT NULL REFERENCES sub_orders(id),
  inventory_id       UUID          NOT NULL REFERENCES inventory(id),
  allocated_quantity DECIMAL(14,2) NOT NULL,
  unit_price         DECIMAL(14,2) NOT NULL,
  total_price        DECIMAL(14,2) NOT NULL,
  method             VARCHAR       NOT NULL DEFAULT 'auto',
  created_at         TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_allocations_sub_order ON allocations(sub_order_id);
CREATE INDEX idx_allocations_inventory ON allocations(inventory_id);

-- ---- auto-update updated_at on every row update ----------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_updated_at   BEFORE UPDATE ON customers   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_items_updated_at       BEFORE UPDATE ON items       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_suppliers_updated_at   BEFORE UPDATE ON suppliers   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_warehouses_updated_at  BEFORE UPDATE ON warehouses  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_inventory_updated_at   BEFORE UPDATE ON inventory   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
