'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthState, getCurrentUser, signIn, signUp, signOut } from '@/lib/auth'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  const refreshUser = async () => {
    try {
      console.log('Refreshing user...')
      setState(prev => ({ ...prev, loading: true, error: null }))
      const user = await getCurrentUser()
      console.log('User from getCurrentUser:', user)
      setState({ user, loading: false, error: null })
    } catch (error) {
      console.error('Error refreshing user:', error)
      setState({ user: null, loading: false, error: 'Failed to load user' })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await signIn(email, password)
      await refreshUser()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }

  const register = async (email: string, password: string, fullName?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await signUp(email, password, fullName)
      await refreshUser()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await signOut()
      setState({ user: null, loading: false, error: null })
    } catch (error) {
      console.error('Logout error:', error)
      setState(prev => ({ ...prev, loading: false, error: 'Logout failed' }))
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 