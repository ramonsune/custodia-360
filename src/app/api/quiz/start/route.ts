import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  return NextResponse.json({
    ok: false,
    error: 'Quiz temporarily disabled for maintenance'
  }, { status: 503 })
}
