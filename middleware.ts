import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Response nesnesini oluştur
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Supabase Client'ı oluştur (Cookie işlemleriyle birlikte)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 3. Kullanıcı oturumunu kontrol et
  // getSession yerine getUser kullanmak daha güvenlidir
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Rota Koruması
  const path = request.nextUrl.pathname
  
  // Korunan rotalar
  const protectedPaths = ['/', '/dashboard', '/projects', '/logs', '/settings', '/notifications']
  
  // O anki sayfa korunan bir sayfa mı?
  const isProtected = protectedPaths.some((route) => path === route || path.startsWith(`${route}/`))

  // A) Kullanıcı YOKSA ve korunan sayfaya girmeye çalışıyorsa -> Login'e at
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  // B) Kullanıcı VARSA ve Login sayfasına girmeye çalışıyorsa -> Dashboard'a at
  if (user && path === '/sign-in') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Aşağıdakiler HARİÇ tüm request yolları eşleşir:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - görseller (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}