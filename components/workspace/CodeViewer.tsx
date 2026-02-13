'use client';

import React, { useState } from 'react';
import { LiveEditor } from 'react-live';
import { useTypewriter } from '@/hooks/useTypewriter'; // Import the new hook

interface CodeViewerProps {
  code: string;
  onChange?: (newCode: string) => void;
}

export function CodeViewer({ code, onChange }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  
  // 1. USE THE HOOK: Get the animated version of the code
  const displayCode = useTypewriter(code);
  const isStreaming = code !== displayCode;

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
    <div className="w-full h-full rounded-lg border border-gray-800 bg-gray-950 overflow-hidden flex flex-col shadow-lg">
      {/* Header with Copy Button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Manual Editor</span>
          {/* 2. VISUAL FEEDBACK: Show "Streaming..." when animating */}
          <span className={`text-[10px] italic transition-colors ${isStreaming ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`}>
            {isStreaming ? 'AI Generating...' : 'Edits sync to preview'}
          </span>
        </div>
        
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
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Editable Code Area */}
      <div className="flex-1 overflow-auto bg-gray-950 custom-scrollbar">
        <LiveEditor 
          code={displayCode} // 3. Use the animated code here
          onChange={onChange}
          language="jsx"
          disabled={isStreaming} // 4. Prevent editing while streaming
          className="font-mono text-sm leading-relaxed"
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: 13,
            minHeight: '100%',
          }}
        />
      </div>
    </div>
  );
}
