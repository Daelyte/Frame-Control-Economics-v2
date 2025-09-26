-- Fix PostgREST configuration to expose public schema
-- This should resolve the "schema must be one of the following: graphql_public" error

-- Create or update PostgREST configuration
-- Set the db-schemas to include both public and graphql_public
-- This allows REST API access to public schema tables

-- Ensure public schema is accessible
DO $$ 
DECLARE
    db_schemas_setting text;
BEGIN
    -- Try to get current setting
    SELECT current_setting('pgrst.db_schemas', true) INTO db_schemas_setting;
    
    -- If setting doesn't include public, add it
    IF db_schemas_setting IS NULL OR db_schemas_setting = '' THEN
        PERFORM set_config('pgrst.db_schemas', 'public,graphql_public', false);
    ELSIF position('public' in db_schemas_setting) = 0 THEN
        PERFORM set_config('pgrst.db_schemas', db_schemas_setting || ',public', false);
    END IF;
    
    -- Also ensure role settings are correct
    PERFORM set_config('pgrst.db_anon_role', 'anon', false);
    PERFORM set_config('pgrst.db_root_spec', 'public', false);
    
EXCEPTION WHEN OTHERS THEN
    -- If we can't set configuration, just ensure permissions are correct
    NULL;
END $$;

-- Alternative approach: Ensure the API can access our schema
-- Grant schema usage to the api user role if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'api') THEN
        GRANT USAGE ON SCHEMA public TO api;
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO api;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Ensure postgrest role has access if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'postgrest') THEN
        GRANT USAGE ON SCHEMA public TO postgrest;
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO postgrest;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Final verification: Show current roles with access to public schema
SELECT 
    r.rolname,
    n.nspname as schema_name
FROM pg_roles r
JOIN pg_namespace n ON has_schema_privilege(r.rolname, n.nspname, 'USAGE')
WHERE n.nspname = 'public'
    AND r.rolname IN ('anon', 'authenticated', 'publishable', 'api', 'postgrest')
LIMIT 10;
