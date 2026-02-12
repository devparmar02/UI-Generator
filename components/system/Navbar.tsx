import React from 'react';

export interface NavbarProps {
  title?: string;
  children?: React.ReactNode;
}

export function Navbar({ title = "App", children }: NavbarProps) {
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md mb-6 rounded-lg">
      <div className="text-xl font-bold tracking-tight">
        {title}
      </div>
      <div className="flex gap-4 items-center">
        {children}
      </div>
    </nav>
  );
}