import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import './Toast.css';

const Toast = () => {
    const { toast } = useToast();

    if (!toast.show) return null;

    return (
        <div className={`toast toast-${toast.type} slide-in`}>
            <div className="toast-icon">
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'error' && <XCircle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
            </div>
            <span className="toast-message">{toast.message}</span>
        </div>
    );
};

export default Toast;
