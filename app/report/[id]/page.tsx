'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import ReportPageContent from '../../../components/ReportPageContent'
import Image from 'next/image';
import ReportProgressStepper from '../../../components/ReportProgressStepper'; // Added import
import SourceCard from '../../../components/SourceCard'; // Added import
import Navigation from '@/components/Navigation';
import { RefreshCw } from 'lucide-react';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

// Define the workflow steps and commentary (top-level)
const workflowSteps = [
  { label: 'Finding review sources with AI', commentary: 'Locating the best review sites for this business using AI.' },
  { label: 'Scraping reviews from sources', commentary: 'Collecting reviews from all discovered platforms.' },
  { label: 'Analyzing customer feedback with AI', commentary: 'AI is analyzing all collected reviews for insights.' },
  { label: 'Generating insights and charts', commentary: 'Creating summaries, themes, and visualizations.' },
  { label: 'Report ready!', commentary: 'Your Voice of Customer report is complete.' }
];

export default function ReportPage() {
  const params = useParams()
  const reportId = params.id as string
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const [pollingAttempts, setPollingAttempts] = useState(0)
  const [progressMessage, setProgressMessage] = useState<string>('Initializing your report...')
  const [minProgressTimeElapsed, setMinProgressTimeElapsed] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Minimum progress overlay duration (ms)
  const MIN_PROGRESS_DURATION = 5000;

  // Determine current step from progressMessage
  const lowerMsg = (progressMessage || '').toLowerCase();
  let currentStep = 0;
  if (lowerMsg.includes('scraping')) currentStep = 1;
  else if (lowerMsg.includes('analyzing')) currentStep = 2;
  else if (lowerMsg.includes('insights')) currentStep = 3;
  else if (lowerMsg.includes('ready')) currentStep = 4;

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
          console.log('VOC Report found:', vocReport);
          console.log('Analysis data:', vocReport.analysis);
          
          // Check if report has analysis data
          if (vocReport.analysis && Object.keys(vocReport.analysis).length > 0) {
            console.log('Analysis data found, displaying report');
            // Use the analysis data from voc_reports
            const reportWithSources = {
              ...vocReport,
              detected_sources: vocReport.sources || [], // Map sources to detected_sources for compatibility
              ...vocReport.analysis // Spread the analysis data into the main object
            }
            setReportData(reportWithSources)
          } else {
            console.log('No analysis data found, starting polling');
            setProgressMessage(vocReport.progress_message || 'Initializing your report...')
            setPolling(true)
            startPolling()
            return
          }
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

  useEffect(() => {
    if (polling) {
      setMinProgressTimeElapsed(false);
      const timer = setTimeout(() => setMinProgressTimeElapsed(true), MIN_PROGRESS_DURATION);
      return () => clearTimeout(timer);
    }
  }, [polling]);

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
              ...updatedReport.analysis // Spread the analysis data into the main object
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

  const regenerateReport = async () => {
    setRegenerating(true);
    setLoading(true);
    
    try {
      // Clear the analysis data to force regeneration
      const { error } = await supabase()
        .from('voc_reports')
        .update({ 
          analysis: null,
          progress_message: 'Regenerating report with updated AI analysis...',
          status: 'processing'
        })
        .eq('id', reportId);
      
      if (error) {
        console.error('Error clearing analysis:', error);
        setError('Failed to regenerate report');
        return;
      }
      
      // Trigger the Edge Function to regenerate the report
      console.log('Calling regenerate API with reportId:', reportId);
      const response = await fetch('/api/regenerate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId })
      });
      
      console.log('Regenerate API response status:', response.status);
      const responseData = await response.json();
      console.log('Regenerate API response:', responseData);
      
      if (!response.ok) {
        console.error('Error triggering regeneration:', responseData);
        setError(`Failed to trigger report regeneration: ${responseData.error || 'Unknown error'}`);
        return;
      }
      
      // Start polling for the new analysis
      setProgressMessage('Regenerating report with updated AI analysis...');
      setPolling(true);
      startPolling();
      
    } catch (err) {
      console.error('Error regenerating report:', err);
      setError('Failed to regenerate report');
    } finally {
      setRegenerating(false);
    }
  };

  if ((loading || polling) && !minProgressTimeElapsed) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
        {/* Use Navigation component for header/nav, matching demo */}
        <Navigation />
        {/* Glassmorphic Main Card */}
        <main className="flex flex-1 items-center justify-center">
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
                      <span className="inline-block w-5 h-5 animate-pulse">
                        <span className="block w-5 h-5 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#a78bfa] to-[#86EFF5]" />
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
        </main>
      </div>
    )
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

  // Show the full report using ReportPageContent component
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Regenerate Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={regenerateReport}
            disabled={regenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'Regenerating...' : 'Regenerate Report'}
          </button>
        </div>
        <ReportPageContent reportData={reportData} reportId={Array.isArray(params.id) ? params.id[0] : params.id} />
      </div>
    </div>
  )
} 