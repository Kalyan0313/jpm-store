import Image from 'next/image';
import Link from 'next/link';
import styles from './PromoBanner.module.css';

const ACCENT = 'rgba(255,255,255,0.9)';

const CARDS = [
    {
        href: '/category/smartwatches',
        tag: 'Limited Time',
        title: 'Up to 40% Off\nSmartwatches',
        desc: 'Premium fitness trackers & smart displays',
        cta: 'Shop Now →',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80&auto=format&fit=crop',
        large: true,
    },
    {
        href: '/category/laptops',
        tag: 'Hot Deals',
        title: 'Laptops from\n₹34,999',
        cta: 'Explore →',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80&auto=format&fit=crop',
        large: false,
    },
    {
        href: '/category/mobiles',
        tag: 'New Stock',
        title: 'Latest Mobiles\nJust Arrived',
        cta: 'View All →',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&q=80&auto=format&fit=crop',
        large: false,
    },
];

export default function PromoBanner() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>

                    {/* ── Large left card ── */}
                    <Link href={CARDS[0].href} className={`${styles.card} ${styles.cardLarge}`}>
                        {/* Background image */}
                        <Image
                            src={CARDS[0].image}
                            alt="Smartwatches promotion"
                            fill
                            className={styles.bgImage}
                            sizes="(max-width: 780px) 100vw, 58vw"
                        />
                        {/* Dark overlay so text is readable */}
                        <div className={styles.overlay} />
                        <div className={styles.cardBody}>
                            <span className={styles.cardTag} style={{ color: ACCENT, borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)' }}>
                                {CARDS[0].tag}
                            </span>
                            <h3 className={styles.cardTitle}>
                                {CARDS[0].title.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
                            </h3>
                            <p className={styles.cardDesc}>{CARDS[0].desc}</p>
                            <span className={styles.cardCta}>{CARDS[0].cta}</span>
                        </div>
                    </Link>

                    {/* ── Right column — two stacked cards ── */}
                    <div className={styles.stackCol}>
                        {CARDS.slice(1).map((card) => (
                            <Link key={card.href} href={card.href} className={`${styles.card} ${styles.cardSmall}`}>
                                <Image
                                    src={card.image}
                                    alt={card.tag}
                                    fill
                                    className={styles.bgImage}
                                    sizes="(max-width: 780px) 100vw, 38vw"
                                />
                                <div className={styles.overlay} />
                                <div className={styles.cardBody}>
                                    <span className={styles.cardTag} style={{ color: ACCENT, borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)' }}>
                                        {card.tag}
                                    </span>
                                    <h3 className={styles.cardTitle}>
                                        {card.title.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
                                    </h3>
                                    <span className={styles.cardCta}>{card.cta}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
