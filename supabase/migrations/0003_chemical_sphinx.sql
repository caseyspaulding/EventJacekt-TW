ALTER TABLE "ticket_types" ALTER COLUMN "sale_start_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "ticket_types" ALTER COLUMN "sale_end_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "valid_from" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "valid_until" SET DATA TYPE date;