import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'sm',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-md tracking-wide';

  const variants = {
    primary: 'bg-campus-primary-light text-campus-primary border border-campus-primary/20',
    success: 'bg-campus-success-light text-campus-success border border-campus-success/20',
    warning: 'bg-campus-warning-light text-campus-warning border border-campus-warning/20',
    danger: 'bg-campus-danger-light text-campus-danger border border-campus-danger/20',
    neutral: 'bg-gray-100 text-campus-text-secondary border border-campus-border',
    accent: 'bg-campus-accent-light text-campus-accent border border-campus-accent/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
