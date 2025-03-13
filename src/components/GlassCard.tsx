
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
        "rounded-2xl bg-white/70 backdrop-blur-lg border border-white/20 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
