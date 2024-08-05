import { createClient } from "@/utils/supabase/server";
import { Button } from "flowbite-react";

import { redirect } from "next/navigation";

export default async function SignUpButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/signup-success");
  };

  return user ? (
    <div className=""></div>
  ) : (
    <Button href="/signup" className="flex rounded-md px-3 py-2 no-underline">
      Sign Up
    </Button>
  );
}
