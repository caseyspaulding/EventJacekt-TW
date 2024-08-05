import { pgTable, uuid, text, timestamp, numeric } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Organizations Table
export const organizations = pgTable('organizations', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    name: text('name').notNull().unique(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// User Profiles Table
export const userProfiles = pgTable('user_profiles', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    userId: uuid('user_id').notNull(), // Will reference auth.users
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    organizationName: text('organization_name').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Events Table
export const events = pgTable('events', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Customers Table
export const customers = pgTable('customers', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgPaymentId: uuid('org_payment_id')
        .notNull()
        .references(() => orgPayments.id), // Reference to org_payments
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Org Payments Table (Stripe Connect)
export const orgPayments = pgTable('org_payments', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    stripeAccountId: text('stripe_account_id').notNull().unique(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Tickets Table
export const tickets = pgTable('tickets', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to organizations
    customerId: uuid('customer_id')
        .notNull()
        .references(() => customers.id), // Reference to customers
    name: text('name').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(), // Ticket price
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Orders Table
export const orders = pgTable('orders', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    customerId: uuid('customer_id')
        .notNull()
        .references(() => customers.id),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(), // Total amount of the order
    stripePaymentId: text('stripe_payment_id').notNull().unique(), // Stripe Payment ID
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Order Items Table
export const orderItems = pgTable('order_items', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orderId: uuid('order_id')
        .notNull()
        .references(() => orders.id),
    ticketId: uuid('ticket_id')
        .notNull()
        .references(() => tickets.id),
    quantity: numeric('quantity').notNull(), // Quantity of tickets
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(), // Price per ticket
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Org Members Table
export const orgMembers = pgTable('org_members', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    role: text('role').notNull(), // Role within the organization
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Performers Table
export const performers = pgTable('performers', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    name: text('name').notNull(),
    stageName: text('stage_name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Vendors Table
export const vendors = pgTable('vendors', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    name: text('name').notNull(),
    businessName: text('business_name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Invites Table
export const invites = pgTable('invites', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    email: text('email').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});
