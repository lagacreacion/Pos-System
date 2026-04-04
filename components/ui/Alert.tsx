interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({ type, message, onClose, className = '' }: AlertProps) => {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`border rounded p-4 flex justify-between items-center ${styles[type]} ${className}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xl font-bold cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  );
};
