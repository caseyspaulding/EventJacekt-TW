import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from './submit-button';
import { Card, Checkbox, Label, TextInput } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchParams {
    message?: string;
}

interface LoginProps {
    searchParams: SearchParams;
}

export default function Login({ searchParams }: LoginProps) {
    const signIn = async (formData: FormData) => {
        'use server';

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const supabase = createClient();

        const { data: session, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return redirect('/login?message=Could not authenticate user');
        }

        const { user } = session;
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('organization_name')
            .eq('user_id', user.id)
            .single();

        if (profileError) {
            console.error('Error fetching user profile:', profileError);
            return redirect('/login?message=Could not fetch user profile');
        }

        // Redirect to the dynamic dashboard route
        return redirect(`/dashboard/${encodeURIComponent(profile.organization_name)}`);
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
                    imgAlt=""
                    imgSrc="/images/authentication/login.png"
                    className="w-full md:max-w-screen-lg"
                    theme={ {
                        root: {
                            children: 'my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16'
                        },
                        img: {
                            horizontal: {
                                on: 'hidden w-2/3 rounded-l-lg md:w-96 md:p-0 lg:block'
                            }
                        }
                    } }
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
                        Sign in 
                    </h2>
                    <form className="mt-8 space-y-6">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="email">Your email</Label>
                            <TextInput
                                
                                name="email"
                                placeholder="name@company.com"
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
                                formAction={ signIn }
                                className="w-full px-0 py-px sm:w-auto bg-blue-600"
                                pendingText="Signing In..."
                            >
                                Login to your account
                            </SubmitButton>

                            { searchParams?.message && (
                                <p className="bg-red-100 border border-red-500 text-red-700 p-4 mt-4 rounded text-center">
                                    { searchParams.message }
                                </p>
                            ) }
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
            {/*<form className="mt-11 flex w-full flex-1 flex-col justify-center gap-2">
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

                <SubmitButton
                    formAction={signIn}
                    className="w-full px-0 py-px sm:w-auto bg-blue-600"
                    pendingText="Signing In..."
                >
                    Sign In
                </SubmitButton>

                {searchParams?.message && (
                    <p className="bg-foreground/10 mt-4 p-4 text-center">{searchParams.message}</p>
                )}
            </form>*/}

           
        </>
    );
}
