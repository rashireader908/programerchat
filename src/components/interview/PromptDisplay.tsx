import React, { useState, useEffect } from 'react'
import { X, RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'
import { getConversationPrompt, getRandomPrompt, assignPromptToConversation } from '../../lib/prompts'

interface PromptDisplayProps {
  conversationId: string
  onClose?: () => void
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ conversationId, onClose }) => {
  const [prompt, setPrompt] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrompt()
  }, [conversationId])

  const loadPrompt = async () => {
    try {
      const data = await getConversationPrompt(conversationId)
      if (data && data.interview_prompts) {
        setPrompt(data.interview_prompts)
      } else {
        // No prompt assigned, get a random one
        const randomPrompt = await getRandomPrompt()
        if (randomPrompt) {
          await assignPromptToConversation(conversationId, randomPrompt.id)
          setPrompt(randomPrompt)
        }
      }
    } catch (error) {
      // Try to get a random prompt
      const randomPrompt = await getRandomPrompt()
      if (randomPrompt) {
        try {
          await assignPromptToConversation(conversationId, randomPrompt.id)
          setPrompt(randomPrompt)
        } catch (err) {
          console.error('Error assigning prompt:', err)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleNewPrompt = async () => {
    setLoading(true)
    const newPrompt = await getRandomPrompt()
    if (newPrompt) {
      try {
        await assignPromptToConversation(conversationId, newPrompt.id)
        setPrompt(newPrompt)
      } catch (error) {
        console.error('Error assigning new prompt:', error)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading prompt...</p>
      </div>
    )
  }

  if (!prompt) {
    return null
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase">
            {prompt.category.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            • {prompt.difficulty}
          </span>
        </div>
        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
          {prompt.prompt_text}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewPrompt}
          disabled={loading}
        >
          <RefreshCw size={14} className="mr-1" />
          New Prompt
        </Button>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

