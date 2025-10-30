# Sistema de Onboarding Actualizado

## ✅ LO QUE SE HA COMPLETADO

### 1. Migración SQL
- **Archivo**: `supabase/migrations/20250111_onboarding_update.sql`
- **Contenido**:
  - 10 preguntas universales (sector_id = NULL)
  - 6 preguntas por cada sector (ludoteca, club_futbol, centro_educativo, ong)
  - Campo `es_universal` para diferenciar tipos

### 2. API Endpoints

#### GET `/api/public/onboarding/test?token=...`
- Devuelve test mixto: 6 universales + 4 del sector
- Baraja orden de preguntas y opciones
- Incluye campo `shuffle` por pregunta para corrección backend
- **Respuesta**:
```json
{
  "ok": true,
  "questions": [
    {
      "id": 123,
      "text": "Pregunta...",
      "options": [
        { "key": "C", "text": "Opción C (mostrada como A)" },
        { "key": "A", "text": "Opción A (mostrada como B)" }
      ],
      "shuffle": ["C", "A", "B", "D"]
    }
  ],
  "total": 10,
  "entity_id": "...",
  "sector": "...",
  "deadline_at": "..."
}
```

#### POST `/api/public/onboarding/submit`
- Recibe respuestas del formulario
- Valida test usando sistema de shuffle
- Calcula estados (ok/pendiente/vencido) según perfil
- Guarda en `onboarding_responses`, `people`, `background_checks`
- **Body**:
```json
{
  "token": "...",
  "perfil": "personal_contacto|personal_sin_contacto|familia",
  "nombre": "...",
  "email": "...",
  "telefono": "...",
  "penales_entregado": true,
  "test": {
    "answers": [
      { "questionId": 123, "choice": "A" }
    ],
    "shuffles": [
      { "questionId": 123, "shuffle": ["C", "A", "B", "D"] }
    ]
  },
  "docs_checklist": ["doc1", "doc2"],
  "lectura_confirmada": true,
  "hijos": [
    { "nombre": "...", "fecha_nacimiento": "2010-01-01" }
  ]
}
```

## 📝 LO QUE FALTA POR HACER

### 3. Portal Público `/i/[token]/page.tsx`

Necesitas crear/actualizar este archivo con:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function OnboardingPortal() {
  const params = useParams()
  const token = params.token as string

  const [step, setStep] = useState<'loading'|'select'|'form'|'result'>('loading')
  const [perfil, setPerfil] = useState<string|null>(null)
  const [entity, setEntity] = useState<any>(null)
  const [testData, setTestData] = useState<any>(null)

  // 1. Validar token y cargar entity
  useEffect(() => {
    fetch(`/api/public/onboarding/test?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setEntity({
            id: data.entity_id,
            sector: data.sector,
            deadline: data.deadline_at
          })
          setStep('select')
        }
      })
  }, [token])

  // 2. Cargar test al seleccionar personal_contacto
  const seleccionarPerfil = async (p: string) => {
    setPerfil(p)
    if (p === 'personal_contacto') {
      const res = await fetch(`/api/public/onboarding/test?token=${token}`)
      const data = await res.json()
      setTestData(data)
    }
    setStep('form')
  }

  // 3. Mostrar selector de perfiles
  if (step === 'select') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Seleccione su perfil</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <button onClick={() => seleccionarPerfil('personal_contacto')}
            className="p-6 border-2 rounded-xl hover:border-blue-500">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="font-bold">Personal de Contacto</h3>
            <p className="text-sm text-gray-600">Trabajo directo con menores</p>
          </button>
          <button onClick={() => seleccionarPerfil('personal_sin_contacto')}
            className="p-6 border-2 rounded-xl hover:border-blue-500">
            <div className="text-4xl mb-2">💼</div>
            <h3 className="font-bold">Personal sin Contacto</h3>
            <p className="text-sm text-gray-600">Administrativo, mantenimiento</p>
          </button>
          <button onClick={() => seleccionarPerfil('familia')}
            className="p-6 border-2 rounded-xl hover:border-blue-500">
            <div className="text-4xl mb-2">👨‍👩‍👧</div>
            <h3 className="font-bold">Familias / Tutores</h3>
            <p className="text-sm text-gray-600">Padres, madres, tutores</p>
          </button>
        </div>
      </div>
    )
  }

  // 4. Formularios por perfil
  if (step === 'form') {
    if (perfil === 'personal_contacto') {
      return <FormPersonalContacto token={token} testData={testData} />
    }
    if (perfil === 'personal_sin_contacto') {
      return <FormPersonalSinContacto token={token} />
    }
    return <FormFamilias token={token} />
  }

  return <div>Cargando...</div>
}

// Componente FormPersonalContacto debe incluir:
// - Campos: nombre, email, teléfono
// - Checkbox: "He entregado el certificado de penales"
// - Test de 10 preguntas con opciones barajadas
// - Checkbox de documentación
// - Al enviar, incluir test.answers y test.shuffles
```

**IMPORTANTE para el test**:
- Mostrar las preguntas de `testData.questions`
- Usar `question.options` (ya vienen barajadas)
- Al responder, guardar `{ questionId: question.id, choice: 'A'|'B'|'C'|'D' }`
- Al enviar, incluir también `shuffles: [{ questionId, shuffle: question.shuffle }]`

### 4. Panel del Delegado

Crear vista en `/panel/delegado/onboarding` o integrar en dashboard existente:

```typescript
// Cargar datos
const res = await fetch(`/api/delegado/onboarding/list?entityId=${entityId}`)
const { responses, stats } = await res.json()

// Mostrar banner si hay vencidos sin penales
const vencidosSinPenales = responses.filter(r =>
  r.perfil === 'personal_contacto' &&
  r.status === 'vencido' &&
  !r.penales_entregado
)

if (vencidosSinPenales.length > 0) {
  return (
    <div className="bg-red-50 border-2 border-red-200 p-6 mb-6 rounded-xl">
      <p className="text-red-900 font-medium">
        ⚠️ Hay personal de contacto que NO ha marcado la entrega del certificado de penales
        dentro del plazo de 30 días. Hasta que lo haga, **no puede ejercer su función**
        en la entidad conforme al artículo 57 de la LOPIVI.
      </p>
    </div>
  )
}

// Tabla con columnas:
// Nombre | Email | Perfil | Penales (Sí/No) | Test (score/10) | Deadline | Estado
```

## 🗄️ Aplicar Migración en Supabase

1. Ve a tu proyecto Supabase → SQL Editor
2. Ejecuta el contenido de `supabase/migrations/20250111_onboarding_update.sql`
3. Verifica:
```sql
SELECT COUNT(*) as universales FROM quiz_questions WHERE es_universal = true;
-- Debe devolver 10

SELECT sector_id, COUNT(*) FROM quiz_questions
WHERE es_universal = false
GROUP BY sector_id;
-- Debe mostrar 6 preguntas por cada sector
```

## 🧪 Probar el Sistema

1. **Generar token** (desde página de configuración del delegado)
2. **Abrir portal**: `/i/{token}`
3. **Probar 3 perfiles**:
   - Personal contacto: completar test (≥8/10 para aprobar), marcar penales
   - Personal sin contacto: marcar lectura
   - Familias: agregar hijos, marcar lectura
4. **Ver en panel delegado**: verificar registros y estados

## 📊 Lógica de Estados

### Personal de Contacto
- `ok`: test_passed=true Y penales_entregado=true
- `pendiente`: dentro de 30 días, falta test o penales
- `vencido`: pasados 30 días sin completar

### Personal sin Contacto y Familias
- `ok`: lectura_confirmada=true (+ hijos para familias)
- `pendiente`: no confirmado
- `vencido`: pasados 30 días sin confirmar

## ⚠️ Banner de Alerta

Mostrar en panel del delegado si existe algún registro con:
- `perfil = 'personal_contacto'`
- `status = 'vencido'`
- `penales_entregado = false`

**Texto del banner**:
> ⚠️ Hay personal de contacto que NO ha marcado la entrega del certificado de penales dentro del plazo de 30 días. Hasta que lo haga, **no puede ejercer su función** en la entidad conforme al artículo 57 de la LOPIVI.

## 🎨 Estilo

- Mantener diseño actual del sitio (tokens, tipografías, colores)
- Sin semáforos, usar etiquetas de texto "OK / Pendiente / Vencido"
- Banners claros y visibles
- Responsive (móvil, tablet, desktop)

## ✅ Exclusiones

- ❌ No crear token nuevo (usar el existente)
- ❌ No modificar configuración del delegado (solo enlazar al portal)
- ❌ No añadir módulo BOE
- ❌ No emails automáticos (se añadirán después)

---

**Estado actual**: Endpoints creados ✅ | Portal pendiente ⏳ | Panel delegado pendiente ⏳
