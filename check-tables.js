require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ektalbtnirqlttfkxdhe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGFsYnRuaXJxbHR0Zmt4ZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Nzg0MDMsImV4cCI6MjA1ODE1NDQwM30.rAnmyyn7W9VHmb8f0LOEQ6LesoqpaFZjT034IyHkBes'
);

async function listTables() {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) throw error;

    console.log('📋 Existing tables:', data.map(t => t.table_name));
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

listTables(); 