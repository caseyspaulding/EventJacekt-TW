// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Database } from '@/database.types';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient ()
{
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll ()
                {

                    // Iterate manually since getAll does not exist
                    const allCookies = cookieStore.getAll().map( ( { name, value } ) => ( { name, value } ) );
                    return allCookies;
                },
                setAll ( cookiesToSet )
                {
                    cookiesToSet.forEach( ( { name, value, options } ) =>
                    {
                        // To persist cookie, you would need to set them manually here,
                        // This example assumes `set` is available in some environments:
                        try
                        {
                            ( cookieStore ).set( name, value, options );
                        } catch
                        {
                            // Ignore if `setAll` was called in a server environment without access
                        }
                    } );
                },
            },
        }
    );
}