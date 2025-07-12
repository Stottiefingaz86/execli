'use client'

import React, { useState } from 'react'

export default function TestScraperPage() {
  const [businessName, setBusinessName] = useState('McDonald\'s')
  const [businessUrl, setBusinessUrl] = useState('https://www.mcdonalds.com')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testScraper = async () => {
    setLoading(true)
    setResults(null)

    try {
      const response = await fetch('/api/test-enhanced-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: businessName,
          business_url: businessUrl
        })
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Test failed:', error)
      setResults({ error: 'Test failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Enhanced Scraper Test</h1>
        
        <div className="bg-[#1c1e26] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 bg-[#23263a] border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Business URL</label>
              <input
                type="text"
                value={businessUrl}
                onChange={(e) => setBusinessUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#23263a] border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>
          <button
            onClick={testScraper}
            disabled={loading}
            className="mt-4 px-6 py-3 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Enhanced Scraper'}
          </button>
        </div>

        {results && (
          <div className="bg-[#1c1e26] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            {results.error ? (
              <div className="text-red-400">{results.error}</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Detected Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.detected_sources?.map((source: any, index: number) => (
                      <div key={index} className="bg-[#23263a] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{source.platform}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            source.hasRealData ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {source.hasRealData ? 'Has Data' : 'No Data'}
                          </span>
                        </div>
                        <div className="text-sm text-[#B0B0C0]">
                          {source.detected ? 'Detected' : 'Not Detected'}
                        </div>
                        {source.estimatedReviews && (
                          <div className="text-sm text-[#B0B0C0]">
                            ~{source.estimatedReviews} reviews
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Discovered Sources (AI)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.discovered_sources?.map((source: any, index: number) => (
                      <div key={index} className="bg-[#23263a] rounded-lg p-4">
                        <div className="font-medium mb-2">{source.platform}</div>
                        <div className="text-sm text-[#B0B0C0] break-all">
                          {source.reviewUrl}
                        </div>
                        {source.estimatedReviews && (
                          <div className="text-sm text-[#B0B0C0]">
                            ~{source.estimatedReviews} reviews
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Summary</h3>
                  <div className="bg-[#23263a] rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-[#B0B0C0]">Total Detected Sources</div>
                        <div className="text-2xl font-bold">{results.detected_sources?.length || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#B0B0C0]">Sources with Real Data</div>
                        <div className="text-2xl font-bold text-green-400">{results.total_sources_with_data || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 