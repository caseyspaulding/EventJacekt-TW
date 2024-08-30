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
            backgroundImage: {
                'gradient-to-r': 'linear-gradient(to right, #007bff, #0041c4)',  // From light blue to darker blue
                'gradient-hover-to-r': 'linear-gradient(to right, #0062cc, #002090)',  // Even darker for hover
                'gradient-orange-to-r': 'linear-gradient(to right, #f97316, #ea580c)',  // From light orange to dark orange
                'gradient-orange-hover-to-r': 'linear-gradient(to right, #f97316, #f97316)'  // Darker orange gradient for hover
            }
        }
    },
    plugins: [ nextui() ],
    darkMode: 'class',  // Fixed dark mode casing
} satisfies Config;
