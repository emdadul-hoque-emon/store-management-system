CREATE TYPE "public"."user_role" AS ENUM('admin', 'employee');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'employee' NOT NULL;