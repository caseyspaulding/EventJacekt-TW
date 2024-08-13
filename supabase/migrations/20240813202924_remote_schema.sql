create schema if not exists "drizzle";

create sequence "drizzle"."__drizzle_migrations_id_seq";

create table "drizzle"."__drizzle_migrations" (
    "id" integer not null default nextval('drizzle.__drizzle_migrations_id_seq'::regclass),
    "hash" text not null,
    "created_at" bigint
);


alter sequence "drizzle"."__drizzle_migrations_id_seq" owned by "drizzle"."__drizzle_migrations"."id";

CREATE UNIQUE INDEX __drizzle_migrations_pkey ON drizzle.__drizzle_migrations USING btree (id);

alter table "drizzle"."__drizzle_migrations" add constraint "__drizzle_migrations_pkey" PRIMARY KEY using index "__drizzle_migrations_pkey";


alter table "public"."events" drop constraint "events_slug_unique";

drop index if exists "public"."events_slug_unique";

create table "public"."ticket_sales" (
    "id" uuid not null default uuid_generate_v4(),
    "ticket_id" uuid not null,
    "attendee_id" uuid not null,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now()
);


CREATE UNIQUE INDEX events_slug_key ON public.events USING btree (slug);

CREATE UNIQUE INDEX ticket_sales_pkey ON public.ticket_sales USING btree (id);

alter table "public"."ticket_sales" add constraint "ticket_sales_pkey" PRIMARY KEY using index "ticket_sales_pkey";

alter table "public"."events" add constraint "events_slug_key" UNIQUE using index "events_slug_key";

grant delete on table "public"."ticket_sales" to "anon";

grant insert on table "public"."ticket_sales" to "anon";

grant references on table "public"."ticket_sales" to "anon";

grant select on table "public"."ticket_sales" to "anon";

grant trigger on table "public"."ticket_sales" to "anon";

grant truncate on table "public"."ticket_sales" to "anon";

grant update on table "public"."ticket_sales" to "anon";

grant delete on table "public"."ticket_sales" to "authenticated";

grant insert on table "public"."ticket_sales" to "authenticated";

grant references on table "public"."ticket_sales" to "authenticated";

grant select on table "public"."ticket_sales" to "authenticated";

grant trigger on table "public"."ticket_sales" to "authenticated";

grant truncate on table "public"."ticket_sales" to "authenticated";

grant update on table "public"."ticket_sales" to "authenticated";

grant delete on table "public"."ticket_sales" to "service_role";

grant insert on table "public"."ticket_sales" to "service_role";

grant references on table "public"."ticket_sales" to "service_role";

grant select on table "public"."ticket_sales" to "service_role";

grant trigger on table "public"."ticket_sales" to "service_role";

grant truncate on table "public"."ticket_sales" to "service_role";

grant update on table "public"."ticket_sales" to "service_role";


