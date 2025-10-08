'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface DelegadoSimple {
  id: string
  email: string
  nombre: string
  tipo: 'principal' | 'suplente'
}

interface FormacionAuthContextType {
  delegado: DelegadoSimple | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const FormacionAuthContext = createContext<FormacionAuthContextType | undefined>(undefined)

// Datos simples de delegados para el sistema
const delegadosSimples: DelegadoSimple[] = [
  {
    id: 'del-1',
    email: 'maria.garcia@clubdeportivo.com',
    nombre: 'María García',
    tipo: 'principal'
  },
  {
    id: 'del-2',
    email: 'suplente@clubdeportivo.com',
    nombre: 'Juan Pérez',
    tipo: 'suplente'
  },
  {
    id: 'del-3',
    email: 'delegado@colegio.com',
    nombre: 'Ana López',
    tipo: 'principal'
  }
]

export function FormacionAuthProvider({ children }: { children: React.ReactNode }) {
  const [delegado, setDelegado] = useState<DelegadoSimple | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedDelegado = localStorage.getItem('formacion-delegado-session')
    if (savedDelegado) {
      try {
        const delegadoData = JSON.parse(savedDelegado)
        setDelegado(delegadoData)
      } catch (error) {
        console.error('Error loading saved session:', error)
        localStorage.removeItem('formacion-delegado-session')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    // Contraseñas simples para el demo
    const passwords: { [key: string]: string } = {
      'maria.garcia@clubdeportivo.com': 'delegado123',
      'delegado@clubdeportivo.com': 'delegado123',
      'suplente@clubdeportivo.com': 'suplente123',
      'delegado@colegio.com': 'delegado123'
    }

    const delegadoEncontrado = delegadosSimples.find(d => d.email === email)

    if (delegadoEncontrado && passwords[email] === password) {
      setDelegado(delegadoEncontrado)
      localStorage.setItem('formacion-delegado-session', JSON.stringify(delegadoEncontrado))
      return true
    }
    return false
  }

  const logout = () => {
    setDelegado(null)
    localStorage.removeItem('formacion-delegado-session')
  }

  return (
    <FormacionAuthContext.Provider value={{
      delegado,
      login,
      logout,
      isLoading
    }}>
      {children}
    </FormacionAuthContext.Provider>
  )
}

export function useFormacionAuth() {
  const context = useContext(FormacionAuthContext)
  if (context === undefined) {
    throw new Error('useFormacionAuth must be used within a FormacionAuthProvider')
  }
  return context
}
