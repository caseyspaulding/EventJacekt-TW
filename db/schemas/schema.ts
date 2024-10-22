
import { sql } from 'drizzle-orm';
import
{
    pgTable,
    uuid,
    text,
    timestamp,
    numeric,
    serial,
    varchar,
    integer,
    boolean,

    date,
    jsonb,
    doublePrecision,
    time,
    uniqueIndex
} from 'drizzle-orm/pg-core';

// Organizations Table
export const organizations = pgTable( 'organizations', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    name: text( 'name' ).notNull().unique(),

    contactPhone: text( 'contact_phone' ),
    website: text( 'website' ),
    address: text( 'address' ),
    city: text( 'city' ),
    state: text( 'state' ),
    country: text( 'country' ),
    zipCode: text( 'zip_code' ),
    logoUrl: text( 'logo_url' ),
    industry: text( 'industry' ), // e.g., 'non-profit', 'entertainment', 'education'
    orgType: text( 'org_type' ), // e.g., 'non-profit', 'business', 'government'
    foundedDate: date( 'founded_date' ), // Date the organization was founded
    numberOfEmployees: integer( 'number_of_employees' ), // Size of the organization
    annualRevenue: numeric( 'annual_revenue', { precision: 15, scale: 2 } ), // Organization's annual revenue
    socialMediaLinks: jsonb( 'social_media_links' ), // Links to social media profiles
    affiliatedOrganizations: jsonb( 'affiliated_organizations' ), // Affiliated organizations or partnerships
    isVerified: boolean( 'is_verified' ).default( false ), // Flag for verified organizations
    subscriptionStatus: text( 'subscription_status' ), // e.g., 'active', 'expired', 'trial'
    lastActivity: timestamp( 'last_activity' ),
    status: text( 'status' ).default( 'active' ),
    stripeAccountId: varchar( 'stripe_account_id' ),
    stripeConnectLinked: boolean( 'stripe_connect_linked' ),
    stripeAccountCreated: timestamp( 'stripe_account_created' ),
    updatedAt: timestamp( 'updated_at' ).default( sql`CURRENT_TIMESTAMP` ),
    metadata: jsonb( 'metadata' ),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull()
} );



// User Profiles Table
export const userProfiles = pgTable( 'user_profiles', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    userId: uuid( 'user_id' ).notNull(), // Will reference auth.users table in Supabase
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    profileImageUrl: text( 'profile_image_url' ),
    organizationName: text( 'organization_name' ).notNull(),
    role: text( 'role' ).notNull().default( 'user' ), // User's role within the organization
    contactNumber: text( 'contact_number' ), // Contact phone number
    bio: text( 'bio' ), // User biography or description
    socialLinks: jsonb( 'social_links' ), // Links to social media profiles
    isActive: boolean( 'is_active' ).default( true ), // Active status flag
    lastLogin: timestamp( 'last_login' ), // Last login timestamp
    permissions: jsonb( 'permissions' ), // JSON field for user-specific permissions
    preferences: jsonb( 'preferences' ), // JSON field for storing user preferences
    department: text( 'department' ), // Department within the organization
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),
}, ( table ) =>
{
    return {
        userIdUnique: uniqueIndex( 'user_profiles_user_id_unique' ).on( table.userId ), // Ensure userId is unique
    };
} );

// Grants Table
export const grants = pgTable( 'grants', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Linking the grant to an organization
    grantName: text( 'grant_name' ).notNull(),
    applicantOrganization: text( 'applicant_organization' ).notNull(), // Organization applying for the grant
    applicationDate: timestamp( 'application_date' ).notNull(), // Date of application
    status: text( 'status' ).notNull().default( 'submitted' ), // e.g., 'submitted', 'in review', 'approved', 'rejected'
    amountRequested: numeric( 'amount_requested', { precision: 15, scale: 2 } ), // Requested amount
    amountApproved: numeric( 'amount_approved', { precision: 15, scale: 2 } ), // Approved amount
    deadline: timestamp( 'deadline' ).notNull(), // Deadline for submitting deliverables or reports
    deliverables: text( 'deliverables' ), // Summary of deliverables required if the grant is approved
    notes: text( 'notes' ), // Additional notes related to the grant
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


/// Forms Table
export const forms = pgTable( 'forms', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' ).notNull().references( () => organizations.id ),
    formName: text( 'form_name' ).notNull(),
    creator_id: uuid( 'creator_id' ).notNull().references( () => userProfiles.userId ), // Reference to the userProfiles table
    description: text( 'description' ),
    status: text( 'status' ).default( 'active' ),
    isArchived: boolean( 'is_archived' ).default( false ), // New field for archiving
    isDeleted: boolean( 'is_deleted' ).default( false ),   // New field for soft deletion
    isDraft: boolean( 'is_draft' ).default( false ), // New field for draft forms
    headerMediaUrl: text( 'header_media_url' ),    // New column for media URL
    headerMediaType: text( 'header_media_type' ),  // New column for media type ('image' or 'video')
    createdAt: timestamp( 'created_at' ).defaultNow(),
    updatedAt: timestamp( 'updated_at' ).defaultNow(),
} );


export const formFields = pgTable( 'form_fields', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    formId: uuid( 'form_id' )
        .notNull()
        .references( () => forms.id ), // Foreign key to the forms table
    fieldName: text( 'field_name' ).notNull(), // Name of the field (e.g., 'email', 'phone')
    placeholder: text( 'placeholder' ), // Placeholder text for the field
    fieldType: text( 'field_type' ).notNull(), // Type of the field (e.g., 'text', 'checkbox', 'radio', 'date')
    options: jsonb( 'options' ), // JSON object for additional options (e.g., dropdown options, validation rules)
    isRequired: boolean( 'is_required' ).default( false ), // Whether the field is required
    order: integer( 'order' ).notNull(), // The order of the field in the form
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
} );

export const formResponses = pgTable( 'form_responses', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    formId: uuid( 'form_id' )
        .notNull()
        .references( () => forms.id ), // Foreign key to the forms table
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Foreign key to the organization
    responderId: uuid( 'responder_id' ), // (Optional) ID of the user filling out the form
    responseData: jsonb( 'response_data' ).notNull(), // JSON data storing the responses
    submittedAt: timestamp( 'submitted_at' ).defaultNow().notNull(),
} );

export const formResponseDetails = pgTable( 'form_response_details', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    formResponseId: uuid( 'form_response_id' )
        .notNull()
        .references( () => formResponses.id ), // Foreign key to form responses
    formFieldId: uuid( 'form_field_id' )
        .notNull()
        .references( () => formFields.id ), // Foreign key to form fields
    fieldValue: jsonb( 'field_value' ).notNull(), // Changed from 'text' to 'jsonb'
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
} );

// Grant Reviews Table
export const grantReviews = pgTable( 'grant_reviews', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    grantId: uuid( 'grant_id' )
        .notNull()
        .references( () => grants.id ), // Link to the grant being reviewed
    reviewerId: uuid( 'reviewer_id' )
        .notNull()
        .references( () => userProfiles.id ), // Reviewer’s user profile
    reviewDate: timestamp( 'review_date' ).notNull().default( sql`now()` ),
    comments: text( 'comments' ), // Reviewer's comments on the grant application
    rating: integer( 'rating' ), // Rating or score assigned by the reviewer
    statusChange: text( 'status_change' ), // Status after the review (e.g., 'approved', 'rejected')
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );
// Grant Reports Table
export const grantReports = pgTable( 'grant_reports', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    grantId: uuid( 'grant_id' )
        .notNull()
        .references( () => grants.id ), // Link to the grant being reported on
    reportDate: timestamp( 'report_date' ).notNull().default( sql`now()` ), // Date the report was submitted
    reportDetails: text( 'report_details' ), // Detailed progress report on the grant
    attachments: jsonb( 'attachments' ), // JSON field to store file URLs or references (if any attachments)
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Grant Reminders Table
export const grantReminders = pgTable( 'grant_reminders', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    grantId: uuid( 'grant_id' )
        .notNull()
        .references( () => grants.id ), // Link to the relevant grant
    reminderDate: timestamp( 'reminder_date' ).notNull(), // Date for the reminder
    message: text( 'message' ).notNull(), // Reminder message
    emailSent: boolean( 'email_sent' ).default( false ), // Whether the reminder email was sent
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );
// Grant Touchpoints Table
export const grantTouchpoints = pgTable( 'grant_touchpoints', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    grantId: uuid( 'grant_id' )
        .notNull()
        .references( () => grants.id ), // Link to the grant
    contactPerson: text( 'contact_person' ), // Name of the person contacted
    date: timestamp( 'date' ).notNull(), // Date of the meeting or touchpoint
    notes: text( 'notes' ), // Notes from the meeting
    nextTouchpointDate: timestamp( 'next_touchpoint_date' ), // When the next meeting or follow-up should occur
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );
export const userEventReminders = pgTable( 'user_event_reminders', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    userId: uuid( 'user_id' )
        .notNull()
        .references( () => userProfiles.id ), // Reference to the userProfiles table
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the events table
    reminderTime: timestamp( 'reminder_time' ).notNull(), // The exact time when the reminder should be sent
    reminderMethod: text( 'reminder_method' ).default( 'email' ), // e.g., 'email', 'sms', 'push'
    isSent: boolean( 'is_sent' ).default( false ), // Status to check if the reminder has been sent
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Ticket Buyer Profiles Table
export const ticketBuyerProfiles = pgTable( 'ticket_buyer_profiles', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    userId: uuid( 'user_id' ).notNull(), // Will reference auth.users table in Supabase
    profileImageUrl: text( 'profile_image_url' ), // Optional profile image
    contactNumber: text( 'contact_number' ), // Contact phone number
    bio: text( 'bio' ), // Optional bio or description
    socialLinks: jsonb( 'social_links' ), // Links to social media profiles
    isActive: boolean( 'is_active' ).default( true ), // Active status flag
    lastLogin: timestamp( 'last_login' ), // Last login timestamp
    preferences: jsonb( 'preferences' ), // JSON field for storing user preferences
    metadata: jsonb( 'metadata' ),
    notes: text( 'notes' ),
    favoriteEventId: uuid( 'favorite_event_id' ).references( () => events.id ), // Reference to favorite event
    favoritePerformerId: uuid( 'favorite_performer_id' ).references( () => orgPerformers.id ), // Reference to favorite performer
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),

    // Stripe-related fields
    stripeCustomerId: text( 'stripe_customer_id' ), // Stripe Customer ID
    stripeDefaultCurrency: text( 'stripe_default_currency' ) // e.g., 'USD', 'EUR'
} );

// Subscription Products Table
export const subscriptionProducts = pgTable( 'subscription_products', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    name: text( 'name' ).notNull().unique(),
    stripeProductId: text( 'stripe_product_id' ).notNull().unique(),
    stripePriceId: text( 'stripe_price_id' ).notNull().unique(),
    description: text( 'description' ),
    price: numeric( 'price', { precision: 10, scale: 2 } ).notNull(), // Price of the subscription product
    billingInterval: text( 'billing_interval' ).notNull(), // e.g., 'monthly', 'annual'
    trialPeriodDays: integer( 'trial_period_days' ).default( sql`0` ), // Number of trial period days, if applicable
    isPopular: boolean( 'is_popular' ).default( false ), // Flag for popular products
    featureSet: jsonb( 'feature_set' ), // List of features included in the product
    targetAudience: text( 'target_audience' ), // e.g., 'small_business', 'enterprise', 'individual'
    isActive: boolean( 'is_active' ).default( true ), // Indicates if the product is active
    salesCount: integer( 'sales_count' ).default( sql`0` ), // Track product sales
    promotionDetails: jsonb( 'promotion_details' ), // Details of promotions or discounts
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );




// Subscriptions Table
export const subscriptions = pgTable( 'subscriptions', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    userProfileId: uuid( 'user_profile_id' )
        .notNull()
        .references( () => userProfiles.id ), // Reference to the userProfiles table
    productId: uuid( 'product_id' )
        .notNull()
        .references( () => subscriptionProducts.id ),
    stripeCustomerId: text( 'stripe_customer_id' ).notNull(),
    stripeSubscriptionId: text( 'stripe_subscription_id' ).notNull(),
    subscriptionStatus: text( 'subscription_status' ).notNull(), // e.g., 'active', 'canceled', 'past_due', 'trial'
    subscriptionStartDate: timestamp( 'subscription_start_date' ).notNull(),
    subscriptionEndDate: timestamp( 'subscription_end_date' ),
    isStripeConnectAccount: boolean( 'is_stripe_connect_account' ).default( false ), // Indicates if the subscription is for a Stripe Connect account
    billingInterval: text( 'billing_interval' ).notNull(), // e.g., 'monthly', 'annual'
    trialEndDate: timestamp( 'trial_end_date' ), // End date of the trial period, if applicable
    cancelAtPeriodEnd: boolean( 'cancel_at_period_end' ).default( false ), // Indicates if the subscription will cancel at the period end
    cancellationDate: timestamp( 'cancellation_date' ), // Date when the subscription was canceled, if applicable
    renewalCount: integer( 'renewal_count' ).default( sql`0` ), // Number of times the subscription has been renewed
    revenueGenerated: numeric( 'revenue_generated', { precision: 15, scale: 2 } ).default( sql`0` ), // Total revenue generated from the subscription
    lastPaymentDate: timestamp( 'last_payment_date' ), // Date of the last payment made
    nextBillingDate: timestamp( 'next_billing_date' ), // Date of the next scheduled billing
    notes: text( 'notes' ), // Additional notes or information
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Stripe Connect Onboarding Table (for Express accounts)
export const stripeConnectOnboarding = pgTable( 'stripe_connect_onboarding', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    userProfileId: uuid( 'user_profile_id' )
        .notNull()
        .references( () => userProfiles.id ),
    stripeAccountId: text( 'stripe_account_id' ).notNull(),
    onboardingStatus: text( 'onboarding_status' ).notNull(), // e.g., 'pending', 'completed', 'rejected'
    onboardingUrl: text( 'onboarding_url' ),
    onboardingStartedAt: timestamp( 'onboarding_started_at' ).defaultNow(),
    onboardingCompletedAt: timestamp( 'onboarding_completed_at' ),
    createdAt: timestamp( 'created_at' ).defaultNow(),
    updatedAt: timestamp( 'updated_at' ).defaultNow()
} );

// Events Table
export const events = pgTable( 'events', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' ).notNull().references( () => organizations.id ),
    name: text( 'name' ).notNull(),
    featuredImage: varchar( 'featured_image', { length: 255 } ), // URL of the featured image
    slug: text( 'slug' ).notNull().unique(), // Add a slug column for SEO-friendly URLs
    description: text( 'description' ),
    notes: text( 'notes' ),
    startDate: date( 'start_date' ).notNull(),
    endDate: date( 'end_date' ).notNull(),
    eventStartTime: time( 'event_start_time' ), // New field for event start time
    eventEndTime: time( 'event_end_time' ), // New field for event end time
    venue: text( 'venue' ),
    venueDescription: text( 'venue_description' ), // New column for venue description
    venueImage: varchar( 'venue_image', { length: 255 } ), // New column for venue image URL
    address: text( 'address' ),
    city: text( 'city' ),
    state: text( 'state' ),
    country: text( 'country' ),
    zipCode: text( 'zip_code' ),
    latitude: numeric( 'latitude', { precision: 9, scale: 6 } ),
    longitude: numeric( 'longitude', { precision: 9, scale: 6 } ),
    scheduleDetails: text( 'schedule_details' ), // Details about the schedule, agenda, etc.
    bannerImage: varchar( 'banner_image', { length: 255 } ), // URL of the banner image
    galleryImages: text( 'gallery_images' ).array(), // Array of image URLs for gallery
    videoLinks: text( 'video_links' ).array(), // Array of video URLs or embed codes
    organizerContact: varchar( 'organizer_contact', { length: 255 } ), // Organizer's contact information
    maxAttendees: integer( 'max_attendees' ),
    status: text( 'status' ).notNull().default( 'draft' ), // e.g., 'draft', 'published', 'cancelled'
    refundPolicy: text( 'refund_policy' ), // Text description of the refund policy
    timezone: varchar( 'timezone', { length: 50 } ), // Timezone of the event
    tags: text( 'tags' ).array(), // Correct way to define an array of strings (tags)
    highlights: text( 'highlights' ).array(), // Array of highlights
    faqs: jsonb( 'faqs' ), // Store FAQs as a JSONB object for flexibility
    ageRestriction: text( 'age_restriction' ), // 'All ages allowed', 'There’s an age restriction', 'Parent or guardian needed'
    parkingOptions: text( 'parking_options' ), // 'Free parking', 'Paid parking', 'No parking options'
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),
} );

// Contact Table for CRM

export const contacts = pgTable( 'contacts', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organizations table
    firstName: text( 'first_name' ).notNull(),
    lastName: text( 'last_name' ).notNull(),
    email: text( 'email' ).notNull(),
    phone: text( 'phone' ),
    address: text( 'address' ),
    city: text( 'city' ),
    state: text( 'state' ),
    country: text( 'country' ),
    zipCode: text( 'zip_code' ),
    contactType: text( 'contact_type' ), // e.g., 'donor', 'volunteer', 'partner', 'attendee'
    company: text( 'company' ), // If applicable
    position: text( 'position' ), // Job title or role
    notes: text( 'notes' ),
    tags: text( 'tags' ).array(), // For categorizing contacts
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
}, ( table ) =>
{
    return {
        uniqueContact: uniqueIndex( 'contacts_unique_email_org' ).on( table.email, table.orgId ),
    };
} );

export const interactions = pgTable( 'interactions', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    contactId: uuid( 'contact_id' )
        .notNull()
        .references( () => contacts.id ), // Reference to the contacts table
    userId: uuid( 'user_id' )
        .notNull()
        .references( () => userProfiles.userId ), // User who had the interaction
    interactionType: text( 'interaction_type' ).notNull(), // e.g., 'email', 'phone call', 'meeting'
    interactionDate: timestamp( 'interaction_date' ).defaultNow().notNull(),
    subject: text( 'subject' ), // Subject or title of the interaction
    notes: text( 'notes' ), // Details about the interaction
    followUpDate: timestamp( 'follow_up_date' ), // For scheduling follow-ups
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

export const donations = pgTable( 'donations', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    contactId: uuid( 'contact_id' )
        .references( () => contacts.id ), // Donor (could be null for anonymous donations)
    amount: numeric( 'amount', { precision: 10, scale: 2 } ).notNull(),
    currency: text( 'currency' ).default( 'USD' ).notNull(),
    donationDate: timestamp( 'donation_date' ).defaultNow().notNull(),
    paymentMethod: text( 'payment_method' ), // e.g., 'credit card', 'bank transfer'
    paymentStatus: text( 'payment_status' ).default( 'pending' ).notNull(), // e.g., 'pending', 'completed'
    transactionId: text( 'transaction_id' ), // From payment gateway like Stripe
    isRecurring: boolean( 'is_recurring' ).default( false ),
    campaignName: text( 'campaign_name' ), // If associated with a specific campaign
    receiptSent: boolean( 'receipt_sent' ).default( false ),
    notes: text( 'notes' ),
    metadata: jsonb( 'metadata' ), // Additional data from payment gateway
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );


// Agenda Table
export const agenda = pgTable( 'agenda', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' ).notNull().references( () => events.id ), // Foreign key to the events table
    title: text( 'title' ).notNull(), // Title of the agenda item
    startTime: timestamp( 'start_time' ), // Start time of the agenda item
    endTime: timestamp( 'end_time' ), // End time of the agenda item
    description: text( 'description' ), // Description of the agenda item
    hostOrArtist: text( 'host_or_artist' ), // Host or artist name
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),
} );

// Event Locations Table
export const eventLocations = pgTable( 'event_locations', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Foreign key to events table
    name: text( 'name' ), // Optional: Name of the venue or location
    address: text( 'address' ), // Street address
    city: text( 'city' ),
    state: text( 'state' ),
    country: text( 'country' ),
    zipCode: text( 'zip_code' ),
    latitude: doublePrecision( 'latitude' ), // Corrected type for latitude
    longitude: doublePrecision( 'longitude' ), // Corrected type for longitude
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


// Tags Table
export const tags = pgTable( 'tags', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    name: text( 'name' ).notNull().unique(), // Tag name, must be unique
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Event_Tags Table (Many-to-Many Relationship) - Junction Table
export const eventTags = pgTable( 'event_tags', {
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Foreign key to events table
    tagId: uuid( 'tag_id' )
        .notNull()
        .references( () => tags.id ), // Foreign key to tags table
    createdAt: timestamp( 'created_at' ).default( sql`now()` ), // Timestamp for record creation
}, ( eventTags ) => ( {
    primaryKey: [ eventTags.eventId, eventTags.tagId ], // Composite primary key to ensure uniqueness
} ) );


// Event Session Table
export const eventSessions = pgTable( 'event_sessions', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to events table
    performerId: uuid( 'performer_id' )
        .references( () => orgPerformers.id ), // Reference to performers table
    name: text( 'name' ).notNull(),
    description: text( 'description' ),
    sessionDate: date( 'session_date' ).notNull(), // Date of the session
    startTime: timestamp( 'start_time' ).notNull(),
    endTime: timestamp( 'end_time' ).notNull(),
    latitude: doublePrecision( 'latitude' ),
    longitude: doublePrecision( 'longitude' ),
    location: text( 'location' ), // Stage, room, or location
    type: text( 'type' ), // e.g., 'workshop', 'performance', 'seminar'
    capacity: integer( 'capacity' ), // Maximum number of attendees
    isFree: boolean( 'is_free' ).default( true ), // Indicates if the session is free or paid
    speakerId: uuid( 'speaker_id' ).references( () => eventSpeakers.id ), // Reference to a speaker
    resources: text( 'resources' ).array(), // Array of URLs or paths to resources
    tags: text( 'tags' ).array(), // Array of tags for categorizing sessions
    status: text( 'status' ).notNull().default( 'scheduled' ), // Status of the session
    recordingUrl: text( 'recording_url' ), // URL for session recording
    notes: text( 'notes' ), // Additional notes or information
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Event Page Sections Table
export const eventSections = pgTable( 'event_sections', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    title: text( 'title' ).notNull(), // Title of the section (e.g., 'Vendors', 'Performers')
    content: text( 'content' ).notNull(), // The content of the section (HTML or text)
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Event Schedules Table
export const eventSchedules = pgTable( 'event_schedules', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the org table for multi-tenancy
    customerId: uuid( 'customer_id' )
        .notNull()
        .references( () => orgCustomers.id ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    sessionId: uuid( 'session_id' )
        .notNull()
        .references( () => eventSessions.id ),
    notes: text( 'notes' ),
    title: text( 'title' ).notNull(), // Title of the session or schedule item
    description: text( 'description' ), // Description or details about the session
    startTime: timestamp( 'start_time' ), // Start time of the session
    endTime: timestamp( 'end_time' ), // End time of the session
    speaker: text( 'speaker' ), // Optional: Speaker or performer for the session
    location: text( 'location' ), // Optional: Specific location or room for the session
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Org Customers Table
export const orgCustomers = pgTable( 'org_customers', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),

    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),

    firstName: text( 'first_name' ),
    lastName: text( 'last_name' ),
    email: text( 'email' ).notNull().unique(),
    phone: text( 'phone' ),
    address: text( 'address' ),
    city: text( 'city' ),
    state: text( 'state' ),
    country: text( 'country' ),
    zipCode: text( 'zip_code' ),
    profileImageUrl: text( 'profile_image_url' ), // URL of the customer's profile image
    status: text( 'status' ).default( 'active' ),
    metadata: jsonb( 'metadata' ),
    notes: text( 'notes' ),
    favoriteEventId: uuid( 'favorite_event_id' ).references( () => events.id ), // Reference to favorite event
    favoritePerformerId: uuid( 'favorite_performer_id' ).references( () => orgPerformers.id ), // Reference to favorite performer
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
    accountType: text( 'account_type' ).notNull().default( 'standard' ), // Type of Stripe account
    totalPayouts: numeric( 'total_payouts', { precision: 15, scale: 2 } ).default( sql`0` ), // Total amount of payouts
    lastPayoutDate: timestamp( 'last_payout_date' ), // Date of the last payout
    pendingBalance: numeric( 'pending_balance', { precision: 15, scale: 2 } ).default( sql`0` ), // Current pending balance in Stripe
    availableBalance: numeric( 'available_balance', { precision: 15, scale: 2 } ).default( sql`0` ), // Current available balance in Stripe
    lastTransactionDate: timestamp( 'last_transaction_date' ), // Date of the last transaction
    totalFeesPaid: numeric( 'total_fees_paid', { precision: 15, scale: 2 } ).default( sql`0` ), // Total amount of fees paid to Stripe
    status: text( 'status' ).notNull().default( 'active' ), // Status of the Stripe account
    country: text( 'country' ), // Country of the Stripe account
    notes: text( 'notes' ), // Additional notes or information
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Ticket Types Table
export const orgTicketTypes = pgTable( 'org_ticket_types', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    name: text( 'name' ).notNull(), // e.g., "Friday Ticket", "Saturday Ticket"
    description: text( 'description' ),
    price: numeric( 'price', { precision: 10, scale: 2 } ).notNull(),
    quantity: integer( 'quantity' ).notNull(),
    eventDate: date( 'event_date' ).notNull(),
    doorOpenTime: time( 'gate_open_time' ), // New column for gate open time
    eventStartTime: time( 'event_start_time' ), // New column for event start time
    eventEndTime: time( 'event_end_time' ), // New column for event end time
    saleStartDate: date( 'sale_start_date' ).notNull(),
    saleEndDate: date( 'sale_end_date' ).notNull(),
    isEarlyBird: boolean( 'is_early_bird' ).default( false ),
    maxPerCustomer: integer( 'max_per_customer' ),
    isFree: boolean( 'is_free' ).default( false ), // Flag for free tickets
    category: text( 'category' ), // e.g., 'general', 'VIP', 'student'
    promoCodeRequired: boolean( 'promo_code_required' ).default( false ), // Indicates if a promo code is needed
    availableOnline: boolean( 'available_online' ).default( true ), // Indicates if the ticket is available online
    groupDiscountAvailable: boolean( 'group_discount_available' ).default( false ), // Flag for group discounts
    refundable: boolean( 'refundable' ).default( true ), // Indicates if the ticket is refundable
    currency: text( 'currency' ).default( 'USD' ), // Currency of the ticket price
    salesLimitPerDay: integer( 'sales_limit_per_day' ).default( 0 ), // Daily sales limit
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Enhanced Tickets Table
export const orgEventTickets = pgTable( 'org_event_tickets', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    customerId: uuid( 'customer_id' ).references( () => orgCustomers.id ), // Who bought the ticket
    ticketTypeId: uuid( 'ticket_type_id' )
        .notNull()
        .references( () => orgTicketTypes.id ), // Reference to ticketTypes
    name: text( 'name' ).notNull(),
    price: numeric( 'price', { precision: 10, scale: 2 } ).notNull(),
    currency: text( 'currency' ).notNull(), // Currency of the ticket price
    status: text( 'status' ).notNull().default( 'available' ), // e.g., 'available', 'sold', 'reserved', 'used', 'expired', 'canceled'
    validFrom: date( 'valid_from' ),
    validUntil: date( 'valid_until' ),
    barcode: text( 'barcode' ).unique(), // Barcode for ticket validation
    qrCode: text( 'qr_code' ), // QR Code for ticket validation
    purchaseDate: timestamp( 'purchase_date' ), // Date of purchase
    salesChannel: text( 'sales_channel' ), // e.g., 'online', 'box office', 'partner'
    promotionCode: text( 'promotion_code' ), // Applied promotion or discount code
    promotionName: text( 'promotion_name' ), // Name of the applied promotion
    discountAmount: numeric( 'discount_amount', { precision: 10, scale: 2 } ), // Amount of the discount applied
    finalPrice: numeric( 'final_price', { precision: 10, scale: 2 } ), // Final price after discount
    seatNumber: text( 'seat_number' ), // Seat number or location (if applicable)
    isRefunded: boolean( 'is_refunded' ).default( false ), // Indicate if ticket was refunded
    refundDate: timestamp( 'refund_date' ), // Date of refund (if applicable)
    checkInStatus: boolean( 'check_in_status' ).default( false ), // e.g., 'checked_in', 'not_checked_in'
    notes: text( 'notes' ), // Additional notes or information
    isVIP: boolean( 'is_vip' ).default( false ), // Indicates if the ticket grants VIP access
    accessLevel: text( 'access_level' ), // Access level for the event (e.g., general admission, VIP)
    transferredToUserId: uuid( 'transferred_to_user_id' ), // ID of the user to whom the ticket was transferred
    transferDate: timestamp( 'transfer_date' ), // Date of the ticket transfer
    isTransferred: boolean( 'is_transferred' ).default( false ), // Indicates if the ticket was transferred
    loyaltyPointsEarned: numeric( 'loyalty_points_earned', { precision: 10, scale: 2 } ), // Points earned by the buyer
    loyaltyPointsRedeemed: numeric( 'loyalty_points_redeemed', { precision: 10, scale: 2 } ), // Points redeemed by the buyer
    isDigitalOnly: boolean( 'is_digital_only' ).default( true ), // Indicates if the ticket is digital-only
    physicalTicketStatus: text( 'physical_ticket_status' ), // Status of the physical ticket (e.g., 'shipped', 'delivered', 'not shipped')
    insuranceProvider: text( 'insurance_provider' ), // Insurance provider's name, if applicable
    insurancePolicyNumber: text( 'insurance_policy_number' ), // Insurance policy number, if applicable
    isInsured: boolean( 'is_insured' ).default( false ), // Indicates if the ticket is insured
    exchangeRate: numeric( 'exchange_rate', { precision: 15, scale: 6 } ), // Exchange rate applied, if applicable
    permissions: jsonb( 'permissions' ), // JSON field for event-specific permissions
    salesChannelDetails: jsonb( 'sales_channel_details' ), // Detailed information about the sales channel
    stripeSessionId: text( 'stripe_session_id' ), // Store the Stripe session ID for reference
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Event Attendance Table
export const orgEventAttendance = pgTable( 'org_event_attendance', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    customerId: uuid( 'customer_id' )
        .notNull()
        .references( () => orgCustomers.id ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    ticketId: uuid( 'ticket_id' ).references( () => orgEventTickets.id ),
    checkInMethod: text( 'check_in_method' ), // e.g., 'QR code', 'manual entry', 'RFID'
    checkedInBy: uuid( 'checked_in_by' ).references( () => userProfiles.id ),
    attendanceStatus: text( 'attendance_status' ).default( 'attended' ), // e.g., 'attended', 'no-show', 'late', 'left early'
    duration: integer( 'duration' ), // Duration of attendance in minutes or hours
    feedbackScore: integer( 'feedback_score' ), // Feedback score or rating (e.g., 1-5)
    additionalNotes: text( 'additional_notes' ),
    attendedAt: timestamp( 'attended_at' ).default( sql`now()` ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Order Items Table
export const orgTransactionItems = pgTable( 'org_transaction_items', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orderId: uuid( 'order_id' )
        .notNull()
        .references( () => orgTransactions.id ),
    ticketId: uuid( 'ticket_id' )
        .notNull()
        .references( () => orgEventTickets.id ),
    quantity: numeric( 'quantity' ).notNull(), // Quantity of tickets
    unitPrice: numeric( 'unit_price', { precision: 10, scale: 2 } ).notNull(), // Price per ticket
    discountAmount: numeric( 'discount_amount', { precision: 10, scale: 2 } ).default( sql`0` ), // Discount applied to the item
    taxAmount: numeric( 'tax_amount', { precision: 10, scale: 2 } ).default( sql`0` ), // Tax applied to the item
    totalPrice: numeric( 'total_price', { precision: 10, scale: 2 } ).notNull(), // Total price after discounts and taxes
    transactionSource: text( 'transaction_source' ).notNull().default( 'online' ), // Source of the transaction
    itemType: text( 'item_type' ).notNull().default( 'ticket' ), // Type of transaction item
    promotionCodeUsed: text( 'promotion_code_used' ), // Promotion code applied to the item, if any
    isRefundable: boolean( 'is_refundable' ).default( true ), // Indicates if the item is refundable
    currency: text( 'currency' ).notNull().default( 'USD' ), // Currency of the transaction item
    notes: text( 'notes' ), // Additional notes or information
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


// Event Map Locations Table
export const festivalMapLocations = pgTable( 'festival_map_locations', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    name: text( 'name' ).notNull(), // Name of the location (e.g., 'Main Stage', 'Food Court')
    type: text( 'type' ).notNull(), // Type of location (e.g., 'stage', 'vendor', 'restroom')
    coordinates: jsonb( 'coordinates' ).notNull(), // JSON object containing the coordinates on the map
    description: text( 'description' ), // Description of the location
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const visitorSchedules = pgTable( 'visitor_schedules', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgCustomersId: uuid( 'visitor_id' )
        .notNull()
        .references( () => orgCustomers.id ), // Reference to the visitors table
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    sessionId: uuid( 'session_id' ).references( () => eventSessions.id ), // Reference to the selected session
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const favoriteSessions = pgTable( 'favorite_sessions', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgCustomersId: uuid( 'visitor_id' )
        .notNull()
        .references( () => orgCustomers.id ), // Reference to the visitors table
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    sessionId: uuid( 'session_id' )
        .notNull()
        .references( () => eventSessions.id ), // Reference to the session
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),
} );

export const favoritePerformers = pgTable( 'favorite_performers', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgCustomersId: uuid( 'visitor_id' )
        .notNull()
        .references( () => orgCustomers.id ), // Reference to the visitors table
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    performerId: uuid( 'performer_id' )
        .notNull()
        .references( () => orgPerformers.id ), // Reference to the performer
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),
} );

export const favoriteEvents = pgTable( 'favorite_events', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    userId: uuid( 'user_id' )
        .notNull()
        .references( () => userProfiles.id ), // Reference to the users table
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the events table
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),
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
        .references( () => events.id ),
    tags: jsonb( 'tags' ),
    name: text( 'name' ).notNull(),
    email: text( 'email' ).notNull().unique(),
    role: text( 'role' ).notNull(), // Role within the organization
    isActive: boolean( 'is_active' ).default( true ), // Indicates if the member is currently active
    lastLogin: timestamp( 'last_login' ), // Last login time of the member
    department: text( 'department' ), // Department or team the member belongs to
    permissions: jsonb( 'permissions' ), // List of permissions or access levels
    joinedDate: date( 'joined_date' ).notNull(), // Date the member joined the organization
    profileImageUrl: text( 'profile_image_url' ), // URL of the member's profile image
    phoneNumber: text( 'phone_number' ), // Member's phone number
    isVerified: boolean( 'is_verified' ).default( false ), // Indicates if the member's email or profile is verified
    isAdmin: boolean( 'is_admin' ).default( false ), // Indicates if the member has admin privileges
    departedAt: timestamp( 'departed_at' ), // Date when the member left the organization
    notes: text( 'notes' ), // Additional notes or information about the member
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Guilds Table
export const guilds = pgTable( 'guilds', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    name: text( 'name' ).notNull(),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    eventId: uuid( 'event_id' )
        .references( () => events.id ),
    description: text( 'description' ),
    tags: jsonb( 'tags' ),
    leaderName: text( 'leader_name' ),
    leaderContact: text( 'leader_contact' ),
    leaderEmail: text( 'leader_email' ), // Email of the guild leader for communication
    guildType: text( 'guild_type' ), // e.g., 'performer', 'artisan', 'vendor'
    website: text( 'website' ),
    profileImageUrl: text( 'profile_image_url' ), // URL for guild's logo or image
    status: text( 'status' ).default( 'confirmed' ), // e.g., 'confirmed', 'pending', 'cancelled'
    contractDetails: jsonb( 'contract_details' ), // JSONB field for contracts or agreements
    contactFrequency: text( 'contact_frequency' ).default( 'monthly' ), // How often to follow up (e.g., 'weekly', 'monthly')
    lastContacted: timestamp( 'last_contacted' ), // When was the last contact made
    nextFollowUp: timestamp( 'next_follow_up' ), // When to follow up next
    emailGroup: text( 'email_group' ), // Group name for email campaigns
    notes: text( 'notes' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Performers Table
export const orgPerformers = pgTable( 'org_performers', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    eventId: uuid( 'event_id' )
        .references( () => events.id ),
    name: text( 'name' ).notNull(),
    stageName: text( 'stage_name' ).notNull(),
    email: text( 'email' ).notNull().unique(),
    phone: text( 'phone' ),
    tags: jsonb( 'tags' ),
    profileImageUrl: text( 'profile_image_url' ), // URL of the performer's profile image
    genre: text( 'genre' ), // Type of performance or genre
    performanceTime: timestamp( 'performance_time' ), // Scheduled time of performance
    status: text( 'status' ).default( 'confirmed' ), // e.g., 'confirmed', 'tentative', 'cancelled'
    contractDetails: jsonb( 'contract_details' ), // Contract or agreement details
    socialLinks: jsonb( 'social_links' ), // Links to social media profiles or website
    contactFrequency: text( 'contact_frequency' ).default( 'monthly' ), // How often to follow up (e.g., 'weekly', 'monthly')
    lastContacted: timestamp( 'last_contacted' ), // When was the last contact made
    nextFollowUp: timestamp( 'next_follow_up' ), // When to follow up next
    emailGroup: text( 'email_group' ), // Group name for email campaigns
    notes: text( 'notes' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Event Speaker Table
export const eventSpeakers = pgTable( 'event_speakers', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .references( () => events.id ), // Reference to the event
    name: text( 'name' ).notNull(), // Speaker's name
    title: text( 'title' ), // Speaker's title or designation
    email: text( 'email' ).notNull().unique(), // Speaker's email
    phone: text( 'phone' ), // Speaker's phone number
    tags: jsonb( 'tags' ),
    profileImageUrl: text( 'profile_image_url' ), // URL of the speaker's profile image
    bio: text( 'bio' ), // Speaker's biography
    talkTitle: text( 'talk_title' ), // Title of the talk or presentation
    talkDescription: text( 'talk_description' ), // Description of the talk
    talkTime: timestamp( 'talk_time' ), // Scheduled time of the talk
    status: text( 'status' ).default( 'confirmed' ), // e.g., 'confirmed', 'tentative', 'cancelled'
    contractDetails: jsonb( 'contract_details' ), // Contract or agreement details
    socialLinks: jsonb( 'social_links' ), // Links to social media profiles or website
    contactFrequency: text( 'contact_frequency' ).default( 'monthly' ), // How often to follow up (e.g., 'weekly', 'monthly')
    lastContacted: timestamp( 'last_contacted' ), // When was the last contact made
    nextFollowUp: timestamp( 'next_follow_up' ), // When to follow up next
    emailGroup: text( 'email_group' ), // Group name for email campaigns
    notes: text( 'notes' ), // Additional notes about the speaker
    createdAt: timestamp( 'created_at' ).default( sql`now()` ), // Timestamp for when the record was created
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ) // Timestamp for when the record was last updated
} );

// Vendors Table
export const orgVendors = pgTable( 'org_vendors', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    eventId: uuid( 'event_id' )
        .references( () => events.id ),
    name: text( 'name' ).notNull(),
    businessName: text( 'business_name' ).notNull(),
    email: text( 'email' ).notNull().unique(),
    phone: text( 'phone' ),
    address: text( 'address' ),
    city: text( 'city' ),
    state: text( 'state' ),
    country: text( 'country' ),
    zipCode: text( 'zip_code' ),
    profileImageUrl: text( 'profile_image_url' ), // URL of the vendor's profile image or logo
    vendorType: text( 'vendor_type' ), // e.g., 'food', 'merchandise', 'service'
    status: text( 'status' ).default( 'active' ),
    contractDetails: jsonb( 'contract_details' ), // Contract or agreement details
    website: text( 'website' ),
    contactFrequency: text( 'contact_frequency' ).default( 'monthly' ), // How often to follow up (e.g., 'weekly', 'monthly')
    lastContacted: timestamp( 'last_contacted' ), // When was the last contact made
    nextFollowUp: timestamp( 'next_follow_up' ), // When to follow up next
    emailGroup: text( 'email_group' ), // Group name for email campaigns
    notes: text( 'notes' ),
    tags: jsonb( 'tags' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const participantEvents = pgTable( 'participant_events', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    participantId: uuid( 'participant_id' )
        .notNull()
        .references( () => orgPerformers.id ), // or the respective table (guilds or eventSpeakers)
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    eventRole: text( 'event_role' ), // 'vendor', 'performer', 'speaker', etc.
    status: text( 'status' ).default( 'confirmed' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
} );

// Invites Table
export const orgInvites = pgTable( 'org_invites', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    email: text( 'email' ).notNull(),
    status: text( 'status' ).notNull(),
    inviterId: uuid( 'inviter_id' ).references( () => userProfiles.id ),
    expiresAt: timestamp( 'expires_at' ),
    token: text( 'token' ).unique().notNull(),
    role: text( 'role' ),
    acceptedAt: timestamp( 'accepted_at' ),
    isResent: boolean( 'is_resent' ).default( false ),
    isRevoked: boolean( 'is_revoked' ).default( false ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

//  Blog Table
export const blogPosts = pgTable( 'blog_posts', {
    id: serial( 'id' ).primaryKey(),
    slug: varchar( 'slug', { length: 255 } ).notNull().unique(),
    title: text( 'title' ).notNull(),
    content: text( 'content' ).notNull(),
    excerpt: text( 'excerpt' ),
    authorId: serial( 'author_id' )
        .notNull()
        .references( () => authors.id ), // Foreign key to authors table
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
    publishedAt: timestamp( 'published_at' ),
    tags: text( 'tags' ),
    featuredImage: varchar( 'featured_image', { length: 255 } ),
    metaTitle: varchar( 'meta_title', { length: 255 } ),
    metaDescription: text( 'meta_description' ),
    isPublished: boolean( 'is_published' ).default( false ),
} );

// Authors Table
export const authors = pgTable( 'authors', {
    id: serial( 'id' ).primaryKey(),
    slug: varchar( 'slug', { length: 255 } ).notNull().unique(),
    name: varchar( 'name', { length: 100 } ).notNull(),
    bio: text( 'bio' ),
    avatarUrl: varchar( 'avatar_url', { length: 255 } ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` ),
} );

// Ticket Sales Pages Table
export const ticketPages = pgTable( 'ticket_pages', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    url: text( 'url' ).notNull().unique(), // Unique URL for the ticket sales page
    pageTitle: text( 'page_title' ).notNull(), // Custom title for the page
    description: text( 'description' ), // Description or details for the sales page
    exitPage: boolean( 'exit_page' ).default( false ),
    bounceRate: numeric( 'bounce_rate', { precision: 5, scale: 2 } ).default( sql`0` ), // Bounce rate as a percentage
    deviceType: text( 'device_type' ).default( 'desktop' ), // Type of device used (e.g., desktop, mobile, tablet)
    referralSource: text( 'referral_source' ), // Source of the traffic (e.g., social media, search engine)
    averageTimeOnPage: numeric( 'average_time_on_page', { precision: 5, scale: 2 } ).default( sql`0` ), // Average time spent on page in seconds
    conversionRate: numeric( 'conversion_rate', { precision: 5, scale: 2 } ).default( sql`0` ), // Conversion rate as a percentage

    entryPage: boolean( 'entry_page' ).default( false ), // Indicates if the ticket page was the entry point to the site
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Org Event Page Media Table
export const eventMedia = pgTable( 'event_media', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    type: text( 'type' ).notNull(), // Type of media (e.g., 'image', 'video')
    url: text( 'url' ).notNull(), // URL of the media file in the Supabase bucket
    description: text( 'description' ), // Optional description or caption for the media
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


// Ticket Analytics Table
export const ticketAnalytics = pgTable( 'ticket_analytics', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    ticketPageId: uuid( 'ticket_page_id' )
        .notNull()
        .references( () => ticketPages.id ),
    views: integer( 'views' ).default( 0 ), // Number of times the page was viewed
    clicks: integer( 'clicks' ).default( 0 ), // Number of times tickets were clicked on the page
    purchases: integer( 'purchases' ).default( 0 ), // Number of ticket purchases
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Org Transactions Table (Stripe)
export const orgTransactions = pgTable( 'org_transactions', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    customerId: uuid( 'customer_id' )
        .notNull()
        .references( () => orgCustomers.id ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    description: text( 'description' ),
    paymentMethod: text( 'payment_method' ), // e.g., 'card', 'bank_transfer', 'paypal'
    stripeFeeAmount: numeric( 'stripe_fee_amount', { precision: 10, scale: 2 } ).notNull(), // Fee charged by Stripe
    applicationFeeAmount: numeric( 'application_fee_amount', { precision: 10, scale: 2 } )
        .notNull()
        .default( sql`0.50` ), // application fee amount
    netAmount: numeric( 'net_amount', { precision: 10, scale: 2 } ),
    metadata: jsonb( 'metadata' ),
    invoiceId: text( 'invoice_id' ).unique(),
    relatedEntityId: uuid( 'related_entity_id' ), // Reference to related entity (e.g., eventId)
    refundStatus: text( 'refund_status' ), // e.g., 'full', 'partial', 'none'
    stripePaymentId: text( 'stripe_payment_id' ).unique(), // Stripe Payment ID
    totalAmount: numeric( 'total_amount', { precision: 10, scale: 2 } ).notNull(), // Total amount of the transaction
    currency: text( 'currency' ), // Currency for payment transactions
    transactionType: text( 'transaction_type' ).notNull(), // e.g., 'ticket_sale', 'vendor_fee', 'donation'
    status: text( 'status' ), // Status for payment transactions, e.g., 'succeeded', 'pending', 'failed'
    stripeConnectAccountId: text( 'stripe_connect_account_id' ),
    stripeTransferAmount: numeric( 'stripe_transfer_amount', { precision: 10, scale: 2 } ),
    stripeTransferStatus: text( 'stripe_transfer_status' ),
    stripeTransferId: text( 'stripe_transfer_id' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const stripeConnectPayouts = pgTable( 'stripe_connect_payouts', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    userProfileId: uuid( 'user_profile_id' )
        .notNull()
        .references( () => userProfiles.id ),
    stripePayoutId: text( 'stripe_payout_id' ).notNull(),
    amount: numeric( 'amount', { precision: 10, scale: 2 } ).notNull(),
    currency: text( 'currency' ).notNull(),
    status: text( 'status' ).notNull(), // e.g., 'paid', 'pending', 'failed'
    payoutMethod: text( 'payout_method' ).notNull(),
    arrivalDate: timestamp( 'arrival_date' ),
    createdAt: timestamp( 'created_at' ).defaultNow(),
    updatedAt: timestamp( 'updated_at' ).defaultNow()
} );

export const orgReferralPrograms = pgTable( 'org_referral_programs', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    name: text( 'name' ).notNull(), // Name of the referral program
    reward: text( 'reward' ).notNull(), // Description of the reward
    status: text( 'status' ).default( 'active' ), // e.g., 'active', 'inactive'
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const emailCampaigns = pgTable( 'email_campaigns', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    name: text( 'name' ).notNull(), // Name of the campaign
    subject: text( 'subject' ).notNull(), // Email subject
    body: text( 'body' ).notNull(), // Email body content
    segmentId: uuid( 'segment_id' ).references( () => audienceSegments.id ), // Reference to the audience segment
    scheduledAt: timestamp( 'scheduled_at' ), // When the email is scheduled to be sent
    sentAt: timestamp( 'sent_at' ), // When the email was sent
    status: text( 'status' ).default( 'draft' ), // e.g., 'draft', 'scheduled', 'sent'
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const audienceSegments = pgTable( 'audience_segments', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    name: text( 'name' ).notNull(), // Name of the segment
    criteria: jsonb( 'criteria' ).notNull(), // JSON field to store segmentation criteria (e.g., age, location, purchase history)
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const emailRecipients = pgTable( 'email_recipients', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    campaignId: uuid( 'campaign_id' )
        .notNull()
        .references( () => emailCampaigns.id ), // Reference to the email campaign
    customerId: uuid( 'customer_id' )
        .notNull()
        .references( () => orgCustomers.id ), // Reference to the customer
    sentAt: timestamp( 'sent_at' ), // When the email was sent
    openedAt: timestamp( 'opened_at' ), // When the email was opened
    clickedAt: timestamp( 'clicked_at' ), // When a link in the email was clicked
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const emailTemplates = pgTable( 'email_templates', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    name: text( 'name' ).notNull(), // Template name
    subject: text( 'subject' ).notNull(), // Default subject for the template
    body: text( 'body' ).notNull(), // Default body content for the template
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


////////////////////////////////////////////////////////////////////////////////////////
// Event Management CRM Schema:
////////////////////////////////////////////////////////////////////////////////////////

// Customer Interactions Table
export const customerInteractions = pgTable( 'customer_interactions', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    customerId: uuid( 'customer_id' )
        .notNull()
        .references( () => orgCustomers.id ), // Reference to orgCustomers
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to organizations
    interactionType: text( 'interaction_type' ).notNull(), // e.g., 'email', 'call', 'meeting'
    interactionDate: timestamp( 'interaction_date' ).notNull().default( sql`now()` ),
    notes: text( 'notes' ), // Notes about the interaction
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Customer feedback Table
export const customerFeedback = pgTable( 'customer_feedback', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    customerId: uuid( 'customer_id' )
        .notNull()
        .references( () => orgCustomers.id ),
    eventId: uuid( 'event_id' )
        .references( () => events.id ), // Optional reference to the event
    sessionId: uuid( 'session_id' )
        .references( () => eventSessions.id ), // Optional reference to the session
    rating: integer( 'rating' ).default( 0 ), // Rating given by the customer
    feedback: text( 'feedback' ), // Text feedback from the customer
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Leads table
export const leads = pgTable( 'leads', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    name: text( 'name' ).notNull(),
    email: text( 'email' ).notNull(),
    phone: text( 'phone' ),
    stageId: uuid( 'stage_id' )
        .references( () => salesStages.id ), // Reference to sales stages
    status: text( 'status' ).default( 'new' ), // e.g., 'new', 'contacted', 'converted'
    notes: text( 'notes' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Sales Pipelines Table
export const salesPipelines = pgTable( 'sales_pipelines', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    name: text( 'name' ).notNull(), // Name of the sales pipeline
    description: text( 'description' ), // Description of the sales pipeline
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Sales Stages Table
export const salesStages = pgTable( 'sales_stages', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    pipelineId: uuid( 'pipeline_id' )
        .notNull()
        .references( () => salesPipelines.id ), // Reference to sales pipelines
    stageName: text( 'stage_name' ).notNull(),
    probability: integer( 'probability' ), // Probability of conversion at this stage
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Sponsors Table
export const sponsors = pgTable( 'sponsors', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    name: text( 'name' ).notNull(), // Sponsor's name or company name
    contactName: text( 'contact_name' ), // Contact person's name
    contactEmail: text( 'contact_email' ), // Contact person's email
    contactPhone: text( 'contact_phone' ), // Contact person's phone
    sponsorshipLevel: text( 'sponsorship_level' ), // Level of sponsorship (e.g., 'gold', 'silver', 'bronze')
    contribution: numeric( 'contribution', { precision: 10, scale: 2 } ), // Monetary or in-kind contribution
    benefits: text( 'benefits' ), // Benefits provided to the sponsor
    status: text( 'status' ).default( 'active' ), // e.g., 'active', 'inactive'
    notes: text( 'notes' ), // Additional notes about the sponsor
    contractDetails: jsonb( 'contract_details' ), // Contract or agreement details
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


// Vendors Table
export const vendors = pgTable( 'vendors', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    name: text( 'name' ).notNull(), // Vendor's name or company name
    contactName: text( 'contact_name' ), // Contact person's name
    contactEmail: text( 'contact_email' ), // Contact person's email
    contactPhone: text( 'contact_phone' ), // Contact person's phone
    vendorType: text( 'vendor_type' ).notNull(), // Type of vendor (e.g., 'food', 'crafts', 'entertainment')
    boothLocation: text( 'booth_location' ), // Location of the vendor's booth at the event
    productsOrServices: text( 'products_or_services' ), // Description of what they sell or provide
    status: text( 'status' ).default( 'active' ), // e.g., 'active', 'inactive'
    contractDetails: jsonb( 'contract_details' ), // Contract or agreement details
    paymentStatus: text( 'payment_status' ).default( 'pending' ), // Payment status (e.g., 'paid', 'pending')
    notes: text( 'notes' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Volunteer Management CRM Schema:
export const volunteers = pgTable( 'volunteers', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    name: text( 'name' ).notNull(), // Volunteer name
    email: text( 'email' ).notNull().unique(), // Volunteer email
    phone: text( 'phone' ), // Volunteer phone
    role: text( 'role' ).notNull(), // Role or duty at the event (e.g., 'usher', 'setup', 'security')
    shift: text( 'shift' ), // Shift timing or details
    availability: text( 'availability' ), // Availability details (e.g., 'morning', 'afternoon')
    status: text( 'status' ).default( 'active' ), // e.g., 'active', 'inactive'
    notes: text( 'notes' ),
    emergencyContact: text( 'emergency_contact' ), // Emergency contact details
    tshirtSize: text( 'tshirt_size' ), // T-shirt size, if provided
    waiverSigned: boolean( 'waiver_signed' ).default( false ), // Indicates if the volunteer waiver has been signed
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const volunteerAssignments = pgTable( 'volunteer_assignments', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    volunteerId: uuid( 'volunteer_id' )
        .notNull()
        .references( () => volunteers.id ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    taskName: text( 'task_name' ).notNull(),
    assignmentDate: date( 'assignment_date' ).notNull(),
    startTime: timestamp( 'start_time' ).notNull(),
    endTime: timestamp( 'end_time' ).notNull(),
    location: text( 'location' ),
    supervisorId: uuid( 'supervisor_id' )
        .references( () => userProfiles.userId ), // Staff member supervising
    notes: text( 'notes' ),
    status: text( 'status' ).default( 'scheduled' ), // e.g., 'scheduled', 'completed', 'canceled'
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

export const volunteerHours = pgTable( 'volunteer_hours', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    volunteerId: uuid( 'volunteer_id' )
        .notNull()
        .references( () => volunteers.id ),
    assignmentId: uuid( 'assignment_id' )
        .references( () => volunteerAssignments.id ), // Reference to the assignment
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ),
    date: date( 'date' ).notNull(),
    hours: numeric( 'hours', { precision: 5, scale: 2 } ).notNull(), // Number of hours
    activityDescription: text( 'activity_description' ), // Description of the work done
    approvedBy: uuid( 'approved_by' )
        .references( () => userProfiles.userId ), // User who approved the hours
    isApproved: boolean( 'is_approved' ).default( false ),
    notes: text( 'notes' ),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );



// Donors Table
export const donors = pgTable( 'donors', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    name: text( 'name' ).notNull(), // Donor's name or company name
    email: text( 'email' ).notNull().unique(), // Donor email
    phone: text( 'phone' ), // Donor phone
    donationAmount: numeric( 'donation_amount', { precision: 10, scale: 2 } ), // Amount donated
    donationDate: timestamp( 'donation_date' ).default( sql`now()` ), // Date of donation
    donationType: text( 'donation_type' ), // Type of donation (e.g., 'one-time', 'recurring')
    status: text( 'status' ).default( 'active' ), // e.g., 'active', 'inactive'
    notes: text( 'notes' ),
    acknowledgmentSent: boolean( 'acknowledgment_sent' ).default( false ), // Indicates if an acknowledgment letter or email has been sent
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Performers Table
export const performers = pgTable( 'performers', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    name: text( 'name' ).notNull(), // Performer's name or stage name
    email: text( 'email' ).notNull().unique(), // Performer's email
    phone: text( 'phone' ), // Performer's phone
    genre: text( 'genre' ), // Type of performance or genre
    performanceTime: timestamp( 'performance_time' ), // Scheduled time of performance
    status: text( 'status' ).default( 'confirmed' ), // e.g., 'confirmed', 'tentative', 'cancelled'
    contractDetails: jsonb( 'contract_details' ), // Contract or agreement details
    requirements: text( 'requirements' ), // Special requirements (e.g., sound, lighting)
    notes: text( 'notes' ),
    socialLinks: jsonb( 'social_links' ), // Links to social media profiles or website
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


// Event Attendees Table
export const attendees = pgTable( 'attendees', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),

    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Foreign key to organizations table
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Foreign key to events table
    name: text( 'name' ).notNull(),
    email: text( 'email' ).notNull().unique(),
    status: text( 'status' ).default( 'registered' ), // Status, e.g., 'registered', 'checked-in', 'cancelled'
    checkInTime: timestamp( 'check_in_time' ), // Time when the attendee checked in
    notes: text( 'notes' ), // Additional notes
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Communication Logs Table
export const communicationLogs = pgTable( 'communication_logs', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    contactId: uuid( 'contact_id' ).notNull(), // Reference to any contact (e.g., sponsor, vendor, volunteer, etc.)
    contactType: text( 'contact_type' ).notNull(), // Type of contact (e.g., 'sponsor', 'vendor', 'volunteer')
    eventId: uuid( 'event_id' ).references( () => events.id ), // Optional reference to the event
    communicationType: text( 'communication_type' ).notNull(), // e.g., 'email', 'phone', 'meeting'
    subject: text( 'subject' ), // Subject of the communication
    content: text( 'content' ), // Content or summary of the communication
    date: timestamp( 'date' ).default( sql`now()` ), // Date of communication
    followUpNeeded: boolean( 'follow_up_needed' ).default( false ), // Indicates if a follow-up is needed
    followUpDate: timestamp( 'follow_up_date' ), // Date for the follow-up
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Tasks Table
export const tasks = pgTable( 'tasks', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' ).references( () => events.id ), // Optional reference to the event
    assignedTo: uuid( 'assigned_to' ).notNull(), // Reference to a user in the organization
    title: text( 'title' ).notNull(), // Title of the task
    description: text( 'description' ), // Description of the task
    dueDate: timestamp( 'due_date' ), // Due date for the task
    status: text( 'status' ).default( 'pending' ), // e.g., 'pending', 'completed'
    priority: text( 'priority' ).default( 'medium' ), // e.g., 'low', 'medium', 'high'
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


// Feedback Surveys Table
export const feedbackSurveys = pgTable( 'feedback_surveys', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => events.id ), // Reference to the event
    respondentType: text( 'respondent_type' ).notNull(), // e.g., 'attendee', 'sponsor', 'vendor', 'volunteer'
    respondentId: uuid( 'respondent_id' ).notNull(), // Reference to the respondent
    surveyData: jsonb( 'survey_data' ), // JSON field to store survey responses
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

// Payments & Invoices Table
export const paymentsInvoices = pgTable( 'payments_invoices', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    contactId: uuid( 'contact_id' ).notNull(), // Reference to a contact (e.g., sponsor, vendor)
    contactType: text( 'contact_type' ).notNull(), // Type of contact (e.g., 'sponsor', 'vendor')
    eventId: uuid( 'event_id' ).references( () => events.id ), // Optional reference to the event
    invoiceNumber: text( 'invoice_number' ).notNull().unique(), // Invoice number
    amount: numeric( 'amount', { precision: 10, scale: 2 } ).notNull(), // Invoice amount
    currency: text( 'currency' ).default( 'USD' ), // Currency of the invoice
    paymentStatus: text( 'payment_status' ).default( 'unpaid' ), // e.g., 'paid', 'unpaid'
    dueDate: timestamp( 'due_date' ), // Due date for the payment
    paidDate: timestamp( 'paid_date' ), // Date the invoice was paid
    notes: text( 'notes' ),
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );


// KANBAN BOARD SCHEMA
export const kanbanBoards = pgTable( 'kanban_boards', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' )
        .notNull()
        .references( () => organizations.id ), // Reference to the organization
    name: text( 'name' ).notNull(), // Name of the Kanban board
    description: text( 'description' ), // Optional description of the board
    createdBy: uuid( 'created_by' )
        .notNull()
        .references( () => userProfiles.id ), // User who created the board
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const kanbanColumns = pgTable( 'kanban_columns', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    boardId: uuid( 'board_id' )
        .notNull()
        .references( () => kanbanBoards.id ), // Reference to the Kanban board
    name: text( 'name' ).notNull(), // Name of the column (e.g., 'To Do', 'In Progress', 'Done')
    position: integer( 'position' ).notNull(), // Position of the column in the board
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const kanbanCards = pgTable( 'kanban_cards', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    columnId: uuid( 'column_id' )
        .notNull()
        .references( () => kanbanColumns.id ), // Reference to the Kanban column
    boardId: uuid( 'board_id' )
        .notNull()
        .references( () => kanbanBoards.id ), // Reference to the Kanban board for easy querying
    title: text( 'title' ).notNull(), // Title of the card/task
    description: text( 'description' ), // Description or details of the card/task
    assignedTo: uuid( 'assigned_to' ).references( () => userProfiles.id ), // User assigned to the task
    dueDate: timestamp( 'due_date' ), // Optional due date for the task
    position: integer( 'position' ).notNull(), // Position of the card in the column
    priority: text( 'priority' ).default( 'medium' ), // e.g., 'low', 'medium', 'high'
    status: text( 'status' ).default( 'open' ), // e.g., 'open', 'closed'
    tags: text( 'tags' ).array(), // Optional tags for the card
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const kanbanCardActivities = pgTable( 'kanban_card_activities', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    cardId: uuid( 'card_id' )
        .notNull()
        .references( () => kanbanCards.id ), // Reference to the Kanban card
    activityType: text( 'activity_type' ).notNull(), // Type of activity (e.g., 'moved', 'updated', 'commented')
    description: text( 'description' ), // Description of the activity
    performedBy: uuid( 'performed_by' )
        .notNull()
        .references( () => userProfiles.id ), // User who performed the activity
    createdAt: timestamp( 'created_at' ).default( sql`now()` )
} );

export const kanbanCardComments = pgTable( 'kanban_card_comments', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    cardId: uuid( 'card_id' )
        .notNull()
        .references( () => kanbanCards.id ), // Reference to the Kanban card
    comment: text( 'comment' ).notNull(), // Comment text
    createdBy: uuid( 'created_by' )
        .notNull()
        .references( () => userProfiles.id ), // User who created the comment
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

///////////////   END KANBAN BOARD SCHEMA   //////////////////////`

/////////////////    BEGIN CALENDAR SCHEMA    //////////////////////

export const calendars = pgTable( 'calendars', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' ).references( () => organizations.id ), // Reference to the organization, nullable for personal calendars
    userId: uuid( 'user_id' ).references( () => userProfiles.id ), // Reference to the user, nullable for organizational calendars
    name: text( 'name' ).notNull(), // Name of the calendar (e.g., "Main Event Calendar", "Personal Tasks")
    description: text( 'description' ), // Optional description of the calendar
    color: varchar( 'color', { length: 7 } ), // Color code for the calendar
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const calendarEvents = pgTable( 'calendar_events', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    calendarId: uuid( 'calendar_id' )
        .notNull()
        .references( () => calendars.id ), // Reference to the calendar
    title: text( 'title' ).notNull(), // Title of the event
    description: text( 'description' ), // Optional description or details of the event
    startDate: timestamp( 'start_date' ).notNull(), // Start date and time of the event
    endDate: timestamp( 'end_date' ), // End date and time of the event
    allDay: boolean( 'all_day' ).default( false ), // Flag for all-day events
    location: text( 'location' ), // Location of the event
    eventType: text( 'event_type' ).default( 'general' ), // Type of event (e.g., 'meeting', 'reminder', 'birthday')
    organizerId: uuid( 'organizer_id' ).references( () => userProfiles.id ), // User who created or is responsible for the event
    isRecurring: boolean( 'is_recurring' ).default( false ), // Flag for recurring events
    recurrenceRule: text( 'recurrence_rule' ), // Recurrence rule (e.g., "FREQ=DAILY;INTERVAL=1")
    status: text( 'status' ).default( 'confirmed' ), // e.g., 'confirmed', 'tentative', 'cancelled'
    notificationSettings: jsonb( 'notification_settings' ), // JSON object for notification preferences
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const calendarTasks = pgTable( 'calendar_tasks', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    calendarId: uuid( 'calendar_id' )
        .notNull()
        .references( () => calendars.id ), // Reference to the calendar
    title: text( 'title' ).notNull(), // Title of the task
    description: text( 'description' ), // Optional description of the task
    dueDate: timestamp( 'due_date' ), // Due date of the task
    isCompleted: boolean( 'is_completed' ).default( false ), // Status of the task
    priority: text( 'priority' ).default( 'medium' ), // e.g., 'low', 'medium', 'high'
    assignedTo: uuid( 'assigned_to' ).references( () => userProfiles.id ), // User assigned to the task
    status: text( 'status' ).default( 'open' ), // e.g., 'open', 'in-progress', 'completed'
    tags: text( 'tags' ).array(), // Optional tags for categorizing tasks
    notificationSettings: jsonb( 'notification_settings' ), // JSON object for task notification preferences
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const recurringEventInstances = pgTable( 'recurring_event_instances', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => calendarEvents.id ), // Reference to the recurring event
    occurrenceDate: timestamp( 'occurrence_date' ).notNull(), // Specific date and time of this occurrence
    status: text( 'status' ).default( 'confirmed' ), // e.g., 'confirmed', 'cancelled', 'tentative'
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const calEventAttendees = pgTable( 'cal_event_attendees', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => calendarEvents.id ), // Reference to the event
    userId: uuid( 'user_id' )
        .notNull()
        .references( () => userProfiles.id ), // User who is attending the event
    status: text( 'status' ).default( 'confirmed' ), // e.g., 'confirmed', 'tentative', 'declined'
    responseDate: timestamp( 'response_date' ), // Date of the attendee's response
    notes: text( 'notes' ), // Any notes or special requests from the attendee
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

export const calendarEventReminders = pgTable( 'calendar_event_reminders', {
    id: uuid( 'id' )
        .primaryKey()
        .default( sql`uuid_generate_v4()` ),
    eventId: uuid( 'event_id' )
        .notNull()
        .references( () => calendarEvents.id ), // Reference to the event
    remindAt: timestamp( 'remind_at' ).notNull(), // When to send the reminder
    reminderType: text( 'reminder_type' ).default( 'email' ), // e.g., 'email', 'sms', 'push'
    message: text( 'message' ), // Optional custom reminder message
    createdAt: timestamp( 'created_at' ).default( sql`now()` ),
    updatedAt: timestamp( 'updated_at' ).default( sql`now()` )
} );

/////////////////    END CALENDAR SCHEMA    //////////////////////

////////////////////     Sign Up Schema (Updated)     ////////////////////


// Enums
export const participantRoles = [ 'attendee', 'volunteer', 'staff' ] as const;
export type ParticipantRole = typeof participantRoles[ number ];

export const contactMethods = [ 'email', 'sms' ] as const;
export type ContactMethod = typeof contactMethods[ number ];

export const notificationTypes = [ 'email', 'sms' ] as const;
export type NotificationType = typeof notificationTypes[ number ];

export const notificationStatuses = [ 'pending', 'sent', 'failed', 'read' ] as const;
export type NotificationStatus = typeof notificationStatuses[ number ];

export const fieldTypes = [ 'text', 'checkbox', 'select', 'radio', 'textarea', 'number', 'date' ] as const;
export type FieldType = typeof fieldTypes[ number ];

export const messageStatuses = [ 'pending', 'sent', 'failed' ] as const;
export type MessageStatus = typeof messageStatuses[ number ];

export const deliveryMethods = [ 'email', 'sms' ] as const;
export type DeliveryMethod = typeof deliveryMethods[ number ];



// Signup Sheets Table
export const signupSheets = pgTable( 'signup_sheets', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' ).notNull().references( () => organizations.id ),
    creatorId: uuid( 'creator_id' ).notNull().references( () => userProfiles.id ),
    groupId: uuid( 'group_id' ).references( () => signupSheetGroups.id ),
    title: text( 'title' ).notNull(),
    description: text( 'description' ),
    startDate: date( 'start_date' ),
    endDate: date( 'end_date' ),
    attachmentUrls: jsonb( 'attachment_urls' ).$type<string[]>(), // Stores an array of URLs
    eventId: uuid( 'event_id' ).references( () => events.id ),
    isPublished: boolean( 'is_published' ).default( false ).notNull(),
    isArchived: boolean( 'is_archived' ).default( false ).notNull(),
    slug: text( 'slug' ).notNull().unique(), // Unique constraint added
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Signup Sheet Groups Table
export const signupSheetGroups = pgTable( 'signup_sheet_groups', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    orgId: uuid( 'org_id' ).notNull().references( () => organizations.id ),
    name: text( 'name' ).notNull(),
    description: text( 'description' ),
    settings: jsonb( 'settings' ).$type<Record<string, any>>(),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Participants Table
export const participants = pgTable( 'participants', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    signupSheetId: uuid( 'signup_sheet_id' ).notNull().references( () => signupSheets.id ),
    participantName: text( 'participant_name' ).notNull(),
    email: text( 'email' ).notNull(),
    phone: text( 'phone' ),
    timeZone: text( 'time_zone' ),
    profilePicUrl: text( 'profile_pic_url' ),
    preferredMethodOfContact: text( 'preferred_method_of_contact' ).$type<ContactMethod>(),
    participantRole: text( 'participant_role' ).$type<ParticipantRole>().default( 'attendee' ).notNull(),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Signup Sheet Slots Table
export const signupSheetSlots = pgTable( 'signup_sheet_slots', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    signupSheetId: uuid( 'signup_sheet_id' ).notNull().references( () => signupSheets.id ),
    groupId: uuid( 'group_id' ).references( () => signupSheetGroups.id ),
    title: text( 'title' ).notNull(),
    description: text( 'description' ),
    startTimestamp: timestamp( 'start_timestamp' ),
    endTimestamp: timestamp( 'end_timestamp' ),
    quantity: integer( 'quantity' ).default( 1 ).notNull(),
    filledQuantity: integer( 'filled_quantity' ).default( 0 ).notNull(),
    hideNumberWanted: boolean( 'hide_number_wanted' ).default( false ).notNull(),
    collectMoney: boolean( 'collect_money' ).default( false ).notNull(),
    price: numeric( 'price', { precision: 10, scale: 2 } ),
    currency: text( 'currency' ).default( 'USD' ),
    waitlistCapacity: integer( 'waitlist_capacity' ).default( 0 ).notNull(),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Signup Sheet Custom Questions Table
export const signupSheetCustomQuestions = pgTable( 'signup_sheet_custom_questions', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    signupSheetId: uuid( 'signup_sheet_id' ).notNull().references( () => signupSheets.id ),
    questionText: text( 'question_text' ).notNull(),
    fieldType: text( 'field_type' ).$type<FieldType>().notNull(),
    options: jsonb( 'options' ).$type<string[]>(),
    validationRules: jsonb( 'validation_rules' ).$type<Record<string, any>>(),
    isRequired: boolean( 'is_required' ).default( false ).notNull(),

    order: integer( 'order' ).default( 0 ).notNull(),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Signup Sheet Responses Table
export const signupSheetResponses = pgTable( 'signup_sheet_responses', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    signupSheetId: uuid( 'signup_sheet_id' ).notNull().references( () => signupSheets.id ),
    slotId: uuid( 'slot_id' ).notNull().references( () => signupSheetSlots.id ),
    participantId: uuid( 'participant_id' ).references( () => participants.id ),
    responderName: text( 'responder_name' ),
    responderEmail: text( 'responder_email' ),
    responseData: jsonb( 'response_data' ),
    waitlistStatus: boolean( 'waitlist_status' ).default( false ).notNull(),
    preferredContactMethod: text( 'preferred_contact_method' ).$type<ContactMethod>(),
    lastUpdatedBy: uuid( 'last_updated_by' ).references( () => userProfiles.id ),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Group Members Table
export const groupMembers = pgTable( 'group_members', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    groupId: uuid( 'group_id' ).notNull().references( () => signupSheetGroups.id ),
    participantId: uuid( 'participant_id' ).notNull().references( () => participants.id ),
    isGroupLeader: boolean( 'is_group_leader' ).default( false ).notNull(),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Notifications Table
export const notifications = pgTable( 'notifications', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    recipientId: uuid( 'recipient_id' ).references( () => participants.id ),
    notificationType: text( 'notification_type' ).$type<NotificationType>().notNull(),
    messageContent: text( 'message_content' ).notNull(),
    status: text( 'status' ).$type<NotificationStatus>().default( 'pending' ).notNull(),
    scheduledAt: timestamp( 'scheduled_at' ),
    readAt: timestamp( 'read_at' ),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Messages Table
export const messages = pgTable( 'messages', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    groupId: uuid( 'group_id' ).references( () => signupSheetGroups.id ),
    participantId: uuid( 'participant_id' ).references( () => participants.id ),
    content: text( 'content' ).notNull(),
    attachmentUrls: jsonb( 'attachment_urls' ), // Stores an array of URLs
    messageTemplateId: uuid( 'message_template_id' ).references( () => messageTemplates.id ),
    sentAt: timestamp( 'sent_at' ).defaultNow().notNull(),
    deliveryMethod: text( 'delivery_method' ).$type<DeliveryMethod>().notNull(),
    status: text( 'status' ).$type<MessageStatus>().default( 'pending' ).notNull(),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

// Message Templates Table
export const messageTemplates = pgTable( 'message_templates', {
    id: uuid( 'id' ).primaryKey().default( sql`uuid_generate_v4()` ),
    name: text( 'name' ).notNull(),
    content: text( 'content' ).notNull(),
    createdAt: timestamp( 'created_at' ).defaultNow().notNull(),
    updatedAt: timestamp( 'updated_at' ).defaultNow().notNull(),
} );

////////////////////     End Sign Up Schema (Updated)     ////////////////////


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
