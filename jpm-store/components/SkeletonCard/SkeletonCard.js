import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
    return (
        <div className={styles.card} aria-hidden="true">
            <div className={styles.image} />
            <div className={styles.body}>
                <div className={`${styles.line} ${styles.short}`} />
                <div className={`${styles.line} ${styles.long}`} />
                <div className={`${styles.line} ${styles.medium}`} />
                <div className={`${styles.line} ${styles.price}`} />
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 8 }) {
    return (
        <div className={styles.grid}>
            {Array.from({ length: count }, (_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
