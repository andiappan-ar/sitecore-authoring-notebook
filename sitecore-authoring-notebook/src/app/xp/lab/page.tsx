// app/page.tsx (or app/xp/lab/page.tsx, etc.)
'use client';

import React from 'react';
import { UniverSheet } from '../../components/xp/UniverSheet'; // Adjust the import path
// import './style.css'; // Remove the import for the separate CSS file
import EditingTool from '@/app/components/xp/EditingTool';

export default function HomePage() {
  return (
    <div className="h-screen overflow-hidden relative"> {/* Ensure parent takes full screen height and is relative */}
      <UniverSheet />
      <EditingTool />
    </div>
  );
}