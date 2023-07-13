import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';

const handler = async (req, res) => {
  const { code } = req.query

  if (code) {
    const supabase = createPagesServerClient({ req, res })
    await supabase.auth.exchangeCodeForSession(String(code))
    redirect('/dashboard')
  }

  // res.redirect('/')
}

export default handler