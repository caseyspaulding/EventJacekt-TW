ALTER TABLE "org_customers" DROP CONSTRAINT "org_customers_org_payment_id_org_payments_id_fk";
--> statement-breakpoint
ALTER TABLE "org_customers" DROP COLUMN IF EXISTS "org_payment_id";