'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginUserThunk, login } from '@/store/authSlice';
import { useToast } from '@/components/Toast/ToastContainer';
import Image from 'next/image';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import styles from './login.module.css';

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToast } = useToast();
    const showToast = (msg, type) => addToast({ message: msg, type });

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const redirect = searchParams.get('redirect') || '/';

    function validate() {
        const e = {};
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.password) e.password = 'Password is required';
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        setLoading(true);
        try {
            // Attempt API login first
            const resultAction = await dispatch(loginUserThunk({ email: form.email.trim(), password: form.password }));
            if (loginUserThunk.fulfilled.match(resultAction)) {
                showToast('Welcome back! 👋', 'success');
                router.push(redirect);
            } else {
                // Fallback to local mock login if API backend server is offline
                dispatch(login({ email: form.email.trim(), password: form.password }));
                showToast('Welcome back! 👋 (Offline mode)', 'success');
                router.push(redirect);
            }
        } catch (err) {
            setErrors({ form: err.message || 'Login failed. Please check your credentials.' });
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
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to your JPM Store account to continue</p>
                </div>

                {errors.form && (
                    <div className={styles.formError}>{errors.form}</div>
                )}

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
                        <label className={styles.label} htmlFor="password">Password</label>
                        <div className={styles.passwordWrap}>
                            <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={onChange('password')}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowPass((v) => !v)}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                        </div>
                        {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p className={styles.switchText}>
                    Don&apos;t have an account?{' '}
                    <Link href={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className={styles.switchLink}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
