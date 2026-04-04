import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal = ({ isOpen, title, onClose, children, actions }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-96 overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {actions && (
          <div className="border-t border-gray-200 px-6 py-4 flex gap-2 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
