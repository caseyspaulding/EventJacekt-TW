'use client';

import React, { useState, useEffect } from 'react';
import { SubmitButton } from './submit-button';
import { Card, Checkbox, Label, TextInput } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from './signin'; // Adjust the path as necessary
import Head from 'next/head';
import SvgBackground from '@/components/Backgrounds/SquareSvgBackground';

interface SearchParams {
    message?: string;
}

interface LoginProps {
    searchParams: SearchParams;
}

export default function Login({ searchParams }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        // Basic email validation regex
        const isEmailValid = /\S+@\S+\.\S+/.test(email);
        // Validate both email and password
        setIsValid(isEmailValid && password.length > 0);
    }, [email, password]);

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
            <div className=" mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
                <SvgBackground />
                <Link
                    href="/"
                    className="mb-8 flex items-center justify-center text-2xl font-semibold dark:text-white lg:mb-10"
                >
                    <Image
                        alt=""
                        src="/images/logo.svg"
                        width={43}
                        height={44}
                        className="mr-2 h-11"
                    />
                    <span className="self-center whitespace-nowrap text-2xl font-extrabold text-blue-600 dark:text-white">
                        EventJacket
                    </span>
                </Link>

                <Card
                    horizontal
                    imgAlt="login"
                    imgSrc="/images/authentication/login.png"
                    className="w-full shadow-2xl md:max-w-screen-lg"
                    theme={{
                        root: {
                            children: ' my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16'
                        },
                        img: {
                            horizontal: {
                                on: 'hidden w-2/3 rounded-l-lg md:w-96 md:p-0 lg:block'
                            }
                        }
                    }}
                >
                    <h2 className=" bg-transparent text-center text-2xl font-bold text-blue-700 dark:text-white lg:text-3xl">
                        Sign in
                    </h2>
                    <form className="mt-8 space-y-6">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="email">Your email</Label>
                            <TextInput
                                name="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="password">Your password</Label>
                            <TextInput
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-3">
                                <Checkbox id="rememberMe" name="rememberMe" />
                                <Label htmlFor="rememberMe">Remember me</Label>
                            </div>
                            <Link
                                href="#"
                                className="text-right text-sm text-primary-700 hover:underline dark:text-primary-500"
                            >
                                Lost Password?
                            </Link>
                        </div>
                        <div className="mb-6">
                            <SubmitButton
                                color="blue"
                                formAction={signIn}
                                className="w-full bg-blue-600 px-0 py-px sm:w-auto"
                                pendingText="Signing In..."
                                disabled={!isValid} // Disable the button if the form is invalid
                            >
                                Login to your account
                            </SubmitButton>

                            {searchParams?.message && (
                                <p className="mt-4 rounded border border-red-500 bg-red-100 p-4 text-center text-red-700">
                                    {searchParams.message}
                                </p>
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Not registered?&nbsp;
                            <Link
                                href="/signup"
                                className="text-primary-700 hover:underline dark:text-primary-500"
                            >
                                Create account
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </>
    );
}
