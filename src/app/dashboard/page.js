"use client"; // This tells the computer this is an interactive visual page

import { useState } from 'react';

export default function Dashboard() {
  // These variables remember what the user types and what the AI answers
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // This function runs when the user clicks the "Generate" button
  async function handleGenerate() {
    setIsLoading(true);
    setContent(""); // Clear any old content from the screen

    try {
      // Send the prompt to the hidden backend we built in Step 3
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();
      
      // Show the result on the screen
      if (data.result) {
        setContent(data.result);
      } else {
        setContent("Oops! Something went wrong.");
      }
    } catch (error) {
      setContent("Error connecting to the server.");
    }

    setIsLoading(false); // Stop the loading animation
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start pt-20">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">AI Content Creator</h1>
        <p className="text-gray-500 mb-8">What would you like to create today?</p>
        
        {/* The Text Box */}
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-800 transition-all text-lg"
          rows="5"
          placeholder="e.g., Write a 3-paragraph blog post about the benefits of drinking water..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        {/* The Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || prompt.trim() === ""}
          className="w-full bg-blue-600 text-white font-bold text-lg py-4 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-md"
        >
          {isLoading ? "Generating Content... Please wait." : "Generate with AI"}
        </button>

        {/* The Output Area (Only shows if there is content) */}
        {content && (
          <div className="mt-10 animate-fade-in">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Your Result</h2>
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
              {content}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}