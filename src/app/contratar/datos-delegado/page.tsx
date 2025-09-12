'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DatosDelegadoPage() {
  const [tieneSuplente, setTieneSuplente] = useState(false)

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-2">✓</div>
              <div className="w-16 h-1 bg-green-600 mr-2"></div>
              <div className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold mr-2">2</div>
              <div className="w-16 h-1 bg-gray-300 mr-2"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paso 2: Datos del Delegado de Protección</h1>
          <p className="text-gray-600">Complete los datos de la persona que actuará como Delegado de Protección LOPIVI</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-8">
            {/* Delegado Principal */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Delegado de Protección Principal</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Importante:</strong> El Delegado de Protección es la figura central del sistema LOPIVI.
                  Debe ser una persona mayor de edad, con formación específica y disponibilidad para actuar ante situaciones de riesgo.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: María García López"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI/NIE *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: 12345678Z"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Solo números: 15031985"
                    maxLength={10}
                    required
                    onInput={(e) => {
                      let value = e.currentTarget.value.replace(/\D/g, '');
                      if (value.length >= 3) {
                        value = value.slice(0, 2) + '/' + value.slice(2);
                      }
                      if (value.length >= 6) {
                        value = value.slice(0, 5) + '/' + value.slice(5, 9);
                      }
                      e.currentTarget.value = value;
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Escriba solo números: 15031985 → 15/03/1985</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: 600123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Acceso *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="delegado@ejemplo.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Email para acceder al dashboard del delegado</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña de Acceso *
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Para acceder al área del delegado</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Función/Cargo en la Entidad *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" required>
                    <option value="">Seleccionar función</option>
                    <option value="Entrenador Principal">Entrenador Principal</option>
                    <option value="Entrenador Asistente">Entrenador Asistente</option>
                    <option value="Coordinador">Coordinador</option>
                    <option value="Director Técnico">Director Técnico</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Responsable de Categoría">Responsable de Categoría</option>
                    <option value="Educador">Educador</option>
                    <option value="Psicólogo Deportivo">Psicólogo Deportivo</option>
                    <option value="Fisioterapeuta">Fisioterapeuta</option>
                    <option value="Conserje/Mantenimiento">Conserje/Mantenimiento</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Voluntario">Voluntario</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiencia con Menores *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" required>
                    <option value="">Seleccionar experiencia</option>
                    <option value="menos-1">Menos de 1 año</option>
                    <option value="1-3">1-3 años</option>
                    <option value="3-5">3-5 años</option>
                    <option value="5-10">5-10 años</option>
                    <option value="mas-10">Más de 10 años</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formación Previa en Protección de Menores
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    rows={3}
                    placeholder="Describa cualquier formación previa relacionada con protección infantil, psicología, educación, etc."
                  />
                </div>
              </div>

              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Incluido en su plan:</strong> Formación LOPIVI completa (6h 30min), certificación oficial,
                  materiales de trabajo y acceso al dashboard de gestión.
                </p>
              </div>
            </div>

            {/* Delegado Suplente */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">👥 Delegado de Protección Suplente (Opcional)</h2>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={tieneSuplente}
                      onChange={(e) => setTieneSuplente(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-800"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Designar delegado suplente (+10€)
                    </span>
                  </label>
                </div>
              </div>

              {tieneSuplente && (
                <div>
                  <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                    <p className="text-yellow-800 text-sm">
                      <strong>Recomendado:</strong> El delegado suplente actuará en caso de ausencia del principal
                      y recibirá la misma formación y certificación.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Ejemplo: Carlos Ruiz Martín"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DNI/NIE *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Ejemplo: 87654321X"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Ejemplo: 600654321"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de Acceso *
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="suplente@ejemplo.com"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña de Acceso *
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Mínimo 8 caracteres"
                        required={tieneSuplente}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Función/Cargo en la Entidad *
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" required={tieneSuplente}>
                        <option value="">Seleccionar función suplente</option>
                        <option value="Entrenador Asistente">Entrenador Asistente</option>
                        <option value="Monitor Suplente">Monitor Suplente</option>
                        <option value="Coordinador Adjunto">Coordinador Adjunto</option>
                        <option value="Responsable de Seguridad">Responsable de Seguridad</option>
                        <option value="Educador Suplente">Educador Suplente</option>
                        <option value="Administrativo">Administrativo</option>
                        <option value="Voluntario Senior">Voluntario Senior</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Declaraciones */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="font-bold text-gray-900">Declaraciones Responsables</h3>

              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" required />
                <span className="text-sm text-gray-700">
                  Declaro que el/los delegado/s designado/s no tiene/n antecedentes penales relacionados con delitos contra menores *
                </span>
              </label>

              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" required />
                <span className="text-sm text-gray-700">
                  Autorizo a Custodia360 a proporcionar la formación LOPIVI requerida al/los delegado/s designado/s *
                </span>
              </label>

              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" required />
                <span className="text-sm text-gray-700">
                  Confirmo que el/los delegado/s cuenta/n con disponibilidad para atender situaciones de emergencia *
                </span>
              </label>
            </div>

            <div className="flex justify-between">
              <Link
                href="/contratar/datos-entidad"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Volver al Paso 1
              </Link>

              <Link
                href="/contratar/pago"
                className="px-8 py-3 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900 transition-colors"
              >
                Continuar al Paso 3 →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
