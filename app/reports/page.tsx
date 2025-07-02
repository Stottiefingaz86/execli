'use client'

import Navigation from '@/components/Navigation'
import { useState } from 'react'

interface ReportForm {
  businessUrl: string
  competitorUrls: string[]
  email: string
}

interface ReportResult {
  id: string
  businessName: string
  generatedAt: string
  status: 'processing' | 'completed' | 'failed'
  downloadUrl?: string
}

export default function Reports() {
  const [formData, setFormData] = useState<ReportForm>({
    businessUrl: '',
    competitorUrls: [],
    email: ''
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<ReportResult[]>([
    {
      id: '1',
      businessName: 'Acme Corp',
      generatedAt: '2024-12-15T10:30:00Z',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: '2',
      businessName: 'TechStart Inc',
      generatedAt: '2024-12-14T15:45:00Z',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: '3',
      businessName: 'Innovate Labs',
      generatedAt: '2024-12-13T09:20:00Z',
      status: 'processing'
    }
  ])

  const handleAddCompetitor = () => {
    setFormData(prev => ({
      ...prev,
      competitorUrls: [...prev.competitorUrls, '']
    }))
  }

  const handleCompetitorChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      competitorUrls: prev.competitorUrls.map((url, i) => i === index ? value : url)
    }))
  }

  const handleRemoveCompetitor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      competitorUrls: prev.competitorUrls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: ReportResult = {
        id: Date.now().toString(),
        businessName: new URL(formData.businessUrl).hostname,
        generatedAt: new Date().toISOString(),
        status: 'processing'
      }
      
      setReports(prev => [newReport, ...prev])
      setIsGenerating(false)
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        setReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'completed', downloadUrl: '#' }
            : report
        ))
      }, 3000)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'processing': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓'
      case 'processing': return '⏳'
      case 'failed': return '✗'
      default: return '○'
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-semibold text-text">
              Voice of <span className="text-accent">Customer</span> Reports
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Generate instant customer feedback analysis reports. Understand what your customers are saying about your business and competitors.
            </p>
          </div>
        </div>
      </section>

      {/* Report Generator Form */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="card p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-text">Generate Customer Insight Report</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business URL */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Your Business URL *
                  </label>
                  <input 
                    type="url" 
                    value={formData.businessUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessUrl: e.target.value }))}
                    placeholder="https://yourbusiness.com"
                    className="input-field w-full"
                    required
                  />
                </div>

                {/* Competitor URLs */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Competitor URLs (Optional)
                  </label>
                  {formData.competitorUrls.map((url, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input 
                        type="url" 
                        value={url}
                        onChange={(e) => handleCompetitorChange(index, e.target.value)}
                        placeholder="https://competitor.com"
                        className="input-field flex-1"
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveCompetitor(index)}
                        className="px-3 py-2 text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={handleAddCompetitor}
                    className="text-accent hover:text-accent/80 text-sm"
                  >
                    + Add Competitor
                  </button>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Email for Report Delivery *
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="input-field w-full"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isGenerating || !formData.businessUrl || !formData.email}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating Report...' : 'Generate Free Report'}
                </button>
              </form>
            </div>

            {/* Recent Reports */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-text">Recent Reports</h2>
              
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="card p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text">{report.businessName}</h3>
                        <p className="text-sm text-gray-400">
                          Generated: {new Date(report.generatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-2 ${getStatusColor(report.status)}`}>
                        <span className="text-lg">{getStatusIcon(report.status)}</span>
                        <span className="text-sm capitalize">{report.status}</span>
                      </div>
                    </div>
                    
                    {report.status === 'completed' && report.downloadUrl && (
                      <div className="flex space-x-3">
                        <button className="btn-primary text-sm px-4 py-2">
                          View Report
                        </button>
                        <button className="btn-secondary text-sm px-4 py-2">
                          Download PDF
                        </button>
                      </div>
                    )}
                    
                    {report.status === 'processing' && (
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                        <span className="text-sm">Analyzing customer feedback...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-text mb-6">
              What's in Your Report
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive customer feedback analysis delivered in minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Sentiment Analysis',
                description: 'Overall customer sentiment and emotional tone',
                icon: '😊'
              },
              {
                title: 'Trending Complaints',
                description: 'Most common issues and pain points',
                icon: '📈'
              },
              {
                title: 'Top Praise',
                description: 'What customers love about your business',
                icon: '⭐'
              },
              {
                title: 'Market Gaps',
                description: 'Opportunities and competitive advantages',
                icon: '🎯'
              }
            ].map((feature, index) => (
              <div key={index} className="card p-6 text-center space-y-4">
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-text">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 