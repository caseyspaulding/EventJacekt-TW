'use client';

import Link from 'next/link';
import Confetti from 'react-confetti';
import { useWindowSize } from '../../hooks/useWindowSize';

export default function SignUpSuccess() {
    const { width, height } = useWindowSize();

    return (

        <div className="bg-gradient-to-tr from-cyan-400 via-blue-500 to-sky-400">
            {width && height && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={200}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                />
            )}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  
                }}
            >
                <div className="mx-auto max-w-sm">
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h1 className="mb-4 text-center text-blue-700 text-4xl font-bold">Sign Up Successful!</h1>
                        <p className="mb-4 text-center text-gray-600">
                            Check your email for a verification link to activate your account.
                        </p>
                        <Link href="/login" passHref>
                            <p className="mt-6 cursor-pointer rounded-md bg-blue-600 px-6 py-2 text-center font-semibold text-white">
                                Go to Login
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
  
        
    );
}
