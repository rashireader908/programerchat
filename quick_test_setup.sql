-- Quick Test User Setup
-- Run this AFTER creating the auth user in Authentication > Users

-- Step 1: Get your user IDs (run this first to see them)
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Step 2: Replace YOUR_USER_ID and TEST_USER_ID below, then run the rest

-- Create test user profile (replace TEST_USER_ID)
INSERT INTO profiles (
  id, email, full_name, verification_status, bio, experience_level, tech_stack
) VALUES (
  'TEST_USER_ID_HERE'::UUID,  -- Replace with test user UUID
  'testuser@example.com',
  'Alex Test User',
  'verified',
  'Hi! I am a test user. Feel free to chat with me!',
  'mid',
  ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript']
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio;

-- Create test user preferences
INSERT INTO user_preferences (
  user_id, preferred_experience_levels, preferred_topics, preferred_duration, availability_status
) VALUES (
  'TEST_USER_ID_HERE'::UUID,  -- Replace with test user UUID
  ARRAY['junior', 'mid', 'senior'],
  ARRAY['technical', 'behavioral', 'system_design'],
  10,
  'online'
)
ON CONFLICT (user_id) DO UPDATE SET
  availability_status = 'online';

-- Create test conversation (replace both UUIDs)
INSERT INTO conversations (
  user1_id, user2_id, type, status, started_at
) VALUES (
  'YOUR_USER_ID_HERE'::UUID,  -- Replace with your UUID
  'TEST_USER_ID_HERE'::UUID,  -- Replace with test user UUID
  'text',
  'active',
  NOW()
)
ON CONFLICT DO NOTHING
RETURNING id as conversation_id;

-- Add a test message (use the conversation_id from above)
-- INSERT INTO messages (conversation_id, sender_id, content) VALUES
-- ('CONVERSATION_ID_HERE', 'TEST_USER_ID_HERE', 'Hello! This is a test message.');
