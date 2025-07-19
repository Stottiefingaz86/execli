'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-[100] bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center space-x-4">
              <img src="/logo.svg" alt="Execli Logo" className="w-[120px] h-[70px] block" />
            </Link>
          </div>

          {/* Desktop Navigation - Main Links and Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link href="/how-it-works" className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium">
                How it works
              </Link>
              <Link href="/pricing" className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium">
                Pricing
              </Link>
              <Link href="/blog" className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium">
                Blog
              </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="border border-white bg-transparent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors duration-200">
                Login
              </Link>
              <Link href="/signup" className="bg-white text-[#181a20] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Create Account
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
              <div className="space-y-2 mb-4">
                <Link href="/how-it-works" className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium block py-2">
                  How it works
                </Link>
                <Link href="/pricing" className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium block py-2">
                  Pricing
                </Link>
                <Link href="/blog" className="text-white hover:text-[#B0B0C0] transition-colors duration-200 text-sm font-medium block py-2">
                  Blog
                </Link>
              </div>
              
              {/* Auth Buttons */}
              <div className="space-y-2">
                <Link href="/login" className="border border-white bg-transparent text-white w-full px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors duration-200 block text-center">
                  Login
                </Link>
                <Link href="/signup" className="bg-white text-[#181a20] w-full px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 