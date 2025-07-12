import { runScrapingWorkflow } from './scraper'

// Simple in-memory job queue
// In production, use Redis with Bull/BullMQ for persistence and scaling
interface Job {
  id: string
  companyId: string
  businessName: string
  businessUrl: string
  industry: string
  reviewSource: string
  reviewUrl: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  error?: string
}

class JobQueue {
  private jobs: Map<string, Job> = new Map()
  private isProcessing = false

  async addJob(jobData: Omit<Job, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const job: Job = {
      id: jobId,
      ...jobData,
      status: 'pending',
      createdAt: new Date()
    }

    this.jobs.set(jobId, job)
    console.log(`Job ${jobId} added to queue`)

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue()
    }

    return jobId
  }

  async getJob(jobId: string): Promise<Job | null> {
    return this.jobs.get(jobId) || null
  }

  async getJobByCompanyId(companyId: string): Promise<Job | null> {
    const jobs = Array.from(this.jobs.values())
    for (const job of jobs) {
      if (job.companyId === companyId) {
        return job
      }
    }
    return null
  }

  private async processQueue() {
    if (this.isProcessing) return

    this.isProcessing = true
    console.log('Starting job queue processing...')

    while (true) {
      // Find next pending job
      const pendingJob = Array.from(this.jobs.values()).find(job => job.status === 'pending')
      
      if (!pendingJob) {
        console.log('No pending jobs, stopping queue processing')
        this.isProcessing = false
        break
      }

      // Process the job
      await this.processJob(pendingJob)
    }
  }

  private async processJob(job: Job) {
    console.log(`Processing job ${job.id} for ${job.businessName}`)
    
    // Update job status to processing
    job.status = 'processing'
    job.startedAt = new Date()

    try {
      // Run the scraping workflow
      const result = await runScrapingWorkflow(
        job.companyId,
        job.businessName,
        job.businessUrl,
        job.industry,
        job.reviewSource,
        job.reviewUrl
      )

      if (result.success) {
        job.status = 'completed'
        job.completedAt = new Date()
        console.log(`Job ${job.id} completed successfully`)
      } else {
        job.status = 'failed'
        job.error = result.error
        job.completedAt = new Date()
        console.error(`Job ${job.id} failed:`, result.error)
      }

    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'Unknown error'
      job.completedAt = new Date()
      console.error(`Job ${job.id} failed with exception:`, error)
    }
  }

  // Clean up old completed/failed jobs (keep last 100)
  cleanup() {
    const jobs = Array.from(this.jobs.values())
    const completedJobs = jobs.filter(job => 
      job.status === 'completed' || job.status === 'failed'
    )

    if (completedJobs.length > 100) {
      // Sort by completion date and remove oldest
      completedJobs.sort((a, b) => 
        (a.completedAt?.getTime() || 0) - (b.completedAt?.getTime() || 0)
      )

      const toRemove = completedJobs.slice(0, completedJobs.length - 100)
      toRemove.forEach(job => {
        this.jobs.delete(job.id)
      })

      console.log(`Cleaned up ${toRemove.length} old jobs`)
    }
  }
}

// Global job queue instance
export const jobQueue = new JobQueue()

// Cleanup old jobs every hour
setInterval(() => {
  jobQueue.cleanup()
}, 60 * 60 * 1000)

// Export job queue functions
export async function addScrapingJob(jobData: Omit<Job, 'id' | 'status' | 'createdAt'>) {
  return jobQueue.addJob(jobData)
}

export async function getJobStatus(jobId: string) {
  return jobQueue.getJob(jobId)
}

export async function getJobStatusByCompanyId(companyId: string) {
  return jobQueue.getJobByCompanyId(companyId)
} 