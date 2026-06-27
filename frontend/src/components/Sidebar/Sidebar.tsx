'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const NAV = [
  {
    section: 'Overview',
    items: [
      { href: '/', label: 'Orders' },
    ],
  },
  {
    section: 'Admin',
    items: [
      { href: '/admin/orders', label: 'Manage Orders' },
      { href: '/admin/customers', label: 'Customers' },
      { href: '/admin/items', label: 'Items' },
      { href: '/admin/suppliers', label: 'Suppliers' },
      { href: '/admin/warehouses', label: 'Warehouses' },
      { href: '/admin/inventory', label: 'Inventory' },
      { href: '/admin/prices', label: 'Prices' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandName}>Fish CRM</div>
        <div className={styles.brandSub}>Order Management</div>
      </div>
      <nav className={styles.nav}>
        {NAV.map((group) => (
          <div key={group.section}>
            <div className={styles.section}>{group.section}</div>
            {group.items.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
