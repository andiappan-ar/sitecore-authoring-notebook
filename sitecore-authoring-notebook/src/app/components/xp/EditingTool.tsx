'use client';

import React, { useState, useCallback } from 'react';
import { FaWrench, FaTimes, FaCaretDown, FaCaretUp } from 'react-icons/fa'; // Example icons
import GraphQLQueryBuilderForm from './GraphQLQueryBuilderForm'; // Import the form component

interface EditingToolProps {
  onGraphQLResult: (data: any[]) => void; // New prop to pass data to UniverSheet
}

const EditingTool: React.FC<EditingToolProps> = ({ onGraphQLResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any | null>(null);
  const [queryError, setQueryError] = useState('');
  const [isGeneratedQueryCollapsed, setIsGeneratedQueryCollapsed] = useState(true); // Default to collapsed
  const [isResultCollapsed, setIsResultCollapsed] = useState(true); // Default to collapsed

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleBuildQuery = (query: string) => {
    setGeneratedQuery(query);
    setIsGeneratedQueryCollapsed(true); // Keep collapsed on new build if desired, or set to false to expand
  };

  const toggleGeneratedQueryCollapse = () => {
    setIsGeneratedQueryCollapsed(!isGeneratedQueryCollapsed);
  };

  const toggleResultCollapse = () => {
    setIsResultCollapsed(!isResultCollapsed);
  };

  const handleQueryResult = useCallback((result: any) => {
    setQueryResult(result);
    setQueryError('');
    setIsResultCollapsed(true); // Default to collapsed on new result
    if (result?.item) {
      const headerRow = ['Item Path'];
      const dataRow = [result.item.path];
      for (const key in result.item) {
        if (key !== 'path') {
          headerRow.push(key);
          dataRow.push(result.item[key]?.value);
        }
      }
      onGraphQLResult([headerRow, dataRow]);
    } else if (Array.isArray(result?.items)) {
      const headerRow = ['Item Path'];
      const firstItem = result.items[0];
      if (firstItem) {
        for (const key in firstItem) {
          if (key !== 'path') {
            headerRow.push(key);
          }
        }
      }
      const dataRows = result.items.map((item: { [x: string]: { value: any; }; path: any; }) => {
        const row = [item.path];
        for (const key in item) {
          if (key !== 'path') {
            row.push(item[key]?.value);
          }
        }
        return row;
      });
      onGraphQLResult([headerRow, ...dataRows]);
    } else {
      onGraphQLResult([['No Data Found']]);
    }
  }, [onGraphQLResult]);

  const handleQueryError = useCallback((error: string) => {
    setQueryError(error);
    setQueryResult(null);
    setIsResultCollapsed(false); // Keep error visible by default
    onGraphQLResult([['Error Fetching Data']]);
  }, [onGraphQLResult]);

  return (
    <div className="fixed left-0 bottom-0 w-full z-1000">
      <button
        className="bg-gray-800 text-white border-b border-gray-700 w-full h-10 flex justify-between items-center px-4 cursor-pointer shadow-lg"
        onClick={handleClick}
      >
        <span className="font-semibold">GraphQL Tool</span>
        {isOpen ? <FaTimes size={16} /> : <FaWrench size={16} />}
      </button>
      {isOpen && (
        <div className="absolute left-0 bottom-full w-full bg-gray-900 text-gray-100 border-t border-gray-700 shadow-lg z-1001 overflow-x-auto whitespace-nowrap resize-y max-h-[70vh] p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-700 pb-2">
            <span className="font-semibold">Build and Call GraphQL Query</span>
            <button className="text-gray-400 hover:text-gray-100" onClick={handleClick}>
              <FaTimes size={16} />
            </button>
          </div>
          <GraphQLQueryBuilderForm
            onBuildQuery={handleBuildQuery}
            onQueryResult={handleQueryResult}
            onError={handleQueryError}
          />
          {generatedQuery && (
            <div className="border border-gray-700 rounded-md p-2 bg-gray-800">
              <div className="flex items-center justify-between cursor-pointer" onClick={toggleGeneratedQueryCollapse}>
                <label className="block text-sm font-medium text-gray-300">Generated Query:</label>
                <FaCaretDown size={16} /> {/* Default to down caret for collapsed */}
              </div>
              {isGeneratedQueryCollapsed ? null : <pre className="text-xs text-gray-400 whitespace-pre-wrap">{generatedQuery}</pre>}
            </div>
          )}
          {queryError && (
            <div className="border border-red-500 rounded-md p-2 bg-red-800 text-red-300">
              <div className="flex items-center justify-between cursor-pointer" onClick={toggleResultCollapse}>
                <label className="block text-sm font-medium text-red-300">Error:</label>
                <FaCaretDown size={16} /> {/* Default to down caret for collapsed */}
              </div>
              {isResultCollapsed ? null : <pre className="text-xs whitespace-pre-wrap">{queryError}</pre>}
            </div>
          )}
          {queryResult && (
            <div className="border border-green-500 rounded-md p-2 bg-green-800 text-green-300">
              <div className="flex items-center justify-between cursor-pointer" onClick={toggleResultCollapse}>
                <label className="block text-sm font-medium text-green-300">Query Result:</label>
                <FaCaretDown size={16} /> {/* Default to down caret for collapsed */}
              </div>
              {isResultCollapsed ? null : <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(queryResult, null, 2)}</pre>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditingTool;