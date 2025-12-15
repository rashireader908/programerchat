import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageSquare, Users, User, Clock, ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { supabase } from '../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    totalPracticeTime: 0,
  })
  const [recentConversations, setRecentConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!user) return

    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      // Get total conversations
      const { count: totalCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

      // Get active conversations
      const { data: activeConvs } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(5)

      // Get completed conversations for practice time calculation
      const { data: completedConvs } = await supabase
        .from('conversations')
        .select('duration_minutes')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'completed')
        .not('duration_minutes', 'is', null)

      const totalPracticeTime = completedConvs?.reduce((sum, conv) => sum + (conv.duration_minutes || 0), 0) || 0

      // Get recent conversations with partner info
      const { data: recentConvs } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(5)

      // Enrich with partner names
      if (recentConvs) {
        const enriched = await Promise.all(
          recentConvs.map(async (conv) => {
            const partnerId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id
            const { data: partnerProfile } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', partnerId)
              .single()

            return {
              ...conv,
              partnerName: partnerProfile?.full_name || 'Unknown',
              partnerAvatar: partnerProfile?.avatar_url,
            }
          })
        )
        setRecentConversations(enriched)
      }

      setStats({
        totalConversations: totalCount || 0,
        activeConversations: activeConvs?.length || 0,
        totalPracticeTime,
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartPractice = () => {
    navigate('/queue')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Ready to level up your interview skills?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Total Sessions
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.totalConversations}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Practice conversations
                </p>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full">
                <MessageSquare className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Active Now
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.activeConversations}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ongoing sessions
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Practice Time
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.totalPracticeTime}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minutes total
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary-600" />
                Quick Actions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Start practicing or manage your profile
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleStartPractice}
              className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="h-6 w-6" />
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Find Practice Partner</h3>
                <p className="text-primary-100 text-sm">
                  Match with verified tech professionals
                </p>
              </div>
            </button>

            <Link
              to="/profile"
              className="group relative overflow-hidden bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 rounded-lg p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <User className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 group-hover:text-primary-600 transition-all" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Update Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Edit your preferences and bio
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary-600" />
                Recent Conversations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Your latest practice sessions
              </p>
            </div>
          </div>

          {recentConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">No conversations yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Start your first practice session!
              </p>
              <Button onClick={handleStartPractice}>
                <Sparkles className="mr-2 h-4 w-4" />
                Find a Partner
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  to={`/conversation/${conv.id}`}
                  className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {conv.partnerAvatar ? (
                        <img
                          src={conv.partnerAvatar}
                          alt={conv.partnerName}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                          {conv.partnerName?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {conv.partnerName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {conv.type === 'video' ? 'Video Call' : 'Text Chat'} •{' '}
                          {conv.status === 'active' ? (
                            <span className="text-green-600 dark:text-green-400">Active</span>
                          ) : conv.status === 'completed' ? (
                            <span className="text-gray-600 dark:text-gray-400">Completed</span>
                          ) : (
                            <span className="text-yellow-600 dark:text-yellow-400">Waiting</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(conv.created_at), { addSuffix: true })}
                      </p>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all mt-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

