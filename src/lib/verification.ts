import { supabase } from './supabase'

export type VerificationMethod = 'linkedin' | 'github'

export interface VerificationData {
  access_token?: string
  user_id?: string
  username?: string
  profile_url?: string
}

export const initiateGitHubVerification = async () => {
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID
  if (!githubClientId) {
    throw new Error('GitHub OAuth not configured')
  }

  const redirectUri = `${window.location.origin}/auth/callback/github`
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`

  window.location.href = githubAuthUrl
}

export const initiateLinkedInVerification = async () => {
  const linkedInClientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID
  if (!linkedInClientId) {
    throw new Error('LinkedIn OAuth not configured')
  }

  const redirectUri = `${window.location.origin}/auth/callback/linkedin`
  const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedInClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email`

  window.location.href = linkedInAuthUrl
}

export const updateVerificationStatus = async (
  userId: string,
  method: VerificationMethod,
  verificationData: VerificationData
) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      verification_method: method,
      verification_data: verificationData,
      verification_status: 'pending', // Will be reviewed by admin
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    throw error
  }
}

export const checkVerificationStatus = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('verification_status, verification_method')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

