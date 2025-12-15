import { supabase } from './supabase'
import { format } from 'date-fns'

export const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return format(date, 'HH:mm')
  } else {
    return format(date, 'MMM d, HH:mm')
  }
}

export const getConversationPartner = async (conversationId: string, currentUserId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('user1_id, user2_id')
    .eq('id', conversationId)
    .single()

  if (error) throw error

  const partnerId = data.user1_id === currentUserId ? data.user2_id : data.user1_id

  const { data: partnerProfile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('id', partnerId)
    .single()

  return partnerProfile
}

