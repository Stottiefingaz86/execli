import React from 'react';

export default function ReportSkeleton() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Navigation Skeleton */}
      <div className="border-b border-white/10 bg-[#1c1e26]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/10 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-white/10 rounded animate-pulse"></div>
            </div>
            <div className="flex space-x-4">
              <div className="w-16 h-8 bg-white/10 rounded animate-pulse"></div>
              <div className="w-24 h-8 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="w-64 h-8 bg-white/10 rounded animate-pulse mb-4"></div>
          <div className="w-96 h-6 bg-white/10 rounded animate-pulse mb-2"></div>
          <div className="w-80 h-6 bg-white/10 rounded animate-pulse"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1c1e26]/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-16 h-16 bg-white/10 rounded-lg animate-pulse mb-4"></div>
              <div className="w-24 h-6 bg-white/10 rounded animate-pulse mb-2"></div>
              <div className="w-32 h-4 bg-white/10 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Sentiment Chart Skeleton */}
            <div className="bg-[#1c1e26]/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-32 h-6 bg-white/10 rounded animate-pulse mb-4"></div>
              <div className="w-full h-64 bg-white/10 rounded-lg animate-pulse"></div>
            </div>

            {/* Topics Skeleton */}
            <div className="bg-[#1c1e26]/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-24 h-6 bg-white/10 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="w-32 h-4 bg-white/10 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-white/10 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Reviews Skeleton */}
            <div className="bg-[#1c1e26]/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-36 h-6 bg-white/10 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b border-white/10 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
                      <div className="w-24 h-4 bg-white/10 rounded animate-pulse"></div>
                    </div>
                    <div className="w-full h-4 bg-white/10 rounded animate-pulse mb-1"></div>
                    <div className="w-3/4 h-4 bg-white/10 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Skeleton */}
            <div className="bg-[#1c1e26]/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-40 h-6 bg-white/10 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full animate-pulse mt-1"></div>
                    <div className="flex-1">
                      <div className="w-full h-4 bg-white/10 rounded animate-pulse mb-1"></div>
                      <div className="w-2/3 h-4 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 