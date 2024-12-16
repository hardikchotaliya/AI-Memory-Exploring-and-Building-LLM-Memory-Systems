import { cn } from '@/lib/utils';
import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ title, children, actions, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col rounded-lg border bg-card text-card-foreground shadow',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    );
  }
); 