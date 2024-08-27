import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { getEventIdBySlug } from "@/app/actions/getEventIdBySlug";
import { eq } from "drizzle-orm/expressions";
import { JsonLd } from 'react-schemaorg';
import type { Event as SchemaEvent } from 'schema-dts'
import { events, orgTicketTypes, organizations } from "@/db/schema";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import { absoluteUrl } from "@/lib/utils";
import type { Metadata } from "next";
import EventImage from "@/components/EventHomeOne/Hero/EventImage";
import Countdown from "@/components/EventHomeOne/Hero/Countdown";
import BuyTicketsButton from "@/components/EventHomeOne/BuyTicketsButton";
import StickyFooterBuyTickets from "@/components/EventHomeOne/StickeyFooterBuyTickets";



export async function generateMetadata (
    { params }: { params: Params }
): Promise<Metadata>
{
    const eventSlug = params.eventSlug;
    const eventId = await getEventIdBySlug( eventSlug );

    if ( !eventId )
    {
        return {
            title: 'Event Not Found',
            description: 'The requested event could not be found.',
        };
    }

    const eventWithOrg = await db
        .select( {
            eventId: events.id,
            eventName: events.name,
            description: events.description,
            startDate: events.startDate,
            endDate: events.endDate,
            featuredImage: events.featuredImage,
            venue: events.venue,
            city: events.city,
            state: events.state,
            zipCode: events.zipCode,
            country: events.country,
            orgId: events.orgId,
            orgName: organizations.name, // Fetch org name
        } )
        .from( events )
        .innerJoin( organizations, eq( events.orgId, organizations.id ) ) // Perform a join on orgId
        .where( eq( events.id, eventId ) )
        .limit( 1 );

    const eventData = eventWithOrg[ 0 ];

    if ( !eventData )
    {
        return {
            title: 'Event Not Found',
            description: 'The requested event could not be found.',
        };
    }

    const title = `${ eventData.eventName } | EventJacket`;
    const description = eventData.description || `Join us for ${ eventData.eventName }`;
    const imageUrl = absoluteUrl( eventData.featuredImage || '/images/event-default.jpg' );

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: absoluteUrl( `/events/${ eventSlug }` ),
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: eventData.eventName,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ imageUrl ],
        },
    };
}
interface Params
{
    eventSlug: string;
}

export default async function EventPage ( { params }: { params: Params } )
{
    const eventSlug = params.eventSlug;
    const eventId = await getEventIdBySlug( eventSlug );

    if ( !eventId )
    {
        notFound();
    }

    const eventWithOrg = await db
        .select( {
            eventId: events.id,
            eventName: events.name,
            description: events.description,
            startDate: events.startDate,
            endDate: events.endDate,
            featuredImage: events.featuredImage,
            venue: events.venue,
            city: events.city,
            state: events.state,
            zipCode: events.zipCode,
            country: events.country,
            orgId: events.orgId,
            orgName: organizations.name, // Fetch org name
        } )
        .from( events )
        .innerJoin( organizations, eq( events.orgId, organizations.id ) ) // Perform a join on orgId
        .where( eq( events.id, eventId ) )
        .limit( 1 );

    const eventData = eventWithOrg[ 0 ];

    if ( !eventData )
    {
        return {
            title: 'Event Not Found',
            description: 'The requested event could not be found.',
        };
    }

    const tickets = await db
        .select( {
            id: orgTicketTypes.id,
            eventId: orgTicketTypes.eventId,
            orgId: orgTicketTypes.orgId,
            name: orgTicketTypes.name,
            description: orgTicketTypes.description,
            price: orgTicketTypes.price,
            quantity: orgTicketTypes.quantity,
            eventDate: orgTicketTypes.eventDate,
            saleStartDate: orgTicketTypes.saleStartDate,
            saleEndDate: orgTicketTypes.saleEndDate,
            isEarlyBird: orgTicketTypes.isEarlyBird,
            maxPerCustomer: orgTicketTypes.maxPerCustomer,
            isFree: orgTicketTypes.isFree,
            category: orgTicketTypes.category,
            promoCodeRequired: orgTicketTypes.promoCodeRequired,
            availableOnline: orgTicketTypes.availableOnline,
            groupDiscountAvailable: orgTicketTypes.groupDiscountAvailable,
            refundable: orgTicketTypes.refundable,
            currency: orgTicketTypes.currency,
            salesLimitPerDay: orgTicketTypes.salesLimitPerDay,
            createdAt: orgTicketTypes.createdAt,
            updatedAt: orgTicketTypes.updatedAt,
        } )
        .from( orgTicketTypes )
        .where( eq( orgTicketTypes.eventId, eventId ) );
    
    const ticketType = await db
        .select( {
            id: orgTicketTypes.id,
            eventId: orgTicketTypes.eventId,
            orgId: orgTicketTypes.orgId,
            name: orgTicketTypes.name,
            description: orgTicketTypes.description,
            price: orgTicketTypes.price,
            quantity: orgTicketTypes.quantity,
            eventDate: orgTicketTypes.eventDate,
            saleStartDate: orgTicketTypes.saleStartDate,
            saleEndDate: orgTicketTypes.saleEndDate,
            isEarlyBird: orgTicketTypes.isEarlyBird,
            maxPerCustomer: orgTicketTypes.maxPerCustomer,
            isFree: orgTicketTypes.isFree,
            category: orgTicketTypes.category,
            promoCodeRequired: orgTicketTypes.promoCodeRequired,
            availableOnline: orgTicketTypes.availableOnline,
            groupDiscountAvailable: orgTicketTypes.groupDiscountAvailable,
            refundable: orgTicketTypes.refundable,
            currency: orgTicketTypes.currency,
            salesLimitPerDay: orgTicketTypes.salesLimitPerDay,
            createdAt: orgTicketTypes.createdAt,
            updatedAt: orgTicketTypes.updatedAt,
        } )
        .from( orgTicketTypes )
        .where( eq( orgTicketTypes.eventId, eventId ) )
        .limit( 1 ); // Assuming you want the first ticket type found

    if ( !ticketType.length )
    {
        notFound();
    }

    const ticket = ticketType[ 0 ]; // Use the first ticket type found
 

    return (
        <>
            <JsonLd<SchemaEvent>
                item={ {
                    "@context": "https://schema.org",
                    "@type": "Event",
                    name: eventData.eventName,
                    description: eventData.description || "No description available",
                    startDate: eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : "",
                    endDate: eventData.endDate ? new Date( eventData.endDate ).toLocaleDateString() : "",
                    location: {
                        "@type": "Place",
                        name: eventData.venue || "No venue available",
                        address: {
                            "@type": "PostalAddress",
                            addressLocality: eventData.city || "No city available",
                            addressRegion: eventData.state || "No state available",
                            postalCode: eventData.zipCode || "No zip code available",
                            addressCountry: eventData.country || "No country available",
                        },
                    },
                    image: [
                        absoluteUrl( eventData.featuredImage || '/images/event-default.jpg' ),
                    ],
                    offers: tickets.map( ticket => ( {
                        "@type": "Offer",
                        price: ticket.price || "0.00",
                        priceCurrency: ticket.currency || "USD",
                        availability: ticket.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                        url: absoluteUrl( `/events/${ eventSlug }` ),
                    } ) ),
                } }
            />
            <NavBar1 />
            
            <main className="pb-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
                {/* Header */ }
                
                <header
                    className="w-full h-[460px] xl:h-[537px] bg-no-repeat bg-cover bg-center bg-blend-darken relative"
                    style={ { backgroundImage: `url('${ eventData.featuredImage }')` } }
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
                    <div className="absolute top-20 left-1/2 px-4 mx-auto w-full max-w-screen-xl -translate-x-1/2 xl:top-1/2 xl:-translate-y-1/2 xl:px-0">
                        <span className="block mb-4 text-gray-300">
                            
                            <h1 className="font-extrabold  text-5xl  text-white ">
                                { eventData.eventName}
                            </h1>
                        </span>
                        <h2 className="mb-4 max-w-4xl text-xl font-semiboldleading-none text-white sm:text-3xl lg:text-4xl">
                            { eventData.description }
                        </h2>
                        <Countdown startDate={ ticket.eventDate ? ticket.eventDate.toString() : "" }
                            color="text-blue-200" // Text color for numbers
                            labelColor="text-blue-100" // Text color for labels
                          />
                        
                    </div>
                </header>

                {/* Main Content */ }
                <div className="flex relative z-20 justify-between shadow-2xl p-6 -m-36 mx-4 max-w-screen-xl bg-white dark:bg-gray-800 rounded-2xl xl:-m-32 xl:p-9 xl:mx-auto">
                    <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-2">
                            <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-base lg:mb-0">
                               
                               
                            </div>
                            {/* Social Media Share */ }
                            <aside aria-label="Share social media">
                                <div className="not-format">
                                    {/* Add social media share buttons here */ }
                                </div>
                            </aside>
                        </div>
                        {/* Article Content */ }
                       
                        
                        
                       
                        <EventImage
                            imageUrl={ eventData.featuredImage || '' }
                            alt={ `${ eventData.eventName } image` }
                            overlayColor=""
                            height="h-[260px] xl:h-[437px]"
                        >   
                        </EventImage>
                        <div className="mt-8">
                        <span className="">
                            Event By{ " " }
                            <a href="#" className="text-gray-900 mt-3 dark:text-white hover:underline no-underline font-semibold">
                                { eventData.orgName }
                            </a>
                            </span>
                        </div>
                        <h2 className="text-2xl mt-4 mb-2 font-bold text-gray-900">
                            Location
                        </h2>
                        <p className="text-lg font-normal mb-2 text-gray-900">
                             { eventData.venue }   
                        </p>
                        <h2 className="text-2xl mb-2 font-bold text-gray-900">
                            Dates
                        </h2>
                        <p className="text-lg font-normal text-gray-900">
                            { eventData.startDate && eventData.endDate ? (
                                <>
                                    { new Date( eventData.startDate ).toLocaleDateString() } - { new Date( eventData.endDate ).toLocaleDateString() }
                                </>
                            ) : eventData.startDate ? (
                                new Date( eventData.startDate ).toLocaleDateString()
                            ) : eventData.endDate ? (
                                new Date( eventData.endDate ).toLocaleDateString()
                            ) : (
                                "No dates available"
                            ) }
                        </p>
                        <p className="lead">Flowbite is an open-source library of UI components built with the utility-first
                            classes from Tailwind CSS. It also includes interactive elements such as dropdowns, modals,
                            datepickers.</p>
                        <p>Before going digital, you might benefit from scribbling down some ideas in a sketchbook. This way,
                            you can think things through before committing to an actual design project.</p>
                        <p>But then I found a <a href="https://flowbite.com">component library based on Tailwind CSS called
                            Flowbite</a>. It comes with the most commonly used UI components, such as buttons, navigation
                            bars, cards, form elements, and more which are conveniently built with the utility classes from
                            Tailwind CSS.</p>
                        <figure><img src="https://flowbite.s3.amazonaws.com/typography-plugin/typography-image-1.png" alt="" className="mx-auto"/>
                            <figcaption>Digital art by Anonymous</figcaption>
                        </figure>
                        <h2>Getting started with Flowbite</h2>
                        <p>First of all you need to understand how Flowbite works. This library is not another framework.
                            Rather, it is a set of components based on Tailwind CSS that you can just copy-paste from the
                            documentation.</p>
                        <p>It also includes a JavaScript file that enables interactive components, such as modals, dropdowns,
                            and datepickers which you can optionally include into your project via CDN or NPM.</p>
                        <p>You can check out the <a href="https://flowbite.com/docs/getting-started/quickstart/">quickstart
                            guide</a> to explore the elements by including the CDN files into your project. But if you want
                            to build a project with Flowbite I recommend you to follow the build tools steps so that you can
                            purge and minify the generated CSS.</p>
                        <p>You'll also receive a lot of useful application UI, marketing UI, and e-commerce pages that can help
                            you get started with your projects even faster. You can check out this <a
                                href="https://flowbite.com/docs/components/tables/">comparison table</a> to better understand
                            the differences between the open-source and pro version of Flowbite.</p>
                        <h2>When does design come in handy?</h2>
                        <p>While it might seem like extra work at a first glance, here are some key moments in which prototyping
                            will come in handy:</p>
                        <ol>
                            <li><strong>Usability testing</strong>. Does your user know how to exit out of screens? Can they
                                follow your intended user journey and buy something from the site you’ve designed? By running a
                                usability test, you’ll be able to see how users will interact with your design once it’s live;
                            </li>
                            <li><strong>Involving stakeholders</strong>. Need to check if your GDPR consent boxes are displaying
                                properly? Pass your prototype to your data protection team and they can test it for real;</li>
                            <li><strong>Impressing a client</strong>. Prototypes can help explain or even sell your idea by
                                providing your client with a hands-on experience;</li>
                            <li><strong>Communicating your vision</strong>. By using an interactive medium to preview and test
                                design elements, designers and developers can understand each other — and the project — better.
                            </li>
                        </ol>
                        <h3>Laying the groundwork for best design</h3>
                        <p>Before going digital, you might benefit from scribbling down some ideas in a sketchbook. This way,
                            you can think things through before committing to an actual design project.</p>
                        <p>Let's start by including the CSS file inside the <code>head</code> tag of your HTML.</p>
                        <h3>Understanding typography</h3>
                        <h4>Type properties</h4>
                        <p>A typeface is a collection of letters. While each letter is unique, certain shapes are shared across
                            letters. A typeface represents shared patterns across a collection of letters.</p>
                        <h4>Baseline</h4>
                        <p>A typeface is a collection of letters. While each letter is unique, certain shapes are shared across
                            letters. A typeface represents shared patterns across a collection of letters.</p>
                        <h4>Measurement from the baseline</h4>
                        <p>A typeface is a collection of letters. While each letter is unique, certain shapes are shared across
                            letters. A typeface represents shared patterns across a collection of letters.</p>
                        <h3>Type classification</h3>
                        <h4>Serif</h4>
                        <p>A serif is a small shape or projection that appears at the beginning or end of a stroke on a letter.
                            Typefaces with serifs are called serif typefaces. Serif fonts are classified as one of the
                            following:</p>
                        <h4>Old-Style serifs</h4>
                        <ul>
                            <li>Low contrast between thick and thin strokes</li>
                            <li>Diagonal stress in the strokes</li>
                            <li>Slanted serifs on lower-case ascenders</li>
                        </ul><img src="https://flowbite.s3.amazonaws.com/typography-plugin/typography-image-2.png" alt=""/>
                            <ol>
                                <li>Low contrast between thick and thin strokes</li>
                                <li>Diagonal stress in the strokes</li>
                                <li>Slanted serifs on lower-case ascenders</li>
                            </ol>
                            <h3>Laying the best for successful prototyping</h3>
                            <p>A serif is a small shape or projection that appears at the beginning:</p>
                            <blockquote>
                                <p>Flowbite is just awesome. It contains tons of predesigned components and pages starting from
                                    login screen to complex dashboard. Perfect choice for your next SaaS application.</p>
                            </blockquote>
                            <h4>Code example</h4>
                            <p>A serif is a small shape or projection that appears at the beginning or end of a stroke on a letter.
                                Typefaces with serifs are called serif typefaces. Serif fonts are classified as one of the
                                following:</p>
                    </article>
                    

                    {/* Sidebar */ }
                    <aside className="hidden xl:block" aria-labelledby="sidebar-label">
                        <div className="xl:w-[336px] sticky top-20">
                            <h3 id="sidebar-label" className="sr-only">Sidebar</h3>
                            {/* Buy Tickets Card */ }
                            
                            <BuyTicketsButton eventSlug={ eventSlug } priceRange={ ticket.price } />
                           
                            {/* Sidebar content */ }
                        </div>
                    </aside>
                </div>
            </main>
            <StickyFooterBuyTickets eventSlug={ eventSlug } priceRange={ticket.price} />
        </>
    );
}