ALTER TABLE "units" ADD COLUMN "baseUnit" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "conversionFactor" numeric(12, 2);