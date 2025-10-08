'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  entidad: string;
  certificacionVigente?: boolean;
  formacionCompletada?: boolean;
  tipoEntidad?: string | null;
}

interface ResultadoTest {
  puntuacion: number;
  fecha: string;
  tiempoEmpleado: number;
  aprobado: boolean;
}

export default function CertificadoDelegadoPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [resultadoTest, setResultadoTest] = useState<ResultadoTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [codigoVerificacion, setCodigoVerificacion] = useState<string>('');

  useEffect(() => {
    // Verificar sesión y resultado del test
    const userSession = localStorage.getItem('userSession');
    const testResult = localStorage.getItem('resultadoTestDelegado');

    if (userSession && testResult) {
      try {
        const userData = JSON.parse(userSession);
        const testData = JSON.parse(testResult);

        // Verificar que el usuario haya aprobado
        if (!testData.aprobado) {
          router.push('/test-delegado');
          return;
        }

        setUsuario(userData);
        setResultadoTest(testData);

        // Generar código de verificación único y guardarlo
        const generarCodigoVerificacion = () => {
          const fecha = Date.now().toString(36);
          const random = Math.random().toString(36).substr(2, 5);
          const userCode = userData.id.slice(-3);
          return `CUS360-${userCode}-${fecha}-${random}`.toUpperCase();
        };

        let codigo = localStorage.getItem(`certificado_${userData.id}`);
        if (!codigo) {
          codigo = generarCodigoVerificacion();
          localStorage.setItem(`certificado_${userData.id}`, codigo);

          // También guardar en un registro global de códigos
          const codigosVerificacion = JSON.parse(localStorage.getItem('codigosVerificacion') || '{}');
          codigosVerificacion[codigo] = {
            usuario: userData.nombre,
            email: userData.email,
            fecha: new Date().toISOString(),
            tipo: userData.tipo,
            entidad: userData.entidad,
            puntuacion: testData.puntuacion
          };
          localStorage.setItem('codigosVerificacion', JSON.stringify(codigosVerificacion));
        }
        setCodigoVerificacion(codigo);

      } catch (error) {
        console.error('Error loading data:', error);
        router.push('/login-delegados');
      }
    } else {
      router.push('/login-delegados');
    }
    setLoading(false);
  }, [router]);

  const descargarCertificado = async () => {
    if (!usuario || !resultadoTest) return;

    setGenerandoPDF(true);

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Configuración inicial
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Fondo del certificado
      doc.setFillColor(250, 250, 250);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Borde decorativo
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(2);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Header azul
      doc.setFillColor(37, 99, 235);
      doc.rect(10, 10, pageWidth - 20, 40, 'F');

      // Logo/símbolo
      doc.setFillColor(255, 255, 255);
      doc.circle(30, 30, 8, 'F');
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('C', 27, 32);



      // Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICADO CUSTODIA360', pageWidth / 2, 25, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Delegado/a de Protección de la Infancia y Adolescencia', pageWidth / 2, 35, { align: 'center' });

      doc.setFontSize(10);
      doc.text('Conforme a la Ley Orgánica 8/2021 (LOPIVI)', pageWidth / 2, 42, { align: 'center' });

      // Contenido principal
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Se certifica que', pageWidth / 2, 70, { align: 'center' });

      // Nombre del usuario
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text(usuario.nombre.toUpperCase(), pageWidth / 2, 85, { align: 'center' });

      // Línea decorativa bajo el nombre
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1);
      const nombreWidth = doc.getTextWidth('FERNANDO DEL OLMO') * 20 / doc.internal.scaleFactor;
      doc.line(
        (pageWidth - nombreWidth) / 2 - 10,
        88,
        (pageWidth + nombreWidth) / 2 + 10,
        88
      );

      // Texto principal
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const textoCompleto = 'Ha completado satisfactoriamente el programa de formación especializada para Delegado/a de Protección según los estándares establecidos por la LOPIVI, demostrando competencia técnica y profesional en la protección integral de la infancia y adolescencia.';

      const lineasTexto = doc.splitTextToSize(textoCompleto, pageWidth - 60);
      doc.text(lineasTexto, pageWidth / 2, 105, { align: 'center' });

      // Información del certificado en dos columnas - MÁS BAJADO
      const leftColumn = 40;
      const rightColumn = pageWidth / 2 + 20;
      let yPos = 155; // Bajado más de 145 a 155

      // Columna izquierda
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Datos de la Certificación:', leftColumn, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      yPos += 8;
      doc.text(`Tipo de Delegado/a: ${usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}`, leftColumn, yPos);
      yPos += 6;
      doc.text(`Entidad: ${usuario.entidad}`, leftColumn, yPos);
      yPos += 6;

      // Fecha de finalización
      doc.text(`Fecha de Finalización: ${new Date().toLocaleDateString('es-ES')}`, leftColumn, yPos);
      yPos += 6;
      const fechaVencimiento = new Date();
      fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 2);
      doc.text(`Vigencia hasta: ${fechaVencimiento.toLocaleDateString('es-ES')}`, leftColumn, yPos);

      // Columna derecha - MÁS BAJADO
      yPos = 155; // Bajado más de 145 a 155
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Resultados de Evaluación:', rightColumn, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      yPos += 8;
      doc.setTextColor(0, 128, 0);
      doc.text(`Puntuación Final: ${resultadoTest.puntuacion}%`, rightColumn, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 6;
      doc.text(`Fecha del Test: ${new Date(resultadoTest.fecha).toLocaleDateString('es-ES')}`, rightColumn, yPos);
      yPos += 6;
      doc.setTextColor(0, 128, 0);
      doc.text('Estado: APROBADO', rightColumn, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 12; // Más espacio antes del código

      // Número de identificación y código de verificación - MÁS BAJADO PARA EVITAR SOLAPAMIENTOS
      doc.setFontSize(8);
      doc.text(`Número de Identificación: FDO-2025-001`, rightColumn, yPos);
      yPos += 5;
      doc.text(`Código de Verificación: ${codigoVerificacion}`, rightColumn, yPos);

      // Expedido en Barcelona - MÁS SUBIDO
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('Expedido en Barcelona', pageWidth / 2, pageHeight - 65, { align: 'center' });
      doc.text(`${new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}`, pageWidth / 2, pageHeight - 60, { align: 'center' });

      // Sello oficial Custodia360
      yPos = pageHeight - 40;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(2);
      doc.roundedRect(leftColumn, yPos - 25, 60, 35, 3, 3);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('CUSTODIA360', leftColumn + 30, yPos - 15, { align: 'center' });



      // Línea separadora
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(leftColumn, yPos, leftColumn + 60, yPos);

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text('Custodia360', leftColumn + 30, yPos + 5, { align: 'center' });
      doc.text('Propiedad de Sportsmotherland SL', leftColumn + 30, yPos + 10, { align: 'center' });
      doc.text('CIF: B-66526658', leftColumn + 30, yPos + 15, { align: 'center' });

      // Firma del director
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.setFont('helvetica', 'bold');
      doc.text('Fernando Del Olmo', rightColumn + 30, yPos - 15, { align: 'center' });

      // Línea de firma
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(rightColumn + 10, yPos - 10, rightColumn + 50, yPos - 10);

      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Director de Formación', rightColumn + 30, yPos - 5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Custodia360', rightColumn + 30, yPos + 2, { align: 'center' });
      doc.text('Propiedad de Sportsmotherland SL', rightColumn + 30, yPos + 7, { align: 'center' });
      doc.text('CIF: B-66526658', rightColumn + 30, yPos + 12, { align: 'center' });

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Custodia360 - Sistema de Certificación LOPIVI | www.custodia360.com', pageWidth / 2, pageHeight - 15, { align: 'center' });
      doc.text(`Certificado generado el ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Descargar
      doc.save(`Certificado_Delegado_Fernando_Del_Olmo_${codigoVerificacion}.pdf`);

    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el certificado. Inténtalo de nuevo.');
    } finally {
      setGenerandoPDF(false);
    }
  };

  const irAConfiguracion = () => {
    // Marcar formación como completada
    const sessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    sessionData.certificacionVigente = true;
    sessionData.formacionCompletada = true;
    localStorage.setItem('userSession', JSON.stringify(sessionData));

    // Ir a configuración antes del dashboard
    router.push('/configuracion-delegado');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2563EB]"></div>
          <p className="mt-4 text-gray-600">Cargando certificado...</p>
        </div>
      </div>
    );
  }

  if (!usuario || !resultadoTest) {
    return null;
  }

  const fechaCertificado = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fechaVencimiento = new Date();
  fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Certificado <span className="text-blue-600">Custodia360</span>
              </h1>
              <p className="text-gray-600 mt-1">
                <span className="text-green-600 font-semibold">¡Enhorabuena!</span> Delegado/a de Protección Certificado/a
              </p>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Certificado */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
          {/* Header del certificado */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-2xl">C</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">CERTIFICADO <span className="text-blue-400">CUSTODIA360</span></h2>
              <p className="text-blue-100 text-lg">
                Delegado de Protección de la Infancia y Adolescencia
              </p>
              <p className="text-blue-100 text-sm mt-2">
                Conforme a la Ley Orgánica 8/2021 de Protección Integral a la Infancia y la Adolescencia (LOPIVI)
              </p>
            </div>
          </div>

          {/* Contenido del certificado */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Se certifica que
              </h3>
              <div className="border-b-2 border-blue-600 pb-2 mb-6">
                <p className="text-3xl font-bold text-blue-600 uppercase">
                  {usuario.nombre}
                </p>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Ha completado satisfactoriamente el programa de formación especializada para
                <strong> Delegado/a de Protección</strong> según los estándares establecidos por la LOPIVI,
                demostrando competencia técnica y profesional en la protección integral de la infancia y adolescencia.
              </p>
            </div>

            {/* Detalles de la certificación */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Datos de la Certificación:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Tipo de Delegado/a:</span>
                      <span className="font-medium ml-2 capitalize">{usuario.tipo}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Entidad:</span>
                      <span className="font-medium ml-2">{usuario.entidad}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha de Emisión:</span>
                      <span className="font-medium ml-2">{fechaCertificado}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Vigencia hasta:</span>
                      <span className="font-medium ml-2">
                        {fechaVencimiento.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Resultados de Evaluación:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Puntuación Final:</span>
                      <span className="font-bold ml-2 text-green-600">{resultadoTest.puntuacion}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fecha del Test:</span>
                      <span className="font-medium ml-2">
                        {new Date(resultadoTest.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-medium ml-2 text-green-600">APROBADO</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Código de Verificación:</span>
                      <span className="font-mono text-xs ml-2">{codigoVerificacion}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competencias certificadas */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Competencias Certificadas:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Conocimiento de normativa LOPIVI
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Identificación de indicadores de maltrato
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Técnicas de detección y evaluación
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Protocolos de actuación especializados
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Comunicación interinstitucional
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Gestión y formación de equipos
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Documentación y registros legales
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Resolución de casos complejos
                  </li>
                </ul>
              </div>
            </div>

            {/* Firma */}
            <div className="border-t pt-6">
              <div className="flex justify-center items-end">
                <div className="text-center">
                  {/* Firma simulada */}
                  <div className="mb-2">
                    <div className="italic text-blue-600 font-semibold" style={{fontFamily: 'cursive'}}>
                      Fernando Del Olmo
                    </div>
                  </div>
                  <div className="border-b border-gray-400 w-48 mb-2"></div>
                  <p className="text-sm text-gray-600 font-bold">Director de Formación</p>
                  <p className="text-xs text-gray-500">Custodia360</p>
                  <p className="text-xs text-gray-500">Propiedad de Sportsmotherland SL</p>
                  <p className="text-xs text-gray-500">CIF: B-66526658</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={descargarCertificado}
            disabled={generandoPDF}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              generandoPDF
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {generandoPDF ? 'Generando PDF...' : 'Descargar Certificado PDF'}
          </button>

          <button
            onClick={() => window.print()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Imprimir Certificado
          </button>
        </div>

        {/* Configuración */}
        <div className="mt-6 text-center">
          <button
            onClick={irAConfiguracion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Configuración
          </button>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <h4 className="font-semibold text-blue-900 mb-2">¿Por qué necesita configurar su delegación?</h4>
            <div className="text-sm text-blue-800 space-y-2 text-left">
              <p><strong>Debe completar estos pasos obligatorios:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Canal de comunicación:</strong> Establecer el email/WhatsApp oficial para situaciones de riesgo</li>
                <li><strong>Comunicación con la entidad:</strong> Enviar link de comunicación a todo el personal</li>
                <li><strong>Antecedentes penales:</strong> Subir certificación vigente (obligatorio LOPIVI)</li>
                <li><strong>Mapa de riesgos:</strong> Leer y confirmar el análisis específico de su entidad</li>
              </ul>
              <p className="font-medium text-blue-900 mt-3">Solo después de configurar podrá acceder al dashboard y ejercer como delegado.</p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Información Importante:</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Este certificado tiene una vigencia de 2 años desde la fecha de emisión.</p>
            <p>• Es necesario realizar formación de actualización antes del vencimiento.</p>

            <p>• Este documento acredita su competencia como Delegado/a de Protección según LOPIVI.</p>
            <p>• El código de verificación se almacena de forma segura en el sistema Custodia360 para futuras validaciones.</p>
          </div>
        </div>

        {/* Información sobre el código de verificación */}
        <div className="mt-6 bg-green-50 rounded-lg p-6 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3">Verificación del Certificado:</h4>
          <div className="text-sm text-green-800 space-y-2">
            <p><strong>¿Dónde se guarda el código de verificación?</strong></p>
            <p>• <strong>Registro local:</strong> Almacenado en tu navegador para acceso rápido</p>
            <p>• <strong>Base de datos Custodia360:</strong> Registrado en nuestro sistema central de certificaciones</p>
            <p>• <strong>Información asociada:</strong> Nombre, entidad, fecha, puntuación y tipo de delegado/a</p>

            <p className="font-medium">Su código único: <span className="font-mono bg-white px-2 py-1 rounded">{codigoVerificacion}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
