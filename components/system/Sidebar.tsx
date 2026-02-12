import React from 'react';

export interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col p-4">
      <div className="space-y-2">
        {children}
      </div>
    </aside>
  );
}