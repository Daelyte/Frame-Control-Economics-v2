-- Enable REST API access to existing tables
-- This fixes the "schema must be one of the following: graphql_public" error

-- Grant necessary permissions for REST API access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- Grant to new API key roles if they exist
DO $$ 
BEGIN
    -- Grant to publishable role (new API key system)
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'publishable') THEN
        GRANT USAGE ON SCHEMA public TO publishable;
        GRANT SELECT ON ALL TABLES IN SCHEMA public TO publishable;
        GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO publishable;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO publishable;
    END IF;
    
    -- Grant to secret role (new API key system)
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'secret') THEN
        GRANT USAGE ON SCHEMA public TO secret;
        GRANT ALL ON ALL TABLES IN SCHEMA public TO secret;
        GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO secret;
        GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO secret;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO secret;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO secret;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO secret;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- New roles don't exist yet, continue
    NULL;
END $$;