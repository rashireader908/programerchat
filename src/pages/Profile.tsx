import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ProfileSetup } from '../components/profile/ProfileSetup'
import { ProfileEdit } from '../components/profile/ProfileEdit'
import { PreferencesForm } from '../components/profile/PreferencesForm'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { supabase } from '../lib/supabase'

export const Profile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [preferences, setPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile')

  useEffect(() => {
    if (user) {
      loadProfile()
      loadPreferences()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPreferences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error
      }
      setPreferences(data)
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }

  const handleProfileUpdate = () => {
    loadProfile()
  }

  const handlePreferencesUpdate = () => {
    loadPreferences()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'preferences'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Preferences
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' ? (
              profile ? (
                <ProfileEdit profile={profile} onUpdate={handleProfileUpdate} />
              ) : (
                <ProfileSetup onComplete={handleProfileUpdate} />
              )
            ) : (
              <PreferencesForm preferences={preferences} onUpdate={handlePreferencesUpdate} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

