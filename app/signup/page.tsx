"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import { signUp } from './signup'; // Adjust the path as necessary
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
    const [ orgName, setOrgName ] = useState( '' );
    const [ acceptTerms, setAcceptTerms ] = useState( false );
    const [ isFormValid, setIsFormValid ] = useState( false );
    const router = useRouter();

    // Toggle visibility of password
    const toggleVisibility = () => setIsVisible( !isVisible );

    // Validate email, password, organization name, and terms acceptance
    useEffect( () =>
    {
        const emailIsValid = email.includes( '@' ) && email.includes( '.' );
        const passwordIsValid = password.length >= 8;
        const orgNameIsValid = orgName.trim() !== '';
        setIsFormValid( emailIsValid && passwordIsValid && orgNameIsValid && acceptTerms );
    }, [ email, password, orgName, acceptTerms ] );

    // Handle form submission
    const handleSubmit = async ( event: React.FormEvent<HTMLFormElement> ) =>
    {
        event.preventDefault();
        const formData = new FormData( event.currentTarget );
        const result = await signUp( formData );

        if ( result.success )
        {
            router.push( '/signup-success' );
        } else
        {
            console.error( result.message );
        }
    };

    return (
        <>
            <Head>
                <title>Create Account - EventJacket</title>
                <meta
                    name="description"
                    content="Create your EventJacket account to manage your events."
                />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="flex h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 px-4">

                <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
                    <div className="flex flex-col items-center pb-6">
                        <img src='/images/logo.svg' alt='logo' className='h-11' />
                        <p className="text-xl text-blue-600 font-medium">Create a Free Account</p>
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

                            label="Organization Name"
                            name="orgName"
                            placeholder="Enter your organization's name"
                            type="text"
                            variant="bordered"
                            value={ orgName }
                            onChange={ ( e ) => setOrgName( e.target.value ) }
                            required
                        />
                        <Input

                            className="text-gray-500"
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
                            <Checkbox
                                name="acceptTerms"
                                checked={ acceptTerms }
                                onChange={ ( e ) => setAcceptTerms( e.target.checked ) }
                                size="sm"
                            >
                                I accept the&nbsp;
                                <Link href="/terms" size="sm">
                                    Terms and Conditions
                                </Link>
                            </Checkbox>
                        </div>
                        <SubmitButton
                            type="submit"
                            className="w-full bg-blue-500"
                            pendingText="Signing Up..."
                            disabled={ !isFormValid }
                        >
                            Sign Up
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
