'use client'

import { useState } from 'react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy el asistente de Custodia360. ¿En qué puedo ayudarte con la implementación de LOPIVI?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Preguntas sugeridas
  const suggestedQuestions = [
    "¿Qué es LOPIVI?",
    "¿Cuánto cuesta implementarla?",
    "¿Cuánto tiempo tarda?",
    "¿Qué sanciones hay?",
    "¿Necesito un delegado?",
    "¿Tengo que formarme?"
  ]

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const getAutomaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Respuestas LOPIVI básicas
    if (message.includes('lopivi') || message.includes('qué es') || message.includes('que es')) {
      return "🏛️ LOPIVI es la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia. **Es OBLIGATORIA** para todas las entidades que trabajan con menores desde junio 2021.\n\n¿Quieres saber cómo implementarla en tu entidad?"
    }

    // Implementación y proceso
    if (message.includes('implementa') || message.includes('cómo') || message.includes('proceso') || message.includes('como')) {
      return "⚡ **Implementamos LOPIVI en 72 horas** con nuestro sistema automatizado:\n\n1️⃣ Designamos delegado certificado\n2️⃣ Creamos plan de protección personalizado  \n3️⃣ Formamos a tu personal\n4️⃣ Dashboard operativo 24/7\n\n¿Te interesa conocer nuestros planes?"
    }

    // Precios y planes
    if (message.includes('plan') || message.includes('precio') || message.includes('coste') || message.includes('cuánto') || message.includes('cuanto') || message.includes('euro')) {
      return "💰 **Planes según número de menores:**\n\n🏃 Plan 50: **19€/mes** (1-50 menores)\n🏃‍♂️ Plan 200: **49€/mes** (51-200 menores)  \n🏃‍♀️ Plan 500: **105€/mes** (201-500 menores)\n🚀 Plan 500+: **250€/mes** (+501 menores)\n\n✅ **Todo incluido:** Delegado + Formación + Dashboard\n\n¿Cuántos menores tiene tu entidad?"
    }

    // Delegado y formación
    if (message.includes('delegado') || message.includes('formación') || message.includes('formacion') || message.includes('certificado')) {
      return "👨‍💼 **Delegado de Protección OBLIGATORIO** según LOPIVI:\n\n✅ Formación especializada 6h 30min\n✅ Certificación oficial acreditada\n✅ Disponible 24/7 para emergencias\n✅ Dashboard de gestión incluido\n✅ Delegado suplente opcional (+10€)\n\n¿Necesitas más información sobre la certificación?"
    }

    // Tiempo de implementación
    if (message.includes('tiempo') || message.includes('cuándo') || message.includes('cuando') || message.includes('72') || message.includes('rápido')) {
      return "⏰ **Timeline de implementación:**\n\n📅 **Día 1:** Configuración automática\n📚 **Días 1-3:** Formación del delegado  \n🎓 **Día 3:** Certificación y acceso\n🚀 **Día 3:** ¡Sistema 100% operativo!\n\n**¡Somos el sistema más rápido de España!** ¿Tienes urgencia?"
    }

    // Sanciones y multas
    if (message.includes('sanción') || message.includes('sancion') || message.includes('multa') || message.includes('inspección') || message.includes('inspeccion')) {
      return "⚠️ **Sanciones LOPIVI muy graves:**\n\n💸 **10.000€ a 1.000.000€** + cierre entidad\n📊 **2021-2025:** 2.847 inspecciones\n💰 **Total multas:** 3.2M€ en sanciones\n\n🛡️ **Custodia360 te protege** de todo esto por solo 19€/mes\n\n¿Quieres protegerte ahora?"
    }

    // Contacto
    if (message.includes('contacto') || message.includes('teléfono') || message.includes('telefono') || message.includes('llamar') || message.includes('email')) {
      return "📞 **Contacta con nosotros:**\n\n📱 **Teléfono:** 678 771 198\n📧 **Email:** info@custodia360.es\n⏰ **Horario:** L-V 9:00-18:00\n\n🚀 **Contratación inmediata** desde la web\n\n¿Prefieres que te llamemos?"
    }

    // Urgencias
    if (message.includes('urgente') || message.includes('ya') || message.includes('inmediato') || message.includes('ahora')) {
      return "🚨 **¡Entendemos la urgencia!**\n\n⚡ Implementación en **72 horas**\n🎯 Contratación **inmediata** online\n📞 Soporte directo al **678 771 198**\n\n**¡Empezamos HOY MISMO!**\n\n¿Necesitas ayuda para elegir tu plan?"
    }

    // Obligatorio
    if (message.includes('obligatorio') || message.includes('ley') || message.includes('legal') || message.includes('debo')) {
      return "⚖️ **SÍ, LOPIVI es OBLIGATORIA:**\n\n📜 Desde **junio 2021** para TODAS las entidades\n👶 Que trabajen con **menores de edad**\n⚠️ **Sin excepciones:** Clubes, escuelas, campamentos...\n\n❌ **NO cumplir = Multas hasta 1M€**\n✅ **Cumplir con Custodia360 = 19€/mes**\n\n¿Tu entidad ya cumple LOPIVI?"
    }

    // ¿Qué incluye?
    if (message.includes('incluye') || message.includes('servicio') || message.includes('obtengo') || message.includes('tengo')) {
      return "📦 **TODO lo que incluye Custodia360:**\n\n👨‍💼 Delegado de protección certificado\n📋 Plan de protección personalizado\n🎓 Formación completa del personal\n📊 Dashboard de gestión 24/7\n🚨 Protocolo de emergencias\n📞 Soporte técnico continuo\n🔄 Actualizaciones automáticas\n\n**¡Todo por el precio de un café al día!**"
    }

    // Respuesta por defecto con sugerencias
    return "🤖 **¡Hola!** Estoy aquí para ayudarte con LOPIVI.\n\n**Puedes preguntarme sobre:**\n• ¿Qué es LOPIVI?\n• ¿Cuánto cuesta?\n• ¿Cuánto tiempo tarda?\n• ¿Qué sanciones hay?\n• ¿Cómo funciona?\n\n¡También puedes **contratar directamente** desde la web!"
  }

  const sendMessage = (messageText?: string) => {
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

      // Respuesta automática después de un breve delay
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: getAutomaticResponse(textToSend),
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
                <p className="text-xs text-blue-100">Asistente LOPIVI IA</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>

          {/* Área de mensajes */}
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
            {showSuggestions && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
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
                    Ocultar preguntas
                  </button>
                )}
              </div>
            )}

            {/* Botón para mostrar preguntas si están ocultas */}
            {!showSuggestions && messages.length > 1 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowSuggestions(true)}
                  className="bg-blue-800 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-900 transition-colors"
                >
                  Ver preguntas frecuentes
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
                placeholder="Pregunta sobre LOPIVI..."
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
        </div>
      )}
    </>
  )
}
