import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.pool.query(`
    ALTER TABLE events 
    ADD COLUMN IF NOT EXISTS "event_type" TEXT DEFAULT 'n_a';
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.pool.query(`
    ALTER TABLE events 
    DROP COLUMN IF EXISTS "event_type";
  `)
}
