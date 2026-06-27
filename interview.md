# Interview 12.1
## Allocation Problem

## Instruction

Read the following problem and deliver the assignment using the solution format provided below. We will evaluate it based on the criteria listed.

---

## Problem

### Situation

User need a allocation interface for a company with a large number of customer orders. Each customer places one or more orders requesting a certain quantity of salmon from multiple supplier and multiple warehouse. However, total supply is limited. Your task is to design an interactive interface to help fairly allocate salmon to orders, based on defined rules.

### Feature

**1. Manual Allocation Logic**

- Users can manually assign salmon to each order.
- The following constraints must be enforced:
  - Total allocated quantity must not exceed the remaining stock.
  - A customer must not receive more than their available credit allows.

**2. Auto-Assignment Algorithm** (Triggered on Page Load)

- Automatically distribute salmon across orders using the following logic:
  - Begin with the type of order **"Emergency" > "Overdue" > "Daily"** than the oldest orders first **(FIFO)**.
  - Prioritize specific order types as defined by business rules (e.g. high-priority types get salmon before others).
  - Enforce credit limits for each customer, preventing any over-credit allocation, and apply rounding to 2 decimal places using **Banker's rounding**.
  - Apply the correct price per unit based on the supplier where the order was created, with pricing adjusted according to the specific order type.
  - Warehouse ID **(WH-000)** and Supplier ID **(SP-000)** indicate that allocation can be made from any available warehouse or supplier, prioritizing those with the highest remaining stock.

**3. Gigaton of Order**

- User can simply to handle order over **5,000+** Order.
- Finding the order that user want to manual allocate.

---

## Example Data

### Order

| Order | Sub Order | Item ID | Warehouse ID | Supplier ID | Request | Type | Create Date | Customer ID | Remark |
|---|---|---|---|---|---:|---|---|---|---|
| ORDER-0001 | ORDER-0001-001 | Item-1 | WH-001 | SP-001 | 11 | DAILY | 1/1/25 | CT-0001 | |
| ORDER-0001 | ORDER-0001-002 | Item-2 | WH-002 | SP-000 | 20 | DAILY | 01/01/2025 | CT-0001 | |
| ORDER-0002 | ORDER-0002-001 | Item-1 | WH-001 | SP-002 | 300 | EMERGENCY | 03/01/2025 | CT-0002 | Special for VIP |
| ORDER-0002 | ORDER-0002-002 | Item-2 | WH-000 | SP-000 | 100 | EMERGENCY | 03/01/2025 | CT-0002 | Special for VIP |

### Price

| Item ID | Supplier ID | Price | Price Tier | % |
|---|---|---:|---|---:|
| Item-1 | SP-001 | 123.49 | EMERGENCY | 125% |
| Item-1 | SP-001 | 99.75 | OVER_DUE | 100% |
| | | | DAILY | 90% |