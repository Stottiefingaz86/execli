import React from 'react';

interface SourceCardProps {
  source: {
    platform: string;
    url?: string;
    reviewCount?: number;
    lastSync?: string;
    status?: 'active' | 'inactive';
    error?: string;
    reviews?: Array<{
      text: string;
      author?: string;
      rating?: number;
      date?: string;
    }>;
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
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 flex flex-col min-h-[200px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-[#23263a]/10 to-[#3b82f6]/5 rounded-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-lg text-white drop-shadow">{source.platform}</div>
          {source.status === 'active' && <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">active</span>}
        </div>
        {source.url ? (
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline break-all mb-2">
            {source.url}
          </a>
        ) : (
          <div className="text-[#B0B0C0] text-sm mb-2">No URL found</div>
        )}
        <div className="flex items-center justify-between mt-2 mb-2">
          <div className="text-xs text-[#B0B0C0]">
            {typeof source.reviewCount === 'number' ? `${source.reviewCount} reviews` : 'No reviews'}
          </div>
          <div className="text-xs text-[#B0B0C0]">
            {source.lastSync ? `Last sync: ${source.lastSync}` : ''}
          </div>
        </div>
        {source.error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-300 text-xs rounded p-2 mb-2">
            <span className="font-semibold">Error:</span> {source.error}
          </div>
        )}
        {source.reviews && source.reviews.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-[#B0B0C0] mb-1">Sample reviews:</div>
            <ul className="space-y-2">
              {source.reviews.slice(0, 2).map((review, idx) => (
                <li key={idx} className="bg-[#23263a]/60 rounded p-2 text-sm text-white/90 shadow-inner">
                  <div className="mb-1">{review.text.length > 180 ? review.text.slice(0, 180) + '…' : review.text}</div>
                  <div className="flex items-center gap-2 text-xs text-[#B0B0C0]">
                    {review.author && <span>by {review.author}</span>}
                    {review.rating && <span>· {review.rating}★</span>}
                    {review.date && <span>· {new Date(review.date).toLocaleDateString()}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
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
    </div>
  );
};

export default SourceCard; 