import Link from 'next/link';
import styles from './page.module.css';

const cards = [
  { href: '/admin/orders', label: 'Manage Orders', description: 'Create and manage customer orders', icon: '✏️' },
  { href: '/admin/customers', label: 'Customers', description: 'Manage customer master data', icon: '👥' },
  { href: '/admin/items', label: 'Items', description: 'Manage fish product catalogue', icon: '🐟' },
  { href: '/admin/suppliers', label: 'Suppliers', description: 'Manage supplier master data', icon: '🏭' },
  { href: '/admin/warehouses', label: 'Warehouses', description: 'Manage warehouse master data', icon: '🏢' },
  { href: '/admin/inventory', label: 'Inventory', description: 'View and adjust stock levels', icon: '📦' },
  { href: '/admin/prices', label: 'Prices', description: 'Manage prices by supplier and order type', icon: '💰' },
];

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin</h1>
      <div className={styles.grid}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className={styles.card}>
            <span className={styles.cardLabel}>{c.label}</span>
            <span className={styles.cardDesc}>{c.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
