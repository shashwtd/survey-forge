import { createClient } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/app', '/settings'];
  
  // Don't redirect if the route is not protected
  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    const supabase = createClient(request);
    const { data: { session } } = await supabase.auth.getSession();

    // If there's no session and we're on a protected route, redirect to login
    if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Allow the request to continue
    return NextResponse.next();
  } catch (e) {
    // On error, allow the request to continue
    console.error('Error in middleware:', e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
