import React, { useEffect, useState } from 'react';

type ToastListener = (msg: string) => void;
const listeners = new Set<ToastListener>();

export function showToast(message: string) {
  listeners.forEach((listener) => listener(message));
}

export const ToastContainer: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let timer: any = null;
    const handleToast = (msg: string) => {
      setToast(msg);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setToast(null);
      }, 2200);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
      clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/90 dark:bg-white/95 text-white dark:text-neutral-900 text-xs sm:text-sm font-medium shadow-lg backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
      <span>✓</span>
      <span>{toast}</span>
    </div>
  );
};
