import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.pool.query(`
    ALTER TABLE discography DROP COLUMN IF EXISTS audio_id;
    ALTER TABLE mixes DROP COLUMN IF EXISTS audio_id;
    ALTER TABLE events DROP COLUMN IF EXISTS audio_id;
    ALTER TABLE sound_design DROP COLUMN IF EXISTS audio_id;
    ALTER TABLE curatorship DROP COLUMN IF EXISTS audio_id;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.pool.query(`
    ALTER TABLE discography ADD COLUMN IF NOT EXISTS audio_id INTEGER;
    ALTER TABLE mixes ADD COLUMN IF NOT EXISTS audio_id INTEGER;
    ALTER TABLE events ADD COLUMN IF NOT EXISTS audio_id INTEGER;
    ALTER TABLE sound_design ADD COLUMN IF NOT EXISTS audio_id INTEGER;
    ALTER TABLE curatorship ADD COLUMN IF NOT EXISTS audio_id INTEGER;
  `)
}
