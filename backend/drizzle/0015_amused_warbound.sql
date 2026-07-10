CREATE TYPE "public"."invoice_type" AS ENUM('manual', 'image');--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "type" "invoice_type" DEFAULT 'manual';