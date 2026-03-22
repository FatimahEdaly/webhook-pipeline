ALTER TABLE "subscribers" RENAME COLUMN "pipelineId" TO "pipeline_id";--> statement-breakpoint
ALTER TABLE "subscribers" DROP CONSTRAINT "subscribers_pipelineId_pipelines_id_fk";
--> statement-breakpoint
ALTER TABLE "pipelines" ALTER COLUMN "source" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pipelines" ALTER COLUMN "action" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pipelines" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_pipeline_id_pipelines_id_fk" FOREIGN KEY ("pipeline_id") REFERENCES "public"."pipelines"("id") ON DELETE cascade ON UPDATE no action;