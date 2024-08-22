"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { signIn } from './signin'; // Adjust the path as necessary
import { SubmitButton } from './submit-button';
import Head from 'next/head';


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
            <div className="flex h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 px-4">
               
                <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                    <div className="flex flex-col items-center pb-6">
                        <Link href="/">
                            <img src='/images/logo.svg' alt='EventJacket Logo' className='h-11' />
                            </Link>
                        <p className="text-xl text-blue-700 font-bold">Welcome Back</p>
                        <p className="text-small text-gray-700">Log in to your account to continue</p>
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
                    <div className="flex items-center gap-4">
                        <Divider className="flex-1" />
                        <p className="shrink-0 text-tiny text-default-500">OR</p>
                        <Divider className="flex-1" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            startContent={ <Icon icon="flat-color-icons:google" width={ 24 } /> }
                            variant="bordered"
                        >
                            Continue with Google
                        </Button>
                        
                    </div>
                    <p className="text-center text-small">
                        Need to create an account?&nbsp;
                        <Link href="/signup" size="sm">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
