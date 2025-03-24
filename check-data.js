require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ektalbtnirqlttfkxdhe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGFsYnRuaXJxbHR0Zmt4ZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Nzg0MDMsImV4cCI6MjA1ODE1NDQwM30.rAnmyyn7W9VHmb8f0LOEQ6LesoqpaFZjT034IyHkBes'
);

async function checkData() {
  try {
    // Перевіряємо партнерів
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('*');

    if (partnersError) throw partnersError;
    console.log('\n📋 Partners:', partners.length);
    partners.forEach(p => console.log(`- ${p.name}`));

    // Перевіряємо послуги
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select(`
        *,
        partners (name)
      `);

    if (servicesError) throw servicesError;
    console.log('\n🔧 Services:', services.length);
    services.forEach(s => console.log(`- ${s.name} (${s.partners.name})`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkData(); 