import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Github, Linkedin, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { initiateGitHubVerification, initiateLinkedInVerification, checkVerificationStatus } from '../../lib/verification'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export const VerificationFlow: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected' | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    loadVerificationStatus()
  }, [user, navigate])

  const loadVerificationStatus = async () => {
    if (!user) return

    try {
      const data = await checkVerificationStatus(user.id)
      setStatus(data.verification_status as 'pending' | 'verified' | 'rejected')
    } catch (error) {
      console.error('Error loading verification status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubVerification = async () => {
    if (!user) return
    setVerifying(true)
    try {
      await initiateGitHubVerification()
    } catch (error) {
      console.error('GitHub verification error:', error)
      setVerifying(false)
    }
  }

  const handleLinkedInVerification = async () => {
    if (!user) return
    setVerifying(true)
    try {
      await initiateLinkedInVerification()
    } catch (error) {
      console.error('LinkedIn verification error:', error)
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (status === 'verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Verification Complete
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your account has been verified. You can now start practicing!
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Verification Rejected
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your verification request was rejected. Please try again or contact support.
          </p>
          <Button onClick={() => navigate('/profile')}>
            Update Profile
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Verify Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            To ensure quality conversations, please verify your tech professional status
          </p>
        </div>

        {status === 'pending' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your verification is pending review. This usually takes 24-48 hours.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3"
            onClick={handleGitHubVerification}
            disabled={verifying}
            isLoading={verifying}
          >
            <Github size={20} />
            Verify with GitHub
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3"
            onClick={handleLinkedInVerification}
            disabled={verifying}
            isLoading={verifying}
          >
            <Linkedin size={20} />
            Verify with LinkedIn
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          By verifying, you agree to our terms of service. We'll review your profile to ensure you're a tech professional.
        </p>
      </div>
    </div>
  )
}

