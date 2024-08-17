CREATE TABLE IF NOT EXISTS "ticket_buyer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"profile_image_url" text,
	"contact_number" text,
	"bio" text,
	"social_links" jsonb,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"preferences" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"stripe_customer_id" text,
	"stripe_default_currency" text
);
