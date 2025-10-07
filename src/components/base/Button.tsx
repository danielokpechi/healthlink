
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'whitespace-nowrap cursor-pointer font-medium rounded-2xl transition-all duration-300 flex items-center justify-center btn-hover micro-bounce relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transform hover:-translate-y-1',
    secondary: 'glass text-gray-700 hover:bg-white/40 shadow-lg hover:shadow-xl transform hover:-translate-y-1',
    outline: 'border-2 border-pink-500/30 text-pink-600 hover:bg-pink-50/50 glass hover:border-pink-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1',
    ghost: 'text-pink-600 hover:bg-pink-50/50 glass transform hover:-translate-y-1',
    glass: 'glass text-gray-700 hover:bg-white/40 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
