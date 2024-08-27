CREATE TABLE IF NOT EXISTS "event_locations" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text,
	"address" text,
	"city" text,
	"state" text,
	"country" text,
	"zip_code" text,
	"latitude" double precision,
	"longitude" double precision,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "event_schedules" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "event_schedules" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "event_schedules" ADD COLUMN "start_time" timestamp;--> statement-breakpoint
ALTER TABLE "event_schedules" ADD COLUMN "end_time" timestamp;--> statement-breakpoint
ALTER TABLE "event_schedules" ADD COLUMN "speaker" text;--> statement-breakpoint
ALTER TABLE "event_schedules" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "event_sessions" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "event_sessions" ADD COLUMN "longitude" double precision;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "schedule_details" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "banner_image" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "gallery_images" text[];--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "video_links" text[];--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "organizer_contact" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_locations" ADD CONSTRAINT "event_locations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
