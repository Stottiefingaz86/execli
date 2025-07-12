'use client'

import { useState } from 'react'
import { Check, Star, Zap, Lock, TrendingUp, Users, Download, Globe } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Free',
      price: 0,
      platforms: 1,
      features: [
        'Basic VOC analysis',
        '1 platform included',
        'Email support',
        'Standard reports',
        'Basic insights'
      ],
      limitations: [
        'Limited to 1 platform',
        'No export functionality',
        'No API access'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: 19,
      platforms: 2,
      features: [
        'Advanced VOC analysis',
        '2 platforms included',
        'Priority support',
        'Export reports (PDF)',
        'Advanced insights',
        'Competitor comparison',
        'Email notifications'
      ],
      limitations: [
        'Limited to 2 platforms',
        'No API access',
        'No custom integrations'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: 49,
      platforms: 'unlimited',
      features: [
        'All platforms included',
        'Real-time monitoring',
        'API access',
        'Custom integrations',
        'White-label reports',
        'Priority support',
        'Advanced analytics',
        'Webhook notifications'
      ],
      limitations: [],
      popular: false
    }
  ]

  const yearlyDiscount = 0.2 // 20% discount

  return (
    <div className="min-h-screen bg-[#0f1117]/80 text-[#f3f4f6] font-sans relative overflow-x-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0f1117]" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/20 to-transparent blur-2xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#1c1e26]/50 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="Execli" className="h-7 w-auto py-1" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-[#B0B0C0] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 text-[#B0B0C0] hover:text-white">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-[#B0B0C0] max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#181a20]/70 border border-white/20 rounded-2xl p-1 backdrop-blur-2xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-[#B0B0C0] hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-[#B0B0C0] hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-[#181a20]/70 border rounded-3xl p-8 backdrop-blur-2xl transition-all duration-200 hover:scale-105 ${
                plan.popular
                  ? 'border-[#3b82f6] shadow-[0_8px_32px_0_rgba(59,130,246,0.15)]'
                  : 'border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    ${billingCycle === 'yearly' ? Math.round(plan.price * (1 - yearlyDiscount)) : plan.price}
                  </span>
                  <span className="text-[#B0B0C0]">/month</span>
                </div>
                <p className="text-[#B0B0C0]">
                  {plan.platforms === 'unlimited' ? 'Unlimited platforms' : `${plan.platforms} platform${Number(plan.platforms) > 1 ? 's' : ''} included`}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-white mb-3">What's included:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-[#B0B0C0]">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-white mb-3">Limitations:</h4>
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:from-[#2563eb] hover:to-[#7c3aed] shadow-lg'
                    : plan.price === 0
                    ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {plan.price === 0 ? 'Start Free' : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-[#181a20]/70 border border-white/20 rounded-3xl p-8 backdrop-blur-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-2">How does the platform detection work?</h3>
              <p className="text-[#B0B0C0]">
                We automatically scan multiple review platforms to find where your business has reviews. You'll see all detected platforms, but access is limited based on your plan.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-[#B0B0C0]">
                Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">What platforms do you support?</h3>
              <p className="text-[#B0B0C0]">
                We support Google Reviews, Yelp, Trustpilot, TripAdvisor, and many more. We're constantly adding new platforms.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-[#B0B0C0]">
                Yes! Start with our free plan and upgrade when you need more features. No credit card required to start.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-[#B0B0C0] mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using Execli to understand their customers better.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white rounded-xl hover:from-[#2563eb] hover:to-[#7c3aed] transition-all duration-200 font-semibold text-lg"
          >
            <Zap className="w-5 h-5" />
            <span>Start Analyzing Reviews</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 