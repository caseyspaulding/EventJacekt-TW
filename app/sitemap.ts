import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/app/actions/blogActions';

export default async function sitemap (): Promise<MetadataRoute.Sitemap>
{
    const blogResult = await getAllBlogPosts();

    if ( !blogResult.success || !blogResult.data )
    {
        console.error( 'Failed to fetch blog posts for sitemap' );
        return []; // Return an empty sitemap if there's an issue
    }

    const blogPosts = blogResult.data;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; // Assume it's set correctly in .env

    // Generate sitemap URLs for dynamic blog posts
    const blogSitemapUrls = blogPosts.map( ( post ) => ( {
        url: `${ baseUrl }/blog/${ post.slug }`,
        lastModified: new Date( post.updatedAt ).toISOString(),
        priority: 0.7, // Blog posts can have medium priority
        changefreq: 'weekly', // Blogs may update weekly
    } ) );

    // Manually add static pages
    const staticUrls = [
        {
            url: `${ baseUrl }/`,
            lastModified: new Date().toISOString(),
            priority: 1.0, // Homepage has highest priority
            changefreq: 'daily',
        },
        {
            url: `${ baseUrl }/about`,
            lastModified: new Date().toISOString(),
            priority: 0.8,
            changefreq: 'monthly',
        },
        {
            url: `${ baseUrl }/crm`,
            lastModified: new Date().toISOString(),
            priority: 0.7,
            changefreq: 'monthly',
        },
        {
            url: `${ baseUrl }/pricing`,
            lastModified: new Date().toISOString(),
            priority: 0.9,
            changefreq: 'monthly',
        },
        {
            url: `${ baseUrl }/faqs`,
            lastModified: new Date().toISOString(),
            priority: 0.6,
            changefreq: 'monthly',
        },
        {
            url: `${ baseUrl }/ticketing`,
            lastModified: new Date().toISOString(),
            priority: 0.7,
            changefreq: 'monthly',
        },
        {
            url: `${ baseUrl }/marketing`,
            lastModified: new Date().toISOString(),
            priority: 0.7,
            changefreq: 'monthly',
        },
        {
            url: `${ baseUrl }/analytics`,
            lastModified: new Date().toISOString(),
            priority: 0.7,
            changefreq: 'monthly',
        },
        {
            url: `${ baseUrl }/qrcode`,
            lastModified: new Date().toISOString(),
            priority: 0.7,
            changefreq: 'monthly',
        },
        {
            url: `${ baseUrl }/blog`,
            lastModified: new Date().toISOString(),
            priority: 0.7,
            changefreq: 'weekly',
        },
        {
            url: `${ baseUrl }/privacy`,
            lastModified: new Date().toISOString(),
            priority: 0.5,
            changefreq: 'yearly',
        },
        {
            url: `${ baseUrl }/terms`,
            lastModified: new Date().toISOString(),
            priority: 0.5,
            changefreq: 'yearly',
        },
        {
            url: `${ baseUrl }/contact`,
            lastModified: new Date().toISOString(),
            priority: 0.7,
            changefreq: 'monthly',
        },
        
    ];

    // Combine both dynamic and static URLs
    return [ ...blogSitemapUrls, ...staticUrls ];
}
