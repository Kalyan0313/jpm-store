import { FiTruck, FiRotateCcw, FiShield, FiHeadphones, FiZap } from 'react-icons/fi';
import styles from './FeaturesRow.module.css';

const FEATURES = [
    {
        icon: FiTruck,
        title: 'Free Shipping',
        desc: 'On all orders above ₹999',
    },
    {
        icon: FiRotateCcw,
        title: '30-Day Returns',
        desc: 'Hassle-free returns policy',
    },
    {
        icon: FiShield,
        title: 'Secure Payment',
        desc: '100% secure transactions',
    },
    {
        icon: FiHeadphones,
        title: '24/7 Support',
        desc: 'Expert help when you need it',
    },
    {
        icon: FiZap,
        title: 'Fast Delivery',
        desc: 'Delivered in 2–4 business days',
    },
];

export default function FeaturesRow() {
    return (
        <section className={styles.section} aria-label="Store features">
            <div className="container">
                <div className={styles.grid}>
                    {FEATURES.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div key={f.title} className={styles.feature}>
                                <span className={styles.icon} aria-hidden="true">
                                    <Icon />
                                </span>
                                <div>
                                    <p className={styles.title}>{f.title}</p>
                                    <p className={styles.desc}>{f.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
