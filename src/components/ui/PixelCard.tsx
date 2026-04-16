import type { HTMLAttributes, ReactNode } from 'react';

interface PixelCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
}

export function PixelCard({ className = '', title, children, ...props }: PixelCardProps) {
  return (
    <div className={`bg-white pixel-border p-0 ${className}`} {...props}>
      {title && (
        <div className="bg-[var(--color-nes-dark)] text-[var(--color-nes-light)] px-4 py-2 text-lg border-b-4 border-[var(--color-nes-dark)]">
          {title}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
