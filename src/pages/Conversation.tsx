import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChatWindow } from '../components/chat/ChatWindow'
import { VideoCall } from '../components/video/VideoCall'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { supabase } from '../lib/supabase'

export const Conversation: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversation, setConversation] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [conversationType, setConversationType] = React.useState<'text' | 'video'>('text')

  useEffect(() => {
    if (!id || !user) {
      navigate('/queue')
      return
    }

    loadConversation()
  }, [id, user, navigate])

  const loadConversation = async () => {
    if (!id || !user) return

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      // Check if user is part of this conversation
      if (data.user1_id !== user.id && data.user2_id !== user.id) {
        navigate('/dashboard')
        return
      }

      setConversation(data)
      setConversationType(data.type)
      setLoading(false)
    } catch (error) {
      console.error('Error loading conversation:', error)
      navigate('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!conversation) {
    return null
  }

  return (
    <>
      {conversationType === 'video' ? (
        <VideoCall conversationId={conversation.id} />
      ) : (
        <ChatWindow conversationId={conversation.id} />
      )}
    </>
  )
}

