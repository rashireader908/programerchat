# Database Setup Instructions

Follow these steps to set up your Supabase database:

## Step 1: Open SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard/project/cchwjpiawmkbcmcanagk
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Run Migration 1 (Initial Schema)

Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql` into the SQL Editor, then click **Run** (or press Cmd/Ctrl + Enter).

This will create:
- All 7 tables (profiles, user_preferences, conversations, messages, interview_prompts, conversation_prompts, feedback)
- All indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

## Step 3: Run Migration 2 (Seed Prompts)

Copy and paste the entire contents of `supabase/migrations/002_seed_prompts.sql` into the SQL Editor, then click **Run**.

This will populate the `interview_prompts` table with 60+ interview questions.

## Step 4: Enable Realtime for Messages

1. Go to **Database** → **Replication** in the left sidebar
2. Find the `messages` table
3. Toggle the switch to enable replication
4. This allows real-time chat functionality

## Step 5: Get Your API Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (starts with `eyJ...`)

## Step 6: Update Your .env File

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=https://cchwjpiawmkbcmcanagk.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_anon_key_here` with the actual anon key from Step 5.

## Step 7: Restart Your Dev Server

After creating/updating the `.env` file:

1. Stop your dev server (Ctrl+C)
2. Run `npm run dev` again
3. The app should now connect to your Supabase database!

## Verification

After running the migrations, you should see these tables in your Supabase dashboard:
- ✅ profiles
- ✅ user_preferences  
- ✅ conversations
- ✅ messages
- ✅ interview_prompts (with ~60 rows)
- ✅ conversation_prompts
- ✅ feedback

You can verify by going to **Table Editor** in the Supabase dashboard.

