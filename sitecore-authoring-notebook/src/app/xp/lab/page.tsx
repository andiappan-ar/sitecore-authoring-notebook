// app/page.tsx (or app/xp/lab/page.tsx, etc.)
'use client';

import React, { useState, useRef } from 'react';
import { UniverSheet } from '../../components/xp/UniverSheet'; // Adjust the import path
import EditingTool from '@/app/components/xp/EditingTool';
import { FUniver } from '@univerjs/presets';
import { setupSetValues } from '../../components/xp/setupSetValues'; // Adjust import path

export default function HomePage() {
  const [sheetData, setSheetData] = useState<string[][]>([['Loading...']]);
  const univerRef = useRef<FUniver | null>(null);

  const handleGraphQLResult = (data: string[][]) => {
    setSheetData(data);
  };

  const handleUniverReady = (univerAPI: FUniver) => {
    univerRef.current = univerAPI;
    const toolbar = document.getElementById('univer-toolbar'); // Assuming you have a toolbar div
    if (toolbar && univerAPI) {
      setupSetValues(toolbar, univerAPI); // Call your setupSetValues function
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div id="univer-toolbar" className="bg-gray-100 p-2 border-b border-gray-200">
        {/* Toolbar elements will be added here by setupSetValues */}
      </div>
      <div className="flex-grow relative">
        <UniverSheet initialData={sheetData} onDataUpdated={handleUniverReady} />
        <EditingTool onGraphQLResult={handleGraphQLResult} />
      </div>
    </div>
  );
}