// Script to fix the profiles table and create parent account
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixAndCreateParent() {
  console.log('Step 1: Fixing profiles role constraint...\n');
  
  // Run SQL to fix constraint
  const { error: sqlError } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
      ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
      CHECK (role IN ('super_admin', 'admin', 'accountant', 'teacher', 'operator', 'student', 'parent'));
    `
  });

  // If rpc doesn't exist, try direct approach
  if (sqlError) {
    console.log('RPC not available, trying direct SQL...');
    // We need to run this manually in Supabase
    console.log('\n⚠️  Please run this SQL in your Supabase SQL Editor:');
    console.log(`
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('super_admin', 'admin', 'accountant', 'teacher', 'operator', 'student', 'parent'));
    `);
    console.log('\nThen run this script again.\n');
    
    // Let's try to create with 'operator' role first, then update
    return tryAlternativeApproach();
  }
  
  console.log('Constraint fixed! Now creating parent...\n');
  await createParentAccount();
}

async function tryAlternativeApproach() {
  const parentEmail = 'parent@ehs.edu.pk';
  const parentPassword = 'parent123';
  
  // Check if auth user already exists
  const { data: authData } = await supabase.auth.admin.listUsers();
  const existingUser = authData?.users?.find(u => u.email === parentEmail);
  
  let userId;
  
  if (existingUser) {
    console.log('Auth user already exists:', existingUser.id);
    userId = existingUser.id;
  } else {
    // Create auth user
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email: parentEmail,
      password: parentPassword,
      email_confirm: true,
    });
    
    if (authError) {
      console.log('Auth error:', authError.message);
      return;
    }
    userId = newUser.user.id;
    console.log('Auth user created:', userId);
  }
  
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();
  
  if (existingProfile) {
    console.log('Profile already exists');
    return;
  }
  
  // Try creating profile with 'student' role (usually allowed), then we update via SQL
  console.log('\nTrying to create profile with operator role first...');
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: parentEmail,
      name: 'Parent User',
      role: 'operator', // Use operator first, update to parent via SQL
      is_active: true,
    });

  if (profileError) {
    console.log('Profile error:', profileError.message);
    console.log('\n❌ Could not create profile. Please run the SQL in Supabase first.');
    return;
  }
  
  console.log('Profile created with operator role.');
  console.log('\n⚠️  To complete, run this SQL in Supabase SQL Editor:');
  console.log(`
-- First fix the constraint:
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('super_admin', 'admin', 'accountant', 'teacher', 'operator', 'student', 'parent'));

-- Then update the parent role:
UPDATE profiles SET role = 'parent' WHERE email = 'parent@ehs.edu.pk';
  `);
  
  console.log('\n✅ Temporarily, you can login with:');
  console.log(`   Email: ${parentEmail}`);
  console.log(`   Password: ${parentPassword}`);
  console.log('   (Will show as operator until you run the SQL above)');
}

async function createParentAccount() {
  const parentEmail = 'parent@ehs.edu.pk';
  const parentPassword = 'parent123';
  
  // Create profile with parent role
  const { data: authData } = await supabase.auth.admin.listUsers();
  const existingUser = authData?.users?.find(u => u.email === parentEmail);
  
  if (existingUser) {
    // Update existing profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: existingUser.id,
        email: parentEmail,
        name: 'Parent User',
        role: 'parent',
        is_active: true,
      });
    
    if (error) {
      console.log('Update error:', error.message);
    } else {
      console.log('Profile updated to parent role!');
    }
  }
}

fixAndCreateParent().catch(console.error);
