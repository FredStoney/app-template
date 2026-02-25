CREATE TABLE "subscription" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_subscription_id" text NOT NULL UNIQUE,
	"stripe_price_id" text NOT NULL,
	"status" text NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
CREATE INDEX "subscription_userId_idx" ON "subscription" ("user_id");--> statement-breakpoint
CREATE INDEX "subscription_stripeCustomerId_idx" ON "subscription" ("stripe_customer_id");--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;