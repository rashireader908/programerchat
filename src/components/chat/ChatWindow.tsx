import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../hooks/useChat'
import { Timer } from '../ui/Timer'
import { Button } from '../ui/Button'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { PromptDisplay } from '../interview/PromptDisplay'
import { getConversationPartner } from '../../lib/chat'
import { supabase } from '../../lib/supabase'

export const ChatWindow: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { messages, loading, sending, sendMessage } = useChat(conversationId)
  const [partner, setPartner] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(true)

  useEffect(() => {
    if (!user || !conversationId) return

    loadPartner()
    loadPrompt()
  }, [conversationId, user])

  const loadPartner = async () => {
    if (!user) return
    try {
      const partnerData = await getConversationPartner(conversationId, user.id)
      setPartner(partnerData)
    } catch (error) {
      console.error('Error loading partner:', error)
    }
  }

  const loadPrompt = async () => {
    try {
      const { data } = await supabase
        .from('conversation_prompts')
        .select('*, interview_prompts(*)')
        .eq('conversation_id', conversationId)
        .order('shown_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setShowPrompt(true)
      }
    } catch (error) {
      // No prompt yet, that's okay
    }
  }

  const handleEndConversation = async () => {
    if (!conversationId) return

    try {
      await supabase
        .from('conversations')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
        })
        .eq('id', conversationId)

      navigate('/dashboard')
    } catch (error) {
      console.error('Error ending conversation:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {partner && (
            <>
              {partner.avatar_url ? (
                <img
                  src={partner.avatar_url}
                  alt={partner.full_name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {partner.full_name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {partner.full_name || 'Unknown'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Practice Session</p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Timer durationMinutes={10} />
          <Button variant="danger" size="sm" onClick={handleEndConversation}>
            <X className="h-4 w-4 mr-2" />
            End Session
          </Button>
        </div>
      </div>

      {/* Prompt Display */}
      {showPrompt && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border-b border-primary-200 dark:border-primary-800 px-4 py-3">
          <PromptDisplay conversationId={conversationId} onClose={() => setShowPrompt(false)} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} currentUserId={user?.id || ''} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <MessageInput onSend={sendMessage} sending={sending} />
      </div>
    </div>
  )
}

