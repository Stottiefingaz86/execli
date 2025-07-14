'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import ReportPageContent from '../../../components/ReportPageContent'
import Image from 'next/image';
import ReportProgressStepper from '../../../components/ReportProgressStepper'; // Added import
import SourceCard from '../../../components/SourceCard'; // Added import
import Navigation from '@/components/Navigation';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default function ReportPage() {
  const params = useParams()
  const reportId = params.id as string
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const [pollingAttempts, setPollingAttempts] = useState(0)
  const [progressMessage, setProgressMessage] = useState<string>('Initializing your report...')

  useEffect(() => {
    async function fetchData() {
      try {
        // First try to get the report from voc_reports table
        const { data: vocReport, error: vocError } = await supabase()
          .from('voc_reports')
          .select('*')
          .eq('id', reportId)
          .single()

        if (vocError) {
          console.error('Error fetching VOC report:', vocError)
          // If not found in voc_reports, try the old reports table
          const { data: oldReport, error: oldError } = await supabase()
            .from('reports')
            .select('report_data')
            .eq('id', reportId)
            .single()

          if (oldError || !oldReport || !oldReport.report_data) {
            setError(oldError ? (typeof oldError === 'object' ? JSON.stringify(oldError) : String(oldError)) : 'No report found')
            return
          }
          setReportData(oldReport.report_data)
        } else if (vocReport) {
          // Check if report is still processing
          if (vocReport.status === 'processing' && !vocReport.analysis) {
            setProgressMessage(vocReport.progress_message || 'Initializing your report...')
            setPolling(true)
            startPolling()
            return
          }
          // Use the analysis data from voc_reports
          const reportWithSources = {
            ...vocReport,
            detected_sources: vocReport.sources || [], // Map sources to detected_sources for compatibility
            analysis: vocReport.analysis || {}
          }
          setReportData(reportWithSources)
        } else {
          setError('No report found')
        }
      } catch (err: any) {
        console.error('Error fetching report:', err)
        setError(err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err)) || 'Failed to load report')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [reportId])

  const startPolling = async () => {
    const maxAttempts = 30 // 5 minutes with 10-second intervals
    let attempts = 0

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError('Report generation timed out. Please try again.')
        setPolling(false)
        return
      }

      try {
        const response = await fetch(`/api/report-status?report_id=${reportId}`)
        const data = await response.json()

        // Update progress message from API
        if (data.progress_message) {
          setProgressMessage(data.progress_message)
        }

        if (data.status === 'complete' && data.has_analysis) {
          // Fetch the updated report data
          const { data: updatedReport, error } = await supabase()
            .from('voc_reports')
        .select('*')
            .eq('id', reportId)
        .single()

          if (!error && updatedReport) {
            const reportWithSources = {
              ...updatedReport,
              detected_sources: updatedReport.sources || [],
              analysis: updatedReport.analysis || {}
            }
            setReportData(reportWithSources)
            setPolling(false)
            return
          }
        } else if (data.status === 'error') {
          setError('Report generation failed. Please try again.')
          setPolling(false)
        return
        }

        attempts++
        setPollingAttempts(attempts)
        
        // Continue polling
        setTimeout(poll, 10000) // Poll every 10 seconds
    } catch (err) {
        console.error('Polling error:', err)
        attempts++
        setPollingAttempts(attempts)
        setTimeout(poll, 10000)
    }
    }

    poll()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
          <p className="text-lg">Loading report...</p>
        </div>
      </div>
    )
  }

  // Define the workflow steps and commentary
  const workflowSteps = [
    { label: 'Finding review sources with AI', commentary: 'Locating the best review sites for this business using AI.' },
    { label: 'Scraping reviews from sources', commentary: 'Collecting reviews from all discovered platforms.' },
    { label: 'Analyzing customer feedback with AI', commentary: 'AI is analyzing all collected reviews for insights.' },
    { label: 'Generating insights and charts', commentary: 'Creating summaries, themes, and visualizations.' },
    { label: 'Report ready!', commentary: 'Your Voice of Customer report is complete.' }
  ];

  // Determine current step from progressMessage
  const lowerMsg = (progressMessage || '').toLowerCase();
  let currentStep = 0;
  if (lowerMsg.includes('scraping')) currentStep = 1;
  else if (lowerMsg.includes('analyzing')) currentStep = 2;
  else if (lowerMsg.includes('insights')) currentStep = 3;
  else if (lowerMsg.includes('ready')) currentStep = 4;

  if (polling) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
        <Navigation />
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="mb-8 mt-12">
            <img src="/logo.svg" alt="Execli Logo" width={64} height={64} className="mx-auto drop-shadow-lg" />
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-[#23263a]/10 to-[#3b82f6]/5 rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-6 text-center">Creating your Voice of Customer report...</h2>
              <div className="flex flex-col items-start gap-4">
                {workflowSteps.map((step, idx) => (
                  <div key={step.label} className={`flex items-center gap-3 text-left w-full transition-all duration-300 ${idx < currentStep ? 'opacity-80' : idx === currentStep ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#86EFF5] animate-shine' : 'opacity-40'}`}>
                    {idx < currentStep ? (
                      <span className="inline-block w-5 h-5 bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] rounded-full flex items-center justify-center text-xs shadow-[0_0_8px_2px_#8b5cf6]">✓</span>
                    ) : idx === currentStep ? (
                      <span className="inline-block w-5 h-5">
                        <span className="block w-5 h-5 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#a78bfa] to-[#86EFF5] animate-gradient-spin"></span>
                      </span>
                    ) : (
                      <span className="inline-block w-5 h-5 border-2 border-[#a78bfa] rounded-full"></span>
                    )}
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center text-[#B0B0C0] text-base min-h-[32px]">
                {workflowSteps[currentStep]?.commentary}
              </div>
              <div className="mt-2 text-xs text-[#B0B0C0] text-center">
                {progressMessage}
              </div>
            </div>
          </div>
          <div className="bg-[#1c1e26]/80 rounded-lg p-4 mt-6 shadow-lg max-w-md w-full">
            <p className="text-xs text-[#B0B0C0] mt-2 text-center">
              This may take up to 5 minutes. Feel free to refresh the page - we'll continue where we left off!
            </p>
          </div>
        </div>
        <style jsx global>{`
          .animate-gradient-spin {
            animation: gradient-spin 1.2s linear infinite;
            background-size: 200% 200%;
          }
          @keyframes gradient-spin {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .animate-shine {
            background-size: 200% 200%;
            animation: shine 2s linear infinite;
          }
          @keyframes shine {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-400">Error</h2>
          <p className="text-[#B0B0C0] mb-4 break-all whitespace-pre-wrap">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors mb-4"
          >
            Try Again
          </button>
          <br />
          <a
            href={`mailto:support@execli.com?subject=Bug Report for Report ID: ${reportId}&body=Error: ${encodeURIComponent(error)}%0AReport ID: ${reportId}%0AURL: ${encodeURIComponent(window.location.href)}`}
            className="inline-block mt-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report Bug
          </a>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No report found</h2>
          <p className="text-[#B0B0C0]">The requested report could not be found.</p>
        </div>
      </div>
    )
  }

  // Extract report and sources for the new structure
  const report = reportData;
  const sources = report?.detected_sources || [];

  // Helper function for date formatting
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString; // Fallback to original string if formatting fails
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#f3f4f6] font-sans relative overflow-x-hidden">
      <Navigation />
      {/* Header section (like demo report) */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">Voice of Customer Report</h1>
        <div className="text-lg text-[#B0B0C0] mb-1">{report?.business_name || ''}</div>
        <div className="text-sm text-[#B0B0C0] mb-6">Generated on {report ? formatDate(report.processed_at) : ''}</div>
      </div>
      {/* Active Sources section (like demo report) */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <span>Active Sources</span>
        </h2>
        <div className="bg-[#181a20] border border-white/10 rounded-2xl p-6 shadow-lg min-h-[180px] flex flex-col items-center justify-center">
          {sources && sources.length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {sources.map((src: { url: string }, i: number) => (
                <SourceCard key={i} source={src} />
              ))}
            </div>
          ) : (
            <div className="text-[#B0B0C0] text-base text-center py-8">
              <div className="font-semibold text-lg mb-2">No sources added yet</div>
              <div>Add a source to begin syncing reviews for this business.</div>
            </div>
          )}
        </div>
      </div>
      {/* ...rest of report sections, if any... */}
    </div>
  );
} 