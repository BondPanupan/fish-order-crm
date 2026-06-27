'use client';

import Link from 'next/link';
import styles from './page.module.css';

const menuItems = [
  { href: '/admin/orders', label: 'Orders', description: 'Create and manage customer orders' },
  { href: '/admin/customers', label: 'Customers', description: 'Manage customer records' },
  { href: '/admin/inventory', label: 'Inventory / Stock', description: 'View and adjust stock levels' },
  { href: '/admin/items', label: 'Items', description: 'Manage fish product catalogue' },
  { href: '/admin/suppliers', label: 'Suppliers', description: 'Manage supplier master data' },
  { href: '/admin/warehouses', label: 'Warehouses', description: 'Manage warehouse master data' },
  { href: '/admin/prices', label: 'Prices', description: 'Manage item prices by supplier and order type' },
];

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Menu</h1>
      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.menuItem}>
            <span className={styles.menuLabel}>{item.label}</span>
            <span className={styles.menuDescription}>{item.description}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
