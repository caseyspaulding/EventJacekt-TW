import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data: session, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect("/auth/sign-in"); // Redirect to sign-in if there's an error
    }

    const { user } = session;
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("organization_name")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return NextResponse.redirect(
        "/auth/sign-in?message=Could not fetch user profile",
      );
    }

    // Properly encode the organization name for the URL
    const encodedOrgName = encodeURIComponent(profile.organization_name);

    // Redirect to the dynamic dashboard route
    return NextResponse.redirect(`/dashboard/${encodedOrgName}`);
  }

  // If no code is present in the URL, redirect to the sign-in page
  return NextResponse.redirect("/auth/sign-in");
}
