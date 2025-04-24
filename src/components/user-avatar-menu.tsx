'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Progress} from "@/components/ui/progress"
import {LogOut, User} from 'lucide-react'
import {useAuth} from '@/context/auth-context'
import {supabase} from '@/lib/supabase/client'
import ProfileCreationDialog from "@/app/(client)/app/profile/profile-creation-dialog";

export function UserAvatarMenu() {
    const router = useRouter()
    const {user} = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [showProfileDialog, setShowProfileDialog] = useState(false);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            router.push('/')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    // You can replace these with actual user data
    const coins = 1235
    const progress = 90
    const location = "Berlin"

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost"
                            className="relative h-12 w-fit px-2 flex items-center gap-2 hover:bg-transparent">
                        {/* Coins */}
                        {/*<div className="flex items-center gap-1">*/}
                        {/*    <div className="w-5 h-5 bg-yellow-400 rounded-full" />*/}
                        {/*    <span className="text-sm font-medium">{coins.toLocaleString()}</span>*/}
                        {/*</div>*/}

                        {/* Progress Circle */}
                        <div className="relative w-10 h-10">
                            <Progress
                                value={progress}
                                className="absolute inset-0 w-10 h-10 rounded-full [&>div]:bg-primary"
                                indicatorClassName="rounded-full"
                            />
                            <Avatar className="w-8 h-8 absolute inset-1">
                                <AvatarImage src={user?.user_metadata?.avatar_url}/>
                                <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Location */}
                        {/*<span className="text-sm font-medium">{location}</span>*/}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                            <User className="w-4 h-4 mr-2"/>
                            Profile
                        </DropdownMenuItem>
                        {/*<DropdownMenuItem onClick={() => router.push('/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </DropdownMenuItem>*/}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="w-4 h-4 mr-2"/>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProfileCreationDialog
                isOpen={showProfileDialog}
                onClose={() => setShowProfileDialog(false)}
            />
        </>

    )
}