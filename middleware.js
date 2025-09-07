import { NextResponse } from 'next/server'
import {QrCentraalCooKieAccessToken, QrCentraalCookieExpireAt} from './utils/cookie'
 
export default function middleware(request) {
    
    const tokenCookie = request.cookies.get(QrCentraalCooKieAccessToken)
    const expireCookie = request.cookies.get(QrCentraalCookieExpireAt)
    
    if (!tokenCookie || !expireCookie) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const token = tokenCookie.value
    const expireAtValue = expireCookie.value
    
    if (!expireAtValue || isNaN(Number(expireAtValue))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const expiresIn = new Date(Number(expireAtValue))
    const now = new Date()
    
    if (now >= expiresIn) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next();
}
 
export const config = {
  matcher: '/dashboard/:path*',
}