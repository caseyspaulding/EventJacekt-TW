import { nextui } from '@nextui-org/react';
import flowbite from 'flowbite-react/tailwind';
import type { Config } from 'tailwindcss';

export default {
    content: [
        './app/**/*.{ts,tsx,mdx}',
        './components/**/*.{ts,tsx,mdx}',
        './pages/**/*.{ts,tsx,mdx}', // Include pages folder if exists
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
        './node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}', // Include Flowbite
        flowbite.content(), // Flowbite's content paths
    ],
    theme: {
        extend: {
            animation: {
                'bounce-once': 'bounce-once 1s ease-in-out',
            },
            keyframes: {
                'bounce-once': {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        transform: 'translateY(-25%)',
                    },
                },
            },
            backgroundImage: {
                'gradient-to-r': 'linear-gradient(to right, #007bff, #0041c4)', // Light blue to darker blue
                'gradient-hover-to-r': 'linear-gradient(to right, #0062cc, #002090)', // Even darker for hover
                'gradient-orange-to-r': 'linear-gradient(to right, #f97316, #ea580c)', // Light orange to dark orange
                'gradient-orange-hover-to-r': 'linear-gradient(to right, #f97316, #f97316)', // Darker orange gradient for hover
            },
        },
    },
    plugins: [
        nextui(),
       
    ],
    darkMode: 'class', // Set dark mode
} satisfies Config;
