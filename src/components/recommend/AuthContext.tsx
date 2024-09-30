import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { getToken } from './api'

interface AuthContextType {
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    const initializeToken = async () => {
      if (!token) {
        try {
          const newToken = await getToken()
          setToken(newToken)
          localStorage.setItem('token', newToken)
        } catch (error) {
          console.error('Failed to get token:', error)
        }
      }
    }

    initializeToken()
  }, [token])

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
