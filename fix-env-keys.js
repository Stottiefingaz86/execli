// Fix environment keys for Supabase
// This will help you get the correct API keys

console.log('🔧 Supabase API Key Fix');
console.log('');
console.log('To fix the API key issue, you need to:');
console.log('');
console.log('1. Go to your Supabase dashboard:');
console.log('   https://supabase.com/dashboard/project/efiioacrgwuewmroztth');
console.log('');
console.log('2. Go to Settings → API');
console.log('');
console.log('3. Copy these values:');
console.log('   - Project URL (should be: https://efiioacrgwuewmroztth.supabase.co)');
console.log('   - anon public key (starts with eyJ...)');
console.log('   - service_role key (starts with eyJ...)');
console.log('');
console.log('4. Update your .env.local file with the correct keys');
console.log('');
console.log('5. Restart your development server:');
console.log('   npm run dev');
console.log('');
console.log('Once you have the correct keys, new reports will work properly!');
console.log('');
console.log('The current .env.local has placeholder values:');
console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here');
console.log('OPENAI_API_KEY=your_openai_api_key_here');
console.log('');
console.log('Replace these with your actual API keys.'); 