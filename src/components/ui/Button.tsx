import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  icon: Icon, 
  iconPosition = 'left', 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-edu-red text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:bg-edu-red-hover hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] hover:-translate-y-0.5',
    secondary: 'bg-transparent border border-edu-dark text-edu-dark hover:border-edu-red hover:text-edu-red',
    tertiary: 'bg-transparent text-edu-dark hover:text-edu-red hover:underline decoration-edu-red underline-offset-4',
  };

  const baseStyles = 'inline-flex items-center justify-center px-7 py-3 rounded-[4px] font-sans font-medium text-base transition-all duration-200';
  const disabledStyles = 'opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0';

  return (
    <button 
      className={cn(baseStyles, variants[variant], props.disabled && disabledStyles, className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} className="mr-2" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} className="ml-2" />}
    </button>
  );
}
