import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  try {
    // Enable RLS on all tables (required by Supabase)
    await payload.db.pool.query(`
      -- Enable RLS on all content block tables
      ALTER TABLE "public"."pages_blocks_cta" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_cta_links" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_content" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_content_columns" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_media_block" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_archive" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."forms" ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on public content collection tables
      ALTER TABLE "public"."media" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."curatorship" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."discography" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."mixes" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."sound_design" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on admin/protected tables (but don't add public access)
      ALTER TABLE "public"."payload_migrations" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."payload_preferences" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."payload_users" ENABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY; 
      ALTER TABLE "public"."api_keys" ENABLE ROW LEVEL SECURITY;

      -- Create policies for public content blocks (read-only)
      CREATE POLICY "Enable read access for all users" ON "public"."pages_blocks_cta"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."pages_blocks_cta_links"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."pages_blocks_content"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."pages_blocks_content_columns"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."pages_blocks_media_block"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."pages_blocks_archive"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."forms"
        FOR SELECT USING (true);
        
      -- Create policies for public content collections (read-only)
      CREATE POLICY "Enable read access for all users" ON "public"."media"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."categories"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."pages"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."posts"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."curatorship"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."discography"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."mixes"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."sound_design"
        FOR SELECT USING (true);

      CREATE POLICY "Enable read access for all users" ON "public"."events"
        FOR SELECT USING (true);
        
      -- Create admin-only policies for protected tables
      -- These require the service role or authenticated admin access
      -- No public read policies are created for these tables
    `)

    console.log('Successfully enabled RLS and created appropriate security policies')
  } catch (error) {
    console.error('Error enabling RLS:', error)
    throw error
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  try {
    // Disable RLS and drop policies
    await payload.db.pool.query(`
      -- Drop policies for content blocks
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."pages_blocks_cta";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."pages_blocks_cta_links";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."pages_blocks_content";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."pages_blocks_content_columns";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."pages_blocks_media_block";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."pages_blocks_archive";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."forms";
      
      -- Drop policies for public content collections
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."media";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."categories";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."pages";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."posts";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."curatorship";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."discography";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."mixes";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."sound_design";
      DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."events";

      -- Disable RLS on all tables
      -- Content blocks
      ALTER TABLE "public"."pages_blocks_cta" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_content" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_media_block" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages_blocks_archive" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."forms" DISABLE ROW LEVEL SECURITY;
      
      -- Public content collections
      ALTER TABLE "public"."media" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."categories" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."pages" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."posts" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."curatorship" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."discography" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."mixes" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."sound_design" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."events" DISABLE ROW LEVEL SECURITY;
      
      -- Admin/protected tables
      ALTER TABLE "public"."payload_migrations" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."payload_preferences" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."payload_users" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."users" DISABLE ROW LEVEL SECURITY;
      ALTER TABLE "public"."api_keys" DISABLE ROW LEVEL SECURITY;
    `)

    console.log('Successfully disabled RLS and dropped policies')
  } catch (error) {
    console.error('Error disabling RLS:', error)
    throw error
  }
}
