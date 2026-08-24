import Image from 'next/image';
import styles from './JPMLogo.module.css';

export default function JPMLogo({ size = 'md' }) {
    const sizes = { sm: 36, md: 48, lg: 64 };
    const px = sizes[size] ?? 48;

    return (
        <div className={`${styles.logo} ${styles[size]}`}>
            <Image
                src="/logo.png"
                alt="JPM Store"
                width={px}
                height={px}
                className={styles.img}
                priority
            />
        </div>
    );
}
