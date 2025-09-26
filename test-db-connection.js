import { Client } from 'pg';

const connectionString = 'postgresql://postgres:aV_^Ao8w4X=HC=rc1_7a+uv8@db.incldnepzwdrodznroat.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
});

async function testConnection() {
  try {
    console.log('Attempting to connect to PostgreSQL database...');
    await client.connect();
    console.log('✅ Successfully connected to the database!');
    
    // Test a simple query
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    // List all tables
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    console.log('\nTables in the database:');
    if (tables.rows.length === 0) {
      console.log('No tables found in the public schema.');
    } else {
      tables.rows.forEach(row => {
        console.log('- ' + row.tablename);
      });
    }
    
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
  } finally {
    await client.end();
    console.log('\nConnection closed.');
  }
}

testConnection();