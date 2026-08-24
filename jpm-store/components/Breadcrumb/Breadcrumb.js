import Link from 'next/link';
import styles from './Breadcrumb.module.css';
import { HiChevronRight } from 'react-icons/hi';

export default function Breadcrumb({ items = [] }) {
    return (
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <ol className={styles.list}>
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={i} className={styles.item}>
                            {!isLast ? (
                                <>
                                    <Link href={item.href} className={styles.link}>{item.label}</Link>
                                    <HiChevronRight className={styles.separator} aria-hidden="true" />
                                </>
                            ) : (
                                <span className={styles.current} aria-current="page">{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
