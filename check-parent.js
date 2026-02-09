// Quick script to check parent account
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkParentAccount() {
  const email = 'parent@ehs.edu.pk';
  
  console.log(`\nChecking account for: ${email}\n`);
  
  // Check profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  console.log('Profile in database:', profile || 'NOT FOUND');
  if (profileError) console.log('Profile error:', profileError.message);
  
  // Check auth users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.log('Auth error:', authError.message);
  } else {
    const authUser = authData.users.find(u => u.email === email);
    console.log('\nAuth user:', authUser ? {
      id: authUser.id,
      email: authUser.email,
      emailConfirmed: !!authUser.email_confirmed_at,
      createdAt: authUser.created_at
    } : 'NOT FOUND');
  }

  // Check parent_students links
  if (profile?.id) {
    const { data: links } = await supabase
      .from('parent_students')
      .select('*, students(*)')
      .eq('parent_id', profile.id);
    console.log('\nLinked students:', links || 'None');
  }
}

checkParentAccount().catch(console.error);
