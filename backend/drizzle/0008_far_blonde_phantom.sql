CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoiceId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"total" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_customerId_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_createdBy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoiceNo" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "subtotal" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "subtotal" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "discount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "imageUrl" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "note" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customerName" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paid" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "due" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_invoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "customerId";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "createdBy";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "source";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "tax";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "paidAmount";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "dueAmount";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "paymentMethod";--> statement-breakpoint
DROP TYPE "public"."invoice_source";--> statement-breakpoint
DROP TYPE "public"."payment_method";