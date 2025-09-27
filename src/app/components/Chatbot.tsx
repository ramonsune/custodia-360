'use client'

import { useState } from 'react'

type Language = 'es' | 'ca' | 'eu' | 'gl'

interface LanguageOption {
  code: Language
  name: string
  flag: string
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const languages: LanguageOption[] = [
    { code: 'es', name: 'Español', flag: '' },
    { code: 'ca', name: 'Català', flag: '' },
    { code: 'eu', name: 'Euskera', flag: '' },
    { code: 'gl', name: 'Galego', flag: '' }
  ]

  // Mensajes de bienvenida por idioma
  const welcomeMessages = {
    es: "Hola! Soy el asistente de Custodia360. ¿En qué puedo ayudarte con la implementación de LOPIVI?",
    ca: "Hola! Sóc l'assistent de Custodia360. En què et puc ajudar amb la implementació de LOPIVI?",
    eu: "Kaixo! Custodia360-ren laguntzailea naiz. Zertan lagun zaitzaket LOPIVI-ren ezarpenean?",
    gl: "Ola! Son o asistente de Custodia360. En que che podo axudar coa implementación de LOPIVI?"
  }

  // Preguntas sugeridas por idioma
  const suggestedQuestions = {
    es: [
      "¿Qué es LOPIVI?",
      "¿Cuánto cuesta implementarla?",
      "¿Cuánto tiempo tarda?",
      "¿Qué sanciones hay?",
      "¿Necesito un/a delegado/a?",
      "¿Tengo que formarme?"
    ],
    ca: [
      "Què és LOPIVI?",
      "Quant costa implementar-la?",
      "Quant temps triga?",
      "Quines sancions hi ha?",
      "Necessito un delegat?",
      "M'he de formar?"
    ],
    eu: [
      "Zer da LOPIVI?",
      "Zenbat balio du ezartzeak?",
      "Zenbat denbora behar da?",
      "Zer zigorra dago?",
      "Ordezkari bat behar dut?",
      "Prestatu behar naiz?"
    ],
    gl: [
      "Que é LOPIVI?",
      "Canto custa implementala?",
      "Canto tempo tarda?",
      "Que sancións hai?",
      "Necesito un/a delegado/a?",
      "Teño que formarme?"
    ]
  }

  const selectLanguage = (lang: Language) => {
    setSelectedLanguage(lang)
    setMessages([{
      id: 1,
      text: welcomeMessages[lang],
      sender: 'bot',
      timestamp: new Date()
    }])
    setShowSuggestions(true)
    setIsLanguageDropdownOpen(false)
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const getAutomaticResponse = (userMessage: string, language: Language): string => {
    const message = userMessage.toLowerCase()

    const responses = {
      es: {
        lopivi: "LOPIVI es la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia. Es OBLIGATORIA para todas las entidades que trabajan con menores desde junio 2021.\n\n¿Quieres saber cómo implementarla en tu entidad?",
        implementacion: "Implementamos LOPIVI en 72 horas con nuestro sistema automatizado:\n\n1. Designamos delegado/a certificado/a\n2. Creamos plan de protección personalizado\n3. Formamos a tu personal\n4. Dashboard operativo 24/7\n\n¿Te interesa conocer nuestros planes?",
        precios: "Planes según número de menores:\n\nPlan 50: 19€/mes (1-50 menores)\nPlan 200: 49€/mes (51-200 menores)\nPlan 500: 105€/mes (201-500 menores)\nPlan 500+: 250€/mes (+501 menores)\n\nTodo incluido: Delegado/a + Formación + Dashboard\n\n¿Cuántos menores tiene tu entidad?",
        delegado: "Delegado/a de Protección OBLIGATORIO según LOPIVI:\n\nFormación especializada 6h 30min\nCertificación oficial acreditada\nDisponible 24/7 para emergencias\nDashboard de gestión incluido\nDelegado/a suplente opcional (+10€)\n\n¿Necesitas más información sobre la certificación?",
        tiempo: "Timeline de implementación:\n\nDía 1: Configuración automática\nDías 1-3: Formación del/la delegado/a\nDía 3: Certificación y acceso\nDía 3: Sistema 100% operativo\n\nSomos el sistema más rápido de España. ¿Tienes urgencia?",
        sanciones: "Sanciones LOPIVI muy graves:\n\n10.000€ a 1.000.000€ + cierre entidad\n2021-2025: 2.847 inspecciones\nTotal multas: 3.2M€ en sanciones\n\nCustodia360 te protege de todo esto por solo 19€/mes\n\n¿Quieres protegerte ahora?",
        contacto: "Contacta con nosotros:\n\nTeléfono: 678 771 198\nEmail: info@custodia360.es\nHorario: L-V 9:00-18:00\n\nContratación inmediata desde la web\n\n¿Prefieres que te llamemos?",
        urgente: "Entendemos la urgencia!\n\nImplementación en 72 horas\nContratación inmediata online\nSoporte directo al 678 771 198\n\nEmpezamos HOY MISMO!\n\n¿Necesitas ayuda para elegir tu plan?",
        obligatorio: "SÍ, LOPIVI es OBLIGATORIA:\n\nDesde junio 2021 para TODAS las entidades\nQue trabajen con menores de edad\nSin excepciones: Clubes, escuelas, campamentos...\n\nNO cumplir = Multas hasta 1M€\nCumplir con Custodia360 = 19€/mes\n\n¿Tu entidad ya cumple LOPIVI?",
        incluye: "TODO lo que incluye Custodia360:\n\nDelegado/a de protección certificado/a\nPlan de protección personalizado\nFormación completa del personal\nDashboard de gestión 24/7\nProtocolo de emergencias\nSoporte técnico continuo\nActualizaciones automáticas\n\nTodo por el precio de un café al día!",
        default: "Estoy aquí para ayudarte con LOPIVI.\n\nPuedes preguntarme sobre:\n• ¿Qué es LOPIVI?\n• ¿Cuánto cuesta?\n• ¿Cuánto tiempo tarda?\n• ¿Qué sanciones hay?\n• ¿Cómo funciona?\n\nTambién puedes contratar directamente desde la web!"
      },
      ca: {
        lopivi: "LOPIVI és la Llei Orgànica de Protecció Integral a la Infància i l'Adolescència enfront de la Violència. És OBLIGATÒRIA per a totes les entitats que treballen amb menors des de juny 2021.\n\nVols saber com implementar-la a la teva entitat?",
        implementacio: "Implementem LOPIVI en 72 hores amb el nostre sistema automatitzat:\n\n1. Designem delegat certificat\n2. Creem pla de protecció personalitzat\n3. Formem el teu personal\n4. Dashboard operatiu 24/7\n\nT'interessa conèixer els nostres plans?",
        precios: "Plans segons nombre de menors:\n\nPla 50: 19€/mes (1-50 menors)\nPla 200: 49€/mes (51-200 menors)\nPla 500: 105€/mes (201-500 menors)\nPla 500+: 250€/mes (+501 menors)\n\nTot inclòs: Delegat + Formació + Dashboard\n\nQuants menors té la teva entitat?",
        delegado: "Delegat de Protecció OBLIGATORI segons LOPIVI:\n\nFormació especialitzada 6h 30min\nCertificació oficial acreditada\nDisponible 24/7 per emergències\nDashboard de gestió inclòs\nDelegat suplent opcional (+10€)\n\nNecessites més informació sobre la certificació?",
        tiempo: "Cronologia d'implementació:\n\nDia 1: Configuració automàtica\nDies 1-3: Formació del delegat\nDia 3: Certificació i accés\nDia 3: Sistema 100% operatiu\n\nSom el sistema més ràpid d'Espanya. Tens urgència?",
        sanciones: "Sancions LOPIVI molt greus:\n\n10.000€ a 1.000.000€ + tancament entitat\n2021-2025: 2.847 inspeccions\nTotal multes: 3.2M€ en sancions\n\nCustodia360 et protegeix de tot això per només 19€/mes\n\nVols protegir-te ara?",
        contacto: "Contacta amb nosaltres:\n\nTelèfon: 678 771 198\nEmail: info@custodia360.es\nHorari: Dl-Dv 9:00-18:00\n\nContractació immediata des del web\n\nPrefereixes que et truquem?",
        urgente: "Entenem la urgència!\n\nImplementació en 72 hores\nContractació immediata online\nSuport directe al 678 771 198\n\nComencem AVUI MATEIX!\n\nNecessites ajuda per triar el teu pla?",
        obligatorio: "SÍ, LOPIVI és OBLIGATÒRIA:\n\nDes de juny 2021 per a TOTES les entitats\nQue treballin amb menors d'edat\nSense excepcions: Clubs, escoles, campaments...\n\nNO complir = Multes fins 1M€\nComplir amb Custodia360 = 19€/mes\n\nLa teva entitat ja compleix LOPIVI?",
        incluye: "TOT el que inclou Custodia360:\n\nDelegat de protecció certificat\nPla de protecció personalitzat\nFormació completa del personal\nDashboard de gestió 24/7\nProtocol d'emergències\nSuport tècnic continu\nActualitzacions automàtiques\n\nTot pel preu d'un cafè al dia!",
        default: "Estic aquí per ajudar-te amb LOPIVI.\n\nPots preguntar-me sobre:\n• Què és LOPIVI?\n• Quant costa?\n• Quant temps triga?\n• Quines sancions hi ha?\n• Com funciona?\n\nTambé pots contractar directament des del web!"
      },
      eu: {
        lopivi: "LOPIVI Haurren eta Nerabeen Babesaren Lege Organikoa da Indarkeriaren aurka. NAHITAEZKOA da adingabeek lan egiten duten entitate guztientzat 2021eko ekainatik.\n\nZure erakundean nola ezarri nahi duzu jakin?",
        implementacion: "LOPIVI 72 ordutan ezartzen dugu gure sistema automatizatuarekin:\n\n1. Ziurtatutako ordezkaria izendatzen dugu\n2. Babes plan pertsonalizatua sortzen dugu\n3. Zure langileei prestakuntza ematen diegu\n4. Dashboard operatiboa 24/7\n\nGure planak ezagutu nahi dituzu?",
        precios: "Adingabeen kopuruaren arabera planak:\n\n50 Plana: 19€/hilabetean (1-50 adingabe)\n200 Plana: 49€/hilabetean (51-200 adingabe)\n500 Plana: 105€/hilabetean (201-500 adingabe)\n500+ Plana: 250€/hilabetean (+501 adingabe)\n\nDena barne: Ordezkaria + Prestakuntza + Dashboard\n\nZenbat adingabe ditu zure erakundeak?",
        delegado: "Babes Ordezkaria NAHITAEZKOA LOPIVI arabera:\n\nEspezializatutako prestakuntza 6o 30min\nZiurtagiri ofiziala\nLarrialdietarako eskuragarri 24/7\nKudeaketa dashboard barne\nOrdezkari ordezkoa aukerakoa (+10€)\n\nZiurtagiriaren gaineko informazio gehiago behar duzu?",
        tiempo: "Ezarpenaren kronologia:\n\n1. eguna: Konfigurazio automatikoa\n1-3 egunak: Ordezkarien prestakuntza\n3. eguna: Ziurtagiria eta sarbidea\n3. eguna: Sistema 100% operatiboa\n\nEspainiko sistema azkarrena gara. Presarik baduzu?",
        sanciones: "LOPIVI zigor oso larriak:\n\n10.000€-tik 1.000.000€-ra + erakundearen itxiera\n2021-2025: 2.847 ikuskapen\nZigor guztira: 3.2M€ zigorretan\n\nCustodia360-k babestuko zaitu horretatik 19€/hilabetean\n\nOrain babestu nahi duzu?",
        contacto: "Gurekin harremanetan jarri:\n\nTelefonoa: 678 771 198\nEmaila: info@custodia360.es\nOrdutegia: Al-Or 9:00-18:00\n\nBerehala kontratatzea webtik\n\nNahiago duzu deitzea?",
        urgente: "Premia ulertzen dugu!\n\nEzarpena 72 ordutan\nBerehala kontratatzea online\nZuzeneko laguntza 678 771 198\n\nGAUR BERTAN hasten gara!\n\nZure plana aukeratzen laguntzarik behar duzu?",
        obligatorio: "BAI, LOPIVI NAHITAEZKOA da:\n\n2021eko ekainatik erakunde GUZTIENTZAT\nAdingabeekin lan egiten dutenak\nSalbuespenik gabe: Klubak, eskolak, kanpamentuak...\n\nEZ betetzea = 1M€-ko isunak\nCustodia360-rekin betetzea = 19€/hilabetean\n\nZure erakundeak jadanik betetzen du LOPIVI?",
        incluye: "Custodia360-k barne hartzen duen GUZTIA:\n\nBabes ordezkari ziurtatua\nBabes plan pertsonalizatua\nLangileentzako prestakuntza osoa\nKudeaketa dashboard 24/7\nLarrialdi protokoloa\nEtengabeko laguntza teknikoa\nEguneraketa automatikoak\n\nDena eguneko kafe baten prezioan!",
        default: "Hemen nago LOPIVI-rekin laguntzeko.\n\nGaldetu diezadakezu:\n• Zer da LOPIVI?\n• Zenbat balio du?\n• Zenbat denbora behar da?\n• Zer zigor dago?\n• Nola funtzionatzen du?\n\nBaita webtik zuzenean kontratatu ere!"
      },
      gl: {
        lopivi: "LOPIVI é a Lei Orgánica de Protección Integral á Infancia e a Adolescencia fronte á Violencia. É OBRIGATORIA para todas as entidades que traballan con menores desde xuño 2021.\n\nQueres saber como implementala na túa entidade?",
        implementacion: "Implementamos LOPIVI en 72 horas co noso sistema automatizado:\n\n1. Designamos delegado/a certificado/a\n2. Creamos plan de protección personalizado\n3. Formamos ao teu persoal\n4. Dashboard operativo 24/7\n\nInterésanche coñecer os nosos plans?",
        precios: "Plans segundo número de menores:\n\nPlan 50: 19€/mes (1-50 menores)\nPlan 200: 49€/mes (51-200 menores)\nPlan 500: 105€/mes (201-500 menores)\nPlan 500+: 250€/mes (+501 menores)\n\nTodo incluído: Delegado + Formación + Dashboard\n\nCantos menores ten a túa entidade?",
        delegado: "Delegado de Protección OBRIGATORIO segundo LOPIVI:\n\nFormación especializada 6h 30min\nCertificación oficial acreditada\nDispoñible 24/7 para emerxencias\nDashboard de xestión incluído\nDelegado/a suplente opcional (+10€)\n\nNecesitas máis información sobre a certificación?",
        tiempo: "Cronoloxía de implementación:\n\nDía 1: Configuración automática\nDías 1-3: Formación do delegado\nDía 3: Certificación e acceso\nDía 3: Sistema 100% operativo\n\nSomos o sistema máis rápido de España. Tes urxencia?",
        sanciones: "Sancións LOPIVI moi graves:\n\n10.000€ a 1.000.000€ + peche entidade\n2021-2025: 2.847 inspeccións\nTotal multas: 3.2M€ en sancións\n\nCustodia360 protéxete de todo isto por só 19€/mes\n\nQueres protexerte agora?",
        contacto: "Contacta connosco:\n\nTeléfono: 678 771 198\nEmail: info@custodia360.es\nHorario: L-V 9:00-18:00\n\nContratación inmediata desde a web\n\nPrefires que che chamemos?",
        urgente: "Entendemos a urxencia!\n\nImplementación en 72 horas\nContratación inmediata online\nSoporte directo ao 678 771 198\n\nEmpezamos HOI MESMO!\n\nNecesitas axuda para escoller o teu plan?",
        obligatorio: "SI, LOPIVI é OBRIGATORIA:\n\nDesde xuño 2021 para TODAS as entidades\nQue traballen con menores de idade\nSen excepcións: Clubs, escolas, campamentos...\n\nNON cumprir = Multas ata 1M€\nCumprir con Custodia360 = 19€/mes\n\nA túa entidade xa cumpre LOPIVI?",
        incluye: "TODO o que inclúe Custodia360:\n\nDelegado/a de protección certificado/a\nPlan de protección personalizado\nFormación completa do persoal\nDashboard de xestión 24/7\nProtocolo de emerxencias\nSoporte técnico continuo\nActualizacións automáticas\n\nTodo polo prezo dun café ao día!",
        default: "Estou aquí para axudarche con LOPIVI.\n\nPodes preguntarme sobre:\n• Que é LOPIVI?\n• Canto custa?\n• Canto tempo tarda?\n• Que sancións hai?\n• Como funciona?\n\nTamén podes contratar directamente desde a web!"
      }
    }

    // Lógica para detectar la intención de la pregunta
    if (message.includes('lopivi') || message.includes('qué es') || message.includes('que es') ||
        message.includes('què és') || message.includes('zer da') || message.includes('que é')) {
      return responses[language].lopivi
    }

    if (message.includes('implementa') || message.includes('cómo') || message.includes('proceso') ||
        message.includes('como') || message.includes('ezarri') || message.includes('implementar')) {
      return responses[language].implementacion
    }

    if (message.includes('plan') || message.includes('precio') || message.includes('coste') ||
        message.includes('cuánto') || message.includes('cuanto') || message.includes('euro') ||
        message.includes('costa') || message.includes('balio') || message.includes('custa')) {
      return responses[language].precios
    }

    if (message.includes('delegado') || message.includes('formación') || message.includes('formacion') ||
        message.includes('certificado') || message.includes('delegat') || message.includes('ordezkari')) {
      return responses[language].delegado
    }

    if (message.includes('tiempo') || message.includes('cuándo') || message.includes('cuando') ||
        message.includes('72') || message.includes('rápido') || message.includes('temps') ||
        message.includes('denbora') || message.includes('tempo')) {
      return responses[language].tiempo
    }

    if (message.includes('sanción') || message.includes('sancion') || message.includes('multa') ||
        message.includes('inspección') || message.includes('inspeccion') || message.includes('zigor')) {
      return responses[language].sanciones
    }

    if (message.includes('contacto') || message.includes('teléfono') || message.includes('telefono') ||
        message.includes('llamar') || message.includes('email') || message.includes('telefon') ||
        message.includes('harremanetan')) {
      return responses[language].contacto
    }

    if (message.includes('urgente') || message.includes('ya') || message.includes('inmediato') ||
        message.includes('ahora') || message.includes('presa') || message.includes('urxencia')) {
      return responses[language].urgente
    }

    if (message.includes('obligatorio') || message.includes('ley') || message.includes('legal') ||
        message.includes('debo') || message.includes('nahitaez') || message.includes('obrigatorio')) {
      return responses[language].obligatorio
    }

    if (message.includes('incluye') || message.includes('servicio') || message.includes('obtengo') ||
        message.includes('tengo') || message.includes('inclou') || message.includes('barne') ||
        message.includes('inclúe')) {
      return responses[language].incluye
    }

    return responses[language].default
  }

  const sendMessage = (messageText?: string) => {
    if (!selectedLanguage) return

    const textToSend = messageText || inputMessage.trim()

    if (textToSend) {
      const newMessage = {
        id: messages.length + 1,
        text: textToSend,
        sender: 'user',
        timestamp: new Date()
      }

      setMessages([...messages, newMessage])
      setInputMessage('')
      setShowSuggestions(false)

      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: getAutomaticResponse(textToSend, selectedLanguage),
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botResponse])
      }, 800)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <>
      {/* Botón flotante para abrir/cerrar chat */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-800 text-white shadow-lg hover:bg-blue-900 transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header del chat */}
          <div className="bg-blue-800 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-800 font-bold text-sm">C</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Custodia360</h3>
                <p className="text-xs text-blue-100">Asistente LOPIVI</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>

          {/* Selector de idioma compacto con dropdown */}
          {!selectedLanguage && (
            <div className="flex-1 p-4 flex flex-col justify-center items-center">
              <h3 className="text-base font-semibold text-gray-700 mb-3 text-center">
                Selecciona idioma
              </h3>
              <div className="relative w-48">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-colors"
                >
                  <span className="text-gray-600 text-sm">🌐 Seleccionar idioma</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.code)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 text-sm"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-gray-700 font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Área de mensajes */}
          {selectedLanguage && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                        message.sender === 'user'
                          ? 'bg-blue-800 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {/* Preguntas sugeridas */}
                {showSuggestions && selectedLanguage && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">
                      {selectedLanguage === 'es' && 'Preguntas frecuentes:'}
                      {selectedLanguage === 'ca' && 'Preguntes freqüents:'}
                      {selectedLanguage === 'eu' && 'Galdera arrunt:'}
                      {selectedLanguage === 'gl' && 'Preguntas frecuentes:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions[selectedLanguage].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                    {messages.length > 1 && (
                      <button
                        onClick={() => setShowSuggestions(false)}
                        className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        {selectedLanguage === 'es' && 'Ocultar preguntas'}
                        {selectedLanguage === 'ca' && 'Amagar preguntes'}
                        {selectedLanguage === 'eu' && 'Galderak ezkutatu'}
                        {selectedLanguage === 'gl' && 'Agochar preguntas'}
                      </button>
                    )}
                  </div>
                )}

                {/* Botón para mostrar preguntas si están ocultas */}
                {!showSuggestions && messages.length > 1 && selectedLanguage && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowSuggestions(true)}
                      className="bg-blue-800 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-900 transition-colors"
                    >
                      {selectedLanguage === 'es' && 'Ver preguntas frecuentes'}
                      {selectedLanguage === 'ca' && 'Veure preguntes freqüents'}
                      {selectedLanguage === 'eu' && 'Galdera arruntak ikusi'}
                      {selectedLanguage === 'gl' && 'Ver preguntas frecuentes'}
                    </button>
                  </div>
                )}
              </div>

              {/* Input para escribir mensajes */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      selectedLanguage === 'es' ? 'Pregunta sobre LOPIVI...' :
                      selectedLanguage === 'ca' ? 'Pregunta sobre LOPIVI...' :
                      selectedLanguage === 'eu' ? 'LOPIVI-ri buruz galdetu...' :
                      'Pregunta sobre LOPIVI...'
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm"
                  />
                  <button
                    onClick={() => sendMessage()}
                    className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
