import Link from 'next/link';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
    return (
        <section className={styles.hero} aria-label="JPM Store Hero Banner">
            <div className={styles.bgLayer} />
            <div className={styles.bgGlow} />

            <div className={`${styles.inner} container`}>
                <div className={styles.textCol}>

                    <h1 className={styles.heading}>
                        <span className={styles.headingLight}>The Future of</span>
                        <span className={styles.headingAccent}>Technology.</span>
                        <span className={styles.headingOutline}>Refined.</span>
                    </h1>

                    <p className={styles.desc}>
                        Explore an elite curation of high-performance wearables, studio-grade audio accessories, and next-gen devices designed for modern living.
                    </p>

                    <div className={styles.actions}>
                        <Link href="/category/smartwatches" className={styles.ctaBtn}>
                            Shop Collection <span className={styles.ctaArrow}>→</span>
                        </Link>
                        <Link href="/category/earphones" className={styles.secondaryBtn}>
                            Explore Categories
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
