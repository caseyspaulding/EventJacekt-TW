import { Button } from "flowbite-react";
import { createClient } from "../utils/supabase/server";

import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="rounded-md px-4 py-2 no-underline">Logout</button>
      </form>
    </div>
  ) : (
    <Button href="/login" className="flex rounded-md px-3 py-2 no-underline">
      Login
    </Button>
  );
}
