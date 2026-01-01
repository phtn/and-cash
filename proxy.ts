import { NextRequest, NextResponse } from 'next/server'
import { extractSubdomain, getSubdomainRoute, SUBDOMAIN_CONFIG } from '@/lib/subdomains'

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|fonts|svg|.*\\.(?:png|jpg|jpeg|gif|webp|ico|svg|woff|woff2|otf|ttf)).*)',
  ],
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') ?? 'localhost'
  const url = request.nextUrl.clone()
  const { pathname } = url

  // Don't rewrite API routes - they should always be accessible directly
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Extract subdomain info
  const { subdomain, isSubdomain } = extractSubdomain(hostname)

  // If no subdomain, continue normally
  if (!isSubdomain || !subdomain) {
    return NextResponse.next()
  }

  // Get the route mapping for this subdomain
  const subdomainRoute = getSubdomainRoute(subdomain)

  // If subdomain is not configured, serve 404 or redirect to root
  if (!subdomainRoute) {
    // You can customize this behavior:
    // Option 1: Show 404
    // return NextResponse.rewrite(new URL('/not-found', request.url))

    // Option 2: Redirect to root domain
    const rootDomain = SUBDOMAIN_CONFIG.allowedDomains.find(
      (d) => hostname.includes(d) && d !== 'localhost'
    )
    if (rootDomain) {
      const protocol = request.nextUrl.protocol
      return NextResponse.redirect(new URL(`${protocol}//${rootDomain}${pathname}`))
    }

    return NextResponse.next()
  }

  // Prevent infinite rewrites - if already on the subdomain path, don't rewrite
  if (pathname.startsWith(subdomainRoute)) {
    return NextResponse.next()
  }

  // Rewrite the URL to include the subdomain route
  // e.g., commerce.localhost/test → localhost/swapped-commerce/test
  const newPathname = `${subdomainRoute}${pathname === '/' ? '' : pathname}`
  url.pathname = newPathname

  // Add subdomain header for use in components
  const response = NextResponse.rewrite(url)
  response.headers.set('x-subdomain', subdomain)
  response.headers.set('x-subdomain-route', subdomainRoute)

  return response
}
