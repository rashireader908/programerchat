import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { supabase } from '../../lib/supabase'

interface PreferencesFormProps {
  preferences: any
  onUpdate: () => void
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onUpdate }) => {
  const { user } = useAuth()
  const [preferredExperienceLevels, setPreferredExperienceLevels] = useState<string[]>(
    preferences?.preferred_experience_levels || []
  )
  const [preferredTopics, setPreferredTopics] = useState<string[]>(
    preferences?.preferred_topics || []
  )
  const [preferredDuration, setPreferredDuration] = useState(
    preferences?.preferred_duration || 10
  )
  const [availabilityStatus, setAvailabilityStatus] = useState(
    preferences?.availability_status || 'offline'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const experienceLevels = ['junior', 'mid', 'senior', 'lead']
  const topics = [
    'technical', 'behavioral', 'system_design', 'coding', 'general'
  ]

  useEffect(() => {
    if (preferences) {
      setPreferredExperienceLevels(preferences.preferred_experience_levels || [])
      setPreferredTopics(preferences.preferred_topics || [])
      setPreferredDuration(preferences.preferred_duration || 10)
      setAvailabilityStatus(preferences.availability_status || 'offline')
    }
  }, [preferences])

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    setter(
      array.includes(item)
        ? array.filter(i => i !== item)
        : [...array, item]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const data = {
        user_id: user.id,
        preferred_experience_levels: preferredExperienceLevels,
        preferred_topics: preferredTopics,
        preferred_duration: preferredDuration,
        availability_status: availabilityStatus,
        updated_at: new Date().toISOString(),
      }

      if (preferences) {
        const { error } = await supabase
          .from('user_preferences')
          .update(data)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('user_preferences')
          .insert(data)

        if (error) throw error
      }

      onUpdate()
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Matching Preferences
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preferred Experience Levels
        </label>
        <div className="flex flex-wrap gap-2">
          {experienceLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => toggleArrayItem(preferredExperienceLevels, level, setPreferredExperienceLevels)}
              className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                preferredExperienceLevels.includes(level)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preferred Topics
        </label>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggleArrayItem(preferredTopics, topic, setPreferredTopics)}
              className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                preferredTopics.includes(topic)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {topic.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preferred Duration (minutes)
        </label>
        <input
          type="number"
          min="5"
          max="30"
          value={preferredDuration}
          onChange={(e) => setPreferredDuration(parseInt(e.target.value))}
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Availability Status
        </label>
        <select
          value={availabilityStatus}
          onChange={(e) => setAvailabilityStatus(e.target.value)}
          className="input-field"
        >
          <option value="offline">Offline</option>
          <option value="away">Away</option>
          <option value="online">Online</option>
        </select>
      </div>

      <Button type="submit" isLoading={loading} className="w-full">
        Save Preferences
      </Button>
    </form>
  )
}

