# Fish CRM — Order Management

A full-stack CRM for managing fish (salmon / tuna) purchase orders, customer credit limits, inventory stock, supplier pricing tiers, and automatic stock allocation.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (TypeScript, App Router, CSS Modules) |
| Backend | NestJS + Prisma ORM |
| Database | PostgreSQL 16 |
| Container | Docker Compose |

---

## Installation

### System Requirements

| Tool | Minimum version |
|---|---|
| Docker | 24+ |
| Docker Compose | v2.20+ |
| Node.js *(local dev only)* | 20+ |

No other dependencies are required — everything runs inside Docker.

### Quick Start

**1. Clone the repository**

```bash
git clone https://github.com/BondPanupan/fish-order-crm.git
cd fish-order-crm
```

**2. Create your environment file**

```bash
cp .env.sample .env
```

Edit `.env` if you need different credentials (the defaults work out of the box).

**3. Start all services**

```bash
docker compose up --build
```

The first run automatically:
- Builds the backend and frontend images
- Starts PostgreSQL and runs `db/init/` scripts in order (schema → seed → extended seed)
- Starts the NestJS API and the Next.js frontend

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

**4. Open the app**

Navigate to **http://localhost:3000** — the Orders overview loads immediately with seed data.

**Stop services**

```bash
docker compose down          # keep database volume
docker compose down -v       # also wipe the database
```

---

## About Features

### Order Management
Create and manage fish purchase orders with multiple line items (sub-orders) per order. Each sub-order specifies an item, warehouse, supplier, quantity, and order type. The system calculates unit prices automatically based on pricing tiers and flags any order that exceeds the customer's credit limit before submission.

### Customer Credit Limits
Each customer has a configurable credit limit (THB). When creating an order, the running grand total is compared against the limit in real time — the submit button is disabled and a warning is shown if the order would exceed it.

### Pricing Tiers
Prices are defined per `item × supplier` combination with three urgency tiers:

| Order Type | Multiplier | Use case |
|---|---|---|
| EMERGENCY | 125% | Urgent stock needed immediately |
| OVER_DUE | 100% | Late or backlogged orders |
| DAILY | 90% | Standard daily procurement |

An explicit price row for a specific tier overrides the base-price × percentage calculation.

### Inventory & Stock Tracking
Stock is tracked per `item × supplier × warehouse` combination. Remaining quantities are visible and editable from the Inventory admin page. The allocation engine consumes stock when orders are confirmed.

### Wildcard Supplier / Warehouse
`SP-000 (Any supplier)` and `WH-000 (Any warehouse)` are special wildcard entries. When a sub-order uses a wildcard, the allocation engine automatically resolves it to the real supplier or warehouse with the highest remaining stock.

### Automatic Allocation
When a sub-order is confirmed, the allocation engine splits the requested quantity across available inventory rows (from highest stock first) and records each allocation with its unit price and total. A sub-order that cannot be fully filled is partially allocated.

---

## Environment Variables

Copy `.env.sample` to `.env` before starting:

```bash
cp .env.sample .env
```

| Variable | Where used | Description |
|---|---|---|
| `POSTGRES_USER` | docker-compose, DB | PostgreSQL username |
| `POSTGRES_PASSWORD` | docker-compose, DB | PostgreSQL password |
| `POSTGRES_DB` | docker-compose, DB | Database name |
| `DATABASE_URL` | Backend (Prisma) | Full Postgres connection string — constructed from the three vars above |
| `PORT` | Backend | NestJS listening port (default `3001`) |
| `NEXT_PUBLIC_API_URL` | Frontend (browser) | API base URL as seen from the user's browser |
| `API_URL` | Frontend (server) | API base URL used by Next.js server-side calls — use the Docker service name inside Compose |

**Example `.env` for Docker Compose (default):**

```env
POSTGRES_USER=fish_user
POSTGRES_PASSWORD=fish_pass
POSTGRES_DB=fish_crm

DATABASE_URL=postgresql://fish_user:fish_pass@db:5432/fish_crm
PORT=3001

NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://backend:3001
```

> When running services locally (outside Docker), change `@db:` to `@localhost:` in `DATABASE_URL` and `http://backend:` to `http://localhost:` in `API_URL`.

---

## Project Structure and Organization

```
fish-order-crm/
│
├── .env.sample                   # Environment variable template
├── docker-compose.yml            # Orchestrates db / backend / frontend
│
├── db/
│   └── init/
│       ├── 01_schema.sql         # DDL — all tables, indexes, triggers
│       ├── 02_seed.sql           # Base sample data (order types, items, etc.)
│       └── 03_seed_extended.sql  # Extended mockup data for UI testing
│
├── frontend/                     # Next.js application (port 3000)
│   └── src/
│       ├── app/                  # App Router pages and layouts
│       │   ├── layout.tsx        # Root layout (sidebar + global styles)
│       │   ├── page.tsx          # Overview — Orders read-only list
│       │   ├── orders/[id]/      # Order detail page
│       │   └── admin/            # Admin pages (CRUD for all entities)
│       │       ├── orders/
│       │       ├── customers/
│       │       ├── items/
│       │       ├── suppliers/
│       │       ├── warehouses/
│       │       ├── inventory/
│       │       └── prices/
│       ├── components/           # Feature UI components
│       │   ├── Sidebar/          # Navigation sidebar
│       │   ├── OrderManager/     # Order list, create/edit form
│       │   ├── CustomerManager/
│       │   ├── ItemManager/
│       │   ├── SupplierManager/
│       │   ├── WarehouseManager/
│       │   ├── InventoryManager/
│       │   ├── PriceManager/
│       │   └── ConfirmModal/     # Shared delete-confirm dialog
│       ├── lib/api/              # API client functions (fetch wrappers)
│       │   ├── orders/
│       │   ├── customers/
│       │   ├── items/
│       │   ├── suppliers/
│       │   ├── warehouses/
│       │   ├── inventory/
│       │   ├── prices/
│       │   └── order-types/
│       └── types/                # Shared TypeScript types
│
└── backend/                      # NestJS application (port 3001)
    └── src/
        ├── app/                  # Feature modules (controller → use-case → db)
        │   ├── customers/
        │   ├── items/
        │   ├── orders/
        │   ├── order-types/
        │   ├── suppliers/
        │   ├── warehouses/
        │   ├── inventory/
        │   └── prices/
        ├── databaseModules/      # Prisma query services per entity
        ├── allocation/           # Allocation engine logic
        ├── prisma/               # Prisma client setup
        └── entities/             # Shared entity definitions
```

### Backend Architecture Pattern

Each resource follows a consistent three-layer pattern:

```
Controller  →  Use-Case  →  DB Service (Prisma)
```

- **Controller** — handles HTTP routing and DTO validation
- **Use-Case** — one file per operation (create, find-all, find-one, update, remove)
- **DB Service** — owns all Prisma queries for that entity

---

## Layouts and Pages

### Root Layout — `src/app/layout.tsx`

Wraps every page with the persistent **Sidebar** navigation. The sidebar is divided into two sections:

- **OVERVIEW** — read-only views for end users
- **ADMIN** — full CRUD management pages

---

### Overview: Orders — `/`

Read-only list of all orders for end users. Shows order code, customer (code + name), order type badges, remark, line count, and creation date. Supports search by order code or customer.

![Orders Overview](ex-images/01-overview-orders.png)

---

### Order Detail — `/orders/[id]`

Drills into a single order. Displays customer info, credit limit, and a full table of sub-order lines with warehouse, supplier, order type, date, quantity, unit price, total, and status. A live credit-limit indicator shows remaining headroom or flags an over-limit order.

![Order Detail](ex-images/02-admin-orders-detail.png)

---

### Admin: Manage Orders — `/admin/orders`

Full CRUD for orders. The create form supports adding multiple sub-order lines in one submission and validates the total against the selected customer's credit limit in real time.

![Manage Orders](ex-images/03-admin-manage-order.png)

---

### Admin: Customers — `/admin/customers`

Manage customers with credit limits (THB). Each row shows the total number of linked orders.

![Customers](ex-images/04-admin-customers.png)

The edit modal lets you update the customer name and credit limit inline.

![Edit Customer](ex-images/05-admin-customers-edit.png)

---

### Admin: Items — `/admin/items`

Catalogue of fish products (Salmon grade A/B/C, Tuna, etc.) with code, name, and unit of measure.

![Items](ex-images/06-admin-item.png)

---

### Admin: Suppliers — `/admin/suppliers`

Suppliers include a **Wildcard** flag. `SP-000 — Any supplier` is the wildcard entry; the allocation engine resolves it automatically at allocation time.

![Suppliers](ex-images/07-admin-suppliers.png)

---

### Admin: Warehouses — `/admin/warehouses`

Same wildcard pattern as suppliers. `WH-000 — Any warehouse` lets the allocation engine pick the best-stocked warehouse.

![Warehouses](ex-images/08-admin-warehouses.png)

---

### Admin: Inventory / Stock — `/admin/inventory`

Tracks remaining stock per `item × supplier × warehouse` combination. Quantities are colour-highlighted for quick scanning. Supports search by item, supplier, or warehouse name.

![Inventory](ex-images/09-admin-inventory.png)

---

### Admin: Prices — `/admin/prices`

Price tiers per `item × supplier`. **Base Price** rows are multiplied by the order type percentage at runtime; explicit tier rows (`EMERGENCY`, `OVER_DUE`, `DAILY`) override that calculation.

![Prices](ex-images/10-admin-price.png)

| Order Type | Priority | Price Multiplier |
|---|---|---|
| EMERGENCY | 1 | 125% |
| OVER_DUE | 2 | 100% |
| DAILY | 3 | 90% |

---

## Data Model

```
customers ──< orders ──< sub_orders ──< allocations
                              │
              items ──────────┤
           suppliers ─────────┤
          warehouses ─────────┘
               │
           inventory  (supplier × warehouse × item → remaining_quantity)
           prices     (item × supplier × order_type → unit_price)
          order_types (EMERGENCY / OVER_DUE / DAILY — priority & %)
```

### Wildcard Resolution

`SP-000` and `WH-000` are wildcard records. When a sub-order uses a wildcard, the allocation engine picks the `inventory` row with the highest `remaining_quantity` that satisfies the non-wildcard dimensions.
