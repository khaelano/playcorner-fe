type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={`flex flex-row bg-secondary-500 py-4 px-6 items-center justify-center rounded-xl text-white ${className} active:bg-primary-100 disabled:bg-primary-100 transition-all duration-75`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
