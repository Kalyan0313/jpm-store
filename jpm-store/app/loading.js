/* app/loading.js — global loading UI for route transitions */
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.spinner} />
        </div>
    );
}
