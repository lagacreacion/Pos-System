interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyle =
    'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm min-h-[40px]',
    md: 'px-5 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3.5 text-lg min-h-[52px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Cargando...
        </span>
      ) : children}
    </button>
  );
};
