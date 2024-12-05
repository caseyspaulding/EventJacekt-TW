CREATE TABLE IF NOT EXISTS "ticket_question_answers" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"answer_text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticket_type_questions" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"ticket_type_id" uuid NOT NULL,
	"question_text" text NOT NULL,
	"question_type" text NOT NULL,
	"options" text[],
	"is_required" boolean DEFAULT true,
	"order" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_question_answers" ADD CONSTRAINT "ticket_question_answers_ticket_id_org_event_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."org_event_tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_question_answers" ADD CONSTRAINT "ticket_question_answers_question_id_ticket_type_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."ticket_type_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_type_questions" ADD CONSTRAINT "ticket_type_questions_ticket_type_id_org_ticket_types_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."org_ticket_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
