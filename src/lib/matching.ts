import { supabase } from './supabase'

export interface MatchResult {
  conversationId: string
  partnerId: string
  partnerName: string
}

export const findMatch = async (userId: string): Promise<MatchResult | null> => {
  try {
    // Get user preferences (for future preference-based matching)
    await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Find available users in queue
    const { data: availableUsers } = await supabase
      .from('user_preferences')
      .select('user_id, preferred_experience_levels, preferred_topics')
      .eq('availability_status', 'online')
      .neq('user_id', userId)

    if (!availableUsers || availableUsers.length === 0) {
      return null
    }

    // Simple matching: find first available user
    // In production, implement preference-based matching
    const matchedUser = availableUsers[0]

    // Create conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        user1_id: userId,
        user2_id: matchedUser.user_id,
        type: 'text', // Default to text, can be changed
        status: 'active',
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Get partner profile
    const { data: partnerProfile } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', matchedUser.user_id)
      .single()

    // Update both users' availability
    await supabase
      .from('user_preferences')
      .update({ availability_status: 'away' })
      .in('user_id', [userId, matchedUser.user_id])

    return {
      conversationId: conversation.id,
      partnerId: matchedUser.user_id,
      partnerName: partnerProfile?.full_name || 'Unknown',
    }
  } catch (error) {
    console.error('Error finding match:', error)
    return null
  }
}

export const joinMatchingQueue = async (userId: string) => {
  // Check if preferences exist, create if not
  const { data: existingPrefs } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!existingPrefs) {
    await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        availability_status: 'online',
      })
  } else {
    await supabase
      .from('user_preferences')
      .update({ availability_status: 'online' })
      .eq('user_id', userId)
  }
}

export const leaveMatchingQueue = async (userId: string) => {
  await supabase
    .from('user_preferences')
    .update({ availability_status: 'offline' })
    .eq('user_id', userId)
}

export const checkAvailableUsers = async (userId: string): Promise<number> => {
  try {
    const { count } = await supabase
      .from('user_preferences')
      .select('*', { count: 'exact', head: true })
      .eq('availability_status', 'online')
      .neq('user_id', userId)

    return count || 0
  } catch (error) {
    console.error('Error checking available users:', error)
    return 0
  }
}

