type PopupProps = React.HTMLProps<HTMLDivElement>;

export default function Popup({ children, className, ...props }: PopupProps) {
  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-1 bg-black/50">
      <div
        className={`fixed w-88 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[3rem] flex ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
