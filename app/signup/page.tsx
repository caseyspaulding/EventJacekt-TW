"use client";

import { useRouter } from "next/navigation";
import { SubmitButton } from "./submit-button";

import { Button } from "flowbite-react";
import { signUp } from "./signup";

interface SearchParams {
  message?: string;
}

interface SignUpProps {
  searchParams: SearchParams;
}

export default function SignUp({ searchParams }: SignUpProps) {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await signUp(formData);

    if (result.success && typeof result.redirectUrl === "string") {
      router.push(result.redirectUrl);
    } else {
      // Handle error, maybe set some state to show an error message
      console.error(result.message);
      // You might want to update your UI to show this error message
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-11 flex w-full flex-1 flex-col justify-center gap-2"
      >
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
        <label className="text-md" htmlFor="orgName">
          Organization Name
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="orgName"
          placeholder="Organization"
          required
        />

        <SubmitButton
          type="submit"
          className="border-foreground/20 mb-2 rounded-md border px-4 py-2"
          pendingText="Signing Up..."
        >
          Sign Up
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
