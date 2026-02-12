'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LivePreview } from '@/components/workspace/LivePreview';
import { CodeViewer } from '@/components/workspace/CodeViewer';

type HistoryStep = {
  prompt: string;
  code: string;
  explanation: string;
};

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryStep[]>([]);
  const [previewHeight, setPreviewHeight] = useState(60);
  const isResizing = useRef(false);

  const currentCode = history.length > 0 ? history[history.length - 1].code : '';

  // --- NEW: Handle Manual Code Edits ---
  const handleCodeChange = (newCode: string) => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const updatedHistory = [...prev];
      // Update the code of the most recent step
      updatedHistory[updatedHistory.length - 1] = {
        ...updatedHistory[updatedHistory.length - 1],
        code: newCode
      };
      return updatedHistory;
    });
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userInput, 
          currentCode: currentCode 
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert("Error generating UI: " + data.error);
        return;
      }

      setHistory(prev => [...prev, {
        prompt: userInput,
        code: data.code,
        explanation: data.explanation
      }]);
      setUserInput('');
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to connect to the AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = () => {
    if (history.length > 0) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newHeight = (e.clientY / window.innerHeight) * 100;
    if (newHeight > 20 && newHeight < 80) {
      setPreviewHeight(newHeight);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <main className="flex h-screen w-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* LEFT PANEL: Chat / User Intent */}
      <section className="w-1/3 flex flex-col border-r border-gray-200 bg-white h-full relative z-10">
        <header className="p-4 border-b border-gray-100 bg-white">
          <h1 className="font-bold text-lg text-gray-900 tracking-tight">AI UI Generator</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Deterministic Agent</p>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50/30">
          {history.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 opacity-40">
              <p className="text-sm">Describe a UI to begin.</p>
            </div>
          )}
          
          {history.map((step, index) => (
            <div key={index} className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white p-3 rounded-2xl rounded-tr-none text-sm self-end max-w-[85%] text-gray-700 shadow-sm border border-gray-200">
                <span className="font-semibold block text-[10px] text-gray-400 mb-1 uppercase tracking-wide">You</span>
                {step.prompt}
              </div>
              
              <div className="bg-blue-50/50 p-3 rounded-2xl rounded-tl-none text-sm self-start max-w-[90%] border border-blue-100/50">
                <span className="font-semibold block text-[10px] text-blue-400 mb-1 uppercase tracking-wide">AI Architect</span>
                <span className="text-gray-800 leading-relaxed">{step.explanation}</span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="self-start bg-gray-100 p-3 rounded-lg text-sm text-gray-500 italic animate-pulse">
              Generating code...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="relative">
            <textarea 
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 pr-24 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all placeholder:text-gray-400"
              placeholder="Describe the UI you want to build..."
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button 
                onClick={handleRollback}
                disabled={history.length === 0 || isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 rounded-md transition-all disabled:opacity-50"
              >
                Undo
              </button>
              
              <button 
                onClick={handleGenerate}
                disabled={isLoading || !userInput.trim()}
                className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-black disabled:opacity-50 transition-all shadow-sm active:scale-95"
              >
                {isLoading ? '...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: Workspace (Preview & Editable Code) */}
      <section className="w-2/3 h-full flex flex-col bg-gray-100">
        
        {/* Live Preview */}
        <div style={{ height: `${previewHeight}%` }} className="w-full p-4 pb-0 min-h-[20%]">
          <div className="h-full shadow-sm rounded-xl overflow-hidden bg-white border border-gray-200/60 relative">
             <LivePreview code={currentCode} />
          </div>
        </div>

        {/* Resizer */}
        <div 
          className="h-4 w-full cursor-row-resize flex items-center justify-center hover:bg-blue-500/10 group transition-colors"
          onMouseDown={startResizing}
        >
          <div className="w-16 h-1 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors"></div>
        </div>

        {/* --- EDITED: Code Viewer is now passed handleCodeChange to allow manual edits --- */}
        <div style={{ height: `${100 - previewHeight}%` }} className="w-full p-4 pt-0 min-h-[20%]">
          <div className="h-full flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-200/60 bg-gray-900">
            <CodeViewer code={currentCode} onChange={handleCodeChange} />
          </div>
        </div>

      </section>
    </main>
  );
}
