-- Create test user data
-- Note: You'll need to create the auth user first, then update the UUID below

-- Step 1: Create a test user in Supabase Auth (do this manually):
-- Go to Authentication > Users > Add User
-- Email: testuser@example.com
-- Password: testpassword123
-- Copy the User ID (UUID) that gets created

-- Step 2: Replace 'YOUR_TEST_USER_UUID_HERE' below with the actual UUID from Step 1
-- Then run this SQL script

-- For now, we'll create a placeholder that you can update
DO $$
DECLARE
  test_user_id UUID;
  current_user_id UUID;
BEGIN
  -- Get the current logged-in user (you'll need to replace this with your actual user ID)
  -- Or we can find it from auth.users
  SELECT id INTO current_user_id FROM auth.users LIMIT 1;
  
  -- Check if test user already exists
  SELECT id INTO test_user_id 
  FROM auth.users 
  WHERE email = 'testuser@example.com';
  
  -- If test user doesn't exist, you need to create it in Auth first
  IF test_user_id IS NULL THEN
    RAISE NOTICE 'Please create a test user in Authentication > Users first with email: testuser@example.com';
    RAISE NOTICE 'Then update this script with the test user UUID';
    RETURN;
  END IF;
  
  -- Create profile for test user if it doesn't exist
  INSERT INTO profiles (
    id,
    email,
    full_name,
    verification_status,
    bio,
    experience_level,
    tech_stack
  ) VALUES (
    test_user_id,
    'testuser@example.com',
    'Test User',
    'verified',
    'I am a test user for practicing interview skills!',
    'mid',
    ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript']
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    bio = EXCLUDED.bio,
    experience_level = EXCLUDED.experience_level,
    tech_stack = EXCLUDED.tech_stack;
  
  -- Create user preferences for test user
  INSERT INTO user_preferences (
    user_id,
    preferred_experience_levels,
    preferred_topics,
    preferred_duration,
    availability_status
  ) VALUES (
    test_user_id,
    ARRAY['junior', 'mid', 'senior'],
    ARRAY['technical', 'behavioral', 'system_design'],
    10,
    'online'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    availability_status = 'online';
  
  -- Create a test conversation between current user and test user
  IF current_user_id IS NOT NULL AND current_user_id != test_user_id THEN
    INSERT INTO conversations (
      user1_id,
      user2_id,
      type,
      status,
      started_at
    ) VALUES (
      current_user_id,
      test_user_id,
      'text',
      'active',
      NOW()
    )
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Test user created successfully!';
    RAISE NOTICE 'Test conversation created between you and test user';
  ELSE
    RAISE NOTICE 'Could not find current user. Test user profile created, but no conversation was created.';
  END IF;
END $$;

