'use client'

import React, { useState } from 'react'
import { Check, Lock, Star, ArrowRight, Zap } from 'lucide-react'

interface Platform {
  name: string
  icon: string
  reviews: number
  detected: boolean
  description: string
  price: number
  url: string
}

interface PlatformSelectionProps {
  businessName: string
  businessUrl: string
  detectedPlatforms: Platform[]
  onPlatformsSelected: (selectedPlatforms: Platform[]) => void
  onBack: () => void
}

export default function PlatformSelection({
  businessName,
  businessUrl,
  detectedPlatforms,
  onPlatformsSelected,
  onBack
}: PlatformSelectionProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [userPlan, setUserPlan] = useState<'free' | 'paid'>('free')

  const handlePlatformToggle = (platform: Platform) => {
    if (userPlan === 'free') {
      // Free tier: only allow one selection
      setSelectedPlatforms([platform])
    } else {
      // Paid tier: allow multiple selections
      setSelectedPlatforms(prev => {
        const isSelected = prev.find(p => p.name === platform.name)
        if (isSelected) {
          return prev.filter(p => p.name !== platform.name)
        } else {
          return [...prev, platform]
        }
      })
    }
  }

  const handleGenerateReport = () => {
    if (selectedPlatforms.length > 0) {
      onPlatformsSelected(selectedPlatforms)
    }
  }

  const canGenerate = selectedPlatforms.length > 0
  const isFreeLimitReached = userPlan === 'free' && selectedPlatforms.length >= 1

  return (
    <div className="min-h-screen bg-[#0f1117]/80 text-[#f3f4f6] font-sans relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0f1117]" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/20 to-transparent blur-2xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="text-[#B0B0C0] hover:text-white transition-colors mb-4"
          >
            ← Back to form
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            We found reviews for <span className="text-[#3b82f6]">{businessName}</span>
          </h1>
          <p className="text-lg text-[#B0B0C0] max-w-2xl mx-auto">
            Choose which platforms to analyze. Free users can select 1 platform, 
            while Pro users get unlimited access to all sources.
          </p>
        </div>

        {/* Plan Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 rounded-2xl p-1">
            <button
              onClick={() => setUserPlan('free')}
              className={`px-6 py-3 rounded-xl transition-all ${
                userPlan === 'free'
                  ? 'bg-white text-[#181a20] font-semibold'
                  : 'text-[#B0B0C0] hover:text-white'
              }`}
            >
              Free Plan
            </button>
            <button
              onClick={() => setUserPlan('paid')}
              className={`px-6 py-3 rounded-xl transition-all ${
                userPlan === 'paid'
                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-semibold'
                  : 'text-[#B0B0C0] hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Pro Plan
            </button>
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {detectedPlatforms.map((platform) => {
            const isSelected = selectedPlatforms.find(p => p.name === platform.name)
            const isDisabled = userPlan === 'free' && !isSelected && isFreeLimitReached

            return (
              <div
                key={platform.name}
                className={`relative bg-[#1c1e26]/60 backdrop-blur-xl border rounded-2xl p-6 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                    : isDisabled
                    ? 'border-white/10 bg-[#1c1e26]/30 opacity-50'
                    : 'border-white/20 hover:border-white/40 hover:bg-[#1c1e26]/80'
                }`}
                onClick={() => !isDisabled && handlePlatformToggle(platform)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#3b82f6] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Platform Icon and Name */}
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{platform.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{platform.name}</h3>
                    <p className="text-sm text-[#B0B0C0]">{platform.description}</p>
                  </div>
                </div>

                {/* Review Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-white font-semibold">{platform.reviews} reviews</span>
                  </div>
                  {platform.price > 0 && (
                    <span className="text-sm text-[#B0B0C0]">${platform.price}/mo</span>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-[#B0B0C0]">Available</span>
                  </div>
                  {platform.price === 0 && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      Free
                    </span>
                  )}
                </div>

                {/* Lock Icon for Disabled */}
                {isDisabled && (
                  <div className="absolute inset-0 bg-[#1c1e26]/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-[#B0B0C0]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Upgrade Prompt */}
        {userPlan === 'free' && detectedPlatforms.length > 1 && (
          <div className="bg-gradient-to-r from-[#3b82f6]/20 to-[#8b5cf6]/20 border border-[#3b82f6]/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Unlock All Platforms
                </h3>
                <p className="text-[#B0B0C0]">
                  Get insights from all {detectedPlatforms.length} platforms for deeper analysis
                </p>
              </div>
              <button className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerateReport}
            disabled={!canGenerate}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              canGenerate
                ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90'
                : 'bg-white/10 text-[#B0B0C0] cursor-not-allowed'
            }`}
          >
            <ArrowRight className="w-5 h-5 inline mr-2" />
            Generate Report with {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
} 