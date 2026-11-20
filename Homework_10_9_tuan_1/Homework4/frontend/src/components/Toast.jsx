import { useEffect } from "react";
import "../styles/toast.css";

function Toast({ message, type = "info", onClose }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="toast-container">
            <div className={`toast toast-${type}`}>
                <span>{message}</span>
                <button className="toast-close" onClick={onClose}>
                    &times;
                </button>
            </div>
        </div>
    );
}

export default Toast;