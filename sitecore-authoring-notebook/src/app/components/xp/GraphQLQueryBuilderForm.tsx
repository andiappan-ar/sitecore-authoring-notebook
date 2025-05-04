'use client';

import React, { useState, useCallback } from 'react';

interface GraphQLQueryBuilderFormProps {
  onBuildQuery: (query: string) => void; // Callback to send the generated query
  onQueryResult: (result: any) => void; // Callback to handle the query result
  onError: (error: string) => void; // Callback to handle errors
}

const GraphQLQueryBuilderForm: React.FC<GraphQLQueryBuilderFormProps> = ({ onBuildQuery, onQueryResult, onError }) => {
  const [path, setPath] = useState('/sitecore/content/Home');
  const [language, setLanguage] = useState('en');
  const [version, setVersion] = useState('');
  const [fieldsInput, setFieldsInput] = useState<string[]>(['text', 'Title']); // Example initial fields as array
  const [loading, setLoading] = useState(false);

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPath(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  const handleVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVersion(event.target.value);
  };

  const handleFieldsInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFieldsInput(event.target.value.split('\n').map(field => field.trim()).filter(field => field !== ''));
  };

  const buildGraphQLQuery = useCallback(() => {
    const fieldsQuery = fieldsInput
      .map(fieldName => `
        ${fieldName}: field(name:"${fieldName}"){
          id
          name
          value
          __typename
        }
      `)
      .join('\n');

    const query = `
      query {
        item(path:"${path}" , language:"${language}" ${version ? `, version:"${version}"` : ''}){
          path
          ${fieldsQuery}
        }
      }
    `;
    onBuildQuery(query);
    return query; // Return the query for the API call
  }, [path, language, version, fieldsInput, onBuildQuery]);

  const callGraphQLApi = async () => {
    setLoading(true);
    onError(''); // Clear any previous errors
    try {
      const sessionResponse = await fetch('/api/xp/session/get-xp-config');
      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        throw new Error(errorData.error || 'Failed to fetch XP config');
      }
      const xpConfig = await sessionResponse.json();

      if (!xpConfig.xpItemUrl || !xpConfig.xpApiKey) {
        throw new Error('XP Item URL or API Key not found in session');
      }

      const query = buildGraphQLQuery();

      const apiResponse = await fetch(xpConfig.xpItemUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'sc_apikey': xpConfig.xpApiKey,
        },
        body: JSON.stringify({ query }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.errors?.[0]?.message || `GraphQL API Error: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      onQueryResult(result.data); // Assuming the data is in result.data
    } catch (error: any) {
      console.error('Error calling GraphQL API:', error);
      onError(error.message);
      onQueryResult(null); // Clear previous results on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label htmlFor="path" className="block text-sm font-medium text-gray-700">
          Path:
        </label>
        <input
          type="text"
          id="path"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={path}
          onChange={handlePathChange}
        />
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Language:
        </label>
        <input
          type="text"
          id="language"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={language}
          onChange={handleLanguageChange}
        />
      </div>
      <div>
        <label htmlFor="version" className="block text-sm font-medium text-gray-700">
          Version (optional):
        </label>
        <input
          type="text"
          id="version"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={version}
          onChange={handleVersionChange}
          placeholder="Leave empty for latest"
        />
      </div>
      <div>
        <label htmlFor="fields" className="block text-sm font-medium text-gray-700">
          Fields (one per line):
        </label>
        <textarea
          id="fields"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={fieldsInput.join('\n')} // Display array as multiline text
          onChange={handleFieldsInputChange}
          rows={4}
        />
      </div>
      <button
        className={`rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={callGraphQLApi}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Call GraphQL API'}
      </button>
    </div>
  );
};

export default GraphQLQueryBuilderForm;