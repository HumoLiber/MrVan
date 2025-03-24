require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ektalbtnirqlttfkxdhe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGFsYnRuaXJxbHR0Zmt4ZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Nzg0MDMsImV4cCI6MjA1ODE1NDQwM30.rAnmyyn7W9VHmb8f0LOEQ6LesoqpaFZjT034IyHkBes'
);

async function checkNewData() {
  try {
    // Перевіряємо користувачів
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) throw usersError;
    console.log('\n👥 Users:', users.length);
    users.forEach(u => console.log(`- ${u.name} (${u.role})`));

    // Перевіряємо документи
    const { data: documents, error: documentsError } = await supabase
      .from('user_documents')
      .select(`
        *,
        users (name)
      `);

    if (documentsError) throw documentsError;
    console.log('\n📄 User Documents:', documents.length);
    documents.forEach(d => console.log(`- ${d.doc_type} for ${d.users.name} (${d.status})`));

    // Перевіряємо транспортні засоби
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select(`
        *,
        users:owner_id (name)
      `);

    if (vehiclesError) throw vehiclesError;
    console.log('\n🚗 Vehicles:', vehicles.length);
    vehicles.forEach(v => console.log(`- ${v.make} ${v.model} (${v.year}) owner: ${v.users.name}, status: ${v.status}`));

    // Перевіряємо угоди
    const { data: agreements, error: agreementsError } = await supabase
      .from('agreements')
      .select(`
        *,
        users (name)
      `);

    if (agreementsError) throw agreementsError;
    console.log('\n📝 Agreements:', agreements.length);
    agreements.forEach(a => console.log(`- ${a.agreement_type} with ${a.users.name} (${a.signature_status})`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkNewData(); 