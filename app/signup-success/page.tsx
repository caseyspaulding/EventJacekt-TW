'use client';

import Link from 'next/link';
import Confetti from 'react-confetti'
import { useWindowSize } from '../../hooks/useWindowSize';

export default function SignUpSuccess ()
{
    const { width, height } = useWindowSize();

    return (
        <div style={ {
            position: 'relative',
            minHeight: '100vh',
            backgroundImage: "url('/images/happypeople.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        } }>
            { width && height && (
                <Confetti
                    width={ width }
                    height={ height }
                    recycle={ false }
                    numberOfPieces={ 200 }
                    style={ { position: 'absolute', top: 0, left: 0 } }
                />
            ) }
            <div style={ {
                position: 'relative',
                zIndex: 1,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)' // Optional: adds a semi-transparent white overlay
            } }>
                <div className="mx-auto max-w-sm">
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h1 className="mb-4 text-4xl text-center font-bold">Sign Up Successful!</h1>
                        <p className="mb-4 text-gray-600 text-center">
                            Check your email for a verification link to activate your account.
                        </p>
                        <Link href="/login" passHref>
                            <p className="mt-6 rounded-md bg-blue-600 px-6 py-2 font-semibold text-white text-center cursor-pointer">
                                Go to Login
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}