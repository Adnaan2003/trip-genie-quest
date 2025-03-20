
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  highlight?: 'food' | 'places' | 'normal';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  onClick,
  highlight = 'normal' 
}) => {
  return (
    <div 
      className={cn(
        "rounded-2xl backdrop-blur-lg border border-white/30 shadow-sm transition-all duration-300 hover:shadow-md",
        highlight === 'food' && "bg-amber-50/70 hover:bg-amber-50/80 border-amber-100",
        highlight === 'places' && "bg-blue-50/70 hover:bg-blue-50/80 border-blue-100",
        highlight === 'normal' && "bg-white/70 hover:bg-white/80",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
