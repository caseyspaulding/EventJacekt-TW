ALTER TABLE "org_event_tickets" ADD COLUMN "currency" text NOT NULL;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "qr_code" text;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "promotion_name" text;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "discount_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "final_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "is_vip" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "access_level" text;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "transferred_to_user_id" uuid;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "transfer_date" timestamp;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "is_transferred" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "loyalty_points_earned" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "loyalty_points_redeemed" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "is_digital_only" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "physical_ticket_status" text;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "insurance_provider" text;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "insurance_policy_number" text;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "is_insured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "exchange_rate" numeric(15, 6);--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "permissions" jsonb;--> statement-breakpoint
ALTER TABLE "org_event_tickets" ADD COLUMN "sales_channel_details" jsonb;--> statement-breakpoint
ALTER TABLE "org_event_tickets" DROP COLUMN IF EXISTS "buyer_first_name";--> statement-breakpoint
ALTER TABLE "org_event_tickets" DROP COLUMN IF EXISTS "buyer_last_name";--> statement-breakpoint
ALTER TABLE "org_event_tickets" DROP COLUMN IF EXISTS "buyer_email";