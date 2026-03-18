CREATE TABLE "pipelines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" varchar(256) NOT NULL,
	"action" varchar(256),
	CONSTRAINT "pipelines_source_unique" UNIQUE("source")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pipelineId" uuid NOT NULL,
	"subscriber_url" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_pipelineId_pipelines_id_fk" FOREIGN KEY ("pipelineId") REFERENCES "public"."pipelines"("id") ON DELETE cascade ON UPDATE no action;