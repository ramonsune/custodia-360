// Conditional imports to handle missing dependencies
let puppeteer: typeof import('puppeteer') | null = null
try {
  // Dynamic import para evitar errores de require
  puppeteer = require('puppeteer') as typeof import('puppeteer')
} catch (error) {
  console.warn('Puppeteer not available, PDF generation will be mocked')
}

export interface PDFOptions {
  title: string
  format?: 'A4' | 'Letter'
  margin?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
}

// Interface para los datos del PDF
interface PDFData {
  entidad?: string
  cif?: string
  delegado?: string
  nombre?: string
  [key: string]: unknown
}

export class PDFGenerator {
  private browser: unknown = null

  async initialize() {
    if (!puppeteer) {
      throw new Error('PDF generation is not available in this environment')
    }
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    }
    return this.browser
  }

  async generateFromHTML(html: string, options: PDFOptions = { title: 'Documento' }): Promise<Buffer> {
    // If puppeteer is not available, return a mock PDF buffer
    if (!puppeteer) {
      console.warn('PDF generation not available, returning mock buffer')
      return Buffer.from('Mock PDF content - PDF generation not available in this environment')
    }

    try {
      const browser = await this.initialize() as import('puppeteer').Browser
      const page = await browser.newPage()

      try {
        // Configurar el contenido HTML
        await page.setContent(html, { waitUntil: 'networkidle0' })

        // Generar PDF
        const pdfBuffer = await page.pdf({
          format: options.format || 'A4',
          printBackground: true,
          margin: options.margin || {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          }
        })

        return Buffer.from(pdfBuffer)
      } finally {
        await page.close()
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Return a fallback buffer in case of error
      return Buffer.from('PDF generation failed - please try again later')
    }
  }

  async close() {
    if (this.browser && puppeteer) {
      try {
        const browser = this.browser as import('puppeteer').Browser
        await browser.close()
        this.browser = null
      } catch (error) {
        console.warn('Error closing browser:', error)
        this.browser = null
      }
    }
  }
}

// Singleton instance
export const pdfGenerator = new PDFGenerator()

// Templates HTML para diferentes documentos
export const PDFTemplates = {
  // Plan de Protección
  planProteccion: (data: PDFData) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .title {
            font-size: 28px;
            margin: 20px 0;
          }
          .content {
            padding: 0 40px 40px;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section-title {
            color: #667eea;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 5px;
          }
          .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background: #f8f9fa;
            font-weight: bold;
            color: #667eea;
          }
          .highlight {
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .badge {
            display: inline-block;
            padding: 5px 10px;
            background: #28a745;
            color: white;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CUSTODIA360</div>
          <div class="title">Plan de Protección del Menor</div>
          <div>${data.entidad || 'Nombre de la Entidad'}</div>
        </div>

        <div class="content">
          <div class="info-box">
            <strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-ES')}<br>
            <strong>Entidad:</strong> ${data.entidad}<br>
            <strong>CIF:</strong> ${data.cif}<br>
            <strong>Delegado de Protección:</strong> ${data.delegado}
          </div>

          <div class="section">
            <h2 class="section-title">1. INTRODUCCIÓN Y MARCO LEGAL</h2>
            <p>
              Este Plan de Protección del Menor se establece en cumplimiento de la
              Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia
              y la adolescencia frente a la violencia (LOPIVI).
            </p>
            <p>
              El presente documento constituye el marco de actuación para garantizar
              un entorno seguro y protector para todos los menores que participan en
              las actividades de nuestra entidad.
            </p>
          </div>

          <div class="section">
            <h2 class="section-title">2. ÁMBITO DE APLICACIÓN</h2>
            <p>Este plan aplica a:</p>
            <ul>
              <li>Todo el personal de la entidad</li>
              <li>Voluntarios y colaboradores</li>
              <li>Menores participantes en nuestras actividades</li>
              <li>Familias y tutores legales</li>
            </ul>
          </div>

          <div class="section">
            <h2 class="section-title">3. PRINCIPIOS FUNDAMENTALES</h2>
            <table>
              <tr>
                <th>Principio</th>
                <th>Descripción</th>
              </tr>
              <tr>
                <td>Interés superior del menor</td>
                <td>Todas las decisiones priorizarán el bienestar del menor</td>
              </tr>
              <tr>
                <td>Prevención</td>
                <td>Actuación proactiva para evitar situaciones de riesgo</td>
              </tr>
              <tr>
                <td>Detección temprana</td>
                <td>Identificación precoz de posibles situaciones de violencia</td>
              </tr>
              <tr>
                <td>Intervención inmediata</td>
                <td>Respuesta rápida ante cualquier situación de riesgo</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2 class="section-title">4. PROTOCOLOS DE ACTUACIÓN</h2>
            <div class="highlight">
              <strong>⚠️ IMPORTANTE:</strong> Ante cualquier sospecha o detección de violencia,
              se activará inmediatamente el protocolo correspondiente contactando con el
              Delegado de Protección.
            </div>
            <p>Los protocolos específicos incluyen:</p>
            <ul>
              <li>Protocolo de prevención del acoso escolar</li>
              <li>Protocolo ante situaciones de maltrato</li>
              <li>Protocolo de actuación en emergencias</li>
              <li>Protocolo de comunicación con autoridades</li>
            </ul>
          </div>

          <div class="section">
            <h2 class="section-title">5. FORMACIÓN Y SENSIBILIZACIÓN</h2>
            <p>
              Todo el personal recibirá formación obligatoria en:
            </p>
            <ul>
              <li>Identificación de situaciones de riesgo</li>
              <li>Aplicación de protocolos</li>
              <li>Comunicación con menores</li>
              <li>Marco legal LOPIVI</li>
            </ul>
            <div class="badge">Formación certificada LOPIVI</div>
          </div>

          <div class="section">
            <h2 class="section-title">6. SUPERVISIÓN Y EVALUACIÓN</h2>
            <p>
              Se realizarán evaluaciones periódicas del cumplimiento del plan mediante:
            </p>
            <ul>
              <li>Auditorías internas trimestrales</li>
              <li>Revisión anual del plan</li>
              <li>Actualización continua de protocolos</li>
              <li>Feedback de familias y menores</li>
            </ul>
          </div>

          <div class="section">
            <h2 class="section-title">7. CONTACTOS DE EMERGENCIA</h2>
            <table>
              <tr>
                <th>Servicio</th>
                <th>Teléfono</th>
              </tr>
              <tr>
                <td>Emergencias</td>
                <td>112</td>
              </tr>
              <tr>
                <td>Policía Nacional</td>
                <td>091</td>
              </tr>
              <tr>
                <td>Guardia Civil</td>
                <td>062</td>
              </tr>
              <tr>
                <td>Teléfono del Menor (ANAR)</td>
                <td>900 20 20 10</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="footer">
          <p>
            Documento generado automáticamente por Custodia360<br>
            Sistema de Gestión LOPIVI - www.custodia360.com<br>
            © ${new Date().getFullYear()} Todos los derechos reservados
          </p>
        </div>
      </body>
    </html>
  `,

  // Certificado LOPIVI
  certificadoLOPIVI: (data: PDFData) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .certificate {
            background: white;
            width: 90%;
            max-width: 800px;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
            border: 3px solid gold;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 2px solid gold;
            border-radius: 15px;
            pointer-events: none;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .logo {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
          }
          .title {
            font-size: 36px;
            color: #333;
            margin: 20px 0;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 30px;
          }
          .content {
            text-align: center;
            margin: 40px 0;
          }
          .recipient {
            font-size: 24px;
            color: #333;
            margin: 20px 0;
            font-weight: bold;
          }
          .description {
            font-size: 16px;
            line-height: 1.8;
            color: #555;
            margin: 30px 0;
          }
          .signatures {
            display: flex;
            justify-content: space-around;
            margin-top: 60px;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            border-bottom: 2px solid #333;
            width: 200px;
            margin: 40px auto 10px;
          }
          .signature-name {
            font-size: 14px;
            color: #666;
          }
          .signature-title {
            font-size: 12px;
            color: #999;
          }
          .seal {
            position: absolute;
            bottom: 60px;
            right: 60px;
            width: 120px;
            height: 120px;
            border: 3px solid gold;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: gold;
            font-size: 14px;
            text-align: center;
            background: rgba(255, 215, 0, 0.1);
          }
          .date {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 14px;
          }
          .verification {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 10px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">CUSTODIA360</div>
            <div class="title">Certificado LOPIVI</div>
            <div class="subtitle">Ley Orgánica 8/2021 de Protección Integral a la Infancia</div>
          </div>

          <div class="content">
            <p class="description">Por la presente se certifica que</p>
            <p class="recipient">${data.nombre || 'NOMBRE DEL DELEGADO'}</p>
            <p class="description">
              ha completado satisfactoriamente la formación como<br>
              <strong>DELEGADO DE PROTECCIÓN DEL MENOR</strong><br>
              de acuerdo con los requisitos establecidos en la LOPIVI<br>
              para la entidad
            </p>
            <p class="recipient">${data.entidad || 'NOMBRE DE LA ENTIDAD'}</p>
          </div>

          <div class="signatures">
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-name">Director General</div>
              <div class="signature-title">Custodia360</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-name">Responsable de Formación</div>
              <div class="signature-title">Departamento LOPIVI</div>
            </div>
          </div>

          <div class="date">
            Expedido en España, ${new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div class="seal">
            CERTIFICADO<br>
            OFICIAL<br>
            LOPIVI<br>
            ${new Date().getFullYear()}
          </div>

          <div class="verification">
            Código de verificación: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>
      </body>
    </html>
  `,

  // Factura Kit de Comunicación
  facturaKitComunicacion: (data: {
    entidad: string
    cif: string
    numeroFactura: string
    fecha: string
    subtotal: number
    iva: number
    total: number
    direccion?: string
    emailAdmin?: string
  }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 40px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
          }
          .company-info {
            text-align: right;
            font-size: 12px;
            color: #666;
          }
          .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .invoice-number {
            font-size: 16px;
            color: #667eea;
            font-weight: bold;
          }
          .invoice-date {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          .billing-section {
            display: flex;
            justify-content: space-between;
            margin: 40px 0;
          }
          .billing-box {
            width: 45%;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          .billing-title {
            font-size: 14px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          .billing-info {
            font-size: 13px;
            line-height: 1.8;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 40px 0;
          }
          .items-table th {
            background: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 14px;
          }
          .items-table td {
            padding: 15px 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
          }
          .item-description {
            color: #666;
            font-size: 12px;
            margin-top: 5px;
          }
          .totals-section {
            margin-left: auto;
            width: 400px;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
          }
          .total-row.subtotal {
            border-bottom: 1px solid #e0e0e0;
          }
          .total-row.grand-total {
            font-size: 18px;
            font-weight: bold;
            background: #f8f9fa;
            padding: 15px;
            margin-top: 10px;
            border-radius: 8px;
          }
          .total-row.grand-total .label {
            color: #667eea;
          }
          .payment-info {
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 15px;
            margin: 40px 0;
            border-radius: 4px;
          }
          .payment-info h4 {
            margin: 0 0 10px 0;
            color: #2e7d32;
            font-size: 14px;
          }
          .payment-info p {
            margin: 5px 0;
            font-size: 13px;
            color: #1b5e20;
          }
          .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 11px;
            color: #999;
          }
          .footer-links {
            margin-top: 10px;
          }
          .footer-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
          }
          .stamp {
            position: absolute;
            top: 150px;
            right: 80px;
            transform: rotate(-15deg);
            border: 4px solid #4caf50;
            color: #4caf50;
            padding: 10px 20px;
            font-size: 24px;
            font-weight: bold;
            border-radius: 8px;
            opacity: 0.3;
          }
        </style>
      </head>
      <body>
        <div class="stamp">PAGADO</div>

        <div class="header">
          <div>
            <div class="logo">CUSTODIA360</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
              Sistema de Gestión LOPIVI
            </div>
          </div>
          <div class="company-info">
            <strong>Custodia360 S.L.</strong><br>
            CIF: B12345678<br>
            C/ Ejemplo, 123<br>
            28001 Madrid, España<br>
            info@custodia360.es<br>
            Tel: 678 771 198
          </div>
        </div>

        <div>
          <div class="invoice-title">FACTURA</div>
          <div class="invoice-number">${data.numeroFactura}</div>
          <div class="invoice-date">Fecha de emisión: ${data.fecha}</div>
        </div>

        <div class="billing-section">
          <div class="billing-box">
            <div class="billing-title">Cliente</div>
            <div class="billing-info">
              <strong>${data.entidad}</strong><br>
              ${data.cif ? `CIF/NIF: ${data.cif}<br>` : ''}
              ${data.direccion ? `${data.direccion}<br>` : ''}
              ${data.emailAdmin ? `Email: ${data.emailAdmin}` : ''}
            </div>
          </div>
          <div class="billing-box">
            <div class="billing-title">Condiciones de pago</div>
            <div class="billing-info">
              <strong>Método:</strong> Tarjeta de crédito/débito<br>
              <strong>Estado:</strong> <span style="color: #4caf50; font-weight: bold;">PAGADO</span><br>
              <strong>Fecha de pago:</strong> ${data.fecha}
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 60%;">Descripción</th>
              <th style="width: 15%; text-align: center;">Cantidad</th>
              <th style="width: 25%; text-align: right;">Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Kit de Comunicación LOPIVI</strong>
                <div class="item-description">
                  Incluye: Cartas personalizables, pósters informativos, dípticos,
                  plantillas editables, material multiidioma y guía de comunicación familiar.
                  Acceso permanente a todos los materiales desde el panel del delegado.
                </div>
              </td>
              <td style="text-align: center;">1</td>
              <td style="text-align: right;">${data.subtotal.toFixed(2)}€</td>
            </tr>
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row subtotal">
            <span class="label">Subtotal:</span>
            <span class="value">${data.subtotal.toFixed(2)}€</span>
          </div>
          <div class="total-row">
            <span class="label">IVA (21%):</span>
            <span class="value">${data.iva.toFixed(2)}€</span>
          </div>
          <div class="total-row grand-total">
            <span class="label">TOTAL:</span>
            <span class="value">${data.total.toFixed(2)}€</span>
          </div>
        </div>

        <div class="payment-info">
          <h4>✓ Pago confirmado</h4>
          <p>Esta factura ha sido pagada en su totalidad mediante tarjeta de crédito/débito.</p>
          <p>El Kit de Comunicación LOPIVI está disponible de forma inmediata en su panel de delegado.</p>
        </div>

        <div style="margin-top: 40px; padding: 20px; background: #f0f4ff; border-radius: 8px;">
          <h4 style="margin: 0 0 10px 0; color: #667eea;">Información del producto</h4>
          <p style="margin: 5px 0; font-size: 13px;">
            <strong>Kit de Comunicación LOPIVI</strong> es un conjunto completo de materiales profesionales
            diseñados específicamente para facilitar la comunicación entre su entidad y las familias,
            garantizando el cumplimiento de las obligaciones de información establecidas en la LOPIVI.
          </p>
          <p style="margin: 5px 0; font-size: 13px;">
            <strong>Licencia:</strong> Pago único. Uso ilimitado y permanente para ${data.entidad}.
          </p>
        </div>

        <div class="footer">
          <p>
            <strong>Custodia360 S.L.</strong> | CIF: B12345678 | Registro Mercantil de Madrid, Tomo XXX, Folio YY, Hoja M-ZZZZZ<br>
            Inscrita en el Registro de Actividades de Tratamiento de Datos Personales
          </p>
          <div class="footer-links">
            <a href="https://custodia360.es">custodia360.es</a> |
            <a href="mailto:info@custodia360.es">info@custodia360.es</a> |
            <a href="tel:+34678771198">678 771 198</a>
          </div>
          <p style="margin-top: 20px; font-size: 10px;">
            Este documento es una factura simplificada conforme al Real Decreto 1619/2012.<br>
            Conserve este documento para su archivo contable y fiscal.
          </p>
        </div>
      </body>
    </html>
  `
}
