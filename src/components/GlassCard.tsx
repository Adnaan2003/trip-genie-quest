
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  highlight?: 'food' | 'places' | 'hotels' | 'nature' | 'normal';
  variant?: 'default' | 'elevated' | 'subtle';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  onClick,
  highlight = 'normal',
  variant = 'default'
}) => {
  return (
    <div 
      className={cn(
        "rounded-2xl backdrop-blur-lg border border-white/30 shadow-sm transition-all duration-300 hover:shadow-md",
        // Highlight colors
        highlight === 'food' && "bg-amber-50/70 hover:bg-amber-50/80 border-amber-100",
        highlight === 'places' && "bg-blue-50/70 hover:bg-blue-50/80 border-blue-100",
        highlight === 'hotels' && "bg-indigo-50/70 hover:bg-indigo-50/80 border-indigo-100",
        highlight === 'nature' && "bg-emerald-50/70 hover:bg-emerald-50/80 border-emerald-100",
        highlight === 'normal' && "bg-white/70 hover:bg-white/80",
        // Variants
        variant === 'elevated' && "shadow-md hover:shadow-xl border-white/40",
        variant === 'subtle' && "shadow-sm hover:shadow border-white/20",
        // Custom hover effects
        onClick && "cursor-pointer transform hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
