'use client';

import { useState } from 'react';
import { Copy, Clock, Eye, ExternalLink, Code2, Sparkles } from 'lucide-react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                PasteBin Lite
              </h1>
              <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Share your code snippets and text with style. Create beautiful, secure pastes with optional expiry and view limits.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Paste Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Create New Paste</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Content *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-48 p-4 border-2 border-gray-200 rounded-2xl resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 font-mono text-sm bg-gray-50/50 text-gray-900"
                    placeholder="Paste your code or text here...

// Example:
function hello() {
  console.log('Hello, World!');
}"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    {content.length} characters
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Clock className="w-4 h-4" />
                      Expire After (seconds)
                    </label>
                    <input
                      type="number"
                      value={ttl}
                      onChange={(e) => setTtl(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-gray-900"
                      min="1"
                      placeholder="Never"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Eye className="w-4 h-4" />
                      Max Views
                    </label>
                    <input
                      type="number"
                      value={maxViews}
                      onChange={(e) => setMaxViews(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-gray-900"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Paste...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Create Paste
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Result/Info Panel */}
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">!</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-800">Error</h3>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <h3 className="font-bold text-green-800 text-lg">Paste Created Successfully!</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/60 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Paste ID</p>
                      <p className="font-mono text-lg text-gray-800">{result.id}</p>
                    </div>
                    
                    <div className="bg-white/60 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Share URL</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={result.url}
                          readOnly
                          className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-900"
                        />
                        <button
                          onClick={() => copyToClipboard(result.url)}
                          className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      {copied && (
                        <p className="text-xs text-green-600 mt-1 font-medium">✓ Copied to clipboard!</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Features Info */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700">Time-based expiry</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">View-based limits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-pink-500" />
                    <span className="text-gray-700">Shareable URLs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Code2 className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Syntax highlighting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}