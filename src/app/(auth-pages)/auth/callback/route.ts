import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(`${origin}/login?error=auth`);
      }
    }

    // URL to redirect to after sign in process completes
    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    // Default redirect if no redirect_to parameter is provided
    return NextResponse.redirect(`${origin}/survey/create`);
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }
}
