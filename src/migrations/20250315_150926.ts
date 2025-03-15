import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "mixes" RENAME COLUMN "media_id" TO "audio_id";
  ALTER TABLE "events" RENAME COLUMN "media_id" TO "audio_id";
  ALTER TABLE "sound_design" RENAME COLUMN "media_id" TO "audio_id";
  ALTER TABLE "mixes" DROP CONSTRAINT "mixes_media_id_media_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_media_id_media_id_fk";
  
  ALTER TABLE "sound_design" DROP CONSTRAINT "sound_design_media_id_media_id_fk";
  
  DROP INDEX IF EXISTS "mixes_media_idx";
  DROP INDEX IF EXISTS "events_media_idx";
  DROP INDEX IF EXISTS "sound_design_media_idx";
  ALTER TABLE "discography" ADD COLUMN "audio_id" integer;
  ALTER TABLE "events" ADD COLUMN "image_id" integer;
  ALTER TABLE "curatorship" ADD COLUMN "audio_id" integer;
  DO $$ BEGIN
   ALTER TABLE "discography" ADD CONSTRAINT "discography_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "mixes" ADD CONSTRAINT "mixes_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "curatorship" ADD CONSTRAINT "curatorship_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sound_design" ADD CONSTRAINT "sound_design_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "discography_audio_idx" ON "discography" USING btree ("audio_id");
  CREATE INDEX IF NOT EXISTS "mixes_audio_idx" ON "mixes" USING btree ("audio_id");
  CREATE INDEX IF NOT EXISTS "events_audio_idx" ON "events" USING btree ("audio_id");
  CREATE INDEX IF NOT EXISTS "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "curatorship_audio_idx" ON "curatorship" USING btree ("audio_id");
  CREATE INDEX IF NOT EXISTS "sound_design_audio_idx" ON "sound_design" USING btree ("audio_id");
  ALTER TABLE "mixes" DROP COLUMN IF EXISTS "duration";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "discography" DROP CONSTRAINT "discography_audio_id_media_id_fk";
  
  ALTER TABLE "mixes" DROP CONSTRAINT "mixes_audio_id_media_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_audio_id_media_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_image_id_media_id_fk";
  
  ALTER TABLE "curatorship" DROP CONSTRAINT "curatorship_audio_id_media_id_fk";
  
  ALTER TABLE "sound_design" DROP CONSTRAINT "sound_design_audio_id_media_id_fk";
  
  DROP INDEX IF EXISTS "discography_audio_idx";
  DROP INDEX IF EXISTS "mixes_audio_idx";
  DROP INDEX IF EXISTS "events_audio_idx";
  DROP INDEX IF EXISTS "events_image_idx";
  DROP INDEX IF EXISTS "curatorship_audio_idx";
  DROP INDEX IF EXISTS "sound_design_audio_idx";
  ALTER TABLE "mixes" ADD COLUMN "media_id" integer;
  ALTER TABLE "mixes" ADD COLUMN "duration" varchar;
  ALTER TABLE "events" ADD COLUMN "media_id" integer;
  ALTER TABLE "sound_design" ADD COLUMN "media_id" integer;
  DO $$ BEGIN
   ALTER TABLE "mixes" ADD CONSTRAINT "mixes_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sound_design" ADD CONSTRAINT "sound_design_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "mixes_media_idx" ON "mixes" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "events_media_idx" ON "events" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "sound_design_media_idx" ON "sound_design" USING btree ("media_id");
  ALTER TABLE "discography" DROP COLUMN IF EXISTS "audio_id";
  ALTER TABLE "mixes" DROP COLUMN IF EXISTS "audio_id";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "audio_id";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "image_id";
  ALTER TABLE "curatorship" DROP COLUMN IF EXISTS "audio_id";
  ALTER TABLE "sound_design" DROP COLUMN IF EXISTS "audio_id";`)
}
