"use client";

function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export default Button;
