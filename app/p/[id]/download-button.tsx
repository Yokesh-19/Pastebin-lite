'use client';

import { Download } from 'lucide-react';

interface DownloadButtonProps {
  content: string;
  id: string;
}

export default function DownloadButton({ content, id }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paste-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
      title="Download as file"
    >
      <Download className="w-4 h-4" />
      Download
    </button>
  );
}