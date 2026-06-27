-- Reference / master data

CREATE TABLE customers (
  id           SERIAL PRIMARY KEY,
  code         VARCHAR UNIQUE NOT NULL,
  name         VARCHAR NOT NULL,
  credit_limit DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_types (
  id       SERIAL PRIMARY KEY,
  code     VARCHAR UNIQUE NOT NULL,
  name     VARCHAR NOT NULL,
  priority INTEGER NOT NULL
);

CREATE TABLE suppliers (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR UNIQUE NOT NULL,
  name        VARCHAR NOT NULL,
  is_wildcard BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE warehouses (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR UNIQUE NOT NULL,
  name        VARCHAR NOT NULL,
  is_wildcard BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id   SERIAL PRIMARY KEY,
  code VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  unit VARCHAR NOT NULL DEFAULT 'kg'
);

-- Stock & pricing

CREATE TABLE inventory (
  id                 SERIAL PRIMARY KEY,
  supplier_id        INTEGER NOT NULL REFERENCES suppliers(id),
  warehouse_id       INTEGER NOT NULL REFERENCES warehouses(id),
  product_id         INTEGER NOT NULL REFERENCES products(id),
  remaining_quantity DECIMAL(14,2) NOT NULL DEFAULT 0,
  updated_at         TIMESTAMP DEFAULT NOW(),
  UNIQUE (supplier_id, warehouse_id, product_id)
);

CREATE INDEX idx_inventory_remaining ON inventory(remaining_quantity);

CREATE TABLE supplier_prices (
  id            SERIAL PRIMARY KEY,
  supplier_id   INTEGER NOT NULL REFERENCES suppliers(id),
  order_type_id INTEGER NOT NULL REFERENCES order_types(id),
  product_id    INTEGER NOT NULL REFERENCES products(id),
  unit_price    DECIMAL(14,2) NOT NULL,
  UNIQUE (supplier_id, order_type_id, product_id)
);

-- Orders & allocations

CREATE TABLE orders (
  id                 SERIAL PRIMARY KEY,
  code               VARCHAR UNIQUE NOT NULL,
  customer_id        INTEGER NOT NULL REFERENCES customers(id),
  order_type_id      INTEGER NOT NULL REFERENCES order_types(id),
  product_id         INTEGER NOT NULL REFERENCES products(id),
  supplier_id        INTEGER NOT NULL REFERENCES suppliers(id),
  warehouse_id       INTEGER NOT NULL REFERENCES warehouses(id),
  requested_quantity DECIMAL(14,2) NOT NULL,
  status             VARCHAR NOT NULL DEFAULT 'pending',
  created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer    ON orders(customer_id);
CREATE INDEX idx_orders_order_type  ON orders(order_type_id);
CREATE INDEX idx_orders_created_at  ON orders(created_at);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_orders_code        ON orders(code);

CREATE TABLE allocations (
  id                 SERIAL PRIMARY KEY,
  order_id           INTEGER NOT NULL REFERENCES orders(id),
  inventory_id       INTEGER NOT NULL REFERENCES inventory(id),
  allocated_quantity DECIMAL(14,2) NOT NULL,
  unit_price         DECIMAL(14,2) NOT NULL,
  total_price        DECIMAL(14,2) NOT NULL,
  method             VARCHAR NOT NULL DEFAULT 'auto',
  created_at         TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_allocations_order     ON allocations(order_id);
CREATE INDEX idx_allocations_inventory ON allocations(inventory_id);
