import React from 'react';

interface SourceCardProps {
  source: {
    platform: string;
    url?: string;
    reviewCount?: number;
    lastSync?: string;
    status?: 'active' | 'inactive';
  };
  onSync?: () => void;
  isIntegrate?: boolean;
}

const SourceCard: React.FC<SourceCardProps> = ({ source, onSync, isIntegrate }) => {
  if (isIntegrate) {
    return (
      <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow p-6 flex flex-col items-center justify-center min-h-[160px]">
        <div className="font-semibold text-lg mb-2 text-white">{source.platform}</div>
        <div className="text-[#B0B0C0] text-sm mb-4">Add integration to sync reviews from {source.platform}.</div>
        <button
          className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition-colors"
          onClick={onSync}
        >
          Add Integration
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#23263a] rounded-2xl p-6 border border-white/10 shadow flex flex-col justify-between min-h-[160px]">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg text-white">{source.platform}</div>
        {source.status === 'active' && <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">active</span>}
      </div>
      {source.url ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline break-all mb-2">
          {source.url}
        </a>
      ) : (
        <div className="text-[#B0B0C0] text-sm mb-2">No URL found</div>
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-[#B0B0C0]">
          {typeof source.reviewCount === 'number' ? `${source.reviewCount} reviews` : 'No reviews'}
        </div>
        <div className="text-xs text-[#B0B0C0]">
          {source.lastSync ? `Last sync: ${source.lastSync}` : ''}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          className={`px-3 py-1 rounded-md border text-xs font-medium transition-all duration-200 shadow-sm ${onSync ? 'border-[#3b82f6]/40 text-[#3b82f6] hover:bg-[#23263a] hover:text-white' : 'border-white/10 text-[#B0B0C0] opacity-60 cursor-not-allowed'}`}
          onClick={onSync}
          disabled={!onSync}
        >
          Sync
        </button>
        {source.url && (
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#B0B0C0] underline text-xs">Open</a>
        )}
      </div>
    </div>
  );
};

export default SourceCard; 