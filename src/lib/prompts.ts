import { supabase } from './supabase'

export interface InterviewPrompt {
  id: string
  category: string
  difficulty: string
  prompt_text: string
}

export const getRandomPrompt = async (
  category?: string,
  difficulty?: string
): Promise<InterviewPrompt | null> => {
  try {
    let query = supabase.from('interview_prompts').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) throw error
    if (!data || data.length === 0) return null

    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex]
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return null
  }
}

export const assignPromptToConversation = async (
  conversationId: string,
  promptId: string
) => {
  const { error } = await supabase
    .from('conversation_prompts')
    .insert({
      conversation_id: conversationId,
      prompt_id: promptId,
    })

  if (error) throw error
}

export const getConversationPrompt = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('conversation_prompts')
    .select('*, interview_prompts(*)')
    .eq('conversation_id', conversationId)
    .order('shown_at', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error
  return data
}

