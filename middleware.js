import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  const {data: {session},} = await supabase.auth.getSession();
  const user = session?.user;

  // if user is signed in and the current path is / redirect the user to /dashboard
  if (user && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // if user is not signed in and the current path is not / redirect the user to /
  // if (!user && req.nextUrl.pathname !== '/') {
  //   return NextResponse.redirect(new URL('/login', req.url))
  // }

  // return res
}

// export const config = {
//   matcher: ['/', '/account'],
// }
 
// // This function can be marked `async` if using `await` inside
// // export async function middleware(request) {
// //     const {data: { session }} = await supabase.auth.getSession();
// //     const user = session.data.session?.user;
// //     if (!user && req.nextUrl.pathname === "/dashboard") {
// //         return NextResponse.redirect(new URL("/", req.url));
// //       }
// // }
 
// // // See "Matching Paths" below to learn more
// // export const config = {
// //   matcher: '/about/:path*',
// // }

