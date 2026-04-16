import type { InputHTMLAttributes } from 'react';

export function PixelInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`px-3 py-2 bg-white text-black pixel-border-inset outline-none focus:border-[var(--color-nes-blue)] ${className}`}
      {...props}
    />
  );
}
