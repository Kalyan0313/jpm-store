'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import styles from './ToastContainer.module.css';
import { HiCheckCircle, HiInformationCircle, HiExclamation, HiX } from 'react-icons/hi';

// ─── Context ───────────────────────────────────────────────
const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
    }, []);

    const addToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
        const id = ++toastId;
        setToasts((t) => [...t, { id, message, type }]);
        setTimeout(() => removeToast(id), duration);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}

// ─── Container ─────────────────────────────────────────────
const ICONS = {
    success: <HiCheckCircle />,
    info: <HiInformationCircle />,
    warning: <HiExclamation />,
    error: <HiExclamation />,
};

function ToastContainer({ toasts, onRemove }) {
    return (
        <div className={styles.container} aria-live="polite" role="status">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function Toast({ toast, onRemove }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger CSS enter animation
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    return (
        <div
            className={`${styles.toast} ${styles[toast.type]} ${visible ? styles.visible : ''}`}
            role="alert"
        >
            <span className={styles.icon}>{ICONS[toast.type]}</span>
            <span className={styles.message}>{toast.message}</span>
            <button
                className={styles.closeBtn}
                onClick={() => onRemove(toast.id)}
                aria-label="Dismiss notification"
            >
                <HiX />
            </button>
        </div>
    );
}
