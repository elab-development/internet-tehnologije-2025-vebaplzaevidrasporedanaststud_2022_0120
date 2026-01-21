CREATE TYPE "public"."attendance_status" AS ENUM('PRESENT', 'ABSENT');--> statement-breakpoint
CREATE TYPE "public"."cabinet_type" AS ENUM('LABORATORIJSKI', 'AUDITORNI', 'AMFITEATAR');--> statement-breakpoint
CREATE TYPE "public"."day_of_week" AS ENUM('PONEDELJAK', 'UTORAK', 'SREDA', 'CETVRTAK', 'PETAK', 'SUBOTA', 'NEDELJA');--> statement-breakpoint
CREATE TYPE "public"."holiday_type" AS ENUM('KOLOKVIJUMSKA_NEDELJA', 'ISPITNI_ROK', 'BEZ_AKTIVNOSTI', 'NERADNI_DAN');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'STUDENT');--> statement-breakpoint
CREATE TYPE "public"."session_type" AS ENUM('PREDAVANJE', 'VEZBE');--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"term_id" integer NOT NULL,
	"status" "attendance_status" DEFAULT 'PRESENT' NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cabinets" (
	"id" integer PRIMARY KEY NOT NULL,
	"number" varchar(20) NOT NULL,
	"capacity" integer NOT NULL,
	"type" "cabinet_type" NOT NULL,
	CONSTRAINT "cabinets_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "holiday_calendar" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"academic_year" varchar(9) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "holidays" (
	"id" integer PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"type" "holiday_type" NOT NULL,
	"calendar_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_groups" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"study_program" text NOT NULL,
	"year_of_study" integer NOT NULL,
	"prezime_od" varchar(1) NOT NULL,
	"prezime_do" varchar(1) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"index_number" varchar(15) NOT NULL,
	"study_program" text NOT NULL,
	"year_of_study" integer NOT NULL,
	"picture_url" text,
	"group_id" integer,
	CONSTRAINT "students_index_number_unique" UNIQUE("index_number")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"espb" integer NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" integer PRIMARY KEY NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"type" "session_type" NOT NULL,
	"subject_id" integer NOT NULL,
	"cabinet_id" integer NOT NULL,
	"group_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'STUDENT' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_calendar_id_holiday_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."holiday_calendar"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_group_id_student_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."student_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_cabinet_id_cabinets_id_fk" FOREIGN KEY ("cabinet_id") REFERENCES "public"."cabinets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_group_id_student_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."student_groups"("id") ON DELETE no action ON UPDATE no action;