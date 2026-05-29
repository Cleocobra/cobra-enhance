import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'enhance_session'

// POST /api/auth → valida senha, grava cookie de sessão (30 dias)
export async function POST(req: NextRequest) {
  let password = ''
  try {
    const body = await req.json()
    password = body.password || ''
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }

  const expected = process.env.ENHANCE_PASSWORD
  const secret = process.env.ENHANCE_SESSION_SECRET

  if (!expected || !secret) {
    return NextResponse.json({ error: 'Servidor sem senha configurada' }, { status: 500 })
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dias — grava a sessão
    path: '/',
  })
  return res
}

// DELETE /api/auth → logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(SESSION_COOKIE)
  return res
}
