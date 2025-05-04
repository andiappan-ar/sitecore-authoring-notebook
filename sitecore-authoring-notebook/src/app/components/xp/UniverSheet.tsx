// components/UniverSheet.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import UniverPresetSheetsCoreEnUS from '@univerjs/presets/preset-sheets-core/locales/en-US';

import '@univerjs/presets/lib/styles/preset-sheets-core.css';

interface UniverSheetProps {
  // You might not need explicit width and height props anymore
}

export function UniverSheet({}: UniverSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerElement = containerRef.current;

    if (containerElement) {
      const { univerAPI } = createUniver({
        locale: LocaleType.EN_US,
        locales: {
          [LocaleType.EN_US]: merge(
            {},
            UniverPresetSheetsCoreEnUS,
          ),
        },
        theme: defaultTheme,
        presets: [
          UniverSheetsCorePreset({
            container: containerElement,
          }),
        ],
      });

      univerAPI.createWorkbook({ name: 'Fullscreen Sheet' });

      return () => {
        univerAPI.dispose();
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    ></div>
  );
}