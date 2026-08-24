import Link from 'next/link';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import styles from './Footer.module.css';

const SHOP_LINKS = [
    { label: 'Smartwatches', href: '/category/smartwatches' },
    { label: 'Earphones', href: '/category/earphones' },
    { label: 'Laptops', href: '/category/laptops' },
    { label: 'Mobiles', href: '/category/mobiles' },
];

const SUPPORT_LINKS = [
    { label: 'Track Order', href: '#' },
    { label: 'Returns & Exchange', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'Contact Us', href: '#' },
];

const COMPANY_LINKS = [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
];

const SOCIAL = [
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
    { icon: FaGithub, href: '#', label: 'GitHub' },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brand}>
                        <div className={styles.brandLogo}>JPM Store</div>
                        <p className={styles.brandDesc}>
                            Premium electronics for the modern lifestyle. Smartwatches, earphones, laptops,
                            and mobiles — curated for quality and performance.
                        </p>
                        <div className={styles.socialLinks}>
                            {SOCIAL.map(({ icon: Icon, href, label }) => (
                                <a key={label} href={href} className={styles.socialLink} aria-label={label} target="_blank" rel="noopener noreferrer">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Shop</h3>
                        <ul className={styles.columnLinks}>
                            {SHOP_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className={styles.columnLink}>{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Support</h3>
                        <ul className={styles.columnLinks}>
                            {SUPPORT_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <a href={href} className={styles.columnLink}>{label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Company</h3>
                        <ul className={styles.columnLinks}>
                            {COMPANY_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <a href={href} className={styles.columnLink}>{label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} JPM Store. All rights reserved.
                    </p>
                    <div className={styles.bottomLinks}>
                        <a href="#" className={styles.bottomLink}>Privacy Policy</a>
                        <a href="#" className={styles.bottomLink}>Terms of Service</a>
                        <a href="#" className={styles.bottomLink}>Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
