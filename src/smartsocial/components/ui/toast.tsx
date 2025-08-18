import * as React from "react";

/** Toast props */
export type ToastProps = {
  id?: number;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number; // custom duration (ms)
};

/** Context type */
type ToastContextType = {
  toast: (props: ToastProps) => { dismiss: () => void };
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  const [leaving, setLeaving] = React.useState<Set<number>>(() => new Set());

  const removeToast = (id: number) => {
    // trigger exit animation
    setLeaving((prev) => new Set(prev).add(id));
    // remove after animation ends
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setLeaving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300); // keep in sync with CSS duration
  };

  const toast = (props: ToastProps) => {
    const id = Date.now();
    const toastData = { ...props, id };
    setToasts((prev) => [...prev, toastData]);

    const timeout = window.setTimeout(() => {
      removeToast(id);
    }, props.duration ?? 3000);

    return {
      dismiss: () => {
        clearTimeout(timeout);
        removeToast(id);
      },
    };
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Stack container */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => {
          const isLeaving = leaving.has(t.id!);
          return (
            <div
              key={t.id}
              className={[
                "p-4 rounded-lg shadow text-white transform transition-all duration-300",
                t.variant === "destructive" ? "bg-red-500" : "bg-gray-800",
                isLeaving
                  ? "opacity-0 translate-y-2"
                  : "opacity-100 translate-y-0",
              ].join(" ")}
            >
              {t.title && <div className="font-bold">{t.title}</div>}
              {t.description && <div className="mt-0.5 whitespace-pre-line">{t.description}</div>}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
