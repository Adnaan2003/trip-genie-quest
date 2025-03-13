
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    <div 
      className={cn(
        "rounded-2xl bg-white/80 backdrop-blur-lg border border-white/30 shadow-sm transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
