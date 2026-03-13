import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'sheet' | 'sequence';
  children: React.ReactNode;
  className?: string;
}

export function Card({ className, variant = 'standard', children, ...props }: CardProps) {
  const baseStyles = 'bg-edu-bg border border-edu-light/30 rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200';
  const hoverStyles = 'hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5';
  
  const variants = {
    standard: 'p-5',
    sheet: 'p-5',
    sequence: 'p-5 border-l-4 border-l-edu-red',
  };

  return (
    <div 
      className={cn(baseStyles, variant !== 'sequence' && hoverStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
