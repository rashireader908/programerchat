import React, { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '../ui/Button'

interface MessageInputProps {
  onSend: (message: string) => void
  sending: boolean
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, sending }) => {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && !sending) {
      onSend(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message... (Press Enter to send)"
        className="flex-1 input-field resize-none"
        rows={1}
        style={{ minHeight: '40px', maxHeight: '120px' }}
        disabled={sending}
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || sending}
        isLoading={sending}
      >
        <Send size={16} />
      </Button>
    </div>
  )
}

