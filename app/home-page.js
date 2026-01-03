'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const body = { content };
      if (ttl) body.ttl_seconds = parseInt(ttl);
      if (maxViews) body.max_views = parseInt(maxViews);

      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to create paste');
      } else {
        setResult(data);
        setContent('');
        setTtl('');
        setMaxViews('');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Pastebin Lite</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 p-3 border rounded-md resize-none"
              placeholder="Enter your text here..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">TTL (seconds)</label>
              <input
                type="number"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                className="w-full p-2 border rounded-md"
                min="1"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Views</label>
              <input
                type="number"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                className="w-full p-2 border rounded-md"
                min="1"
                placeholder="Optional"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-medium mb-2">Paste created successfully!</p>
            <p className="mb-2">ID: {result.id}</p>
            <p className="mb-2">URL: <a href={result.url} className="underline">{result.url}</a></p>
          </div>
        )}
      </div>
    </div>
  );
}