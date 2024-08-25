'use client';

import React, { useState, useEffect } from "react";
import { Input, Checkbox, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { SubmitButton } from "./submit-button";
import { verifyAndRedirect } from "./signin";

import { createClient } from "@/utils/supabase/client";

declare global
{
    interface Window
    {
        handleSignInWithGoogle: ( response: { credential: string } ) => void;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LoginComponent ( { searchParams }: { searchParams: any } )
{
    const [ isVisible, setIsVisible ] = useState( false );
    const [ email, setEmail ] = useState( "" );
    const [ password, setPassword ] = useState( "" );
    const [ isValid, setIsValid ] = useState( false );
    const router = useRouter();
    const supabase = createClient(); // Initialize Supabase client
    const [ errorMessage, setErrorMessage ] = useState( "" );

    const toggleVisibility = () => setIsVisible( !isVisible );

    useEffect( () =>
    {
        const isEmailValid = /\S+@\S+\.\S+/.test( email );
        setIsValid( isEmailValid && password.length > 0 );
    }, [ email, password ] );

    useEffect( () =>
    {// Check if user is already authenticated
        const checkAuthStatus = async () =>
        {
            const { data: { session } } = await supabase.auth.getSession();
            if ( session )
            {
                // User is already authenticated, redirect them
                router.push( '/dashboard' );
            }
        };

        checkAuthStatus();

        window.handleSignInWithGoogle = async ( response ) =>
        {
            console.log( "Google Sign-In Response:", response );

            const token = response.credential;
            const result = await verifyAndRedirect( token );

            console.log( "Verification result:", result );

            if ( result.success )
            {
                router.push( result.redirectTo as string );
            } else
            {
                setErrorMessage( result.message || "Google sign-in failed" );
                console.error( result.message );
            }
        };

        // Load Google Sign-In script
        const script = document.createElement( "script" );
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild( script );

        return () =>
        {
            document.body.removeChild( script );
        };
    }, [] );

    const handleLogin = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        const formData = new FormData( e.currentTarget );

        // Call the server action to handle email/password login
        const result = await verifyAndRedirect( { formData } );

        if ( result.success )
        {
            router.push( result.redirectTo as string );
        } else
        {
            setErrorMessage( result.message || "Email/Password sign-in failed" );
            console.error( result.message );
        }
    };

    return (
        <>
            <Head>
                <title>Login - EventJacket</title>
                <meta name="description" content="Login to your EventJacket account to manage your events." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="flex min-h-screen h-full">
                <div className="flex flex-1 flex-col justify-center items-center px-4 py-12 bg-gray-100 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="w-full max-w-md lg:w-96 bg-white p-6 rounded-3xl shadow-lg">
                        <div className="mb-4">
                            <img
                                alt="EventJacket Logo"
                                src="/images/logo.svg"
                                className="h-12 w-auto mx-auto"
                            />
                            <h2 className="mt-2 text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-gray-500 text-center">
                                Log in to your account to continue
                            </p>
                        </div>

                        <form className="flex flex-col gap-3" onSubmit={ handleLogin }>
                            <Input
                                label="Email Address"
                                name="email"
                                placeholder="Enter your email"
                                type="email"
                                variant="bordered"
                                value={ email }
                                onChange={ ( e ) => setEmail( e.target.value ) }
                                required
                            />
                            <Input
                                endContent={
                                    <button type="button" onClick={ toggleVisibility }>
                                        { isVisible ? (
                                            <Icon
                                                className="pointer-events-none text-2xl text-default-400"
                                                icon="solar:eye-closed-linear"
                                            />
                                        ) : (
                                            <Icon
                                                className="pointer-events-none text-2xl text-default-400"
                                                icon="solar:eye-bold"
                                            />
                                        ) }
                                    </button>
                                }
                                label="Password"
                                name="password"
                                placeholder="Enter your password"
                                type={ isVisible ? "text" : "password" }
                                variant="bordered"
                                value={ password }
                                onChange={ ( e ) => setPassword( e.target.value ) }
                                required
                            />
                            <div className="flex items-center justify-between px-1 py-2">
                                <Checkbox name="remember" size="sm">
                                    Remember me
                                </Checkbox>
                                <Link className="text-default-500" href="#" size="sm">
                                    Forgot password?
                                </Link>
                            </div>
                            <SubmitButton
                                color="blue"
                                className="w-full bg-orange-500 rounded-3xl text-white  font-medium text-medium"
                                pendingText="Signing In..."
                                disabled={ !isValid }
                            >
                                Log In
                            </SubmitButton>

                            { searchParams?.message && (
                                <p className="mt-4 rounded border border-red-500 bg-red-100 p-4 text-center text-red-700">
                                    { searchParams.message }
                                </p>
                            ) }
                            { errorMessage && (
                                <p className="mt-4 rounded border border-red-500 bg-red-100 p-4 text-center text-red-700">
                                    { errorMessage }
                                </p>
                            ) }
                        </form>

                        <div className="relative mt-6">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-white px-4 text-gray-900">Or continue with</span>
                            </div>
                        </div>
                        <div className='flex justify-center w-full '>
                            <div
                                id="g_id_onload"
                                data-client_id="820727006892-1j07b2899mm4c8esa9ciiug6gu34ticn.apps.googleusercontent.com"
                                data-context="signin"
                                data-ux_mode="popup"
                                data-callback="handleSignInWithGoogle"
                                data-auto_select="true"
                                data-itp_support="true"
                                data-use_fedcm_for_prompt="true"
                                className="flex justify-center"
                            />
                            <div
                                className="g_id_signin mt-4"
                                data-type="standard"
                                data-shape="pill"
                                data-theme="outline"
                                data-text="signin_with"
                                data-size="large"
                                data-logo_alignment="left"
                            />
                        </div>
                        <p className="text-center mt-4 text-small">
                            Need to create an account?&nbsp;
                            <Link href="/signup" size="sm">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="relative hidden w-0 flex-1 lg:block">
                    <img
                        alt=""
                        src="/images/festival-4.png"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>

        </>
    );
}
