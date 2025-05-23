import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/track" ||
    path.startsWith("/track/") ||
    path.startsWith("/products/")

  // Check if user is authenticated
  const isAuthenticated = request.cookies.has("user")

  // Define admin paths
  const isAdminPath = path.startsWith("/admin")

  // For debugging
  console.log(`Middleware: Path=${path}, Public=${isPublicPath}, Authenticated=${isAuthenticated}`)

  // Redirect logic - only redirect to login if trying to access protected route while not authenticated
  if (!isAuthenticated && !isPublicPath) {
    console.log("Middleware: Redirecting to login")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // For admin routes, we'll let the client-side check handle this
  // since we need to verify if the user is actually an admin

  return NextResponse.next()
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api routes (we'll handle auth in the API routes themselves)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|api).*)",
  ],
}
