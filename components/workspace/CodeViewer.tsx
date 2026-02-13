'use client';

import React, { useState, memo } from 'react';
import { LiveEditor } from 'react-live';
import { useTypewriter } from '@/hooks/useTypewriter';

interface CodeViewerProps {
  code: string;
  onChange?: (newCode: string) => void;
}

// 1. Wrap the component in 'memo' to prevent unnecessary re-renders
export const CodeViewer = memo(function CodeViewer({ code, onChange }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  
  // Use the hook for the streaming effect
  const displayCode = useTypewriter(code);
  const isStreaming = code !== displayCode;

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code || code.trim() === '// Generated code will appear here') {
    return (
      <div className="w-full h-full border border-gray-800 rounded-lg bg-gray-950 flex items-center justify-center text-gray-500 font-mono text-sm p-8">
        // Generated code will appear here
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg border border-gray-800 bg-gray-950 overflow-hidden flex flex-col shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Manual Editor</span>
          <span className={`text-[10px] italic transition-colors ${isStreaming ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`}>
            {isStreaming ? 'AI Generating...' : 'Edits sync to preview'}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${copied ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:border-gray-600'}`}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-gray-950 custom-scrollbar">
        <LiveEditor 
          code={displayCode} 
          onChange={onChange}
          language="jsx"
          disabled={isStreaming}
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
}, (prevProps, nextProps) => {
  // 2. CUSTOM COMPARISON FUNCTION (The Fix)
  // Only re-render if the 'code' prop has actually changed.
  // We ignore 'onChange' updates to prevent focus stealing when parent re-renders.
  return prevProps.code === nextProps.code;
});
