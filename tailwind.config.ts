import { nextui } from '@nextui-org/react';
import flowbite from 'flowbite-react/tailwind';
import type { Config } from 'tailwindcss';


export default {
    content: [
        './app/**/*.{ts,tsx,mdx}',
        './components/**/*.{ts,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
        flowbite.content(),
    ],
    theme: {
        extend: {
            colors: {
                // Customize colors if necessary
            }
        }
    },
    plugins: [ nextui() ],
    darkMode: 'class',  // Fixed dark mode casing
} satisfies Config;