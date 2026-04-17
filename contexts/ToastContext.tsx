'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} hideToast={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({
  toasts,
  hideToast,
}: {
  toasts: Toast[];
  hideToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} hideToast={hideToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  hideToast,
}: {
  toast: Toast;
  hideToast: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => hideToast(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, hideToast]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => hideToast(toast.id), 300);
  };

  const Icon = toast.type === 'success' ? CheckCircle : XCircle;
  const variant = toast.type === 'success' ? 'success' : 'destructive';

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        isExiting
          ? 'opacity-0 -translate-y-2 scale-95'
          : 'opacity-100 translate-y-0 scale-100 animate-bounce-in'
      )}
    >
      <Alert
        variant={variant}
        className="min-w-[320px] shadow-lg flex items-center gap-3 relative"
      >
        <Icon className="h-5 w-5" />
        <div className="flex-1">
          <AlertTitle className="text-sm font-semibold">{toast.title}</AlertTitle>
          {toast.description && (
            <AlertDescription className="text-xs mt-0.5">
              {toast.description}
            </AlertDescription>
          )}
        </div>
        <button
          onClick={handleClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </Alert>
    </div>
  );
}
