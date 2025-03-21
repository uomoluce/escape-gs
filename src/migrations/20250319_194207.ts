import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add video_embed column to discography table
    ALTER TABLE "discography" 
    ADD COLUMN IF NOT EXISTS "video_embed" TEXT;

    -- Add video_embed column to mixes table
    ALTER TABLE "mixes" 
    ADD COLUMN IF NOT EXISTS "video_embed" TEXT;

    -- Add video_embed column to events table
    ALTER TABLE "events" 
    ADD COLUMN IF NOT EXISTS "video_embed" TEXT;

    -- Add video_embed column to sound_design table
    ALTER TABLE "sound_design" 
    ADD COLUMN IF NOT EXISTS "video_embed" TEXT;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Remove video_embed column from discography table
    ALTER TABLE "discography" 
    DROP COLUMN IF EXISTS "video_embed";

    -- Remove video_embed column from mixes table
    ALTER TABLE "mixes" 
    DROP COLUMN IF EXISTS "video_embed";

    -- Remove video_embed column from events table
    ALTER TABLE "events" 
    DROP COLUMN IF EXISTS "video_embed";

    -- Remove video_embed column from sound_design table
    ALTER TABLE "sound_design" 
    DROP COLUMN IF EXISTS "video_embed";
  `)
}
