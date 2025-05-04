// app/page.tsx (or app/xp/lab/page.tsx, etc.)
'use client';

import React from 'react';
import { UniverSheet } from '../../components/xp/UniverSheet'; // Adjust the import path
import './style.css';

export default function HomePage() {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}> {/* Optional: Ensure parent doesn't cause scroll */}
      <UniverSheet />
    </div>
  );
}