'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useRouter } from 'next/navigation'
import { getUserReports } from '@/lib/auth'

interface UserAvatarProps {
  className?: string
}

export default function UserAvatar({ className = '' }: UserAvatarProps) {
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [reports, setReports] = useState<any[]>([])
  const [loadingReports, setLoadingReports] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isDropdownOpen && user) {
      loadUserReports()
    }
  }, [isDropdownOpen, user])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadUserReports = async () => {
    if (!user) return
    
    setLoadingReports(true)
    try {
      const userReports = await getUserReports()
      setReports(userReports)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoadingReports(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsDropdownOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleCreateReport = () => {
    setIsDropdownOpen(false)
    router.push('/create-report')
  }

  const handleViewReport = (reportId: string) => {
    setIsDropdownOpen(false)
    router.push(`/report/${reportId}`)
  }

  const handleViewReports = () => {
    setIsDropdownOpen(false)
    router.push('/reports')
  }

  if (!user) return null

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  const hasReports = reports.length > 0

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name || user.email}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {getInitials(user.full_name || "", user.email)}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.full_name || user.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || user.email}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {getInitials(user.full_name || "", user.email)}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.full_name || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {user.account_type === 'full' ? 'Full Account' : 'Partial Account'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            {!hasReports ? (
              <button
                onClick={handleCreateReport}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Create Report</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Generate your first VOC report</p>
                </div>
              </button>
            ) : (
              <div>
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Reports</p>
                  {loadingReports ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
                  ) : (
                    <div className="space-y-1">
                      {reports.slice(0, 3).map((report) => (
                        <button
                          key={report.id}
                          onClick={() => handleViewReport(report.id)}
                          className="w-full flex items-center space-x-3 p-2 text-left rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {report.business_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(report.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </button>
                      ))}
                      {reports.length > 3 && (
                        <button
                          onClick={handleViewReports}
                          className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-2 text-left"
                        >
                          View all {reports.length} reports
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleCreateReport}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700 pt-3"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Create New Report</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generate another VOC report</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 