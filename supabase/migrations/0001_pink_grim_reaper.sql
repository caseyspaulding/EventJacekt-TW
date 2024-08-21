ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "connected_account_id";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_customer_id";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_account_type";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_account_status";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_account_country";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_account_created";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_subscription_id";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_last_payout_date";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_account_balance";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_verification_due_date";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_tax_information";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_payout_method";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_default_currency";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "stripe_connect_linked";