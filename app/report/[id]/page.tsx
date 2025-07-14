'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import ReportPageContent from '../../../components/ReportPageContent'

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
            setError('No report found')
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
      } catch (err) {
        console.error('Error fetching report:', err)
        setError('Failed to load report')
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

  if (polling) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Creating your Voice of Customer report...</h2>
          <p className="text-[#B0B0C0] mb-4">
            {progressMessage}
          </p>
          <div className="bg-[#1c1e26] rounded-lg p-4">
            <p className="text-sm text-[#B0B0C0] mb-2">Progress: {pollingAttempts}/30</p>
            <div className="w-full bg-[#23263a] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(pollingAttempts / 30) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#B0B0C0] mt-2">
              This may take up to 5 minutes. Feel free to refresh the page - we'll continue where we left off!
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-400">Error</h2>
          <p className="text-[#B0B0C0] mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Try Again
          </button>
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

  return <ReportPageContent report={reportData} />
} 