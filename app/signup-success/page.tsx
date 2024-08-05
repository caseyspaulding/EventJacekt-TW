import Link from 'next/link';

export default function SignUpSuccess() {
    return (
        <div className="mx-auto max-w-sm">
            <div className="flex min-h-screen flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
                <h1 className="mb-4 text-4xl font-bold">Sign Up Successful!</h1>
                <p className="mb-4 text-gray-600">
                    Check your email to continue the sign-in process.
                </p>
                <Link href="/login" passHref>
                    <a className="mt-6 rounded-md bg-blue-600 px-6 py-2 font-semibold text-white">
                        Go to Login
                    </a>
                </Link>
            </div>
        </div>
    );
}
