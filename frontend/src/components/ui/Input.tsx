import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startIcon, endIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-campus-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-campus-text-muted">
              {startIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-white border border-campus-border rounded-lg text-sm text-campus-text placeholder:text-campus-text-muted transition-colors focus:outline-none focus:border-campus-primary focus:ring-2 focus:ring-campus-primary/10 disabled:bg-gray-50 disabled:cursor-not-allowed',
              startIcon ? 'pl-9' : 'pl-3.5',
              endIcon ? 'pr-9' : 'pr-3.5',
              'py-2',
              error && 'border-campus-danger focus:border-campus-danger focus:ring-campus-danger/10',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 flex items-center text-campus-text-muted">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-campus-danger font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-campus-text-secondary">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
