-- Debug and Fix Queue Issues
-- Run this in Supabase SQL Editor

-- Step 1: Check all users and their availability status
SELECT 
  u.id as user_id,
  u.email,
  p.full_name,
  up.availability_status,
  up.preferred_experience_levels,
  up.preferred_topics
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN user_preferences up ON up.user_id = u.id
ORDER BY u.created_at DESC;

-- Step 2: Check how many users are online
SELECT 
  COUNT(*) as online_users,
  array_agg(user_id) as online_user_ids
FROM user_preferences
WHERE availability_status = 'online';

-- Step 3: If test user exists, set them to online
-- Replace 'TEST_USER_UUID' with your test user's UUID
UPDATE user_preferences
SET availability_status = 'online'
WHERE user_id = 'TEST_USER_UUID'::UUID;

-- Step 4: If test user doesn't have preferences, create them
-- Replace 'TEST_USER_UUID' with your test user's UUID
INSERT INTO user_preferences (
  user_id,
  preferred_experience_levels,
  preferred_topics,
  preferred_duration,
  availability_status
)
SELECT 
  'TEST_USER_UUID'::UUID,
  ARRAY['junior', 'mid', 'senior'],
  ARRAY['technical', 'behavioral', 'system_design'],
  10,
  'online'
WHERE NOT EXISTS (
  SELECT 1 FROM user_preferences WHERE user_id = 'TEST_USER_UUID'::UUID
);

-- Step 5: Set ALL users to online (for testing)
-- WARNING: Only use this for testing!
UPDATE user_preferences
SET availability_status = 'online'
WHERE user_id IN (
  SELECT id FROM auth.users
);

-- Step 6: Verify the fix
SELECT 
  u.email,
  up.availability_status,
  CASE 
    WHEN up.availability_status = 'online' THEN '✅ Available'
    WHEN up.availability_status = 'offline' THEN '❌ Offline'
    WHEN up.availability_status = 'away' THEN '⏸️ Away'
    ELSE '❓ Unknown'
  END as status_display
FROM auth.users u
LEFT JOIN user_preferences up ON up.user_id = u.id
ORDER BY u.created_at DESC;

