import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  try {
    // Check if the column already exists to avoid errors
    const checkResult = await payload.db.pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'header' 
      AND column_name = 'description'
      AND table_schema = 'public';
    `)

    // Only add the column if it doesn't exist
    if (checkResult.rows.length === 0) {
      await payload.db.pool.query(`
        ALTER TABLE "public"."header"
        ADD COLUMN "description" TEXT;
      `)
      console.log('Successfully added description column to header table')
    } else {
      console.log('Description column already exists in header table')
    }
  } catch (error) {
    console.error('Error adding description column to header table:', error)
    throw error
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  try {
    // Check if the column exists before attempting to drop it
    const checkResult = await payload.db.pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'header' 
      AND column_name = 'description'
      AND table_schema = 'public';
    `)

    // Only drop the column if it exists
    if (checkResult.rows.length > 0) {
      await payload.db.pool.query(`
        ALTER TABLE "public"."header"
        DROP COLUMN "description";
      `)
      console.log('Successfully dropped description column from header table')
    } else {
      console.log('Description column does not exist in header table')
    }
  } catch (error) {
    console.error('Error dropping description column from header table:', error)
    throw error
  }
}
