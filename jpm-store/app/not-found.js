/* app/not-found.js — custom 404 page */
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <p className={styles.code}>404</p>
                <h1 className={styles.title}>Page Not Found</h1>
                <p className={styles.desc}>
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className={styles.actions}>
                    <Link href="/" className="btn btn-primary">Go Home</Link>
                    <Link href="/category/mobiles" className="btn btn-outline">Browse Products</Link>
                </div>
            </div>
        </div>
    );
}
