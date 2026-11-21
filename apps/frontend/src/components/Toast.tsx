import { useEffect, useRef } from 'react';
import InfoIcon from '../assets/icons/info.svg';
import './Toast.css';

interface ToastProps {
  title: string;
  message: string;
  onClose: () => void;
}

// randomly chosen
const DISMISS_AFTER_MS = 4000;

export default function Toast({ title, message, onClose }: ToastProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), DISMISS_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="toast">
      <img src={InfoIcon} alt="" className="toast__icon" />
      <div className="toast__text">
        <span className="toast__title">{title}</span>
        <span className="toast__message">{message}</span>
      </div>
    </div>
  );
}
