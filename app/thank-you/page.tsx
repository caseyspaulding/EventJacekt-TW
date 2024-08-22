import Link from "next/link";

export default function ThankYouPage ()
{
  return (

    
    <div className="flex p-3 items-center justify-center h-screen bg-gradient-to-tr from-cyan-400 via-blue-500 to-sky-400">

      <div className="p-1 rounded-2xl  shadow-2xl bg-gradient-to-r from-blue-500 via-sky-500 to-blue-500">
        <div className="flex flex-col rounded-2xl items-center p-4 space-y-2 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-green-400 w-28 h-28" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1
                className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
                Confirmed !</h1>
              <p className='text-center mb-3'>Thank you for confirming your email! You are all set to start creating events!</p>
              <Link href="/" passHref
                className=" mt-3 inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="text-sm font-medium">
                  Get Started
                </span>
              </Link>
            </div>
          </div>
        </div>
    
  )
}