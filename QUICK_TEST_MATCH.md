# Quick Test: Find a Match Feature

Yes! The test user **WILL appear** in "Find a Match" if set up correctly.

## How It Works

The matching system looks for users with `availability_status = 'online'` in the `user_preferences` table. When you:
1. Click "Join Queue" → Your status becomes `'online'`
2. The system searches for other users with `'online'` status
3. If found, it creates a conversation and matches you

## Setup for Testing

Make sure when you create the test user, you run this SQL:

```sql
-- This sets the test user to 'online' so they appear in the queue
INSERT INTO user_preferences (
  user_id, 
  availability_status  -- This is the key!
) VALUES (
  'TEST_USER_UUID_HERE'::UUID,
  'online'  -- ✅ This makes them appear in matching
)
ON CONFLICT (user_id) DO UPDATE SET
  availability_status = 'online';  -- Keep them online
```

## Testing Steps

1. **Create test user** (follow TEST_USER_SETUP.md)
2. **Make sure test user has `availability_status = 'online'`** ✅
3. **Go to Dashboard** → Click **"Find a Practice Partner"**
4. **Click "Join Queue"**
5. **Wait 3 seconds** → You should be matched with the test user!
6. **You'll be redirected** to the chat automatically

## Troubleshooting

**Not matching?** Check:
- Test user has `user_preferences` row with `availability_status = 'online'`
- Run this to check: 
  ```sql
  SELECT user_id, availability_status 
  FROM user_preferences 
  WHERE user_id = 'TEST_USER_UUID';
  ```
- Should show: `availability_status = 'online'`

**Want to test with two real accounts?**
- Open incognito window
- Sign up as second user
- Set both to `'online'` status
- Both click "Join Queue" → Instant match!

