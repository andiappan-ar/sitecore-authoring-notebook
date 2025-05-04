// components/xp/setupSetValues.ts
import type { FUniver } from '@univerjs/presets'

export function setupSetValues($toolbar: HTMLElement, univerAPI: FUniver) {
  // Your existing setupSetValues function remains the same
  const $button = document.createElement('a');
  $button.textContent = 'set A1:B2 values';
  $toolbar.appendChild($button);

  $button.addEventListener('click', () => {
    const values = [
      ['Hello', 'World!'],
      ['Hello', 'Univer!'],
    ];

    const activeWorkbook = univerAPI.getActiveWorkbook();
    if (!activeWorkbook) throw new Error('activeWorkbook is not defined');
    const activeSheet = activeWorkbook.getActiveSheet();
    if (!activeSheet) throw new Error('activeSheet is not defined');

    const range = activeSheet.getRange(0, 0, values.length, values[0].length);
    if (!range) throw new Error('range is not defined');

    range.setValues(values);
  });
}