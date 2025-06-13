import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  try {
    // Check if the columns already exist to avoid errors
    const checkResult = await payload.db.pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'header' 
      AND column_name IN ('email', 'instagram')
      AND table_schema = 'public';
    `)

    const existingColumns = checkResult.rows.map((row) => row.column_name)

    // Add email column if it doesn't exist
    if (!existingColumns.includes('email')) {
      await payload.db.pool.query(`
        ALTER TABLE "public"."header"
        ADD COLUMN "email" TEXT;
      `)
      console.log('Successfully added email column to header table')
    } else {
      console.log('Email column already exists in header table')
    }

    // Add instagram column if it doesn't exist
    if (!existingColumns.includes('instagram')) {
      await payload.db.pool.query(`
        ALTER TABLE "public"."header"
        ADD COLUMN "instagram" TEXT;
      `)
      console.log('Successfully added instagram column to header table')
    } else {
      console.log('Instagram column already exists in header table')
    }
  } catch (error) {
    console.error('Error adding columns to header table:', error)
    throw error
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  try {
    // Check if the columns exist before attempting to drop them
    const checkResult = await payload.db.pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'header' 
      AND column_name IN ('email', 'instagram')
      AND table_schema = 'public';
    `)

    const existingColumns = checkResult.rows.map((row) => row.column_name)

    // Drop email column if it exists
    if (existingColumns.includes('email')) {
      await payload.db.pool.query(`
        ALTER TABLE "public"."header"
        DROP COLUMN "email";
      `)
      console.log('Successfully dropped email column from header table')
    } else {
      console.log('Email column does not exist in header table')
    }

    // Drop instagram column if it exists
    if (existingColumns.includes('instagram')) {
      await payload.db.pool.query(`
        ALTER TABLE "public"."header"
        DROP COLUMN "instagram";
      `)
      console.log('Successfully dropped instagram column from header table')
    } else {
      console.log('Instagram column does not exist in header table')
    }
  } catch (error) {
    console.error('Error dropping columns from header table:', error)
    throw error
  }
}
