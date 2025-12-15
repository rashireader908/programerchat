# Quick Test User Setup Guide

Follow these **3 simple steps** to create a test user for chatting:

## Step 1: Create Auth User

1. Go to: https://supabase.com/dashboard/project/cchwjpiawmkbcmcanagk/auth/users
2. Click **"Add User"** → **"Create New User"**
3. Fill in:
   - **Email**: `testuser@example.com`
   - **Password**: `testpassword123`
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create User"**
5. **Copy the User ID** (UUID) - you'll see it in the user list

## Step 2: Get Your User ID

1. Still in **Authentication** → **Users**
2. Find **your own account** (the email you signed up with)
3. **Copy your User ID** (UUID)

## Step 3: Run This SQL

1. Go to **SQL Editor** in Supabase
2. Copy and paste the SQL below
3. **Replace the two UUIDs** with your actual user IDs from Steps 1 & 2
4. Click **Run**

```sql
-- Replace these two UUIDs:
-- YOUR_USER_ID = Your account UUID (from Step 2)
-- TEST_USER_ID = Test user UUID (from Step 1)

-- Create test user profile
INSERT INTO profiles (
  id, email, full_name, verification_status, bio, experience_level, tech_stack
) VALUES (
  'TEST_USER_ID_HERE'::UUID,  -- Replace with test user UUID from Step 1
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
  'TEST_USER_ID_HERE'::UUID,  -- Replace with test user UUID from Step 1
  ARRAY['junior', 'mid', 'senior'],
  ARRAY['technical', 'behavioral', 'system_design'],
  10,
  'online'
)
ON CONFLICT (user_id) DO UPDATE SET
  availability_status = 'online';

-- Create test conversation
INSERT INTO conversations (
  user1_id, user2_id, type, status, started_at
) VALUES (
  'YOUR_USER_ID_HERE'::UUID,  -- Replace with YOUR UUID from Step 2
  'TEST_USER_ID_HERE'::UUID,  -- Replace with test user UUID from Step 1
  'text',
  'active',
  NOW()
)
ON CONFLICT DO NOTHING
RETURNING id as conversation_id;

-- Add a welcome message (optional - use the conversation_id from above)
-- INSERT INTO messages (conversation_id, sender_id, content) VALUES
-- ('CONVERSATION_ID_FROM_ABOVE', 'TEST_USER_ID_HERE', 'Hello! This is a test message.');
```

## Done! 🎉

Now you have two ways to test:

### Option A: Use "Find a Match" (Queue)
1. The test user is already set to `availability_status = 'online'`
2. Go to **"Find a Practice Partner"** in your Dashboard
3. Click **"Join Queue"**
4. Within 3 seconds, you should be matched with "Alex Test User"!
5. You'll be automatically redirected to the chat

### Option B: Use Existing Conversation
1. **Refresh your Dashboard** - you should see "Alex Test User" in Recent Conversations
2. **Click on it** to open the chat
3. **Start messaging!**

**Note:** The test user will appear in the matching queue as long as their `availability_status` is set to `'online'` (which the SQL above does).

## Alternative: Use Incognito Window

If you want to test with two real accounts:

1. Open an **incognito/private window**
2. Go to http://localhost:3000
3. Sign up with a different email (e.g., `testuser2@example.com`)
4. Complete profile setup
5. Now you have two accounts - open both windows side by side and chat!

## Troubleshooting

- **Can't find UUIDs**: They're in Authentication → Users, in the ID column
- **Conversation not showing**: Make sure you replaced both UUIDs correctly
- **Can't send messages**: Check that Realtime is enabled (Database → Replication → messages table)

