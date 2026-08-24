'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { registerUserThunk, register } from '@/store/authSlice';
import { useToast } from '@/components/Toast/ToastContainer';
import Image from 'next/image';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import styles from './register.module.css';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToast } = useToast();
    const showToast = (msg, type) => addToast({ message: msg, type });

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirm: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const redirect = searchParams.get('redirect') || '/';

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = 'Full name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.phone.trim()) e.phone = 'Phone number is required';
        else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
        if (!form.password) e.password = 'Password is required';
        else if (form.password.length < 6) e.password = 'Minimum 6 characters';
        if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        setLoading(true);
        try {
            const resultAction = await dispatch(registerUserThunk({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            }));

            if (registerUserThunk.fulfilled.match(resultAction)) {
                showToast('Account created successfully! 🎉', 'success');
                router.push(redirect);
            } else {
                dispatch(register({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    password: form.password,
                }));
                showToast('Account created successfully! 🎉 (Offline mode)', 'success');
                router.push(redirect);
            }
        } catch (err) {
            setErrors({ form: err.message || 'Registration failed' });
        } finally {
            setLoading(false);
        }
    }

    function onChange(field) {
        return (ev) => {
            setForm((f) => ({ ...f, [field]: ev.target.value }));
            setErrors((e) => ({ ...e, [field]: '', form: '' }));
        };
    }

    return (
        <div className={styles.page}>
            <div className={styles.glow} />

            <div className={styles.card}>
                <div className={styles.header}>
                    <Link href="/" className={styles.logoLink}>
                        <Image src="/logo.png" alt="JPM Store" width={60} height={60} className={styles.logoImg} priority />
                    </Link>
                    <h1 className={styles.title}>Create account</h1>
                    <p className={styles.subtitle}>Join us for the best deals on electronics</p>
                </div>

                {errors.form && (
                    <div className={styles.formError}>{errors.form}</div>
                )}

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="name">Full name</label>
                        <input
                            id="name"
                            type="text"
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                            placeholder="John Doe"
                            value={form.name}
                            onChange={onChange('name')}
                            autoComplete="name"
                        />
                        {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={onChange('email')}
                            autoComplete="email"
                        />
                        {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="phone">Phone number</label>
                        <input
                            id="phone"
                            type="tel"
                            className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={onChange('phone')}
                            autoComplete="tel"
                        />
                        {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="password">Password</label>
                            <div className={styles.passwordWrap}>
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                    placeholder="Min 6 characters"
                                    value={form.password}
                                    onChange={onChange('password')}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPass((v) => !v)}
                                    aria-label="Toggle password"
                                >
                                    {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                                </button>
                            </div>
                            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="confirm">Confirm password</label>
                            <input
                                id="confirm"
                                type={showPass ? 'text' : 'password'}
                                className={`${styles.input} ${errors.confirm ? styles.inputError : ''}`}
                                placeholder="Repeat password"
                                value={form.confirm}
                                onChange={onChange('confirm')}
                                autoComplete="new-password"
                            />
                            {errors.confirm && <span className={styles.fieldError}>{errors.confirm}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <Link href={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className={styles.switchLink}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
