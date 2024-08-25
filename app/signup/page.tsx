'use client';

import React, { useState, useEffect } from "react";
import { Input, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { SubmitButton } from "./submit-button";
import { signUp } from "./signup";
import toast from "react-hot-toast";


declare global
{
    interface Window
    {
        handleSignInWithGoogle: ( response: { credential: string } ) => void;
    }
}

export default function Component ()
{
    const [ isVisible, setIsVisible ] = useState( false );
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ isFormValid, setIsFormValid ] = useState( false );
    const router = useRouter();

    useEffect( () =>
    {
        const emailIsValid = email.includes( '@' ) && email.includes( '.' );
        const passwordIsValid = password.length >= 8;
        setIsFormValid( emailIsValid && passwordIsValid );
    }, [ email, password ] );

    const toggleVisibility = () => setIsVisible( !isVisible );

    // Function to call the server action
    const handleSubmit = async ( event: React.FormEvent<HTMLFormElement> ) =>
    {
        event.preventDefault();
        const formData = new FormData( event.currentTarget );

        // Calling server action here
        const result = await signUp( formData );

        if ( result.success )
        {
            // Check if email confirmation is required
            if ( result.user && !result.user.confirmed_at )
            {
                // Notify the user to check their email
                router.push(  '/signup-success' );
            } else
            {
                // Redirect to the next step
                router.push( result.redirectTo || '/choose-account-type' );
            }
        } else
        {
            console.error( result.message );
            toast.error( 'Error creating account. ' );
        }
    };

    useEffect( () =>
    {
        window.handleSignInWithGoogle = async ( response ) =>
        {
            const formData = new FormData();
            formData.append( 'googleToken', response.credential );

            // Send the token to the server action
            const result = await signUp( formData );

            if ( result.success )
            {
                router.push( result.redirectTo || '/choose-account-type' );
            } else
            {
                console.error( result.message );
            }
        };

        // Load Google Sign-In script only after the component mounts
        const script = document.createElement( 'script' );
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild( script );

        // Cleanup to avoid memory leaks
        return () =>
        {
            document.body.removeChild( script );
        };
    }, [] );

    return (
        <>
            <Head>
                <title>Create Account - EventJacket</title>
                <meta name="description" content="Create your EventJacket account to manage your events." />
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
                                Create an account
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-gray-500 text-center">
                                Sign up to get started with EventJacket
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={ handleSubmit }>
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
                                className="text-gray-500"
                                endContent={
                                    <button type="button" onClick={ toggleVisibility }>
                                        { isVisible ? (
                                            <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                                        ) : (
                                            <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
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
                            <SubmitButton
                                type="submit"
                                className="w-full bg-blue-500 rounded-3xl"
                                pendingText="Signing Up..."
                                disabled={ !isFormValid }
                            >
                                Sign Up
                            </SubmitButton>
                        </form>
                        <div className="relative mt-6">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-white px-4 text-gray-900">Or continue with</span>
                            </div>
                        </div>
                        <div className='flex justify-center mx-2'>
                            <div
                                id="g_id_onload"
                                data-client_id="820727006892-1j07b2899mm4c8esa9ciiug6gu34ticn.apps.googleusercontent.com"
                                data-context="signin"
                                data-ux_mode="popup"
                                data-callback="handleSignInWithGoogle"
                                data-auto_select="true"
                                data-itp_support="true"
                                data-use_fedcm_for_prompt="true"
                                className="text-center "
                            >
                            </div>
                            <div
                                className="g_id_signin mt-4"
                                data-type="standard"
                                data-shape="pill"
                                data-theme="outline"
                                data-text="signin_with"
                                data-size="large"
                                data-logo_alignment="left"
                            ></div>
                        </div>
                            <p className="text-center text-sm mt-4">
                                Already have an account?&nbsp;
                                <Link href="/login" size="sm">
                                    Log In
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
