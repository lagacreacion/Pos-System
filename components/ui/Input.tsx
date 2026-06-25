interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) => {
  const baseStyle =
    'h-12 bg-white border-2 rounded-xl px-4 text-base font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 transition-all';
  const stateStyle = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
    : 'border-slate-100 focus:border-blue-500 focus:ring-blue-100';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={widthClass}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`${baseStyle} ${stateStyle} ${widthClass} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">{error}</p>}
    </div>
  );
};
