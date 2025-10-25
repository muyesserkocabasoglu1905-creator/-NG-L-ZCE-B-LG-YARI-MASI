import React from 'react';

interface ApiKeyScreenProps {
  onKeySelect: () => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onKeySelect }) => {
  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        await window.aistudio.openSelectKey();
        // Assume success and let the parent component handle the state change.
        onKeySelect();
      } catch (e) {
        console.error("Could not open API key selection dialog:", e);
      }
    } else {
      console.error("aistudio.openSelectKey() is not available.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in w-full h-full">
      <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          API Key Required
        </h1>
        <p className="text-lg text-slate-300 mb-6">
          This application uses the Google Gemini API to generate quiz questions. To proceed, please select an API key.
        </p>
        <p className="text-sm text-slate-400 mb-8">
          Your API key is required to use the app's features. For information on API keys and billing, please visit the{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
            Google AI documentation
          </a>.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105"
        >
          Select API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyScreen;
