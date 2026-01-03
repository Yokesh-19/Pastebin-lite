import { ArrowLeft, FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-12 max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileX className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">404 Error - Paste Not Found</h1>
            <p className="text-gray-600 leading-relaxed">
              The paste you're looking for doesn't exist or has expired. It may have reached its view limit or time limit.
            </p>
          </div>
          
          <div className="space-y-4">
            <a
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Create New Paste
            </a>
            
            <div className="text-sm text-gray-500">
              <p>Possible reasons:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Paste has expired (time limit reached)</li>
                <li>• Maximum views exceeded</li>
                <li>• Invalid paste ID</li>
                <li>• Paste was manually deleted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}