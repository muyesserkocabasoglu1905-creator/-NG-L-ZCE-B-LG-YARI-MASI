import React, { useState } from 'react';

interface ApiKeyScreenProps {
  onKeySubmit: (key: string) => void;
  error?: string | null;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onKeySubmit, error }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in w-full h-full">
      <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          Enter Your API Key
        </h1>
        <p className="text-lg text-slate-300 mb-6">
          This application uses the Google Gemini API to generate quiz questions. Please enter your API key to proceed.
        </p>
        
        {error && <p className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-4 text-center"
            placeholder="Enter your Gemini API Key"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Save &amp; Continue
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-8">
          You can get your API key from Google AI Studio. For information on API keys and billing, please visit the{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
            Google AI documentation
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyScreen;