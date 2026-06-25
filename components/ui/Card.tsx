interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const Card = ({ title, children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div className="border-b border-slate-100 px-5 sm:px-6 py-4">
          <h3 className="text-base font-black text-slate-800">{title}</h3>
        </div>
      )}
      <div className="px-5 sm:px-6 py-4">{children}</div>
    </div>
  );
};
