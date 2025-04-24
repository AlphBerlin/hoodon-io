import { useState, useEffect } from 'react';
import axios from 'axios';
import {User} from "@supabase/supabase-js";
import {supabase} from "@/lib/supabase/client";

export const useAuth = () => {
    const [ user,setUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    useEffect(() => {
        (async ()=>{
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        })()
    }, []);

    useEffect(() => {
        // Setup axios interceptor for 401 errors
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    setShowAuthModal(true);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return {
        user,
        showAuthModal,
        setShowAuthModal,
        isAuthenticated: !!user,
    };
};