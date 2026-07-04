ALTER TABLE "products" ALTER COLUMN "barcode" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "barcode" SET DEFAULT 22862574;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "barcode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "unitId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "imageUrl" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "isActive" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price" numeric(12, 2) DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "sku";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "purchasePrice";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "sellingPrice";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "minimumStock";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_barcode_unique" UNIQUE("barcode");