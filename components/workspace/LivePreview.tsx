'use client';

import React from 'react';
import { LiveProvider, LiveError, LivePreview as ReactLivePreview } from 'react-live';
import { Button, Card, Input, Container, Navbar, Sidebar, Modal, Chart } from '../system'; 

interface LivePreviewProps {
  code: string;
}

export function LivePreview({ code }: LivePreviewProps) {
  const scope = { Button, Card, Input, Container, Navbar, Sidebar, Modal, Chart };

  // FIX: If the code is empty or just the placeholder comment, 
  // show a clean "Welcome" state instead of crashing.
  const isPlaceholder = !code || code.trim() === '// Generated code will appear here' || code.trim().startsWith('//');

  if (isPlaceholder) {
    return (
      <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex flex-col items-center justify-center text-gray-400">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold">Ready to Build</p>
          <p className="text-sm">Describe your UI in the chat to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col">
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm font-mono text-gray-600 flex justify-between">
        <span>Live Render</span>
      </div>
      
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        <LiveProvider code={code} scope={scope} noInline={false}>
          <ReactLivePreview />
          {/* Only show errors if it's NOT a syntax error caused by typing */}
          <LiveError className="text-red-500 font-mono text-sm mt-4 p-2 bg-red-50 rounded" />
        </LiveProvider>
      </div>
    </div>
  );
}