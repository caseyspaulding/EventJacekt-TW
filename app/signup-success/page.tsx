'use client';

import Confetti from 'react-confetti';
import { useWindowSize } from '../../hooks/useWindowSize';

export default function SignUpSuccess() {
    const { width, height } = useWindowSize();

    return (

        <div className="relative flex h-screen min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 px-4">
            { width && height && (
                <Confetti
                    width={ width }
                    height={ height }
                    recycle={ false }
                    numberOfPieces={ 200 }
                    style={ { position: 'absolute', top: 0, left: 0 } }
                />
            ) }

            <div className="relative z-10 mx-auto max-w-sm">
                <div className="rounded-lg bg-white p-8 shadow-xl">
                    <div className="flex justify-center mb-6">
                        <a href="#" className="inline-flex">
                            <span className="sr-only">EventJacket</span>
                            <img
                                alt="EventJacket Logo"
                                src="/images/logo.svg"
                                className="h-16 w-auto"
                            />
                        </a>
                    </div>
                    <h1 className="mb-4 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                        Sign Up Successful!
                    </h1>
                    <p className="mb-4 text-center text-lg text-gray-700">
                        Welcome to EventJacket!
                    </p>
                    <p className="mb-6 text-center text-gray-600">
                        Check your email for a verification link to activate your account.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="/login"
                            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
                        >
                             Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
  
        
    );
}
