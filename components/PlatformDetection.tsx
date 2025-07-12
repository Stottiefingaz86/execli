import React from 'react'
import { CheckCircle, Lock, Star, TrendingUp, Zap } from 'lucide-react'
import { PLAN_LIMITS } from '@/lib/multi-scraper'

interface PlatformDetectionProps {
  detectedPlatforms: string[]
  scrapedPlatforms: string[]
  userPlan: 'free' | 'paid' | 'premium'
  totalReviews: number
  upgradeSuggestions: Array<{
    type: string
    message: string
    platforms: string[]
    upgradeTo: string
  }>
}

export default function PlatformDetection({
  detectedPlatforms,
  scrapedPlatforms,
  userPlan,
  totalReviews,
  upgradeSuggestions
}: PlatformDetectionProps) {
  const planInfo = PLAN_LIMITS[userPlan]
  
  return (
    <div className="space-y-6">
      {/* Detection Summary */}
      <div className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-8 backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Review Sources Detected</h3>
            <p className="text-[#B0B0C0] mt-2">
              We found reviews on {detectedPlatforms.length} platforms
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-[#3b82f6]" />
            <span className="text-white font-semibold">{totalReviews} reviews analyzed</span>
          </div>
        </div>
        
        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detectedPlatforms.map((platform, index) => {
            const isScraped = scrapedPlatforms.includes(platform)
            const isLocked = !isScraped && index >= Number(planInfo.platforms)
            
            return (
              <div 
                key={platform}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  isScraped 
                    ? 'bg-[#181a20]/60 border-green-500/30 text-white' 
                    : isLocked
                    ? 'bg-[#181a20]/40 border-white/10 text-gray-400'
                    : 'bg-[#181a20]/60 border-white/20 text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {isScraped ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Star className="w-5 h-5 text-[#3b82f6]" />
                    )}
                    <span className="font-semibold">{platform}</span>
                  </div>
                  {isLocked && (
                    <span className="text-xs bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-1 rounded-full">
                      Upgrade
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-[#B0B0C0]">
                  {isScraped ? (
                    <span className="text-green-400">✓ Analyzed</span>
                  ) : isLocked ? (
                    <span>Available with {upgradeSuggestions[0]?.upgradeTo} plan</span>
                  ) : (
                    <span>Ready to analyze</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Upgrade Suggestions */}
      {upgradeSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 border border-[#3b82f6]/20 rounded-3xl p-8 backdrop-blur-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-[#3b82f6]" />
            <h3 className="text-xl font-semibold text-white">Unlock More Insights</h3>
          </div>
          
          {upgradeSuggestions.map((suggestion, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="text-[#B0B0C0] mb-3">{suggestion.message}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestion.platforms.map((platform) => (
                  <span 
                    key={platform}
                    className="px-3 py-1 bg-[#3b82f6]/20 text-[#3b82f6] rounded-full text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
              
              <button className="px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white rounded-xl hover:from-[#2563eb] hover:to-[#7c3aed] transition-all duration-200 font-semibold">
                Upgrade to {suggestion.upgradeTo} Plan
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Current Plan Info */}
      <div className="bg-[#181a20]/70 border border-white/20 rounded-3xl p-6 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white">Current Plan: {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}</h4>
            <p className="text-[#B0B0C0] text-sm">
              {planInfo.platforms === 'unlimited' 
                ? 'Unlimited platforms' 
                : `${planInfo.platforms} platform${Number(planInfo.platforms) > 1 ? 's' : ''} included`
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              ${planInfo.price}
              <span className="text-sm text-[#B0B0C0]">/month</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {planInfo.features.map((feature, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
} 