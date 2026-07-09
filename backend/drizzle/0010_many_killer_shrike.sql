CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" varchar(255),
	"email" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "storeId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "storeId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "storeId" uuid NOT NULL;