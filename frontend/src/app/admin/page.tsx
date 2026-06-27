import Link from 'next/link';
import styles from './page.module.css';

const menuItems = [
  { href: '/admin/customers', label: 'Customers', description: 'Manage customer records' },
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
