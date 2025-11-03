
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'gradient';
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  variant = 'default'
}: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variants = {
    default: 'bg-white backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl',
    glass: 'glass shadow-xl hover:shadow-2xl',
    gradient: 'bg-gradient-to-br from-white/90 to-pink-50/50 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl'
  };
  
  return (
    <div className={`rounded-3xl transition-all duration-500 card-hover ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
