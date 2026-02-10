// Script to create parent account and link to student
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createParentAccount() {
  const parentEmail = 'parent@ehs.edu.pk';
  const parentPassword = 'parent123'; // Change this to the password you want
  
  console.log(`\nCreating parent account for: ${parentEmail}\n`);
  
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: parentEmail,
    password: parentPassword,
    email_confirm: true,
  });

  if (authError) {
    console.log('Auth creation error:', authError.message);
    return;
  }
  
  console.log('Auth user created:', authData.user.id);
  
  // 2. Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: parentEmail,
      name: 'Parent User',
      role: 'parent',
      is_active: true,
    });

  if (profileError) {
    console.log('Profile creation error:', profileError.message);
    // Clean up auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    return;
  }
  
  console.log('Profile created successfully!');
  
  // 3. Find the student (Arham Ali) and link
  const { data: student } = await supabase
    .from('students')
    .select('id, name')
    .eq('name', 'Arham Ali')
    .single();
  
  if (student) {
    const { error: linkError } = await supabase
      .from('parent_students')
      .insert({
        parent_id: authData.user.id,
        student_id: student.id,
        relationship: 'parent',
        is_primary: true,
      });
    
    if (linkError) {
      console.log('Link error:', linkError.message);
    } else {
      console.log(`Linked to student: ${student.name}`);
    }
  } else {
    console.log('Student not found - you can link manually later');
  }
  
  console.log('\n✅ Parent account created successfully!');
  console.log(`   Email: ${parentEmail}`);
  console.log(`   Password: ${parentPassword}`);
  console.log('\nYou can now login with these credentials.');
}

createParentAccount().catch(console.error);

export default createParentAccount;
