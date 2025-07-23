'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Share2, Check } from 'lucide-react'
import { useAuth } from './AuthContext'
import UserAvatar from './UserAvatar'

interface NavigationProps {
  hideLinks?: boolean;
  hideAuth?: boolean;
}

export default function Navigation({ hideLinks = false, hideAuth = false }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  
  // Check if we're on a report page
  const isReportPage = pathname?.startsWith('/report/')



  const handleShare = async () => {
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)
      
      // Show feedback
      setShowCopiedFeedback(true)
      
      // Hide feedback after 2 seconds
      setTimeout(() => {
        setShowCopiedFeedback(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setShowCopiedFeedback(true)
      setTimeout(() => {
        setShowCopiedFeedback(false)
      }, 2000)
    }
  }

  return (
    <nav className="sticky top-0 z-[100] bg-[#0a0a0f]/40 backdrop-blur-3xl border-b border-white/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-4">
              <img src="/logo.svg" alt="Execli Logo" className="w-[140px] h-[80px] block" />
            </Link>
          </div>

          {/* Desktop Navigation - Centered Main Links */}
          {!hideLinks && (
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                <Link 
                  href="/#how-it-works"
                  className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium"
                >
                  How it works
                </Link>
                <Link 
                  href="/#pricing"
                  className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium"
                >
                  Pricing
                </Link>
                <Link 
                  href="/blog"
                  className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium"
                >
                  Blog
                </Link>
              </div>
            </div>
          )}
            
          {/* Share Button - Only show on report pages */}
          {isReportPage && (
            <div className="flex items-center space-x-4 flex-shrink-0">
              <button
                onClick={handleShare}
                className="relative border border-white/30 bg-white/5 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-2"
              >
                {showCopiedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share
                  </>
                )}
              </button>
            </div>
          )}

          {/* Auth Buttons or User Avatar */}
          {!hideAuth && (
            <div className="flex items-center space-x-4 flex-shrink-0">
              {user ? (
                <UserAvatar />
              ) : (
                <>
                  <Link href="/login" className="border border-white/30 bg-white/5 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-white/90 backdrop-blur-sm text-[#181a20] px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-all duration-300">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#B0B0C0] hover:text-white p-2 rounded-md transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Main Links and Auth */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/10 mt-4">
              {/* Main Navigation Links */}
              {!hideLinks && (
                <div className="space-y-2 mb-4">
                  <Link 
                    href="/#how-it-works"
                    className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium block py-2 w-full text-left"
                  >
                    How it works
                  </Link>
                  <Link 
                    href="/#pricing"
                    className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium block py-2 w-full text-left"
                  >
                    Pricing
                  </Link>
                  <Link 
                    href="/blog"
                    className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium block py-2 w-full text-left"
                  >
                    Blog
                  </Link>
                </div>
              )}
              
              {/* Share Button - Mobile - Only show on report pages */}
              {isReportPage && (
                <div className="space-y-2">
                  <button
                    onClick={handleShare}
                    className="border border-white/30 bg-white/5 backdrop-blur-sm text-white w-full px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {showCopiedFeedback ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Share Report
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* Auth Buttons or User Avatar */}
              {!hideAuth && (
                <div className="space-y-2">
                  {user ? (
                    <div className="flex justify-center">
                      <UserAvatar />
                    </div>
                  ) : (
                    <>
                      <Link href="/login" className="border border-white/30 bg-white/5 backdrop-blur-sm text-white w-full px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 block text-center">
                        Login
                      </Link>
                      <Link href="/signup" className="bg-white/90 backdrop-blur-sm text-[#181a20] w-full px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-all duration-300 block text-center">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 