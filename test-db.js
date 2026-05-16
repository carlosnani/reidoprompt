const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('ai_models')
    .insert({ name: 'Test Model', slug: 'test-model', provider: 'Test Provider' })
    .select();
  
  console.log('Result:', { data, error });
}
test();
