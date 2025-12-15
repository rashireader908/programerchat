import { useState, useEffect } from 'react'
import { getRandomPrompt, getConversationPrompt, assignPromptToConversation } from '../lib/prompts'
import type { InterviewPrompt } from '../lib/prompts'

export const usePrompts = (conversationId?: string) => {
  const [currentPrompt, setCurrentPrompt] = useState<InterviewPrompt | null>(null)
  const [loading, setLoading] = useState(false)

  const loadConversationPrompt = async () => {
    if (!conversationId) return

    setLoading(true)
    try {
      const data = await getConversationPrompt(conversationId)
      if (data && data.interview_prompts) {
        setCurrentPrompt(data.interview_prompts)
      }
    } catch (error) {
      console.error('Error loading conversation prompt:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNewPrompt = async (category?: string, difficulty?: string) => {
    setLoading(true)
    try {
      const prompt = await getRandomPrompt(category, difficulty)
      if (prompt && conversationId) {
        await assignPromptToConversation(conversationId, prompt.id)
        setCurrentPrompt(prompt)
      }
      return prompt
    } catch (error) {
      console.error('Error getting new prompt:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (conversationId) {
      loadConversationPrompt()
    }
  }, [conversationId])

  return {
    currentPrompt,
    loading,
    getNewPrompt,
    loadConversationPrompt,
  }
}

