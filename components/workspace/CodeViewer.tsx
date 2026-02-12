'use client';

import React, { useState } from 'react';

interface CodeViewerProps {
  code: string;
}

export function CodeViewer({ code }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If no code, show a placeholder state
  if (!code || code.trim() === '// Generated code will appear here') {
    return (
      <div className="w-full h-full border border-gray-800 rounded-lg bg-gray-950 flex items-center justify-center text-gray-500 font-mono text-sm p-8">
        // Generated code will appear here
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-gray-800 bg-gray-950 overflow-hidden flex flex-col shadow-lg">
      {/* Header with Copy Button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Generated JSX</span>
        
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200
            ${copied 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:border-gray-600'}
          `}
        >
          {copied ? (
            <>
              {/* Check Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Copied!
            </>
          ) : (
            <>
              {/* Copy Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="relative overflow-hidden">
        <pre className="p-4 text-sm font-mono text-gray-300 overflow-auto max-h-[300px] leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}