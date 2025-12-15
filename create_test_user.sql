-- Quick Test User Creation Script
-- Follow these steps:

-- 1. FIRST: Create the auth user manually:
--    Go to: Authentication > Users > Add User
--    Email: testuser@example.com
--    Password: testpassword123
--    Copy the User ID (UUID) - it looks like: 123e4567-e89b-12d3-a456-426614174000

-- 2. Replace 'REPLACE_WITH_TEST_USER_UUID' below with the UUID from step 1

-- 3. Replace 'REPLACE_WITH_YOUR_USER_UUID' with your own user UUID
--    (You can find it in Authentication > Users, or run: SELECT id FROM auth.users WHERE email = 'your-email@example.com')

-- 4. Run this entire script in SQL Editor

BEGIN;

-- Replace these UUIDs with actual values
DO $$
DECLARE
  test_user_uuid UUID := 'REPLACE_WITH_TEST_USER_UUID'::UUID;
  your_user_uuid UUID := 'REPLACE_WITH_YOUR_USER_UUID'::UUID;
BEGIN
  -- Create test user profile
  INSERT INTO profiles (
    id, email, full_name, verification_status, bio, experience_level, tech_stack
  ) VALUES (
    test_user_uuid,
    'testuser@example.com',
    'Alex Test User',
    'verified',
    'Hi! I am a test user created for practicing interview skills. Feel free to chat with me!',
    'mid',
    ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python']
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    bio = EXCLUDED.bio;

  -- Create test user preferences
  INSERT INTO user_preferences (
    user_id, preferred_experience_levels, preferred_topics, preferred_duration, availability_status
  ) VALUES (
    test_user_uuid,
    ARRAY['junior', 'mid', 'senior'],
    ARRAY['technical', 'behavioral', 'system_design', 'coding'],
    10,
    'online'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    availability_status = 'online';

  -- Create a test conversation
  INSERT INTO conversations (
    user1_id, user2_id, type, status, started_at
  ) VALUES (
    your_user_uuid,
    test_user_uuid,
    'text',
    'active',
    NOW()
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Test user created successfully!';
  RAISE NOTICE '✅ Test conversation created!';
END $$;

COMMIT;

