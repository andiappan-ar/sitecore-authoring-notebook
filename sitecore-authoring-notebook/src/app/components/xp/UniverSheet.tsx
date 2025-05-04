// components/UniverSheet.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createUniver, defaultTheme, LocaleType, merge, FUniver } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import UniverPresetSheetsCoreEnUS from '@univerjs/presets/preset-sheets-core/locales/en-US';
import { IStyleData } from '@univerjs/presets';

import '@univerjs/presets/lib/styles/preset-sheets-core.css';

interface UniverSheetProps {
  initialData?: string[][];
  onDataUpdated?: (univerAPI: FUniver) => void;
}

export function UniverSheet({ initialData, onDataUpdated }: UniverSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [univerAPI, setUniverAPI] = useState<FUniver | null>(null);

  useEffect(() => {
    const containerElement = containerRef.current;

    if (containerElement) {
      const { univerAPI: instanceApi } = createUniver({
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

      setUniverAPI(instanceApi);

      // Create an initial sheet and set data if provided
      const workbook = instanceApi.createWorkbook({ name: 'GraphQL Data' });
      const sheet = workbook.getActiveSheet();

      if (initialData && initialData.length > 0) {
        const rowCount = initialData.length;
        const colCount = initialData[0]?.length || 0;
        const dataRange = sheet.getRange(0, 0, rowCount, colCount);
        dataRange.setValues(initialData);

        // Apply style to the first row (header)
        if (rowCount > 0) {
          const headerRange = sheet.getRange(0, 0, 1, colCount);
         
          headerRange.setFontSize(12)
          headerRange.setFontWeight('bold')
          headerRange.setFontColor('#000000')
          headerRange.setBackgroundColor('#f0f0f0')
        }
      }

      // Call the onDataUpdated callback if provided
      if (onDataUpdated && instanceApi) {
        onDataUpdated(instanceApi);
      }

      return () => {
        instanceApi.dispose();
        setUniverAPI(null);
      };
    }
  }, [initialData, onDataUpdated]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full" // Use Tailwind classes for width and height
    ></div>
  );
}