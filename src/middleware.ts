import { NextRequest, NextResponse } from 'next/server'

// Protege todo o app com um cookie de sessão.
// Rotas livres: /login, /api/auth, assets estáticos.
const SESSION_COOKIE = 'enhance_session'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rotas públicas (login + auth API + assets)
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next()
  }

  const session = req.cookies.get(SESSION_COOKIE)?.value
  const expected = process.env.ENHANCE_SESSION_SECRET

  if (session && expected && session === expected) {
    return NextResponse.next()
  }

  // Não autenticado → redireciona pro login
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  // Aplica em tudo exceto assets estáticos do Next
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
