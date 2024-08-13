import flowbite from 'flowbite-react/tailwind';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
    content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}', flowbite.content()],
    theme: {
        extend: {
            colors: {
                primary: colors.blue
            }
        }
    },
    plugins: [ flowbite.plugin(), addVariablesForColors ],
    darkmode: 'class',
    
} satisfies Config;

const {
    default: flattenColorPalette,
} = require( "tailwindcss/lib/util/flattenColorPalette" );

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors ( { addBase, theme }: any )
{
    let allColors = flattenColorPalette( theme( "colors" ) );
    let newVars = Object.fromEntries(
        Object.entries( allColors ).map( ( [ key, val ] ) => [ `--${ key }`, val ] )
    );

    addBase( {
        ":root": newVars,
    } );
}