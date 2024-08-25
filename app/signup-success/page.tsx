'use client';

import Confetti from 'react-confetti';
import { useWindowSize } from '../../hooks/useWindowSize';
import { Button } from '@nextui-org/button';

export default function SignUpSuccess() {
    const { width, height } = useWindowSize();

    return (

        <div className="relative flex h-screen min-h-screen items-center justify-center bg-gray-100 px-4">
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
                <div className="rounded-3xl bg-white p-8 shadow-2xl">
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
                    <h1 className="mb-4 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-600">
                        Sign Up Successful!
                    </h1>
                    <p className="mb-4 text-center text-lg text-gray-700">
                        Welcome to EventJacket!
                    </p>
                    <p className="mb-6 text-center text-gray-600">
                        <span className='font-medium text-blue-500'> Check your email </span>for a verification link to activate your account.
                    </p>
                    <div className="flex justify-center">
                        <Button
                            href="/"
                            as="a"
                            className="w-full text-white bg-orange-500"
                            
                        >
                             Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
  
        
    );
}
