import 'server-only'

import {
  experimental_composeSpec,
  experimental_createEvaluator
} from '@json-render/core'
import { NextRequest, NextResponse } from 'next/server'
import { jevCandidates } from '@/lib/jev-candidates'
import { jevCatalog } from '@/lib/jev-catalog'

export const runtime = 'nodejs'

const MAX_PROMPT_LENGTH = 600

const spanishCandidateText: Record<string, { description: string; title?: string; text?: string; label?: string; items?: string[] }> = {
  'train-ticket-card': { description: 'Tarjeta raíz para un resumen de reserva de tren', title: 'Boleto de tren' },
  'train-route': { description: 'Ruta y hora de salida de un boleto de tren', text: 'Santo Domingo a Santiago, hoy a las 4:30 p. m.' },
  'train-fare': { description: 'Precio del tren para el boleto seleccionado', label: 'Precio' },
  'book-seat': { description: 'Acción para reservar el boleto de tren seleccionado', label: 'Reservar asiento' },
  'spending-overview-card': { description: 'Tarjeta raíz para un resumen de gastos personales', title: 'Resumen de gastos' },
  'weekly-spending': { description: 'Monto gastado durante la semana actual', label: 'Esta semana' },
  'budget-left': { description: 'Monto de presupuesto restante', label: 'Presupuesto restante' },
  'top-category': { description: 'Categoría principal del resumen de gastos', text: 'Categoría principal: supermercado' },
  'support-checklist-card': { description: 'Tarjeta raíz para una lista de resolución de soporte', title: 'Lista de soporte' },
  'support-steps': { description: 'Próximos pasos seguros para resolver una solicitud de soporte', items: ['Confirma el correo de la cuenta', 'Restablece la sesión', 'Escala si hay una factura pendiente'] },
  'resolve-support': { description: 'Acción para una lista de soporte completada', label: 'Marcar como resuelto' }
}

function getCandidates (isSpanish: boolean) {
  if (!isSpanish) return jevCandidates
  return jevCandidates.map(candidate => {
    const localized = spanishCandidateText[candidate.id]
    if (!localized) return candidate
    return {
      ...candidate,
      description: localized.description,
      element: {
        ...candidate.element,
        props: {
          ...candidate.element.props,
          ...(localized.title ? { title: localized.title } : {}),
          ...(localized.text ? { text: localized.text } : {}),
          ...(localized.label ? { label: localized.label } : {}),
          ...(localized.items ? { items: localized.items } : {})
        }
      }
    }
  })
}

export async function POST (request: NextRequest): Promise<NextResponse> {
  let isSpanish = false
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Expected a JSON request body.' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  isSpanish = typeof body === 'object' && body !== null && 'lang' in body && body.lang === 'es'

  const prompt = typeof body === 'object' && body !== null && 'prompt' in body
    ? body.prompt
    : undefined

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ error: isSpanish ? 'Se necesita una instrucción.' : 'A prompt is required.' }, { status: 400 })
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: isSpanish ? `La instrucción debe tener ${MAX_PROMPT_LENGTH} caracteres o menos.` : `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.` },
      { status: 400 }
    )
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: isSpanish ? 'La composición en vivo no está configurada en este entorno.' : 'Live composition is not configured for this environment.' },
      { status: 503 }
    )
  }

  try {
    const evaluate = experimental_createEvaluator({
      apiKey,
      model: 'typesafe-ai/jev',
      timeoutMs: 15_000
    })
    const steps: Array<{ choice: string; description: string; elapsedMs: number }> = []
    let spec = null

    for await (const event of experimental_composeSpec({
      catalog: jevCatalog,
      candidates: getCandidates(isSpanish),
      prompt: isSpanish
        ? `Genera todos los textos visibles de la interfaz en español. ${prompt.trim()}`
        : prompt.trim(),
      initialState: {},
      evaluate,
      maxElements: 8,
      maxSteps: 4,
      maxDepth: 3,
      signal: AbortSignal.timeout(30_000)
    })) {
      if (event.type === 'step') {
        spec = event.spec
        steps.push({
          choice: event.step.choice,
          description: event.step.description,
          elapsedMs: event.step.elapsedMs
        })
      } else {
        spec = event.spec ?? spec
      }
    }

    if (!spec) {
      return NextResponse.json(
        { error: isSpanish ? 'La composición en vivo no devolvió una Spec utilizable.' : 'Live composition did not return a usable spec.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ spec, steps })
  } catch {
    return NextResponse.json(
      { error: isSpanish ? 'La composición en vivo no está disponible. Inténtalo de nuevo.' : 'Live composition is unavailable. Please try again.' },
      { status: 502 }
    )
  }
}
