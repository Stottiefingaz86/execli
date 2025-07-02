'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navLinks = [
    { href: '#how-it-works', label: 'How it Works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '/report', label: 'Demo Report' },
    { 
      href: '#', 
      label: 'Resources', 
      dropdown: [
        { href: '/blog', label: 'Blog' },
        { href: '#', label: 'Templates' },
        { href: '#', label: 'Strategy' },
      ]
    },
  ]

  return (
    <nav className="sticky top-0 z-[100] bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full flex items-center justify-center shadow-lg">
                <img src="/logo.svg" alt="Execli Logo" className="w-5 h-5" />
              </div>
              <span className="text-xl font-semibold text-white">Execli</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.dropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      <button className="text-[#B0B0C0] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1">
                        <span>{link.label}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-[#1c1e26]/95 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl py-2">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block px-4 py-2 text-sm text-[#B0B0C0] hover:text-white hover:bg-white/5 transition-colors duration-200"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[#B0B0C0] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200">
              Sign In
            </button>
            <button className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#2563eb] hover:to-[#7c3aed] transition-all duration-200">
              Generate Free Report
            </button>
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/10 mt-4">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.dropdown ? (
                    <div>
                      <div className="text-[#B0B0C0] px-3 py-2 text-base font-medium">
                        {link.label}
                      </div>
                      <div className="pl-4 space-y-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="text-[#B0B0C0] hover:text-white block px-3 py-2 rounded-md text-sm transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[#B0B0C0] hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <button className="bg-white text-black w-full px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200">
                  Sign In
                </button>
                <button className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white w-full px-4 py-2 rounded-lg text-sm font-medium hover:from-[#2563eb] hover:to-[#7c3aed] transition-all duration-200">
                  Generate Free Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 