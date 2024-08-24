/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useEffect } from "react";
import { Input, Divider, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { SubmitButton } from "./submit-button";
import { signUp } from "./signup";



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
            router.push( '/choose-account-type' );
        } else
        {
            console.error( result.message );
        }
    };

    useEffect( () =>
    {
       // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        window.handleSignInWithGoogle = async ( _response ) =>
        {
            const result = await signUp( new FormData() );
            if ( result.success )
            {
                router.push( '/choose-account-type' );
            } else
            {
                console.error( result.message );
            }
        };

        const script = document.createElement( 'script' );
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild( script );

        return () =>
        {
            document.body.removeChild( script );
        };
    }, [ router ] );

    return (
        <>
            <Head>
                <title>Create Account - EventJacket</title>
                <meta name="description" content="Create your EventJacket account to manage your events." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="flex h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 px-4">
                <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                    <div className="flex flex-col items-center pb-6">
                        <img src='/images/logo.svg' alt='logo' className='h-11' />
                        <p className="text-xl text-blue-600 font-bold">Create a Free Account</p>
                        <p className="text-small text-gray-800">Sign up to get started with EventJacket</p>
                    </div>
                    <form className="flex flex-col gap-3" onSubmit={ handleSubmit }>
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
                            className="w-full bg-blue-500"
                            pendingText="Signing Up..."
                            disabled={ !isFormValid }
                        >
                            Sign Up
                        </SubmitButton>
                    </form>
                    <div className="flex items-center gap-4">
                        <Divider className="flex-1" />
                        <p className="shrink-0 text-tiny text-default-500">OR</p>
                        <Divider className="flex-1" />
                    </div>
                    <div
                        id="g_id_onload"
                        data-client_id="820727006892-1j07b2899mm4c8esa9ciiug6gu34ticn.apps.googleusercontent.com"
                        data-context="signin"
                        data-ux_mode="popup"
                        data-callback="handleSignInWithGoogle"
                        data-auto_select="true"
                        data-itp_support="true"
                        data-use_fedcm_for_prompt="true"
                    >
                        
                    </div>
                    <div
                        className="g_id_signin"
                        data-type="standard"
                        data-shape="pill"
                        data-theme="outline"
                        data-text="signin_with"
                        data-size="large"
                        data-logo_alignment="left"
                    ></div>
                    <p className="text-center text-small">
                        Already have an account?&nbsp;
                        <Link href="/login" size="sm">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}