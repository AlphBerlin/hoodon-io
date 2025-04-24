'use client'

import {useEffect, useRef, useState} from 'react'
import {motion} from 'framer-motion'
import {format} from 'date-fns'
import {Camera, Loader2, MapPin} from 'lucide-react'
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useLocation} from '@/hooks/useLocation'
import {DatePicker} from "@/components/ui/date-picker"
import {addProfile, updateProfile} from "@/lib/user-api-handler";
import {useAuth} from "@/context/auth-context";
import {CreateProfileDto, UpdateProfileDto} from "@/types/database";
import {useUser} from "@/context/user-context";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {storageService} from "@/lib/supabase/client";

interface BasicInfoFormProps {
    onComplete: () => void
}

export function BasicInfoForm({onComplete}: BasicInfoFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        dateOfBirth: undefined as Date | undefined,
        location: '',
        avatar_url: '',
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const {location, loading: locationLoading, error: locationError, updateLocation} = useLocation()
    const {user} = useAuth()
    const {user: userProfile, refreshUser} = useUser()
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (user) {
            // Try to get location from auth provider metadata if available
            const userMetadata = user.user_metadata
            setFormData(prev => ({
                ...prev,
                name: user.user_metadata?.full_name || prev.name,
                avatar_url: user.user_metadata?.avatar_url || prev.avatar_url,
                location: userMetadata?.location || prev.location,
            }))
        }
    }, [user])

    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.display_name,
                gender: userProfile.gender || '',
                dateOfBirth: userProfile.birth_date ? new Date(userProfile.birth_date) : undefined,
                location: userProfile.location || '',
                avatar_url: userProfile.avatar_url || '',
            })
        }
    }, [userProfile])

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            // Assuming you have a function to upload to your storage
            const result = await storageService.uploadAvatar(user!.id, file)
            if (result.error) {
                console.error('Avatar upload failed:', result.error)
                return
            }
            setFormData(prev => ({...prev, avatar_url: result.publicUrl || ''}))
        } catch (error) {
            console.error('Error uploading avatar:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            let profileData :any = {
                user_id: user!.id,
                display_name: formData.name,
                bio: userProfile?.bio || null,
                gender: formData.gender,
                birth_date: formData.dateOfBirth ? format(formData.dateOfBirth, 'yyyy-MM-dd') : null,
                location: formData.location,
                avatar_url: formData.avatar_url,
            }

            if (userProfile?.id) {
                profileData.id = userProfile.id
                await updateProfile(profileData as UpdateProfileDto)
            } else {
                await addProfile(profileData as CreateProfileDto)
            }

            await refreshUser()
            onComplete()
        } catch (error) {
            console.error('Error saving profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const isValid = formData.name && formData.gender && formData.dateOfBirth

    useEffect(() => {
        if (location) {
            setFormData(prev => ({...prev, location}))
        }
    }, [location])

    return (
        <div className="w-full flex items-center justify-center p-4">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="w-full overflow-hidden"
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Avatar */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="flex justify-center"
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="relative group cursor-pointer"
                                         onClick={() => fileInputRef.current?.click()}>
                                        <Avatar className="w-24 h-24 border-4 border-secondary/20">
                                            <AvatarImage src={formData.avatar_url} />
                                            <AvatarFallback>
                                                {formData.name?.charAt(0)?.toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            {uploading ? (
                                                <Loader2 className="w-6 h-6 text-white animate-spin"/>
                                            ) : (
                                                <Camera className="w-6 h-6 text-white"/>
                                            )}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Click to update avatar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </motion.div>

                    {/* Rest of the form fields remain the same */}
                    <div className="space-y-6">
                        {/* Location */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.1}}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Where are you located?</h2>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                                    className="h-12 text-base rounded-xl focus:ring-2 focus:ring-secondary/25 focus:border-secondary transition-all duration-200"
                                    placeholder="Your location"
                                />
                                <Button
                                    type="button"
                                    onClick={updateLocation}
                                    className="h-12 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary"
                                    disabled={locationLoading}
                                >
                                    {locationLoading ? <Loader2 className="w-5 h-5 animate-spin"/> :
                                        <MapPin className="w-5 h-5"/>}
                                </Button>
                            </div>
                            {locationError && <p className="text-sm text-destructive mt-2">{locationError}</p>}
                        </motion.div>

                        {/* Name */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.2}}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">What's your name?*</h2>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                className="h-12 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-secondary/25 focus:border-secondary transition-all duration-200"
                                placeholder="Your name"
                                required
                            />
                        </motion.div>

                        {/* Gender */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.3}}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">What's your gender?*</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    {value: 'male', icon: '♂️', label: 'Male'},
                                    {value: 'female', icon: '♀️', label: 'Female'},
                                    {value: 'non-binary', icon: '⚧', label: 'Non-Binary'},
                                ].map((option) => (
                                    <motion.button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({...prev, gender: option.value}))}
                                        className={`aspect-square rounded-xl p-4 flex flex-col items-center justify-center border-2 transition-all duration-200 hover:bg-secondary/5 ${
                                            formData.gender === option.value
                                                ? 'border-secondary bg-secondary/10 shadow-lg shadow-secondary/20'
                                                : 'border-gray-200'
                                        }`}
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <span className="text-2xl mb-2">{option.icon}</span>
                                        <span className="text-sm">{option.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Date of Birth */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.4}}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">What's your date of birth?*</h2>
                            <DatePicker
                                value={formData.dateOfBirth}
                                onChange={(date) => setFormData(prev => ({...prev, dateOfBirth: date}))}
                                className="h-12 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-secondary/25 focus:border-secondary transition-all duration-200"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.6}}
                    >
                        <Button
                            type="submit"
                            disabled={loading || !isValid}
                            className="w-full h-12 text-base rounded-xl bg-secondary text-white hover:bg-secondary/90
                            disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-200
                            shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                    Confirming...
                                </div>
                            ) : (
                                'CONFIRM'
                            )}
                        </Button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    )
}