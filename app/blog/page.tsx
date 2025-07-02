import React from 'react';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "How to Grow Your Ratings and Get Noticed",
      excerpt: "Proven strategies to increase your business ratings, attract more customers, and stand out in a crowded market.",
      author: "Chris Hunt",
      date: "Dec 2, 2024",
      readTime: "6 min read",
      category: "Growth",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "How to Reply to Negative Reviews (and Win Customers Back)",
      excerpt: "Turn criticism into opportunity: actionable tips for responding to negative feedback and building trust.",
      author: "Ava Lee",
      date: "Nov 28, 2024",
      readTime: "5 min read",
      category: "Reputation",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Make VoC Reports Useful and Take Action",
      excerpt: "Unlock the real value of Voice of Customer reports by turning insights into business improvements.",
      author: "Jordan Smith",
      date: "Nov 25, 2024",
      readTime: "7 min read",
      category: "VoC",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Become More User-Centric as a Business",
      excerpt: "Shift your mindset and operations to put customers at the heart of every decision.",
      author: "Taylor Brooks",
      date: "Nov 20, 2024",
      readTime: "6 min read",
      category: "Customer Experience",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Create a Tone of Voice That Speaks for Your Brand",
      excerpt: "Craft a unique, authentic brand voice that resonates with your audience and builds loyalty.",
      author: "Morgan Lee",
      date: "Nov 15, 2024",
      readTime: "5 min read",
      category: "Branding",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Understanding Your Customer's Journey Through Reviews",
      excerpt: "Learn how to map and optimize your customer journey using review data and feedback analysis.",
      author: "Alex Chen",
      date: "Nov 10, 2024",
      readTime: "8 min read",
      category: "Customer Journey",
      image: "/api/placeholder/400/250"
    }
  ]

  const NAV_LINKS = [
    { href: '/#how-it-works', label: 'How it Works' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/report', label: 'Demo Report' },
    { href: '#', label: 'Resources', dropdown: [
      { href: '/blog', label: 'Blog' },
      { href: '#', label: 'Templates' },
      { href: '#', label: 'Strategy' },
    ]},
  ];

  return (
    <main className="min-h-screen bg-[#0f1117]/75 text-[#f3f4f6] font-sans relative overflow-x-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0f1117]" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/20 to-transparent blur-2xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
      </div>
      {/* Navigation - exact match to landing page */}
      <nav className="sticky top-0 z-50 w-full bg-[#1c1e26]/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img src="/logo.svg" alt="Execli" className="h-7 w-auto py-1 cursor-pointer" />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {NAV_LINKS.map((link, i) =>
              !link.dropdown ? (
                <Link key={i} href={link.href} className="px-2 py-1.5 rounded-md hover:bg-white/10 transition-all duration-300 text-[#B0B0C0] hover:text-white text-sm font-medium">{link.label}</Link>
              ) : (
                <div key={i} className="relative group">
                  <button className="px-2 py-1.5 rounded-md hover:bg-white/10 transition-all duration-300 flex items-center space-x-1 text-[#B0B0C0] hover:text-white text-sm font-medium">
                    <span>{link.label}</span>
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-40 bg-[#1c1e26]/90 border border-white/20 rounded-xl shadow-2xl backdrop-blur-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {link.dropdown.map((item, j) => (
                      <Link key={j} href={item.href} className="block px-4 py-2 hover:bg-white/10 transition-all duration-300 text-[#B0B0C0] hover:text-white text-sm">{item.label}</Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/login" className="px-3 py-1.5 rounded-md btn-secondary text-sm">Sign In</Link>
            <Link href="#form" className="px-3 py-1.5 rounded-md btn-primary text-sm font-semibold flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Generate Report
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-semibold text-white">
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent animate-gradient-shift">Execli</span> Blog
            </h1>
            <p className="text-xl text-[#B0B0C0] max-w-3xl mx-auto">
              Insights, tips, and stories from our team about productivity, automation, and building better software.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-video bg-[#1c1e26]/60 border border-white/10 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </div>
                    <p className="text-[#B0B0C0]">Featured Image</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-[#3b82f6]/10 text-[#3b82f6] px-3 py-1 rounded-full">Featured</span>
                    <span className="text-[#B0B0C0]">Dec 15, 2024</span>
                    <span className="text-[#B0B0C0]">•</span>
                    <span className="text-[#B0B0C0]">5 min read</span>
                  </div>
                  <h2 className="text-3xl font-semibold text-white leading-tight">
                    10 Ways to Boost Team Productivity in 2024
                  </h2>
                  <p className="text-[#B0B0C0] leading-relaxed">
                    Discover the latest strategies and tools that leading companies are using to maximize their team's efficiency and output. From automation to collaboration, learn how to transform your workflow.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">SJ</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">Sarah Johnson</div>
                      <div className="text-[#B0B0C0] text-sm">Product Manager</div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white px-6 py-3 rounded-lg font-medium hover:from-[#2563eb] hover:to-[#7c3aed] transition-all duration-200">
                    Read Full Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-6 backdrop-blur-2xl relative overflow-hidden hover:scale-105 transition-all duration-200 group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
                <div className="relative z-10 space-y-4">
                  <div className="aspect-video bg-[#1c1e26]/60 border border-white/10 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                      </div>
                      <p className="text-[#B0B0C0] text-xs">Article Image</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="bg-[#3b82f6]/10 text-[#3b82f6] px-2 py-1 rounded-full text-xs">{post.category}</span>
                      <span className="text-[#B0B0C0]">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-[#B0B0C0] text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#3b82f6]/20 rounded-full flex items-center justify-center">
                          <span className="text-[#3b82f6] text-xs font-semibold">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-[#B0B0C0] text-sm">{post.author}</span>
                      </div>
                      <span className="text-[#B0B0C0] text-sm">{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1c1e26]/40 border border-white/20 rounded-3xl shadow-2xl p-12 backdrop-blur-2xl relative overflow-hidden text-center space-y-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/5 via-transparent to-[#8b5cf6]/5 rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                Stay Updated
              </h2>
              <p className="text-xl text-[#B0B0C0] max-w-2xl mx-auto">
                Get the latest insights on productivity, automation, and SaaS delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 bg-[#1c1e26]/60 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-[#B0B0C0] focus:outline-none focus:border-[#3b82f6] transition-colors duration-200"
                />
                <button className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white px-6 py-3 rounded-lg font-medium hover:from-[#2563eb] hover:to-[#7c3aed] transition-all duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-[#B0B0C0] text-sm">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 