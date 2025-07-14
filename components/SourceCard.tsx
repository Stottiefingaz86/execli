import React from 'react';

interface SourceCardProps {
  source: {
    platform: string;
    url: string;
  };
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  return (
    <div className="bg-[#23263a] rounded-xl p-4 border border-white/10 shadow">
      <div className="font-semibold text-lg mb-2 text-white">{source.platform}</div>
      {source.url ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline break-all">
          {source.url}
        </a>
      ) : (
        <div className="text-[#B0B0C0] text-sm">No URL found</div>
      )}
    </div>
  );
};

export default SourceCard; 