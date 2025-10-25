import React, { useState } from 'react';
import { saveApiKey } from '../utils/apiKey';

interface ApiKeyScreenProps {
  onKeySaved: () => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 10) { // Basic validation
      saveApiKey(apiKey.trim());
      onKeySaved();
    } else {
      setError('Please enter a valid API key.');
    }
  };

  return (
    <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full max-w-lg text-center">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Enter Your API Key
      </h2>
      <p className="text-slate-300 my-6">
        To use this application, you need a Google Gemini API key. Your key will be saved securely in your browser's local storage.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="sr-only">Gemini API Key</label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setError('');
            }}
            className="bg-slate-700 border border-slate-600 text-white text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-4 text-center"
            placeholder="Enter your Gemini API key"
            required
            autoFocus
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!apiKey.trim()}
          className="w-full px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          Save and Continue
        </button>
      </form>
       <p className="text-xs text-slate-500 mt-6">
        You can get a free API key from{' '}
        <a 
          href="https://ai.google.dev/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:underline"
        >
          Google AI Studio
        </a>.
      </p>
    </div>
  );
};

export default ApiKeyScreen;
