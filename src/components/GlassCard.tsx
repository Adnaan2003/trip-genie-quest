
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      className={cn(
        "rounded-2xl bg-white/70 backdrop-blur-lg border border-white/30 shadow-sm transition-all duration-300 hover:bg-white/80 hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
