import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, action, ...props }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, title, description, action, ...props },
    ]);
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
    }, 5000); // Auto-dismiss after 5 seconds
  }, []);

  return { toast, toasts };
}