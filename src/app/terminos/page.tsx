import Link from 'next/link'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Volver a Inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Términos y Condiciones
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información General</h2>
              <p className="text-gray-700 mb-4">
                Estos términos y condiciones regulan el uso de los servicios proporcionados por Custodia360,
                propiedad de Sportsmotherland SL, especializada en cumplimiento de la Ley Orgánica de Protección
                Integral a la Infancia y la Adolescencia frente a la Violencia (LOPIVI).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Servicios Ofrecidos</h2>
              <p className="text-gray-700 mb-4">
                Custodia360 ofrece servicios de implementación y mantenimiento de sistemas de protección
                infantil conforme a la LOPIVI, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Designación y certificación de delegados de protección</li>
                <li>Desarrollo de planes de protección personalizados</li>
                <li>Formación especializada del personal</li>
                <li>Documentación completa LOPIVI</li>
                <li>Sistema de gestión digital</li>
                <li>Mantenimiento y actualizaciones continuas</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Condiciones de Contratación</h2>
              <p className="text-gray-700 mb-4">
                Al contratar nuestros servicios, el cliente acepta:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Proporcionar información veraz y completa sobre su entidad</li>
                <li>Facilitar el acceso necesario para la implementación del sistema</li>
                <li>Colaborar en la formación del personal designado</li>
                <li>Mantener actualizada la información de contacto</li>
                <li>Cumplir con los pagos según la modalidad elegida</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Modalidades de Pago</h2>
              <p className="text-gray-700 mb-4">
                Ofrecemos las siguientes modalidades de pago:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Plan 50 (1-50 menores): 19€ + IVA inicial, 19€ + IVA a los 6 meses</li>
                <li>Plan 200 (51-200 menores): 49€ + IVA inicial, 49€ + IVA a los 6 meses</li>
                <li>Plan 500 (201-500 menores): 105€ + IVA inicial, 105€ + IVA a los 6 meses</li>
                <li>Plan 500+ (+501 menores): 250€ + IVA inicial, 250€ + IVA a los 6 meses</li>
                <li>Custodia Temporal: 39€ + IVA pago único</li>
                <li>Kit de Comunicación: 40€ + IVA pago único</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Garantías y Responsabilidades</h2>
              <p className="text-gray-700 mb-4">
                Custodia360 garantiza la implementación completa de los sistemas de protección conforme
                a la normativa LOPIVI vigente. Sin embargo, la responsabilidad final del cumplimiento
                normativo recae en la entidad contratante.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cancelación y Reembolsos</h2>
              <p className="text-gray-700 mb-4">
                El cliente puede cancelar el servicio en cualquier momento. Los reembolsos se procesarán
                según la política de reembolsos establecida y el estado de implementación del servicio.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modificaciones</h2>
              <p className="text-gray-700 mb-4">
                Custodia360 se reserva el derecho de modificar estos términos en cualquier momento.
                Los cambios serán notificados a los usuarios activos con antelación suficiente.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contacto</h2>
              <p className="text-gray-700">
                Para cualquier consulta sobre estos términos y condiciones, puede contactarnos en:
              </p>
              <div className="text-gray-700 mt-4">
                <p>Email: info@custodia360.es</p>
                <p>Teléfono: 678 771 198</p>
                <p>Dirección: Barcelona, España</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
