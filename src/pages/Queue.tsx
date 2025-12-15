import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useMatching } from '../hooks/useMatching'

export const Queue: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { joinQueue, leaveQueue, isInQueue, isMatching, matchFound, matchAttempts, noUsersAvailable } = useMatching()

  const handleJoinQueue = async () => {
    if (!user) return
    await joinQueue()
  }

  const handleLeaveQueue = async () => {
    await leaveQueue()
  }

  useEffect(() => {
    if (matchFound) {
      navigate(`/conversation/${matchFound.conversationId}`)
    }
  }, [matchFound, navigate])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <Users className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Find a Practice Partner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join the queue to get matched with another verified tech professional for a practice session
          </p>

          {noUsersAvailable ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  ⚠️ No users available in the queue right now. Try again in a moment or invite a friend to join!
                </p>
              </div>
              <Button onClick={handleJoinQueue}>
                Try Again
              </Button>
              <Button variant="secondary" onClick={handleLeaveQueue}>
                Go Back
              </Button>
            </div>
          ) : isMatching ? (
            <div className="space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Finding your match...
              </p>
              {matchAttempts > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Attempt {matchAttempts} of 10
                </p>
              )}
              <Button variant="secondary" onClick={handleLeaveQueue}>
                Cancel
              </Button>
            </div>
          ) : isInQueue ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary-600">
                <Loader className="h-5 w-5 animate-spin" />
                <p className="text-lg">Waiting for a match...</p>
              </div>
              {matchAttempts > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Attempt {matchAttempts} of 10
                </p>
              )}
              <Button variant="secondary" onClick={handleLeaveQueue}>
                Leave Queue
              </Button>
            </div>
          ) : (
            <Button size="lg" onClick={handleJoinQueue}>
              Join Queue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

