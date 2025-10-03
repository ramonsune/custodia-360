'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function ConditionalHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-orange-600" />
            <h1 className="text-xl font-bold text-gray-700">Custodia360</h1>
          </Link>

          <nav className="flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/servicios" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Servicios
            </Link>
            <Link href="/planes" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Planes
            </Link>
            <Link href="/demo" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Proceso
            </Link>
            <Link href="/contacto" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Contacto
            </Link>
            <Link href="/dashboard-directo" className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium">
              Portal Delegados/as
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
