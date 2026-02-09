// Run this AFTER running the SQL migration in Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function completeParentSetup() {
  console.log('Completing parent account setup...\n');
  
  // 1. Update role to parent
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role: 'parent' })
    .eq('email', 'parent@ehs.edu.pk');
  
  if (roleError) {
    console.log('Role update error:', roleError.message);
    console.log('\n⚠️ You may need to run this SQL first:');
    console.log("ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;");
    console.log("ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('super_admin', 'admin', 'accountant', 'teacher', 'operator', 'student', 'parent'));");
    return;
  }
  console.log('✅ Role updated to parent');
  
  // 2. Link to student
  const { data: student } = await supabase
    .from('students')
    .select('id, name')
    .ilike('name', '%Arham%')
    .single();
  
  if (!student) {
    console.log('Student not found');
    return;
  }
  
  const { error: linkError } = await supabase
    .from('parent_students')
    .upsert({
      parent_id: '343378f4-8978-4feb-b379-6854dad9ab3b',
      student_id: student.id,
      relationship: 'father',
      is_primary: true,
    });
  
  if (linkError) {
    console.log('Link error:', linkError.message);
  } else {
    console.log(`✅ Parent linked to student: ${student.name}`);
  }
  
  console.log('\n🎉 Parent setup complete!');
  console.log('   Email: parent@ehs.edu.pk');
  console.log('   Password: (the one you set when creating the student)');
}

completeParentSetup().catch(console.error);

export { completeParentSetup };
