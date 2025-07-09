import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;
    const redirectTo = requestUrl.searchParams.get("redirect_to");

    if (!code) {
      console.error('No code provided in auth callback');
      return NextResponse.redirect(`${origin}/login?error=no_code`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }

    // Ensure we have a valid redirect path that starts with /
    const safePath = redirectTo && redirectTo.startsWith('/') 
      ? redirectTo 
      : '/survey/create';

    // Construct the full redirect URL
    const redirectUrl = new URL(safePath, origin);

    // Redirect to the appropriate page
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }
}
