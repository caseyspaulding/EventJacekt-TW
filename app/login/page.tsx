"use client";

import React, { useState, useEffect } from "react";
import {  Input, Checkbox, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { signIn } from './signin'; // Adjust the path as necessary
import { SubmitButton } from './submit-button';
import { createClient } from '@/utils/supabase/client';
import Head from 'next/head';

import OneTapComponent from "@/components/GoogleOneTap";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabase = createClient();
interface SearchParams
{
    message?: string;
}


export default function Component ( { searchParams }: { searchParams: SearchParams } )
{
    const [ isVisible, setIsVisible ] = useState( false );
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ isValid, setIsValid ] = useState( false );

    const toggleVisibility = () => setIsVisible( !isVisible );

    useEffect( () =>
    {
        // Basic email validation regex
        const isEmailValid = /\S+@\S+\.\S+/.test( email );
        // Validate both email and password
        setIsValid( isEmailValid && password.length > 0 );
    }, [ email, password ] );

    return (
        <>
            <Head>
                <title>Login - EventJacket</title>
                <meta
                    name="description"
                    content="Login to your EventJacket account to manage your events."
                />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="flex min-h-screen h-full">
                <div className="flex flex-1 flex-col justify-center items-center px-4 py-12 bg-gray-100 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="w-full max-w-md lg:w-96 bg-white p-6 rounded-lg shadow-lg">
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

                        <form className="flex flex-col gap-3" action={ signIn }>
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
                                formAction={ signIn }
                                className="w-full bg-blue-700"
                                pendingText="Signing In..."
                                disabled={ !isValid } // Disable the button if the form is invalid
                            >
                                Log In
                            </SubmitButton>

                            { searchParams?.message && (
                                <p className="mt-4 rounded border border-red-500 bg-red-100 p-4 text-center text-red-700">
                                    { searchParams.message }
                                </p>
                            ) }
                        </form>
                        <OneTapComponent />
                        <div className="relative mt-6">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-white px-4 text-gray-900">Or continue with</span>
                            </div>
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
                            className="mt-6"
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
