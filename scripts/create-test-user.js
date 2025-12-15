// Script to create a test user for testing chat functionality
// Run with: node scripts/create-test-user.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Make sure .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestUser() {
  console.log('🚀 Creating test user...\n')

  try {
    // Step 1: Create auth user
    console.log('Step 1: Creating auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'testuser@example.com',
      password: 'testpassword123',
      email_confirm: true,
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Test user already exists, fetching existing user...')
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const testUser = existingUsers.users.find(u => u.email === 'testuser@example.com')
        if (!testUser) {
          console.error('❌ Could not find existing test user')
          process.exit(1)
        }
        await createUserData(testUser.id)
        return
      }
      throw authError
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user')
    }

    console.log('✅ Auth user created:', authData.user.id)
    await createUserData(authData.user.id)

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n📝 Manual setup required:')
    console.log('1. Go to Supabase Dashboard > Authentication > Users')
    console.log('2. Create user: testuser@example.com / testpassword123')
    console.log('3. Run quick_test_setup.sql in SQL Editor')
    process.exit(1)
  }
}

async function createUserData(userId) {
  console.log('\nStep 2: Creating profile...')
  
  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: 'testuser@example.com',
      full_name: 'Alex Test User',
      verification_status: 'verified',
      bio: 'Hi! I am a test user created for practicing interview skills. Feel free to chat with me!',
      experience_level: 'mid',
      tech_stack: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
    })

  if (profileError) {
    console.error('❌ Profile error:', profileError.message)
    throw profileError
  }
  console.log('✅ Profile created')

  // Create preferences
  console.log('\nStep 3: Creating preferences...')
  const { error: prefsError } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      preferred_experience_levels: ['junior', 'mid', 'senior'],
      preferred_topics: ['technical', 'behavioral', 'system_design', 'coding'],
      preferred_duration: 10,
      availability_status: 'online',
    })

  if (prefsError) {
    console.error('❌ Preferences error:', prefsError.message)
    throw prefsError
  }
  console.log('✅ Preferences created')

  // Get current user
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) {
    console.log('\n⚠️  Not logged in. Please log in first, then create a conversation manually.')
    return
  }

  // Create conversation
  console.log('\nStep 4: Creating test conversation...')
  const { data: convData, error: convError } = await supabase
    .from('conversations')
    .insert({
      user1_id: currentUser.id,
      user2_id: userId,
      type: 'text',
      status: 'active',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (convError) {
    console.error('❌ Conversation error:', convError.message)
    throw convError
  }
  console.log('✅ Conversation created:', convData.id)

  // Add test message
  console.log('\nStep 5: Adding test message...')
  const { error: msgError } = await supabase
    .from('messages')
    .insert({
      conversation_id: convData.id,
      sender_id: userId,
      content: 'Hello! This is a test message from Alex Test User. Feel free to reply!',
    })

  if (msgError) {
    console.error('⚠️  Message error (non-critical):', msgError.message)
  } else {
    console.log('✅ Test message added')
  }

  console.log('\n🎉 Test user setup complete!')
  console.log('\n📋 Test User Credentials:')
  console.log('   Email: testuser@example.com')
  console.log('   Password: testpassword123')
  console.log('\n💡 You can now:')
  console.log('   1. Open the conversation from your Dashboard')
  console.log('   2. Or sign in as test user in an incognito window')
  console.log('   3. Start chatting!')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUser()
}

