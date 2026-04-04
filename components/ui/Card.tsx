interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const Card = ({ title, children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}
      {...props}
    >
      {title && (
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};
