'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Delegado, ProgresoDelegado } from './formacion-types'
import { delegados } from './formacion-data'

interface FormacionAuthContextType {
  delegado: Delegado | null
  login: (email: string, password: string) => boolean
  logout: () => void
  actualizarProgreso: (nuevoProgreso: Partial<ProgresoDelegado>) => void
  isLoading: boolean
}

const FormacionAuthContext = createContext<FormacionAuthContextType | undefined>(undefined)

export function FormacionAuthProvider({ children }: { children: React.ReactNode }) {
  const [delegado, setDelegado] = useState<Delegado | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedDelegado = localStorage.getItem('formacion-delegado-session')
    if (savedDelegado) {
      try {
        const delegadoData = JSON.parse(savedDelegado)
        // Buscar el delegado actual en la base de datos para obtener datos actualizados
        const delegadoActual = delegados.find(d => d.id === delegadoData.id)
        if (delegadoActual) {
          setDelegado(delegadoActual)
        }
      } catch (error) {
        console.error('Error loading saved session:', error)
        localStorage.removeItem('formacion-delegado-session')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    const delegadoEncontrado = delegados.find(
      d => d.email === email && d.password === password
    )

    if (delegadoEncontrado) {
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

  const actualizarProgreso = (nuevoProgreso: Partial<ProgresoDelegado>) => {
    if (!delegado) return

    const delegadoActualizado = {
      ...delegado,
      progreso: {
        ...delegado.progreso,
        ...nuevoProgreso
      }
    }

    setDelegado(delegadoActualizado)
    localStorage.setItem('formacion-delegado-session', JSON.stringify(delegadoActualizado))

    // En una aplicación real, aquí enviarías los datos al servidor
    console.log('Progreso actualizado:', delegadoActualizado.progreso)
  }

  return (
    <FormacionAuthContext.Provider value={{
      delegado,
      login,
      logout,
      actualizarProgreso,
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
