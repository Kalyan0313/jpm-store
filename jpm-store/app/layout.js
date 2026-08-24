import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { Providers } from '@/store/Providers';
import ClientShell from '@/components/ClientShell/ClientShell';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata = {
    title: {
        default: 'JPM Store — Premium Electronics',
        template: '%s | JPM Store',
    },
    description:
        'Shop premium smartwatches, earphones, laptops, and mobiles at JPM Store. Best prices, free shipping on orders above ₹999.',
    keywords: ['electronics', 'smartwatch', 'earphones', 'laptop', 'mobile', 'online shopping'],
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
        apple: '/logo.png',
    },
    openGraph: {
        title: 'JPM Store — Premium Electronics',
        description: 'Shop premium electronics at JPM Store.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <body>
                <Providers>
                    <ClientShell>{children}</ClientShell>
                </Providers>
            </body>
        </html>
    );
}
