import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const middleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXT_PRIVATE_JWT_SECRET })
  const { pathname } = req.nextUrl
  if (!token || token.role !== 'admin') {
    if (pathname === '/admin/auth/login') {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/admin/auth/login', req.url))
  }

  if (token &&  pathname === '/admin/auth/login' || pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  if (token && pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export default middleware

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
