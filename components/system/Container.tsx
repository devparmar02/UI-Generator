import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end';
  gap?: 'small' | 'medium' | 'large';
}

export function Container({ 
  children, 
  direction = 'column', 
  align = 'start',
  gap = 'medium' 
}: ContainerProps) {
  
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  }[align];
  const gapClass = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8'
  }[gap];

  return (
    <div className={`flex w-full ${directionClass} ${alignClass} ${gapClass}`}>
      {children}
    </div>
  );
}