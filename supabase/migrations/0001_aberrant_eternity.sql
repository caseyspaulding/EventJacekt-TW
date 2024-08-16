ALTER TABLE "organizations" ADD COLUMN "stripe_connect_account_id" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_account_type" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_account_status" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_account_country" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_account_created" timestamp;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_last_payout_date" timestamp;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_account_balance" numeric(15, 2);--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_verification_due_date" timestamp;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_tax_information" jsonb;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_payout_method" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_default_currency" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "stripe_connect_linked" boolean DEFAULT false;