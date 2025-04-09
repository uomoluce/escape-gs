import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  try {
    // Get ALL tables in the public schema
    const tablesResult = await payload.db.pool.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `)

    const allTables = tablesResult.rows.map((row) => row.tablename)
    console.log(`Found ${allTables.length} tables in public schema`)

    // Define admin/system tables that should NOT have public read access
    const adminTables = [
      'users', // User accounts
      'payload_users', // PayloadCMS admin accounts
      'payload_preferences', // Admin preferences
      'payload_preferences_rels', // Admin preferences relationships
      'payload_migrations', // Database migrations
      'api_keys', // API keys
      'payload_jobs', // Background jobs
      'payload_jobs_log', // Job logs
      'payload_locked_documents', // Locked documents
      'payload_locked_documents_rels', // Document locking relationships
    ]

    // Determine if a table is admin-only or public content
    const isAdminTable = (tableName: string) => {
      if (adminTables.includes(tableName)) return true
      // Check for patterns that indicate admin tables
      if (tableName.startsWith('payload_')) return true
      return false
    }

    // Process tables in smaller batches to avoid query size limits
    const batchSize = 10
    for (let i = 0; i < allTables.length; i += batchSize) {
      const batch = allTables.slice(i, i + batchSize)
      console.log(`Processing batch ${i / batchSize + 1} with ${batch.length} tables`)

      // Build query for this batch
      let batchQuery = ''

      for (const table of batch) {
        // Check if RLS is already enabled (to avoid errors on tables that might already have RLS)
        const rlsCheckResult = await payload.db.pool.query(`
          SELECT relrowsecurity 
          FROM pg_class 
          WHERE relname = '${table}' 
          AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        `)

        const isRLSEnabled = rlsCheckResult.rows.length > 0 && rlsCheckResult.rows[0].relrowsecurity

        if (!isRLSEnabled) {
          batchQuery += `
            ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY;
          `
        }

        // Only create read policies for public content tables (not admin tables)
        if (!isAdminTable(table)) {
          // Check if policy already exists (to avoid errors for duplicate policies)
          const policyCheckResult = await payload.db.pool.query(`
            SELECT polname 
            FROM pg_policy 
            WHERE polrelid = (SELECT oid FROM pg_class WHERE relname = '${table}' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
            AND polname = 'Enable read access for all users'
          `)

          const policyExists = policyCheckResult.rows.length > 0

          if (!policyExists) {
            batchQuery += `
              CREATE POLICY "Enable read access for all users" ON "public"."${table}"
                FOR SELECT USING (true);
            `
          }
        } else {
          console.log(`Skipping public read policy for admin table: ${table}`)
        }
      }

      // Execute batch query if it's not empty
      if (batchQuery.trim()) {
        await payload.db.pool.query(batchQuery)
      }
    }

    console.log(
      'Successfully enabled RLS with proper security separation between public and admin tables',
    )
  } catch (error) {
    console.error('Error enabling RLS:', error)
    throw error
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  try {
    // Get ALL tables in the public schema
    const tablesResult = await payload.db.pool.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `)

    const allTables = tablesResult.rows.map((row) => row.tablename)
    console.log(`Found ${allTables.length} tables to disable RLS`)

    // Process tables in smaller batches
    const batchSize = 10
    for (let i = 0; i < allTables.length; i += batchSize) {
      const batch = allTables.slice(i, i + batchSize)
      console.log(
        `Processing batch ${i / batchSize + 1} with ${batch.length} tables for down migration`,
      )

      // Build query for this batch
      let batchQuery = ''

      for (const table of batch) {
        batchQuery += `
          DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."${table}";
          ALTER TABLE "public"."${table}" DISABLE ROW LEVEL SECURITY;
        `
      }

      // Execute batch query
      await payload.db.pool.query(batchQuery)
    }

    console.log('Successfully disabled RLS on all tables')
  } catch (error) {
    console.error('Error disabling RLS:', error)
    throw error
  }
}
