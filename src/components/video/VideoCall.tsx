import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Timer } from '../ui/Timer'
import { Button } from '../ui/Button'
import { getConversationPartner } from '../../lib/chat'
import { supabase } from '../../lib/supabase'

interface VideoCallProps {
  conversationId: string
}

export const VideoCall: React.FC<VideoCallProps> = ({ conversationId }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [partner, setPartner] = useState<any>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    if (!user || !conversationId) return

    loadPartner()
    initializeVideo()
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

  const initializeVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        setLocalStream(stream)
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const handleEndCall = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }

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
      console.error('Error ending call:', error)
    }
  }

  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [localStream])

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
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
                <h2 className="text-lg font-semibold text-white">
                  {partner.full_name || 'Unknown'}
                </h2>
                <p className="text-sm text-gray-400">Video Call</p>
              </div>
            </>
          )}
        </div>
        <Timer durationMinutes={10} className="text-white" />
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <div className="absolute inset-0 bg-gray-800">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {partner?.avatar_url ? (
                  <img
                    src={partner.avatar_url}
                    alt={partner.full_name}
                    className="h-32 w-32 rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-semibold mx-auto mb-4">
                    {partner?.full_name?.charAt(0) || '?'}
                  </div>
                )}
                <p className="text-white text-lg">{partner?.full_name || 'Waiting...'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-900 rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff className="h-12 w-12 text-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-4 py-4 flex items-center justify-center gap-4">
        <Button
          variant={isMuted ? 'danger' : 'secondary'}
          onClick={toggleMute}
          className="rounded-full p-3"
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </Button>
        <Button
          variant={isVideoOff ? 'danger' : 'secondary'}
          onClick={toggleVideo}
          className="rounded-full p-3"
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </Button>
        <Button
          variant="danger"
          onClick={handleEndCall}
          className="rounded-full p-3"
        >
          <PhoneOff size={20} />
        </Button>
      </div>
    </div>
  )
}

