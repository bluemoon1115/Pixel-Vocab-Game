import type { ButtonHTMLAttributes } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'warning';
}

export function PixelButton({ variant = 'primary', className = '', children, ...props }: PixelButtonProps) {
  // 將原本字體改為英文用 Press Start 2P，避免按鈕被字體影響跑版
  const baseStyle = "px-4 py-2 font-['DotGothic16'] font-bold text-lg transition-transform active:scale-95";
  
  const variants = {
    primary: "bg-[var(--color-nes-blue)] text-white pixel-border hover:brightness-110",
    success: "bg-[var(--color-nes-green)] text-white pixel-border hover:brightness-110",
    danger: "bg-[var(--color-nes-red)] text-white pixel-border hover:brightness-110",
    warning: "bg-[var(--color-nes-yellow)] text-black pixel-border hover:brightness-110",
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
