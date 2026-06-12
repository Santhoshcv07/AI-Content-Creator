import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // If Google sent back a successful code...
  if (code) {
    const supabase = await createClient()
    // ...exchange it for a secure login session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // If successful, send them to the dashboard!
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If something went wrong, send them back to the login page with an error
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`)
}