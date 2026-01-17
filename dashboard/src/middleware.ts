import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

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

    const { data: { user } } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Admin/Test accounts with full access to all dashboards
    const adminEmails = ['theakhileshreddy07@gmail.com']
    const isAdmin = user?.email && adminEmails.includes(user.email.toLowerCase())

    // Public paths that don't need auth
    const publicPaths = ['/', '/login', '/pricing', '/about', '/blog', '/gym/login', '/gym/signup', '/trainer/login', '/trainer/join']
    const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith('/blog/'))

    // Auth pages - redirect to dashboard if already logged in
    const authPages = ['/login', '/gym/login', '/trainer/login']
    const isAuthPage = authPages.includes(pathname)

    // Protected dashboard paths - STRICT protection, no exceptions
    const protectedPaths = ['/dashboard', '/admin', '/gym', '/trainer']
    const isProtected = protectedPaths.some(path => pathname.startsWith(path)) &&
        !pathname.startsWith('/gym/login') &&
        !pathname.startsWith('/gym/signup') &&
        !pathname.startsWith('/trainer/login') &&
        !pathname.startsWith('/trainer/join')

    // STRICT AUTH CHECK - If not logged in and trying to access protected route, ALWAYS redirect
    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If logged in and on auth page, redirect to appropriate dashboard
    if (user && isAuthPage) {
        const role = await getUserRole(supabase, user.id)
        const redirectUrl = getRoleBasedUrl(role)
        return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Role-based access control for dashboards (skip for admins)
    if (user && isProtected && !isAdmin) {
        const role = await getUserRole(supabase, user.id)

        // Gym owner trying to access trainer dashboard
        if (pathname.startsWith('/trainer') && role === 'gym_owner') {
            return NextResponse.redirect(new URL('/gym', request.url))
        }

        // Pro trainer trying to access gym owner dashboard
        if (pathname.startsWith('/gym') && role === 'pro_trainer') {
            return NextResponse.redirect(new URL('/trainer', request.url))
        }

        // Solo trainer trying to access wrong dashboards
        if ((pathname.startsWith('/gym') || pathname.startsWith('/trainer')) && role === 'solo_trainer') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Pro trainer or gym owner trying to access basic dashboard
        if (pathname.startsWith('/dashboard') && (role === 'gym_owner' || role === 'pro_trainer')) {
            const redirectUrl = getRoleBasedUrl(role)
            return NextResponse.redirect(new URL(redirectUrl, request.url))
        }
    }

    return response
}

// Helper: Determine user role from database
async function getUserRole(supabase: any, userId: string): Promise<string> {
    try {
        // Check if user is a gym owner
        const { data: gym } = await supabase
            .from('gyms')
            .select('gym_id')
            .eq('owner_id', userId)
            .single()

        if (gym) return 'gym_owner'

        // Check if user is a pro trainer (staff)
        const { data: staff } = await supabase
            .from('staff')
            .select('id')
            .eq('auth_id', userId)
            .single()

        if (staff) return 'pro_trainer'

        // Default: solo trainer
        return 'solo_trainer'
    } catch {
        return 'solo_trainer'
    }
}

// Helper: Get redirect URL based on role
function getRoleBasedUrl(role: string): string {
    switch (role) {
        case 'gym_owner': return '/gym'
        case 'pro_trainer': return '/trainer'
        default: return '/dashboard'
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
