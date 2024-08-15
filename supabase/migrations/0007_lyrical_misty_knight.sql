CREATE TABLE IF NOT EXISTS "stripe_connect_onboarding" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"stripe_account_id" text NOT NULL,
	"onboarding_status" text NOT NULL,
	"onboarding_url" text,
	"onboarding_started_at" timestamp DEFAULT now(),
	"onboarding_completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stripe_connect_payouts" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"stripe_payout_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"payout_method" text NOT NULL,
	"arrival_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "org_transactions" ADD COLUMN "stripe_connect_account_id" text;--> statement-breakpoint
ALTER TABLE "org_transactions" ADD COLUMN "stripe_transfer_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "org_transactions" ADD COLUMN "stripe_transfer_status" text;--> statement-breakpoint
ALTER TABLE "org_transactions" ADD COLUMN "stripe_transfer_id" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "is_stripe_connect_account" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stripe_connect_onboarding" ADD CONSTRAINT "stripe_connect_onboarding_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stripe_connect_payouts" ADD CONSTRAINT "stripe_connect_payouts_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_email_unique" UNIQUE("email");