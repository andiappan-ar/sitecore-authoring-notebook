'use client';

import React, { useState } from 'react';
import { FaWrench, FaTimes } from 'react-icons/fa'; // Example icons
import GraphQLQueryBuilderForm from './GraphQLQueryBuilderForm'; // Import the form component

interface EditingToolProps {
  // You can pass props if needed
}

const EditingTool: React.FC<EditingToolProps> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState('');

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleBuildQuery = (query: string) => {
    setGeneratedQuery(query);
  };

  const handleQueryResult = (result: any) => {
    setQueryResult(result);
    setQueryError('');
  };

  const handleQueryError = (error: string) => {
    setQueryError(error);
    setQueryResult(null);
  };

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
              <label className="block text-sm font-medium text-gray-300">Generated Query:</label>
              <pre className="text-xs text-gray-400 whitespace-pre-wrap">{generatedQuery}</pre>
            </div>
          )}
          {queryError && (
            <div className="border border-red-500 rounded-md p-2 bg-red-800 text-red-300">
              <label className="block text-sm font-medium text-red-300">Error:</label>
              <pre className="text-xs whitespace-pre-wrap">{queryError}</pre>
            </div>
          )}
          {queryResult && (
            <div className="border border-green-500 rounded-md p-2 bg-green-800 text-green-300">
              <label className="block text-sm font-medium text-green-300">Query Result:</label>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(queryResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditingTool;