import { stripe } from '@/utils/stripe';
import { sql } from 'drizzle-orm';
import {
    pgTable,
    uuid,
    text,
    timestamp,
    numeric,
    serial,
    varchar,
    integer,
    boolean,
    PgColumn,
    PgTableWithColumns,
    date,
    jsonb
} from 'drizzle-orm/pg-core';

// Organizations Table
export const organizations = pgTable('organizations', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    name: text('name').notNull().unique(),

    contactPhone: text('contact_phone'),
    website: text('website'),
    address: text('address'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
    zipCode: text('zip_code'),
    logoUrl: text('logo_url'),
    industry: text('industry'), // e.g., 'non-profit', 'entertainment', 'education'
    orgType: text('org_type'), // e.g., 'non-profit', 'business', 'government'
    foundedDate: date('founded_date'), // Date the organization was founded
    numberOfEmployees: integer('number_of_employees'), // Size of the organization
    annualRevenue: numeric('annual_revenue', { precision: 15, scale: 2 }), // Organization's annual revenue
    socialMediaLinks: jsonb('social_media_links'), // Links to social media profiles
    affiliatedOrganizations: jsonb('affiliated_organizations'), // Affiliated organizations or partnerships
    isVerified: boolean('is_verified').default(false), // Flag for verified organizations
    subscriptionStatus: text('subscription_status'), // e.g., 'active', 'expired', 'trial'
    lastActivity: timestamp('last_activity'),
    status: text('status').default('active').notNull(),
    stripeAccountId: varchar('stripe_account_id'),
    stripeConnectLinked: boolean('stripe_connect_linked'),
    stripeAccountCreated: timestamp('stripe_account_created'),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

// Stripe Connect Onboarding Table (for Express accounts)
export const stripeConnectOnboarding = pgTable('stripe_connect_onboarding', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    userProfileId: uuid('user_profile_id')
        .notNull()
        .references(() => userProfiles.id),
    stripeAccountId: text('stripe_account_id').notNull(),
    onboardingStatus: text('onboarding_status').notNull(), // e.g., 'pending', 'completed', 'rejected'
    onboardingUrl: text('onboarding_url'),
    onboardingStartedAt: timestamp('onboarding_started_at').defaultNow(),
    onboardingCompletedAt: timestamp('onboarding_completed_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// User Profiles Table
export const userProfiles = pgTable('user_profiles', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    userId: uuid('user_id').notNull(), // Will reference auth.users table in Supabase
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    profileImageUrl: text('profile_image_url'),
    organizationName: text('organization_name').notNull(),
    role: text('role').notNull().default('user'), // User's role within the organization
    contactNumber: text('contact_number'), // Contact phone number
    bio: text('bio'), // User biography or description

    socialLinks: jsonb('social_links'), // Links to social media profiles
    isActive: boolean('is_active').default(true), // Active status flag
    lastLogin: timestamp('last_login'), // Last login timestamp
    permissions: jsonb('permissions'), // JSON field for user-specific permissions
    preferences: jsonb('preferences'), // JSON field for storing user preferences
    department: text('department'), // Department within the organization
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
    stripeConnectedAccountId: text('connected_account_id'), // Stripe Connect account ID
    stripeCustomerId: text('stripe_customer_id'), // Stripe Customer ID
    stripeAccountType: text('stripe_account_type'), // e.g., 'express', 'standard', 'custom'
    stripeAccountStatus: text('stripe_account_status'), // e.g., 'active', 'pending', 'restricted'
    stripeAccountCountry: text('stripe_account_country'), // e.g., 'US', 'CA', 'GB'
    stripeAccountCreated: timestamp('stripe_account_created'), // Date when the Stripe account was created
    stripeSubscriptionId: text('stripe_subscription_id'), // Stripe Subscription ID
    stripeLastPayoutDate: timestamp('stripe_last_payout_date'), // Date of the last payout
    stripeAccountBalance: numeric('stripe_account_balance', { precision: 15, scale: 2 }), // Current balance in the Stripe account
    stripeVerificationDueDate: timestamp('stripe_verification_due_date'), // Due date for Stripe verification
    stripeTaxInformation: jsonb('stripe_tax_information'), // JSON field for tax-related information
    stripePayoutMethod: text('stripe_payout_method'), // e.g., 'bank_transfer', 'debit_card'
    stripeDefaultCurrency: text('stripe_default_currency'), // e.g., 'USD', 'EUR'

    stripeConnectLinked: boolean('stripe_connect_linked').default(false) // Indicates if the Stripe account is linked
});

// Ticket Buyer Profiles Table
export const ticketBuyerProfiles = pgTable('ticket_buyer_profiles', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    userId: uuid('user_id').notNull(), // Will reference auth.users table in Supabase
    profileImageUrl: text('profile_image_url'), // Optional profile image
    contactNumber: text('contact_number'), // Contact phone number
    bio: text('bio'), // Optional bio or description
    socialLinks: jsonb('social_links'), // Links to social media profiles
    isActive: boolean('is_active').default(true), // Active status flag
    lastLogin: timestamp('last_login'), // Last login timestamp
    preferences: jsonb('preferences'), // JSON field for storing user preferences
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),

    // Stripe-related fields
    stripeCustomerId: text('stripe_customer_id'), // Stripe Customer ID
    stripeDefaultCurrency: text('stripe_default_currency') // e.g., 'USD', 'EUR'
});

// Subscription Products Table
export const subscriptionProducts = pgTable('subscription_products', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    name: text('name').notNull().unique(),
    stripeProductId: text('stripe_product_id').notNull().unique(),
    stripePriceId: text('stripe_price_id').notNull().unique(),
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(), // Price of the subscription product
    billingInterval: text('billing_interval').notNull(), // e.g., 'monthly', 'annual'
    trialPeriodDays: integer('trial_period_days').default(sql`0`), // Number of trial period days, if applicable
    isPopular: boolean('is_popular').default(false), // Flag for popular products
    featureSet: jsonb('feature_set'), // List of features included in the product
    targetAudience: text('target_audience'), // e.g., 'small_business', 'enterprise', 'individual'
    isActive: boolean('is_active').default(true), // Indicates if the product is active
    salesCount: integer('sales_count').default(sql`0`), // Track product sales
    promotionDetails: jsonb('promotion_details'), // Details of promotions or discounts
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Subscriptions Table
export const subscriptions = pgTable('subscriptions', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    userProfileId: uuid('user_profile_id')
        .notNull()
        .references(() => userProfiles.id), // Reference to the userProfiles table
    productId: uuid('product_id')
        .notNull()
        .references(() => subscriptionProducts.id),
    stripeCustomerId: text('stripe_customer_id').notNull(),
    stripeSubscriptionId: text('stripe_subscription_id').notNull(),
    subscriptionStatus: text('subscription_status').notNull(), // e.g., 'active', 'canceled', 'past_due', 'trial'
    subscriptionStartDate: timestamp('subscription_start_date').notNull(),
    subscriptionEndDate: timestamp('subscription_end_date'),
    isStripeConnectAccount: boolean('is_stripe_connect_account').default(false), // Indicates if the subscription is for a Stripe Connect account
    billingInterval: text('billing_interval').notNull(), // e.g., 'monthly', 'annual'
    trialEndDate: timestamp('trial_end_date'), // End date of the trial period, if applicable
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false), // Indicates if the subscription will cancel at the period end
    cancellationDate: timestamp('cancellation_date'), // Date when the subscription was canceled, if applicable
    renewalCount: integer('renewal_count').default(sql`0`), // Number of times the subscription has been renewed
    revenueGenerated: numeric('revenue_generated', { precision: 15, scale: 2 }).default(sql`0`), // Total revenue generated from the subscription
    lastPaymentDate: timestamp('last_payment_date'), // Date of the last payment made
    nextBillingDate: timestamp('next_billing_date'), // Date of the next scheduled billing
    notes: text('notes'), // Additional notes or information
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
    featuredImage: varchar('featured_image', { length: 255 }), // URL of the featured image
    slug: text('slug').notNull().unique(), // Add a slug column for SEO-friendly URLs
    description: text('description'),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    venue: text('venue'),
    address: text('address'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
    zipCode: text('zip_code'),
    maxAttendees: integer('max_attendees'),
    status: text('status').notNull().default('draft'), // e.g., 'draft', 'published', 'cancelled'
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Event Session Table
export const eventSessions = pgTable('event_sessions', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the org table for multi-tenancy
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    name: text('name').notNull(),
    description: text('description'),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    location: text('location'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Event Schedules Table
export const eventSchedules = pgTable('event_schedules', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the org table for multi-tenancy
    customerId: uuid('customer_id')
        .notNull()
        .references(() => orgCustomers.id),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    sessionId: uuid('session_id')
        .notNull()
        .references(() => eventSessions.id),
    notes: text('notes'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Org Customers Table
export const orgCustomers = pgTable('org_customers', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),

    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone'),
    address: text('address'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
    zipCode: text('zip_code'),
    profileImageUrl: text('profile_image_url'), // URL of the customer's profile image
    status: text('status').default('active'),
    metadata: jsonb('metadata'),
    notes: text('notes'),
    favoriteEventId: uuid('favorite_event_id').references(() => events.id), // Reference to favorite event
    favoritePerformerId: uuid('favorite_performer_id').references(() => orgPerformers.id), // Reference to favorite performer
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
    accountType: text('account_type').notNull().default('standard'), // Type of Stripe account
    totalPayouts: numeric('total_payouts', { precision: 15, scale: 2 }).default(sql`0`), // Total amount of payouts
    lastPayoutDate: timestamp('last_payout_date'), // Date of the last payout
    pendingBalance: numeric('pending_balance', { precision: 15, scale: 2 }).default(sql`0`), // Current pending balance in Stripe
    availableBalance: numeric('available_balance', { precision: 15, scale: 2 }).default(sql`0`), // Current available balance in Stripe
    lastTransactionDate: timestamp('last_transaction_date'), // Date of the last transaction
    totalFeesPaid: numeric('total_fees_paid', { precision: 15, scale: 2 }).default(sql`0`), // Total amount of fees paid to Stripe
    status: text('status').notNull().default('active'), // Status of the Stripe account
    country: text('country'), // Country of the Stripe account
    notes: text('notes'), // Additional notes or information
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Ticket Types Table
export const orgTicketTypes = pgTable('org_ticket_types', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    name: text('name').notNull(), // e.g., "Friday Ticket", "Saturday Ticket"
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    eventDate: date('event_date').notNull(), // New column to represent the specific day of the event
    saleStartDate: date('sale_start_date').notNull(),
    saleEndDate: date('sale_end_date').notNull(),
    isEarlyBird: boolean('is_early_bird').default(false),
    maxPerCustomer: integer('max_per_customer'),
    isFree: boolean('is_free').default(false), // Flag for free tickets
    category: text('category'), // e.g., 'general', 'VIP', 'student'
    promoCodeRequired: boolean('promo_code_required').default(false), // Indicates if a promo code is needed
    availableOnline: boolean('available_online').default(true), // Indicates if the ticket is available online
    groupDiscountAvailable: boolean('group_discount_available').default(false), // Flag for group discounts
    refundable: boolean('refundable').default(true), // Indicates if the ticket is refundable
    currency: text('currency').default('USD'), // Currency of the ticket price
    salesLimitPerDay: integer('sales_limit_per_day').default(0), // Daily sales limit
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Enhanced Tickets Table
export const orgEventTickets = pgTable('org_event_tickets', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    customerId: uuid('customer_id').references(() => orgCustomers.id), // Who bought the ticket
    ticketTypeId: uuid('ticket_type_id')
        .notNull()
        .references(() => orgTicketTypes.id), // Reference to ticketTypes
    name: text('name').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull(), // Currency of the ticket price
    status: text('status').notNull().default('available'), // e.g., 'available', 'sold', 'reserved', 'used', 'expired', 'canceled'
    validFrom: date('valid_from'),
    validUntil: date('valid_until'),
    barcode: text('barcode').unique(), // Barcode for ticket validation
    qrCode: text('qr_code'), // QR Code for ticket validation
    purchaseDate: timestamp('purchase_date'), // Date of purchase
    salesChannel: text('sales_channel'), // e.g., 'online', 'box office', 'partner'
    promotionCode: text('promotion_code'), // Applied promotion or discount code
    promotionName: text('promotion_name'), // Name of the applied promotion
    discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }), // Amount of the discount applied
    finalPrice: numeric('final_price', { precision: 10, scale: 2 }), // Final price after discount
    seatNumber: text('seat_number'), // Seat number or location (if applicable)
    isRefunded: boolean('is_refunded').default(false), // Indicate if ticket was refunded
    refundDate: timestamp('refund_date'), // Date of refund (if applicable)
    checkInStatus: text('check_in_status').default('not_checked_in'), // e.g., 'checked_in', 'not_checked_in'
    notes: text('notes'), // Additional notes or information
    isVIP: boolean('is_vip').default(false), // Indicates if the ticket grants VIP access
    accessLevel: text('access_level'), // Access level for the event (e.g., general admission, VIP)
    transferredToUserId: uuid('transferred_to_user_id'), // ID of the user to whom the ticket was transferred
    transferDate: timestamp('transfer_date'), // Date of the ticket transfer
    isTransferred: boolean('is_transferred').default(false), // Indicates if the ticket was transferred
    loyaltyPointsEarned: numeric('loyalty_points_earned', { precision: 10, scale: 2 }), // Points earned by the buyer
    loyaltyPointsRedeemed: numeric('loyalty_points_redeemed', { precision: 10, scale: 2 }), // Points redeemed by the buyer
    isDigitalOnly: boolean('is_digital_only').default(true), // Indicates if the ticket is digital-only
    physicalTicketStatus: text('physical_ticket_status'), // Status of the physical ticket (e.g., 'shipped', 'delivered', 'not shipped')
    insuranceProvider: text('insurance_provider'), // Insurance provider's name, if applicable
    insurancePolicyNumber: text('insurance_policy_number'), // Insurance policy number, if applicable
    isInsured: boolean('is_insured').default(false), // Indicates if the ticket is insured
    exchangeRate: numeric('exchange_rate', { precision: 15, scale: 6 }), // Exchange rate applied, if applicable
    permissions: jsonb('permissions'), // JSON field for event-specific permissions
    salesChannelDetails: jsonb('sales_channel_details'), // Detailed information about the sales channel
    stripeSessionId: text('stripe_session_id'), // Store the Stripe session ID for reference
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Event Attendance Table
export const orgEventAttendance = pgTable('org_event_attendance', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    customerId: uuid('customer_id')
        .notNull()
        .references(() => orgCustomers.id),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    ticketId: uuid('ticket_id').references(() => orgEventTickets.id),
    checkInMethod: text('check_in_method'), // e.g., 'QR code', 'manual entry', 'RFID'
    checkedInBy: uuid('checked_in_by').references(() => userProfiles.id),
    attendanceStatus: text('attendance_status').default('attended'), // e.g., 'attended', 'no-show', 'late', 'left early'
    duration: integer('duration'), // Duration of attendance in minutes or hours
    feedbackScore: integer('feedback_score'), // Feedback score or rating (e.g., 1-5)
    additionalNotes: text('additional_notes'),
    attendedAt: timestamp('attended_at').default(sql`now()`),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Order Items Table
export const orgTransactionItems = pgTable('org_transaction_items', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orderId: uuid('order_id')
        .notNull()
        .references(() => orgTransactions.id),
    ticketId: uuid('ticket_id')
        .notNull()
        .references(() => orgEventTickets.id),
    quantity: numeric('quantity').notNull(), // Quantity of tickets
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(), // Price per ticket
    discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }).default(sql`0`), // Discount applied to the item
    taxAmount: numeric('tax_amount', { precision: 10, scale: 2 }).default(sql`0`), // Tax applied to the item
    totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(), // Total price after discounts and taxes
    transactionSource: text('transaction_source').notNull().default('online'), // Source of the transaction
    itemType: text('item_type').notNull().default('ticket'), // Type of transaction item
    promotionCodeUsed: text('promotion_code_used'), // Promotion code applied to the item, if any
    isRefundable: boolean('is_refundable').default(true), // Indicates if the item is refundable
    currency: text('currency').notNull().default('USD'), // Currency of the transaction item
    notes: text('notes'), // Additional notes or information
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
    isActive: boolean('is_active').default(true), // Indicates if the member is currently active
    lastLogin: timestamp('last_login'), // Last login time of the member
    department: text('department'), // Department or team the member belongs to
    permissions: jsonb('permissions'), // List of permissions or access levels
    joinedDate: date('joined_date').notNull(), // Date the member joined the organization
    profileImageUrl: text('profile_image_url'), // URL of the member's profile image
    phoneNumber: text('phone_number'), // Member's phone number
    isVerified: boolean('is_verified').default(false), // Indicates if the member's email or profile is verified
    isAdmin: boolean('is_admin').default(false), // Indicates if the member has admin privileges
    departedAt: timestamp('departed_at'), // Date when the member left the organization
    notes: text('notes'), // Additional notes or information about the member
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Guilds Table
export const guilds = pgTable('guilds', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    name: text('name').notNull(),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    description: text('description'),
    leaderName: text('leader_name').notNull(),
    leaderContact: text('leader_contact'),
    leaderEmail: text('leader_email').notNull(), // Email of the guild leader for communication
    guildType: text('guild_type'), // e.g., 'performer', 'artisan', 'vendor'
    website: text('website'),
    profileImageUrl: text('profile_image_url'), // URL for guild's logo or image
    status: text('status').default('confirmed'), // e.g., 'confirmed', 'pending', 'cancelled'
    contractDetails: jsonb('contract_details'), // JSONB field for contracts or agreements
    contactFrequency: text('contact_frequency').default('monthly'), // How often to follow up (e.g., 'weekly', 'monthly')
    lastContacted: timestamp('last_contacted'), // When was the last contact made
    nextFollowUp: timestamp('next_follow_up'), // When to follow up next
    emailGroup: text('email_group'), // Group name for email campaigns
    notes: text('notes'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Performers Table
export const orgPerformers = pgTable('org_performers', {
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
    phone: text('phone'),
    profileImageUrl: text('profile_image_url'), // URL of the performer's profile image
    genre: text('genre'), // Type of performance or genre
    performanceTime: timestamp('performance_time'), // Scheduled time of performance
    status: text('status').default('confirmed'), // e.g., 'confirmed', 'tentative', 'cancelled'
    contractDetails: jsonb('contract_details'), // Contract or agreement details
    socialLinks: jsonb('social_links'), // Links to social media profiles or website
    contactFrequency: text('contact_frequency').default('monthly'), // How often to follow up (e.g., 'weekly', 'monthly')
    lastContacted: timestamp('last_contacted'), // When was the last contact made
    nextFollowUp: timestamp('next_follow_up'), // When to follow up next
    emailGroup: text('email_group'), // Group name for email campaigns
    notes: text('notes'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Event Speaker Table
export const eventSpeakers = pgTable('event_speakers', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id), // Reference to the event
    name: text('name').notNull(), // Speaker's name
    title: text('title'), // Speaker's title or designation
    email: text('email').notNull().unique(), // Speaker's email
    phone: text('phone'), // Speaker's phone number
    profileImageUrl: text('profile_image_url'), // URL of the speaker's profile image
    bio: text('bio'), // Speaker's biography
    talkTitle: text('talk_title'), // Title of the talk or presentation
    talkDescription: text('talk_description'), // Description of the talk
    talkTime: timestamp('talk_time'), // Scheduled time of the talk
    status: text('status').default('confirmed'), // e.g., 'confirmed', 'tentative', 'cancelled'
    contractDetails: jsonb('contract_details'), // Contract or agreement details
    socialLinks: jsonb('social_links'), // Links to social media profiles or website
    contactFrequency: text('contact_frequency').default('monthly'), // How often to follow up (e.g., 'weekly', 'monthly')
    lastContacted: timestamp('last_contacted'), // When was the last contact made
    nextFollowUp: timestamp('next_follow_up'), // When to follow up next
    emailGroup: text('email_group'), // Group name for email campaigns
    notes: text('notes'), // Additional notes about the speaker
    createdAt: timestamp('created_at').default(sql`now()`), // Timestamp for when the record was created
    updatedAt: timestamp('updated_at').default(sql`now()`) // Timestamp for when the record was last updated
});

// Event Map Locations Table
export const festivalMapLocations = pgTable('festival_map_locations', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id), // Reference to the event
    name: text('name').notNull(), // Name of the location (e.g., 'Main Stage', 'Food Court')
    type: text('type').notNull(), // Type of location (e.g., 'stage', 'vendor', 'restroom')
    coordinates: jsonb('coordinates').notNull(), // JSON object containing the coordinates on the map
    description: text('description'), // Description of the location
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

export const visitorSchedules = pgTable('visitor_schedules', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgCustomersId: uuid('visitor_id')
        .notNull()
        .references(() => orgCustomers.id), // Reference to the visitors table
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id), // Reference to the event
    sessionId: uuid('session_id').references(() => eventSessions.id), // Reference to the selected session
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Vendors Table
export const orgVendors = pgTable('org_vendors', {
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
    phone: text('phone'),
    address: text('address'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
    zipCode: text('zip_code'),
    profileImageUrl: text('profile_image_url'), // URL of the vendor's profile image or logo
    vendorType: text('vendor_type'), // e.g., 'food', 'merchandise', 'service'
    status: text('status').default('active'),
    contractDetails: jsonb('contract_details'), // Contract or agreement details
    website: text('website'),
    contactFrequency: text('contact_frequency').default('monthly'), // How often to follow up (e.g., 'weekly', 'monthly')
    lastContacted: timestamp('last_contacted'), // When was the last contact made
    nextFollowUp: timestamp('next_follow_up'), // When to follow up next
    emailGroup: text('email_group'), // Group name for email campaigns
    notes: text('notes'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Invites Table
export const orgInvites = pgTable('org_invites', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    email: text('email').notNull(),
    status: text('status').notNull(),
    inviterId: uuid('inviter_id').references(() => userProfiles.id),
    expiresAt: timestamp('expires_at'),
    token: text('token').unique().notNull(),
    role: text('role'),
    acceptedAt: timestamp('accepted_at'),
    isResent: boolean('is_resent').default(false),
    isRevoked: boolean('is_revoked').default(false),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// EventJacket Blog Table
export const blogPosts = pgTable('blog_posts', {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    author: varchar('author', { length: 100 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    publishedAt: timestamp('published_at'),
    tags: text('tags').array(),
    featuredImage: varchar('featured_image', { length: 255 })
});

// Ticket Sales Pages Table
export const ticketPages = pgTable('ticket_pages', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    url: text('url').notNull().unique(), // Unique URL for the ticket sales page
    pageTitle: text('page_title').notNull(), // Custom title for the page
    description: text('description'), // Description or details for the sales page
    exitPage: boolean('exit_page').default(false),
    bounceRate: numeric('bounce_rate', { precision: 5, scale: 2 }).default(sql`0`), // Bounce rate as a percentage
    deviceType: text('device_type').default('desktop'), // Type of device used (e.g., desktop, mobile, tablet)
    referralSource: text('referral_source'), // Source of the traffic (e.g., social media, search engine)
    averageTimeOnPage: numeric('average_time_on_page', { precision: 5, scale: 2 }).default(sql`0`), // Average time spent on page in seconds
    conversionRate: numeric('conversion_rate', { precision: 5, scale: 2 }).default(sql`0`), // Conversion rate as a percentage

    entryPage: boolean('entry_page').default(false), // Indicates if the ticket page was the entry point to the site
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Org Event Page Media Table
export const eventMedia = pgTable('event_media', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id), // Reference to the event
    type: text('type').notNull(), // Type of media (e.g., 'image', 'video')
    url: text('url').notNull(), // URL of the media file in the Supabase bucket
    description: text('description'), // Optional description or caption for the media
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Org Event Page Sections Table
export const eventSections = pgTable('event_sections', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    eventId: uuid('event_id')
        .notNull()
        .references(() => events.id), // Reference to the event
    title: text('title').notNull(), // Title of the section (e.g., 'Vendors', 'Performers')
    content: text('content').notNull(), // The content of the section (HTML or text)
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Ticket Analytics Table
export const ticketAnalytics = pgTable('ticket_analytics', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    ticketPageId: uuid('ticket_page_id')
        .notNull()
        .references(() => ticketPages.id),
    views: integer('views').default(0), // Number of times the page was viewed
    clicks: integer('clicks').default(0), // Number of times tickets were clicked on the page
    purchases: integer('purchases').default(0), // Number of ticket purchases
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

// Org Transactions Table (Stripe)
export const orgTransactions = pgTable('org_transactions', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    customerId: uuid('customer_id')
        .notNull()
        .references(() => orgCustomers.id),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id),
    description: text('description'),
    paymentMethod: text('payment_method'), // e.g., 'card', 'bank_transfer', 'paypal'
    stripeFeeAmount: numeric('stripe_fee_amount', { precision: 10, scale: 2 }).notNull(), // Fee charged by Stripe
    applicationFeeAmount: numeric('application_fee_amount', { precision: 10, scale: 2 })
        .notNull()
        .default(sql`0.50`), // application fee amount
    netAmount: numeric('net_amount', { precision: 10, scale: 2 }),
    metadata: jsonb('metadata'),
    invoiceId: text('invoice_id').unique(),
    relatedEntityId: uuid('related_entity_id'), // Reference to related entity (e.g., eventId)
    refundStatus: text('refund_status'), // e.g., 'full', 'partial', 'none'
    stripePaymentId: text('stripe_payment_id').unique(), // Stripe Payment ID
    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(), // Total amount of the transaction
    currency: text('currency'), // Currency for payment transactions
    transactionType: text('transaction_type').notNull(), // e.g., 'ticket_sale', 'vendor_fee', 'donation'
    status: text('status'), // Status for payment transactions, e.g., 'succeeded', 'pending', 'failed'
    stripeConnectAccountId: text('stripe_connect_account_id'),
    stripeTransferAmount: numeric('stripe_transfer_amount', { precision: 10, scale: 2 }),
    stripeTransferStatus: text('stripe_transfer_status'),
    stripeTransferId: text('stripe_transfer_id'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

export const stripeConnectPayouts = pgTable('stripe_connect_payouts', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    userProfileId: uuid('user_profile_id')
        .notNull()
        .references(() => userProfiles.id),
    stripePayoutId: text('stripe_payout_id').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    status: text('status').notNull(), // e.g., 'paid', 'pending', 'failed'
    payoutMethod: text('payout_method').notNull(),
    arrivalDate: timestamp('arrival_date'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const orgReferralPrograms = pgTable('org_referral_programs', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    name: text('name').notNull(), // Name of the referral program
    reward: text('reward').notNull(), // Description of the reward
    status: text('status').default('active'), // e.g., 'active', 'inactive'
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

export const emailCampaigns = pgTable('email_campaigns', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    name: text('name').notNull(), // Name of the campaign
    subject: text('subject').notNull(), // Email subject
    body: text('body').notNull(), // Email body content
    segmentId: uuid('segment_id').references(() => audienceSegments.id), // Reference to the audience segment
    scheduledAt: timestamp('scheduled_at'), // When the email is scheduled to be sent
    sentAt: timestamp('sent_at'), // When the email was sent
    status: text('status').default('draft'), // e.g., 'draft', 'scheduled', 'sent'
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

export const audienceSegments = pgTable('audience_segments', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    name: text('name').notNull(), // Name of the segment
    criteria: jsonb('criteria').notNull(), // JSON field to store segmentation criteria (e.g., age, location, purchase history)
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

export const emailRecipients = pgTable('email_recipients', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    campaignId: uuid('campaign_id')
        .notNull()
        .references(() => emailCampaigns.id), // Reference to the email campaign
    customerId: uuid('customer_id')
        .notNull()
        .references(() => orgCustomers.id), // Reference to the customer
    sentAt: timestamp('sent_at'), // When the email was sent
    openedAt: timestamp('opened_at'), // When the email was opened
    clickedAt: timestamp('clicked_at'), // When a link in the email was clicked
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

export const emailTemplates = pgTable('email_templates', {
    id: uuid('id')
        .primaryKey()
        .default(sql`uuid_generate_v4()`),
    orgId: uuid('org_id')
        .notNull()
        .references(() => organizations.id), // Reference to the organization
    name: text('name').notNull(), // Template name
    subject: text('subject').notNull(), // Default subject for the template
    body: text('body').notNull(), // Default body content for the template
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`)
});

/**
 * Email Campaigns Schema:
 *
 * Relationships Between Tables:
 * - The emailCampaigns table references audienceSegments to target specific segments.
 * - The emailRecipients table connects each campaign with its recipients, tracking interactions like opens and clicks.
 * - The emailTemplates table (if used) can be referenced by emailCampaigns to reuse content across multiple campaigns.
 *
 * How It Works:
 * - Email Campaign Creation: Users create campaigns by selecting a segment from the audienceSegments table and composing the email content.
 * - Audience Segmentation: Audience segments are defined based on various criteria (stored in JSON format) and are tied to specific organizations via the orgId.
 * - Recipient Tracking: The emailRecipients table tracks who received which emails and how they interacted with them, allowing you to analyze the effectiveness of your campaigns.
 * - Template Management (Optional): Users can save and reuse email templates for consistent branding and messaging.
 */
