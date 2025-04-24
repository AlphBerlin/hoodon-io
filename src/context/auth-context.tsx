'use client'

import React, {createContext, Dispatch, useContext, useEffect, useState} from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from "@/lib/supabase/client"
import {router} from "next/client";
import { useRouter ,usePathname} from 'next/navigation';
import {publicRoutes} from "@/config/routes";


interface AuthContextType {
  user: User | null
  loading: boolean
  showLoginModal: boolean
  setShowLoginModal: Dispatch<React.SetStateAction<boolean>>;
  handleAccessAppButtonClick: ()=>void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  showLoginModal: false,
  setShowLoginModal: () => {},
  handleAccessAppButtonClick: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      setSessionChecked(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Show login modal after 30 seconds if user hasn't interacted
  useEffect(() => {
    const isPublicRoute = publicRoutes.some((route) => {
      const regex = new RegExp(`^${route.replace('[id]', '[^/]+')}$`);
      return regex.test(pathname);
    });
    // Only start the timer if:
    // 1. Session check is complete
    // 2. User is not logged in
    // 3. User hasn't interacted
    // 4. Modal is not already showing
    if (!isPublicRoute && sessionChecked && !user && !hasInteracted && !showLoginModal) {
      setShowLoginModal(true)
    }
  }, [sessionChecked, user, hasInteracted, showLoginModal])

  // Track user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true)
      // Optionally hide the modal when user interacts
      // setShowLoginModal(false)
    }

    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('scroll', handleInteraction)

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
    }
  }, [])

  const handleAccessAppButtonClick = () => {
    if(user){
      router.push('/cupid')
    }else {
      setShowLoginModal(true)
    }
  }

  return (
      <AuthContext.Provider value={{
        user,
        loading,
        showLoginModal,
        setShowLoginModal,
        handleAccessAppButtonClick
      }}>
        {children}
      </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)