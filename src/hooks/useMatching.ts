import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { findMatch, joinMatchingQueue, leaveMatchingQueue, checkAvailableUsers } from '../lib/matching'
import type { MatchResult } from '../lib/matching'

export const useMatching = () => {
  const { user } = useAuth()
  const [isInQueue, setIsInQueue] = useState(false)
  const [isMatching, setIsMatching] = useState(false)
  const [matchFound, setMatchFound] = useState<MatchResult | null>(null)
  const [matchingInterval, setMatchingInterval] = useState<ReturnType<typeof setInterval> | null>(null)
  const [matchAttempts, setMatchAttempts] = useState(0)
  const [noUsersAvailable, setNoUsersAvailable] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const MAX_ATTEMPTS = 10 // 30 seconds total (10 attempts × 3 seconds)
  const MATCH_TIMEOUT = 30000 // 30 seconds total timeout

  const joinQueue = useCallback(async () => {
    if (!user) return

    setIsInQueue(true)
    setIsMatching(true)
    setMatchAttempts(0)
    setNoUsersAvailable(false)
    await joinMatchingQueue(user.id)

    // Check if there are any available users first
    const availableCount = await checkAvailableUsers(user.id)
    if (availableCount === 0) {
      setNoUsersAvailable(true)
      setIsMatching(false)
      return
    }

    // Set timeout to stop matching after 30 seconds
    timeoutRef.current = setTimeout(() => {
      setIsMatching(false)
      setNoUsersAvailable(true)
      if (matchingInterval) {
        clearInterval(matchingInterval)
        setMatchingInterval(null)
      }
    }, MATCH_TIMEOUT)

    // Start matching loop
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      setMatchAttempts(attempts)

      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(interval)
        setIsMatching(false)
        setNoUsersAvailable(true)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        return
      }

      const match = await findMatch(user.id)
      if (match) {
        setMatchFound(match)
        setIsInQueue(false)
        setIsMatching(false)
        clearInterval(interval)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }, 3000) // Check every 3 seconds

    setMatchingInterval(interval)
  }, [user, matchingInterval])

  const leaveQueue = useCallback(async () => {
    if (!user) return

    setIsInQueue(false)
    setIsMatching(false)
    setNoUsersAvailable(false)
    setMatchAttempts(0)
    await leaveMatchingQueue(user.id)

    if (matchingInterval) {
      clearInterval(matchingInterval)
      setMatchingInterval(null)
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [user, matchingInterval])

  useEffect(() => {
    return () => {
      if (matchingInterval) {
        clearInterval(matchingInterval)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [matchingInterval])

  return {
    isInQueue,
    isMatching,
    matchFound,
    matchAttempts,
    noUsersAvailable,
    joinQueue,
    leaveQueue,
  }
}

