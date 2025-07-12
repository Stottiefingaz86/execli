import React from "react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export default function ErrorPage({ 
  message = "We couldn't generate your report. Please try again.", 
  showRetry = true,
  onRetry
}: ErrorPageProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-8 h-8 text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-[#B0B0C0] mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        {showRetry && (
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 