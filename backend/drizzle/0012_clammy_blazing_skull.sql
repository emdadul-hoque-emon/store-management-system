ALTER TABLE "invoices" DROP CONSTRAINT "invoices_invoiceNo_unique";--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoiceNo" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoiceNo" ADD GENERATED ALWAYS AS IDENTITY (sequence name "invoices_invoiceNo_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1);