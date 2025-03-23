import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.pool.query(`
    ALTER TABLE discography ADD COLUMN IF NOT EXISTS "audio_url" TEXT;
    ALTER TABLE mixes ADD COLUMN IF NOT EXISTS "audio_url" TEXT;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS "audio_url" TEXT;
    ALTER TABLE sound_design ADD COLUMN IF NOT EXISTS "audio_url" TEXT;
    ALTER TABLE curatorship ADD COLUMN IF NOT EXISTS "audio_url" TEXT;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.pool.query(`
    ALTER TABLE discography DROP COLUMN IF EXISTS "audio_url";
    ALTER TABLE mixes DROP COLUMN IF EXISTS "audio_url";
    ALTER TABLE events DROP COLUMN IF EXISTS "audio_url";
    ALTER TABLE sound_design DROP COLUMN IF EXISTS "audio_url";
    ALTER TABLE curatorship DROP COLUMN IF EXISTS "audio_url";
  `)
}
