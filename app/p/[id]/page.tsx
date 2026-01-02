import { notFound } from 'next/navigation';
import { getPaste, getTestTime } from '@/lib/db';
import { sanitizeContent } from '@/lib/utils';
import { headers } from 'next/headers';
import { Clock, Eye, ArrowLeft, Code2 } from 'lucide-react';
import CopyButton from './copy-button';
import DownloadButton from './download-button';

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const headersList = await headers();
  
  // Handle test mode timing
  const currentTime = process.env.TEST_MODE === '1' 
    ? getTestTime(headersList as any)
    : undefined;
  
  const paste = await getPaste(id, currentTime);
  
  if (!paste) {
    notFound();
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <a 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 text-gray-700 hover:text-indigo-600 transition-all duration-200 hover:shadow-lg group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Create New Paste</span>
              </a>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Paste Content</h1>
                  <p className="text-sm text-gray-600">ID: <span className="font-mono">{id}</span></p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paste.remaining_views !== null && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Views Remaining</p>
                      <p className="text-2xl font-bold text-gray-800">{paste.remaining_views}</p>
                    </div>
                  </div>
                )}
                
                {paste.expires_at && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Expires At</p>
                      <p className="text-lg font-bold text-gray-800">{formatDate(paste.expires_at)}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Content Length</p>
                    <p className="text-2xl font-bold text-gray-800">{paste.content.length.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">characters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Content Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">paste.txt</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CopyButton content={paste.content} />
                  <DownloadButton content={paste.content} id={id} />
                </div>
              </div>
            </div>
            
            {/* Content Body */}
            <div className="p-6">
              <div className="bg-gray-900 rounded-xl p-6 overflow-auto max-h-[70vh]">
                <pre className="text-sm font-mono text-gray-100 whitespace-pre-wrap leading-relaxed">
                  <code dangerouslySetInnerHTML={{ __html: sanitizeContent(paste.content) }} />
                </pre>
              </div>
            </div>
          </div>
          
          {/* Warning Messages */}
          {paste.remaining_views !== null && paste.remaining_views <= 3 && (
            <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800">Limited Views Remaining</h3>
                  <p className="text-orange-700">
                    This paste will be automatically deleted after {paste.remaining_views} more view{paste.remaining_views !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {paste.expires_at && new Date(paste.expires_at).getTime() - Date.now() < 3600000 && (
            <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Expiring Soon</h3>
                  <p className="text-red-700">
                    This paste will expire at {formatDate(paste.expires_at)}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}