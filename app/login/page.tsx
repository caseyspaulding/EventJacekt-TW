import { createClient } from "@/utils/supabase/server";
import { Button } from "flowbite-react";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

interface SearchParams {
  message?: string;
}

interface LoginProps {
  searchParams: SearchParams;
}

export default function Login({ searchParams }: LoginProps) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data: session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    const { user } = session;
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("organization_name")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return redirect("/login?message=Could not fetch user profile");
    }

    // Redirect to the dynamic dashboard route
    return redirect(
      `/dashboard/${encodeURIComponent(profile.organization_name)}`,
    );
  };

  return (
    <>
      <form className="mt-11 flex w-full flex-1 flex-col justify-center gap-2">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <SubmitButton
          formAction={signIn}
          className="mb-2 rounded-md bg-green-700 px-4 py-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>

        {searchParams?.message && (
          <p className="bg-foreground/10 mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}
      </form>

      <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
        <Button
          href="/"
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="text-foreground bg-btn-background hover:bg-btn-background-hover group absolute left-8 top-8 flex items-center rounded-md px-4 py-2 text-sm no-underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Button>
      </div>
    </>
  );
}
