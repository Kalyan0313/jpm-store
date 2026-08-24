'use client';

import styles from './AnnouncementBar.module.css';

const MESSAGES = [
    { text: 'Free Shipping on orders above', highlight: '₹999' },
    { text: 'Use code', highlight: 'SAVE10', suffix: 'for 10% off' },
    { text: 'New arrivals every week — Shop', highlight: 'Latest Drops' },
    { text: 'Easy 30-day returns &', highlight: 'Hassle-Free Exchange' },
    { text: 'COD available on orders above', highlight: '₹499' },
];

export default function AnnouncementBar() {
    // Duplicate messages for seamless infinite loop
    const allMessages = [...MESSAGES, ...MESSAGES];

    return (
        <div className={styles.announcementBar} role="marquee" aria-label="Announcements">
            <div className={styles.track}>
                {allMessages.map((msg, i) => (
                    <span key={i} className={styles.message}>
                        {msg.text}&nbsp;<strong className={styles.highlight}>{msg.highlight}</strong>
                        {msg.suffix && <>&nbsp;{msg.suffix}</>}
                        <span className={styles.dot} aria-hidden="true" />
                    </span>
                ))}
            </div>
        </div>
    );
}
