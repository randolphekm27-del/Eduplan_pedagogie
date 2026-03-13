import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export function Input({ className, label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-edu-dark">{label}</label>}
      <input
        className={cn(
          "h-11 px-3 border border-edu-light rounded-[4px] bg-edu-bg focus:border-edu-red focus:ring-1 focus:ring-edu-red transition-all duration-200 placeholder:text-edu-light placeholder:italic",
          className
        )}
        {...props}
      />
    </div>
  );
}
