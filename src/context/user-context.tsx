'use client'

import React, {createContext, Dispatch, useContext, useEffect, useState} from 'react';
import {getUser} from "@/lib/user-api-handler";
import {ProfileWithRelations} from "@/types/database";

interface UserContextType {
    user: ProfileWithRelations | null;
    hoodUrl: string | null;
    setHoodUrl: Dispatch<React.SetStateAction<string | null>>;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<ProfileWithRelations | null>(null);
    const [hoodUrl, setHoodUrl] = useState<string | null>("/asset/hoods/panda.glb");
    const [loading, setLoading] = useState<boolean>(true);

    const refreshUser = async () => {
        setLoading(true);
        try {
            const profile = await getUser();
            setUser(profile);
        } catch (error) {
            console.error('Error refreshing user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const value = {
        user,
        loading,
        refreshUser,
        hoodUrl, setHoodUrl
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}