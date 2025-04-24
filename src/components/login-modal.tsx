'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/context/auth-context'
import { supabase } from "@/lib/supabase/client"
import { X, Mail, Apple, Facebook, Loader2 } from 'lucide-react'
import { Icons } from "@/components/icons"
import {useRouter} from "next/navigation";

type ErrorType = {
  message: string;
  type?: 'error' | 'warning' | 'info';
}

export function LoginModal() {
  const { showLoginModal, setShowLoginModal } = useAuth()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorType | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  const router = useRouter()
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setLoading(true)
      setError(null)

      const getProviderOptions = (provider: 'google' | 'facebook' | 'apple'):{queryParams:any} => {
        const baseOptions = {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }

        const providerOptions = {
          google: {
            queryParams: {
              'access_type': 'offline',
              prompt: 'consent',
            }
          },
          facebook: {
            queryParams: {
              auth_type: 'rerequest',
              scope: 'email,public_profile,user_birthday,user_location,user_hometown'
            }
          },
          apple: {
            queryParams: {
              scope: 'name email',
              response_mode: 'form_post',
              response_type: 'code id_token'
            }
          }
        }

        return { ...baseOptions, ...providerOptions[provider] }
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: getProviderOptions(provider)
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Error:', error)
      setError({
        message: 'Failed to sign in with social provider. Please try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      setError({
        message: 'Please agree to the Terms of Service',
        type: 'warning'
      })
      return
    }

    try {
      setLoading(true)
      setError(null)

      // First, try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // If credentials are invalid, check if we should sign up instead
      if (signInError?.message.includes('Invalid login credentials')) {
        setError({
          message: 'Invalid password. Please try again.',
          type: 'error'
        })

        // New user - proceed with sign up
        setIsNewUser(true)
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (signUpError) throw signUpError

        setError({
          message: 'Check your email for the confirmation link to complete your registration.',
          type: 'info'
        })
      } else if (signInError) {
        throw signInError
      } else {
        // Successful login
        setShowLoginModal(false)
        await router.push('/cupid')
      }
    } catch (error: any) {
      console.error('Error:', error)
      setError({
        message: error.message || 'Failed to sign in. Please try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    const pathType = document.querySelector('meta[name="path-type"]')?.getAttribute('content')
    if (pathType !== 'protected') {
      setShowLoginModal(false)
      setShowEmailForm(false)
      setError(null)
      setIsNewUser(false)
      setEmail('')
      setPassword('')
      setAgreedToTerms(false)
    }
  }

  return (
      <Dialog open={showLoginModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-center">HoodOn.io</DialogTitle>
            <p className="text-xl text-center text-muted-foreground">
              Start chat immediately after signing in
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {error && (
                <Alert variant={error.type === 'warning' ? 'destructive' : error.type === 'info' ? 'default' : 'destructive'}>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            {!showEmailForm ? (
                <div className="space-y-4">
                  <Button
                      variant="outline"
                      className="w-full h-14 text-lg relative"
                      onClick={() => handleSocialLogin('google')}
                      disabled={loading}
                  >
                    <Icons.google className="w-6 h-6 mr-3" />
                    Connect with Google
                    {loading && <Loader2 className="w-5 h-5 animate-spin absolute right-4" />}
                  </Button>

                  <Button
                      variant="outline"
                      className="w-full h-14 text-lg"
                      onClick={() => setShowEmailForm(true)}
                      disabled={loading}
                  >
                    <Mail className="w-6 h-6 mr-3" />
                    Connect with Email
                  </Button>
                </div>
            ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14"
                        disabled={loading}
                        placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14"
                        disabled={loading}
                        placeholder="Enter your password"
                        minLength={6}
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                        className="mt-1"
                        disabled={loading}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground"
                    >
                      I certify I have read and agree to the{" "}
                      <a href="/terms-and-conditions" className="underline font-bold hover:text-primary">
                        Terms of Service
                      </a>{" "}
                      and confirm that you have read{" "}
                      <a href="/privacy" className="underline font-bold hover:text-primary">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>

                  <Button
                      type="submit"
                      className="w-full h-14 text-lg relative"
                      disabled={loading}
                  >
                    {loading ? (
                        <>
                          Loading...
                          <Loader2 className="w-5 h-5 animate-spin ml-2" />
                        </>
                    ) : (
                        'Continue'
                    )}
                  </Button>

                  <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setShowEmailForm(false)
                        setError(null)
                      }}
                      disabled={loading}
                  >
                    Back to options
                  </Button>
                </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
  )
}