# Create Test User for Chatting

Follow these steps to create a test user so you can test the chatting functionality:

## Option 1: Manual Setup (Recommended)

### Step 1: Create Auth User
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/cchwjpiawmkbcmcanagk
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create New User**
4. Fill in:
   - **Email**: `testuser@example.com`
   - **Password**: `testpassword123`
   - **Auto Confirm User**: ✅ (check this)
5. Click **Create User**
6. **Copy the User ID** (UUID) - you'll need this!

### Step 2: Get Your User ID
1. Still in **Authentication** → **Users**
2. Find your own user account (the one you're logged in with)
3. **Copy your User ID** (UUID)

### Step 3: Run SQL Script
1. Go to **SQL Editor** in Supabase
2. Open the file `create_test_user.sql` from this project
3. Replace `REPLACE_WITH_TEST_USER_UUID` with the test user UUID from Step 1
4. Replace `REPLACE_WITH_YOUR_USER_UUID` with your user UUID from Step 2
5. Click **Run**

### Step 4: Add Test Messages (Optional)
Run this in SQL Editor to add some test messages:

```sql
-- Get the conversation ID first
SELECT id FROM conversations 
WHERE user1_id = 'YOUR_USER_UUID' OR user2_id = 'YOUR_USER_UUID'
ORDER BY created_at DESC LIMIT 1;

-- Then insert test messages (replace CONVERSATION_ID with the ID above)
INSERT INTO messages (conversation_id, sender_id, content) VALUES
('CONVERSATION_ID', 'TEST_USER_UUID', 'Hello! This is a test message from the test user.'),
('CONVERSATION_ID', 'YOUR_USER_UUID', 'Hi! Thanks for testing the chat feature.'),
('CONVERSATION_ID', 'TEST_USER_UUID', 'How are you finding the platform?');
```

## Option 2: Quick SQL (If you know your UUIDs)

If you already have both user UUIDs, you can run this directly:

```sql
-- Replace these UUIDs
\set test_user_id 'YOUR_TEST_USER_UUID_HERE'
\set your_user_id 'YOUR_USER_UUID_HERE'

-- Create profile
INSERT INTO profiles (id, email, full_name, verification_status, bio, experience_level, tech_stack)
VALUES (:test_user_id, 'testuser@example.com', 'Alex Test User', 'verified', 
        'Test user for practicing!', 'mid', ARRAY['JavaScript', 'React', 'Node.js'])
ON CONFLICT (id) DO NOTHING;

-- Create preferences
INSERT INTO user_preferences (user_id, preferred_experience_levels, preferred_topics, availability_status)
VALUES (:test_user_id, ARRAY['junior', 'mid', 'senior'], ARRAY['technical', 'behavioral'], 'online')
ON CONFLICT (user_id) DO UPDATE SET availability_status = 'online';

-- Create conversation
INSERT INTO conversations (user1_id, user2_id, type, status, started_at)
VALUES (:your_user_id, :test_user_id, 'text', 'active', NOW())
ON CONFLICT DO NOTHING;
```

## Option 3: Use Second Browser/Incognito

1. Open an incognito/private window
2. Go to http://localhost:3000
3. Sign up with a different email (e.g., `testuser2@example.com`)
4. Complete profile setup
5. Now you have two accounts to test with!

## Verify It Worked

After creating the test user:
1. Go to your Dashboard
2. You should see "Recent Conversations" with the test user
3. Click on it to open the chat
4. Start messaging!

## Troubleshooting

- **Can't find user UUID**: Check Authentication → Users in Supabase
- **Conversation not showing**: Make sure both users have profiles created
- **Can't send messages**: Check that Realtime is enabled for the `messages` table

