import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, numeric, serial, varchar, integer, boolean, PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core';



// Organizations Table
export const organizations = pgTable( 'organizations', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    name: text( 'name' ).notNull().unique(),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// User Profiles Table
export const userProfiles = pgTable( 'user_profiles', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    userId: uuid( 'user_id' ).notNull(), // Will reference auth.users
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    organizationName: text( 'organization_name' ).notNull(),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Events Table
export const events = pgTable( 'events', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' ).notNull().references( () => organizations.id ),
    name: text( 'name' ).notNull(),
    featuredImage: varchar( 'featured_image', { length: 255 } ), // URL of the featured image
    slug: text( 'slug' ).notNull().unique(), // Add a slug column for SEO-friendly URLs
    description: text( 'description' ),
    startDate: timestamp( 'start_date' ),
    endDate: timestamp( 'end_date' ),
    venue: text( 'venue' ),
    address: text( 'address' ),
    city: text( 'city' ),
    state: text( 'state' ),
    country: text( 'country' ),
    zipCode: text( 'zip_code' ),
    maxAttendees: integer( 'max_attendees' ),
    status: text( 'status' ).notNull().default( 'draft' ), // e.g., 'draft', 'published', 'cancelled'
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),
} );


// Customers Table
export const customers = pgTable( 'customers', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgPaymentId: uuid( 'org_payment_id' )
        .notNull()
        .references( () => orgPayments.id ), // Reference to org_payments
    name: text( 'name' ).notNull(),
    email: text( 'email' ).notNull().unique(),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Org Payments Table (Stripe Connect)
export const orgPayments = pgTable( 'org_payments', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    stripeAccountId: text( 'stripe_account_id' ).notNull().unique(),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


// Ticket Types Table
export const ticketTypes = pgTable( 'ticket_types', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' ).notNull().references( () => events.id ),
    orgId: uuid( 'org_id' ).notNull().references( () => organizations.id ),
    name: text( 'name' ).notNull(),
    description: text( 'description' ),
    price: numeric( 'price', { precision: 10, scale: 2 } ).notNull(),
    quantity: integer( 'quantity' ).notNull(),
    saleStartDate: timestamp( 'sale_start_date' ).notNull(),
    saleEndDate: timestamp( 'sale_end_date' ).notNull(),
    isEarlyBird: boolean( 'is_early_bird' ).default( false ),
    maxPerCustomer: integer( 'max_per_customer' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Tickets Table
export const tickets = pgTable( 'tickets', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' ).notNull().references( () => events.id ),
    orgId: uuid( 'org_id' ).notNull().references( () => organizations.id ),
    customerId: uuid( 'customer_id' ).references( () => customers.id ),
    ticketTypeId: uuid( 'ticket_type_id' ).notNull().references( () => ticketTypes.id ), // New field
    name: text( 'name' ).notNull(),
    price: numeric( 'price', { precision: 10, scale: 2 } ).notNull(),
    status: text( 'status' ).notNull().default( 'available' ), // e.g., 'available', 'sold', 'reserved'
    validFrom: timestamp( 'valid_from' ).notNull(),
    validUntil: timestamp( 'valid_until' ).notNull(),
    barcode: text( 'barcode' ).unique(),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );



// Orders Table
export const orders = pgTable( 'orders', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    customerId: uuid( 'customer_id' )
        .notNull()
        .references( () => customers.id ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    totalAmount: numeric( 'total_amount', { precision: 10, scale: 2 } ).notNull(), // Total amount of the order
    stripePaymentId: text( 'stripe_payment_id' ).notNull().unique(), // Stripe Payment ID
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Order Items Table
export const orderItems = pgTable( 'order_items', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orderId: uuid( 'order_id' )
        .notNull()
        .references( () => orders.id ),
    ticketId: uuid( 'ticket_id' )
        .notNull()
        .references( () => tickets.id ),
    quantity: numeric( 'quantity' ).notNull(), // Quantity of tickets
    unitPrice: numeric( 'unit_price', { precision: 10, scale: 2 } ).notNull(), // Price per ticket
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Org Members Table
export const orgMembers = pgTable( 'org_members', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    name: text( 'name' ).notNull(),
    email: text( 'email' ).notNull().unique(),
    role: text( 'role' ).notNull(), // Role within the organization
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Performers Table
export const performers = pgTable( 'performers', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    name: text( 'name' ).notNull(),
    stageName: text( 'stage_name' ).notNull(),
    email: text( 'email' ).notNull().unique(),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Vendors Table
export const vendors = pgTable( 'vendors', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    name: text( 'name' ).notNull(),
    businessName: text( 'business_name' ).notNull(),
    email: text( 'email' ).notNull().unique(),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Invites Table
export const invites = pgTable( 'invites', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    email: text( 'email' ).notNull(),
    status: text( 'status' ).notNull(),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// EventJacket Blog Table
export const blogPosts = pgTable( 'blog_posts', {
    id: serial( 'id' ).primaryKey(),
    slug: varchar( 'slug', { length: 255 } ).notNull().unique(),
    title: text( 'title' ).notNull(),
    content: text( 'content' ).notNull(),
    excerpt: text( 'excerpt' ),
    author: varchar( 'author', { length: 100 } ).notNull(),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
    publishedAt: timestamp( 'published_at' ),
    tags: text( 'tags' ).array(),
    featuredImage: varchar( 'featured_image', { length: 255 } ), 
} );

// Ticket Sales Pages Table
export const ticketPages = pgTable( 'ticket_pages', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' ).notNull().references( () => events.id ),
    orgId: uuid( 'org_id' ).notNull().references( () => organizations.id ),
    url: text( 'url' ).notNull().unique(), // Unique URL for the ticket sales page
    pageTitle: text( 'page_title' ).notNull(), // Custom title for the page
    description: text( 'description' ), // Description or details for the sales page
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Ticket Analytics Table
export const ticketAnalytics = pgTable( 'ticket_analytics', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    ticketPageId: uuid( 'ticket_page_id' ).notNull().references( () => ticketPages.id ),
    views: integer( 'views' ).default( 0 ), // Number of times the page was viewed
    clicks: integer( 'clicks' ).default( 0 ), // Number of times tickets were clicked on the page
    purchases: integer( 'purchases' ).default( 0 ), // Number of ticket purchases
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export type TicketType = {
    id: string;
    eventId: string;
    orgId: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    saleStartDate: Date;
    saleEndDate: Date;
    isEarlyBird?: boolean;
    maxPerCustomer?: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Ticket = {
    id: string;
    eventId: string;
    orgId: string;
    customerId?: string;
    ticketTypeId: string;
    name: string;
    price: number;
    status: 'available' | 'sold' | 'reserved';
    validFrom: Date;
    validUntil: Date;
    barcode?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Event = {
    id: string;
    orgId: string;
    organizationName: string;
    name: string;
    featuredImage?: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    venue?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    maxAttendees?: number;
    status: 'draft' | 'published' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
};