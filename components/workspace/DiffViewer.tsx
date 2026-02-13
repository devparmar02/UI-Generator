'use client';

import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

interface DiffViewerProps {
  oldCode: string;
  newCode: string;
}

export function DiffViewer({ oldCode, newCode }: DiffViewerProps) {
  if (!oldCode) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-sm bg-slate-900 h-full">
        No previous version to compare.
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-[#0d1117] custom-scrollbar">
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
        compareMethod={DiffMethod.WORDS}
        useDarkTheme={true}
        styles={{
          variables: {
            dark: {
              diffViewerBackground: '#0d1117',
              gutterBackground: '#161b22',
              addedBackground: '#23863626',
              addedGutterBackground: '#2386364d',
              removedBackground: '#da363326',
              removedGutterBackground: '#da36334d',
            }
          },
          line: {
            fontSize: '12px',
          }
        }}
      />
    </div>
  );
}
