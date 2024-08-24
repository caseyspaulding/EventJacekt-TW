ALTER TABLE "ticket_buyer_profiles" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "ticket_buyer_profiles" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "ticket_buyer_profiles" ADD COLUMN "favorite_event_id" uuid;--> statement-breakpoint
ALTER TABLE "ticket_buyer_profiles" ADD COLUMN "favorite_performer_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_buyer_profiles" ADD CONSTRAINT "ticket_buyer_profiles_favorite_event_id_events_id_fk" FOREIGN KEY ("favorite_event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_buyer_profiles" ADD CONSTRAINT "ticket_buyer_profiles_favorite_performer_id_org_performers_id_fk" FOREIGN KEY ("favorite_performer_id") REFERENCES "public"."org_performers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
