'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    HiLockClosed,
    HiCreditCard,
    HiCheckCircle,
    HiX,
    HiShieldCheck,
} from 'react-icons/hi';
import styles from './StripeModal.module.css';

export default function StripeModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
    const [method, setMethod] = useState('card'); // 'card' | 'upi' | 'netbanking' | 'cod'
    const [processing, setProcessing] = useState(false);
    const [cardForm, setCardForm] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        zip: '',
    });
    const [upiId, setUpiId] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    // Auto-fill test card helper for rapid testing
    const fillTestCard = () => {
        setCardForm({
            number: '4242 4242 4242 4242',
            expiry: '12 / 28',
            cvc: '424',
            name: 'John Doe',
            zip: '560001',
        });
        setError('');
    };

    const handleCardChange = (field, val) => {
        let formatted = val;
        if (field === 'number') {
            formatted = val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
        } else if (field === 'expiry') {
            formatted = val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1 / $2').slice(0, 7);
        } else if (field === 'cvc') {
            formatted = val.replace(/\D/g, '').slice(0, 4);
        }
        setCardForm((prev) => ({ ...prev, [field]: formatted }));
        setError('');
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setError('');

        if (method === 'card') {
            if (cardForm.number.replace(/\s/g, '').length < 16) {
                setError('Please enter a valid 16-digit card number');
                return;
            }
            if (!cardForm.expiry || !cardForm.cvc) {
                setError('Please fill in card expiration date and CVC');
                return;
            }
        } else if (method === 'upi' && !upiId.includes('@')) {
            setError('Please enter a valid UPI ID (e.g. mobile@upi)');
            return;
        }

        setProcessing(true);

        // Simulate 1.2s Stripe payment gateway authentication
        setTimeout(() => {
            setProcessing(false);
            onPaymentSuccess({
                method,
                transactionId: `txn_${Math.random().toString(36).substring(2, 12)}`,
            });
        }, 1200);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.backdrop} onClick={onClose} />

            <div className={styles.modal}>
                {/* Stripe Header */}
                <div className={styles.header}>
                    <div className={styles.brandRow}>
                        <Image src="/logo.png" alt="JPM Store" width={36} height={36} className={styles.logo} />
                        <div>
                            <h3 className={styles.title}>JPM Store Checkout</h3>
                            <p className={styles.subtitle}>256-bit SSL Encrypted Payment</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <HiX />
                    </button>
                </div>

                {/* Amount Banner */}
                <div className={styles.amountBanner}>
                    <span className={styles.amountLabel}>Total Due</span>
                    <span className={styles.amountValue}>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                {/* Payment Method Selector */}
                <div className={styles.methodsTab}>
                    <button
                        className={`${styles.tabBtn} ${method === 'card' ? styles.tabActive : ''}`}
                        onClick={() => setMethod('card')}
                    >
                        <HiCreditCard className={styles.tabIcon} /> Card
                    </button>
                    <button
                        className={`${styles.tabBtn} ${method === 'upi' ? styles.tabActive : ''}`}
                        onClick={() => setMethod('upi')}
                    >
                        ⚡ UPI / GPay
                    </button>
                    <button
                        className={`${styles.tabBtn} ${method === 'cod' ? styles.tabActive : ''}`}
                        onClick={() => setMethod('cod')}
                    >
                        💵 COD
                    </button>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmitPayment} className={styles.form}>
                    {/* Card Form */}
                    {method === 'card' && (
                        <div className={styles.cardSection}>
                            <div className={styles.demoBanner}>
                                <span>Demo Mode:</span>
                                <button type="button" className={styles.demoFillBtn} onClick={fillTestCard}>
                                    Auto-fill Test Card 💳
                                </button>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Card Number</label>
                                <div className={styles.inputWrap}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="4242 4242 4242 4242"
                                        value={cardForm.number}
                                        onChange={(e) => handleCardChange('number', e.target.value)}
                                        maxLength={19}
                                    />
                                    <span className={styles.cardBrandBadge}>VISA</span>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Expires</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="MM / YY"
                                        value={cardForm.expiry}
                                        onChange={(e) => handleCardChange('expiry', e.target.value)}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>CVC</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="123"
                                        value={cardForm.cvc}
                                        onChange={(e) => handleCardChange('cvc', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Cardholder Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="John Doe"
                                    value={cardForm.name}
                                    onChange={(e) => handleCardChange('name', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* UPI Form */}
                    {method === 'upi' && (
                        <div className={styles.upiSection}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>UPI ID / VPA</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="username@okaxis or 9876543210@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                />
                            </div>
                            <div className={styles.quickUpiRow}>
                                {['@okaxis', '@okicici', '@paytm', '@ybl'].map((suf) => (
                                    <button
                                        key={suf}
                                        type="button"
                                        className={styles.upiChip}
                                        onClick={() => setUpiId((prev) => (prev ? prev.split('@')[0] + suf : `user${suf}`))}
                                    >
                                        {suf}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* COD Form */}
                    {method === 'cod' && (
                        <div className={styles.codSection}>
                            <div className={styles.codBox}>
                                <HiCheckCircle className={styles.codIcon} />
                                <p className={styles.codText}>
                                    Pay <strong>₹{totalAmount.toLocaleString('en-IN')}</strong> in cash upon delivery to your doorstep.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Pay Button */}
                    <button type="submit" className={styles.paySubmitBtn} disabled={processing}>
                        {processing ? (
                            <span className={styles.spinnerWrap}>
                                <span className={styles.spinner} /> Contacting Stripe Gateway…
                            </span>
                        ) : (
                            <span className={styles.btnContent}>
                                <HiLockClosed className={styles.lockIcon} />
                                {method === 'cod' ? 'Confirm Order' : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}
                            </span>
                        )}
                    </button>
                </form>

                {/* Footer Security Badges */}
                <div className={styles.footerSecurity}>
                    <HiShieldCheck className={styles.shieldIcon} />
                    <span>Powered by Stripe & Express Security</span>
                </div>
            </div>
        </div>
    );
}
