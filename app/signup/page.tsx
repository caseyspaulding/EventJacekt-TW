'use client'; 

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { signUp } from "./signup"; // Adjust the path as necessary
import { Card, Checkbox, Label, TextInput } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

interface SearchParams
{
  message?: string;
}

interface SignUpProps
{
  searchParams: SearchParams;
}

export default function SignUp ( { searchParams }: SignUpProps )
{
  const [ email, setEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ orgName, setOrgName ] = useState( "" );
  const [ acceptTerms, setAcceptTerms ] = useState( false );
  const [ isFormValid, setIsFormValid ] = useState( false );
  const router = useRouter();

  // Validate email and password
  useEffect( () =>
  {
    const emailIsValid = email.includes( "@" ) && email.includes( "." );
    const passwordIsValid = password.length >= 8;
    const orgNameIsValid = orgName.trim() !== "";
    setIsFormValid( emailIsValid && passwordIsValid && orgNameIsValid && acceptTerms );
  }, [ email, password, orgName, acceptTerms ] );

  const handleSubmit = async ( event: React.FormEvent<HTMLFormElement> ) =>
  {
    event.preventDefault();
    const formData = new FormData( event.currentTarget );
    const result = await signUp( formData );

    if ( result.success && typeof result.redirectUrl === "string" )
    {
      router.push( result.redirectUrl );
    } else
    {
      console.error( result.message );
    }
  };

  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center text-2xl font-semibold dark:text-white lg:mb-10"
        >
          <Image alt="" src="/images/logo.svg" width={ 43 } height={ 44 } className="mr-2 h-11" />
          <span className="self-center text-blue-600 whitespace-nowrap text-2xl font-extrabold dark:text-white">
            EventJacket
          </span>
        </Link>
        <Card
          horizontal
          imgSrc="/images/authentication/create-account.jpg"
          imgAlt=""
          className="w-full md:max-w-screen-lg"
          theme={ {
            root: {
              children: "my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16",
            },
            img: {
              horizontal: {
                on: "hidden rounded-l-lg md:w-96 md:p-0 lg:block",
              },
            },
          } }
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
            Create a Free Account
          </h2>
          <form onSubmit={ handleSubmit } className="mt-8 space-y-6">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="email">Your email</Label>
              <TextInput
                name="email"
                placeholder="name@company.com"
                value={ email }
                onChange={ ( e ) => setEmail( e.target.value ) }
                required
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <TextInput
                name="orgName"
                placeholder="Organization"
                value={ orgName }
                onChange={ ( e ) => setOrgName( e.target.value ) }
                required
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="password">Your password</Label>
              <TextInput
                name="password"
                placeholder="••••••••"
                type="password"
                value={ password }
                onChange={ ( e ) => setPassword( e.target.value ) }
                required
              />
            </div>

            <div className="flex items-center gap-x-3">
              <Checkbox
                name="acceptTerms"
                checked={ acceptTerms }
                onChange={ ( e ) => setAcceptTerms( e.target.checked ) }
              />
              <Label htmlFor="acceptTerms">
                I accept the&nbsp;
                <Link
                  href="/terms"
                  className="text-primary-700 hover:underline dark:text-primary-500"
                >
                  Terms and Conditions
                </Link>
              </Label>
            </div>
            <div className="mb-7">
              <SubmitButton
                type="submit"
                className="w-full bg-blue-500 px-0 py-px sm:w-auto"
                pendingText="Signing Up..."
                disabled={ !isFormValid }
              >
                Sign Up
              </SubmitButton>
              { searchParams?.message && (
                <p className="bg-red-100 border border-red-500 text-red-700 p-4 mt-4 rounded text-center">
                  { searchParams.message }
                </p>
              ) }
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Already have an account?&nbsp;
              <Link
                href="/login"
                className="text-primary-700 hover:underline dark:text-primary-500"
              >
                Login here
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}
