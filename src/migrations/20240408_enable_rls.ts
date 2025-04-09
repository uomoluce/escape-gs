import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  try {
    // First, get a list of all tables that actually exist
    const tablesResult = await payload.db.pool.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `)

    const existingTables = tablesResult.rows.map((row) => row.tablename)
    console.log('Existing tables:', existingTables)

    // Build a dynamic query to only operate on tables that exist
    let enableRlsQuery = ''
    let publicPoliciesQuery = ''

    // Content block tables - only add if they exist
    const contentBlockTables = [
      'pages_blocks_cta',
      'pages_blocks_cta_links',
      'pages_blocks_content',
      'pages_blocks_content_columns',
      'pages_blocks_media_block',
      'pages_blocks_archive',
      'forms',
    ]

    // Public content tables - only add if they exist
    const publicContentTables = [
      'media',
      'categories',
      'pages',
      'posts',
      'curatorship',
      'discography',
      'mixes',
      'sound_design',
      'events',
    ]

    // Admin tables - enable RLS but no public policies - only add if they exist
    const adminTables = [
      'payload_migrations',
      'payload_preferences',
      'payload_users',
      'users',
      'api_keys',
    ]

    // Add enable RLS commands for tables that exist
    for (const table of [...contentBlockTables, ...publicContentTables, ...adminTables]) {
      if (existingTables.includes(table)) {
        enableRlsQuery += `ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY;\n`
      }
    }

    // Add policies for public tables that exist
    for (const table of [...contentBlockTables, ...publicContentTables]) {
      if (existingTables.includes(table)) {
        publicPoliciesQuery += `
          CREATE POLICY "Enable read access for all users" ON "public"."${table}"
            FOR SELECT USING (true);
        `
      }
    }

    // Execute the dynamic queries
    if (enableRlsQuery) {
      console.log('Enabling RLS on tables that exist...')
      await payload.db.pool.query(enableRlsQuery)
    }

    if (publicPoliciesQuery) {
      console.log('Creating public read policies for content tables...')
      await payload.db.pool.query(publicPoliciesQuery)
    }

    console.log('Successfully enabled RLS and created appropriate security policies')
  } catch (error) {
    console.error('Error enabling RLS:', error)
    throw error
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  try {
    // First, get a list of all tables that actually exist
    const tablesResult = await payload.db.pool.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `)

    const existingTables = tablesResult.rows.map((row) => row.tablename)
    console.log('Existing tables for down migration:', existingTables)

    // Build a dynamic query to only operate on tables that exist
    let dropPoliciesQuery = ''
    let disableRlsQuery = ''

    // All tables that might have policies
    const allTables = [
      'pages_blocks_cta',
      'pages_blocks_cta_links',
      'pages_blocks_content',
      'pages_blocks_content_columns',
      'pages_blocks_media_block',
      'pages_blocks_archive',
      'forms',
      'media',
      'categories',
      'pages',
      'posts',
      'curatorship',
      'discography',
      'mixes',
      'sound_design',
      'events',
      'payload_migrations',
      'payload_preferences',
      'payload_users',
      'users',
      'api_keys',
    ]

    // Drop policies for tables that exist
    for (const table of allTables) {
      if (existingTables.includes(table)) {
        dropPoliciesQuery += `DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."${table}";\n`
        disableRlsQuery += `ALTER TABLE "public"."${table}" DISABLE ROW LEVEL SECURITY;\n`
      }
    }

    // Execute the dynamic queries
    if (dropPoliciesQuery) {
      console.log('Dropping policies...')
      await payload.db.pool.query(dropPoliciesQuery)
    }

    if (disableRlsQuery) {
      console.log('Disabling RLS...')
      await payload.db.pool.query(disableRlsQuery)
    }

    console.log('Successfully disabled RLS and dropped policies')
  } catch (error) {
    console.error('Error disabling RLS:', error)
    throw error
  }
}
