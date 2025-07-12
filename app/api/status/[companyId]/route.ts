import { NextRequest, NextResponse } from 'next/server'
import { getJobStatusByCompanyId } from '@/lib/queue'
import { getCompany } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params

    // Get company data
    const company = await getCompany(companyId)
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Get job status
    const job = await getJobStatusByCompanyId(companyId)

    return NextResponse.json({
      company_id: companyId,
      company_name: company.name,
      status: company.status,
      job_status: job?.status || 'unknown',
      job_started_at: job?.startedAt,
      job_completed_at: job?.completedAt,
      job_error: job?.error,
      report_url: company.status === 'complete' ? `/report/${companyId}` : null
    })

  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 