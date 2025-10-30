import Link from 'next/link'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Volver a Inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-gray-600">
            Última actualización: 25 de agosto de 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsable del Tratamiento</h2>
              <p className="text-gray-700 mb-4">
                El responsable del tratamiento de sus datos personales es Sportsmotherland SL,
                a través de su marca Custodia360.
              </p>
              <div className="text-gray-700">
                <p>Datos de contacto:</p>
                <p>Email: info@custodia360.es</p>
                <p>Teléfono: 678 771 198</p>
                <p>Dirección: Calle Diagonal 437, 2º2ª, 08037 Barcelona, España</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Datos que Recopilamos</h2>
              <p className="text-gray-700 mb-4">
                Recopilamos los siguientes tipos de datos personales:
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Datos de la Entidad:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mb-4">
                <li>Nombre de la entidad y CIF/NIF</li>
                <li>Dirección completa</li>
                <li>Teléfono y email de contacto</li>
                <li>Número de menores bajo custodia</li>
                <li>Tipo de entidad y actividades</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Datos del Contratante:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mb-4">
                <li>Nombre completo y DNI/NIE</li>
                <li>Cargo en la entidad</li>
                <li>Teléfono y email personal</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Datos del Delegado de Protección:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Nombre completo y DNI/NIE</li>
                <li>Datos de contacto</li>
                <li>Experiencia profesional</li>
                <li>Disponibilidad</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalidad del Tratamiento</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos sus datos personales para las siguientes finalidades:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Prestación de servicios de cumplimiento LOPIVI</li>
                <li>Implementación de sistemas de protección infantil</li>
                <li>Formación y certificación del personal</li>
                <li>Gestión de la relación contractual</li>
                <li>Comunicación sobre el servicio</li>
                <li>Cumplimiento de obligaciones legales</li>
                <li>Facturación y gestión de pagos</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal</h2>
              <p className="text-gray-700 mb-4">
                El tratamiento de sus datos se basa en:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><span className="font-semibold">Ejecución contractual:</span> Para prestar los servicios contratados</li>
                <li><span className="font-semibold">Cumplimiento legal:</span> Para cumplir con obligaciones normativas LOPIVI</li>
                <li><span className="font-semibold">Consentimiento:</span> Para comunicaciones comerciales (opcional)</li>
                <li><span className="font-semibold">Interés legítimo:</span> Para la gestión y mejora de nuestros servicios</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Conservación de Datos</h2>
              <p className="text-gray-700 mb-4">
                Conservamos sus datos personales durante:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Datos contractuales: Durante la vigencia del contrato y 6 años después</li>
                <li>Datos de facturación: 4 años según normativa fiscal</li>
                <li>Datos de formación: Según requerimientos LOPIVI</li>
                <li>Comunicaciones comerciales: Hasta la revocación del consentimiento</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Destinatarios</h2>
              <p className="text-gray-700 mb-4">
                Sus datos pueden ser comunicados a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Proveedores de servicios tecnológicos (hosting, email)</li>
                <li>Entidades financieras para procesamiento de pagos</li>
                <li>Autoridades competentes cuando sea legalmente requerido</li>
                <li>Asesores legales y fiscales</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sus Derechos</h2>
              <p className="text-gray-700 mb-4">
                Tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><span className="font-semibold">Acceso:</span> Obtener información sobre qué datos tratamos</li>
                <li><span className="font-semibold">Rectificación:</span> Corregir datos inexactos</li>
                <li><span className="font-semibold">Supresión:</span> Solicitar la eliminación de sus datos</li>
                <li><span className="font-semibold">Limitación:</span> Restringir el tratamiento en determinados casos</li>
                <li><span className="font-semibold">Portabilidad:</span> Recibir sus datos en formato estructurado</li>
                <li><span className="font-semibold">Oposición:</span> Oponerse al tratamiento por motivos legítimos</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Para ejercer estos derechos, contacte con nosotros en info@custodia360.es
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Seguridad</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos
                personales contra acceso no autorizado, alteración, divulgación o destrucción,
                incluyendo cifrado SSL, acceso restringido y copias de seguridad regulares.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Reclamaciones</h2>
              <p className="text-gray-700 mb-4">
                Si considera que el tratamiento de sus datos no se ajusta a la normativa,
                puede presentar una reclamación ante la Agencia Española de Protección de Datos
                (www.aepd.es).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cambios en la Política</h2>
              <p className="text-gray-700">
                Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos
                cualquier cambio significativo y la nueva política entrará en vigor tras su
                publicación en nuestro sitio web.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
