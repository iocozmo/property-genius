import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export default async function GET(req) {
//   const { searchParams } = new URL(req.url)
  const {query} = req;
  const code = query.code;
//   console.log("CODE", code)
//   const code = query.getAll('code');
//   console.log("Code", code)

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', req.url))
    // return NextResponse.redirect(new Url('/'), req.url)
}