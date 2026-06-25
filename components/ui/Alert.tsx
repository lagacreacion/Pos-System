interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({ type, message, onClose, className = '' }: AlertProps) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };
  const dot = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`border rounded-2xl px-4 py-3.5 flex items-center gap-3 ${styles[type]} ${className}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot[type]}`} />
      <span className="flex-1 text-sm font-semibold">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 text-lg font-bold leading-none transition-colors"
          aria-label="Cerrar"
        >
          &times;
        </button>
      )}
    </div>
  );
};
