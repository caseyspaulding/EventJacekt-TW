import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/app/actions/blogActions';

export default async function sitemap (): Promise<MetadataRoute.Sitemap>
{
    const blogResult = await getAllBlogPosts();

    if ( !blogResult.success || !blogResult.data )
    {
        console.warn( 'Failed to fetch blog posts for sitemap.' );
        return []; // Return an empty sitemap if there's an issue
    }

    const blogPosts = blogResult.data;

    // Generate sitemap URLs for dynamic blog posts
    const blogSitemapUrls = blogPosts.map( ( post ) => ( {
        url: `${ process.env.NEXT_PUBLIC_SITE_URL }/blog/${ post.slug }`,
        lastModified: new Date( post.updatedAt ).toISOString(),
    } ) );

    // Manually add static pages
    const staticUrls = [
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/about`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/crm`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/pricing`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/faqs`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/ticketing`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/marketing`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/analytics`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/qrcode`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/blog`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/privacy`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${ process.env.NEXT_PUBLIC_SITE_URL }/terms`,
            lastModified: new Date().toISOString(),
        },
        // Add more static pages here as needed...
    ];

    // Combine both dynamic and static URLs
    return [ ...blogSitemapUrls, ...staticUrls ];
}
