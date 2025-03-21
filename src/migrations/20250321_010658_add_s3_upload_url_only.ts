import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.pool.query(`
    ALTER TABLE "media"
    ADD COLUMN IF NOT EXISTS "s3_upload_url" TEXT;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.pool.query(`
    ALTER TABLE "media"
    DROP COLUMN IF EXISTS "s3_upload_url";
  `)
}
