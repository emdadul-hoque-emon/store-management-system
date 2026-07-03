CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"phone" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL
);
