CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "app_config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blocked_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"grill_id" integer,
	"reason" text
);
--> statement-breakpoint
CREATE TABLE "booking_extras" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"extra_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"grill_id" integer,
	"package_id" integer NOT NULL,
	"rental_date" date NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_address" text,
	"customer_city" text,
	"event_type" text,
	"guest_count" integer,
	"notes" text,
	"accepted_terms" boolean DEFAULT false NOT NULL,
	"accepted_privacy" boolean DEFAULT false NOT NULL,
	"package_price" integer NOT NULL,
	"extras_total" integer DEFAULT 0 NOT NULL,
	"deposit" integer DEFAULT 25000 NOT NULL,
	"total_amount" integer NOT NULL,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"deposit_refunded" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"cleaned_on_return" boolean,
	"confirmation_email_sent_at" timestamp with time zone,
	"pickup_reminder_sent_at" timestamp with time zone,
	"return_reminder_sent_at" timestamp with time zone,
	"reserved_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bookings_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "extras" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL,
	"price_per_unit" integer NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faq_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "grills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"weight_kg" integer NOT NULL,
	"price" integer NOT NULL,
	"serves_min" integer NOT NULL,
	"serves_max" integer NOT NULL,
	"includes" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_resets" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "password_resets_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stripe_events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_grill_id_grills_id_fk" FOREIGN KEY ("grill_id") REFERENCES "public"."grills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_extras" ADD CONSTRAINT "booking_extras_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_extras" ADD CONSTRAINT "booking_extras_extra_id_extras_id_fk" FOREIGN KEY ("extra_id") REFERENCES "public"."extras"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_grill_id_grills_id_fk" FOREIGN KEY ("grill_id") REFERENCES "public"."grills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_admin_user_id_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_admin_user_id_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blocked_dates_date_idx" ON "blocked_dates" USING btree ("date");--> statement-breakpoint
CREATE INDEX "bookings_rental_date_idx" ON "bookings" USING btree ("rental_date");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_stripe_session_idx" ON "bookings" USING btree ("stripe_session_id");--> statement-breakpoint
CREATE INDEX "contact_messages_status_idx" ON "contact_messages" USING btree ("status");