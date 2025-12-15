# Fix "No Users Available" Issue

If you're seeing the "No users available" message, follow these steps:

## Quick Fix (Run in SQL Editor)

### Option 1: Set Test User to Online

```sql
-- First, find your test user's UUID
SELECT id, email FROM auth.users WHERE email = 'testuser@example.com';

-- Then set them to online (replace UUID)
UPDATE user_preferences
SET availability_status = 'online'
WHERE user_id = 'YOUR_TEST_USER_UUID_HERE'::UUID;

-- If they don't have preferences, create them:
INSERT INTO user_preferences (
  user_id, 
  preferred_experience_levels, 
  preferred_topics, 
  preferred_duration, 
  availability_status
) VALUES (
  'YOUR_TEST_USER_UUID_HERE'::UUID,
  ARRAY['junior', 'mid', 'senior'],
  ARRAY['technical', 'behavioral'],
  10,
  'online'
)
ON CONFLICT (user_id) DO UPDATE SET availability_status = 'online';
```

### Option 2: Set ALL Users to Online (For Testing)

```sql
-- This sets all users to online for easy testing
UPDATE user_preferences
SET availability_status = 'online'
WHERE user_id IN (SELECT id FROM auth.users);

-- If any user doesn't have preferences, create them
INSERT INTO user_preferences (user_id, availability_status)
SELECT id, 'online'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_preferences);
```

### Option 3: Debug What's Wrong

Run this to see the current status:

```sql
-- See all users and their queue status
SELECT 
  u.email,
  p.full_name,
  up.availability_status,
  CASE 
    WHEN up.availability_status = 'online' THEN '✅ Available'
    WHEN up.availability_status = 'offline' THEN '❌ Offline'
    WHEN up.availability_status IS NULL THEN '❌ No Preferences'
    ELSE '⏸️ ' || up.availability_status
  END as status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN user_preferences up ON up.user_id = u.id
ORDER BY u.created_at DESC;
```

## Common Issues

1. **Test user doesn't have `user_preferences` row**
   - Solution: Run Option 1 above

2. **Test user status is 'offline' or 'away'**
   - Solution: Update to 'online' using Option 1

3. **No test user created yet**
   - Solution: Follow `TEST_USER_SETUP.md` first

4. **You're checking against yourself**
   - The system excludes your own user_id, so you need at least 2 users

## Verify It Works

After running the SQL:

1. Refresh your browser
2. Go to "Find a Practice Partner"
3. Click "Join Queue"
4. Should match within 3 seconds!

## Quick Test: Set Yourself to Online Too

Make sure YOU are also set to online:

```sql
-- Replace with YOUR user UUID
UPDATE user_preferences
SET availability_status = 'online'
WHERE user_id = 'YOUR_USER_UUID'::UUID;
```

Then when you click "Join Queue", if the test user is also online, you'll match instantly!

