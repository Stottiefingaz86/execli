'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      // Handle password reset logic here
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#0f1117]/80 text-[#f3f4f6] font-sans relative overflow-x-hidden">
      {/* Enhanced Background - Matching Landing Page */}
      <div className="fixed inset-0 -z-10">
        {/* Radial gradient/vignette for depth */}
        <div className="absolute inset-0 bg-[#0f1117]" />
        <div className="absolute inset-0 bg-gradient-radial" />
        {/* More visible animated flowing gradient */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
        {/* One major glow per quadrant, harmonized indigo-aqua */}
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/20 to-transparent blur-2xl opacity-30" />
        {/* Top Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#1c1e26]/50 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="Execli" className="h-7 w-auto py-1" />
          </Link>
          <Link 
            href="/login" 
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Forgot Password Card */}
          <div className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-8 backdrop-blur-2xl relative overflow-hidden">
            {/* Liquid effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
            
            <div className="relative z-10">
              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot your password?</h1>
                    <p className="text-[#B0B0C0]">No worries, we'll send you reset instructions.</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-white">
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-field w-full pl-10"
                          placeholder="Enter your email"
                          required
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#B0B0C0]" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-[#232b4d] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Send reset instructions</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-[#B0B0C0]">
                      Remember your password?{' '}
                      <Link href="/login" className="text-[#3b82f6] hover:text-[#3b82f6]/80 transition-colors font-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>
                    <p className="text-[#B0B0C0] mb-6">
                      We've sent password reset instructions to{' '}
                      <span className="text-white font-medium">{email}</span>
                    </p>
                    
                    <div className="bg-[#0f1117]/60 backdrop-blur-md rounded-lg border border-white/10 p-4 mb-6">
                      <p className="text-sm text-[#B0B0C0]">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button 
                          onClick={() => setIsSubmitted(false)}
                          className="text-[#3b82f6] hover:text-[#3b82f6]/80 transition-colors font-medium"
                        >
                          try again
                        </button>
                      </p>
                    </div>
                    
                    <Link 
                      href="/login" 
                      className="btn-secondary w-full flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Sign In</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#B0B0C0]/60">
              Need help?{' '}
              <Link href="/support" className="text-[#3b82f6] hover:text-[#3b82f6]/80 transition-colors">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 