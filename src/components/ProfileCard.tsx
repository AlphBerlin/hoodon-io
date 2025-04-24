import { Edit, Eye } from 'lucide-react'
import { User } from '@/types/types'
import { PhotoCarousel } from './PhotoCarousel'
import { Button } from '@/components/ui/button'

interface ProfileCardProps {
    user: User
    isCurrentUser?: boolean
    onEdit?: () => void
    onViewMatch?: () => void
    className?: string
}

export function ProfileCard({
                                user,
                                isCurrentUser = false,
                                onEdit,
                                onViewMatch,
                                className = '',
                            }: ProfileCardProps) {
    return (
        <div className={`w-full h-full rounded-xl overflow-hidden bg-background  shadow-xl ${className}`}>
            <div className="relative h-full">
                <div className="absolute inset-0 z-20">
                    <div className="relative">
                        <PhotoCarousel photos={user.photos} />
                        {isCurrentUser && onEdit && (
                            <Button
                                onClick={onEdit}
                                className="absolute top-2 right-2 p-2 rounded-full shadow-md"
                            >
                                <Edit size={20} />
                            </Button>
                        )}
                        {!isCurrentUser && onViewMatch && (
                            <Button
                                onClick={onViewMatch}
                                className="absolute top-2 left-2 p-2 rounded-full shadow-md"
                            >
                                <Eye size={20} />
                            </Button>
                        )}
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-3xl font-semibold">{user.name}</h3>
                            {user.verified && (
                                <div className="text-cyan-400 text-xl">✓</div>
                            )}
                        </div>
                        <p className="text-lg opacity-90">{user.jobTitle}</p>
                        <div className="flex items-center gap-1 text-lg opacity-90">
                            <span>{user.location}</span>
                            {user.flag && <span>{user.flag}</span>}
                        </div>
                        <div className="flex gap-2 mt-3">
                            {user.mbti && (
                                <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-sm font-medium">
                  {user.mbti}
                </span>
                            )}
                            {user.zodiac && (
                                <span className="px-3 py-1 rounded-full bg-pink-400/20 text-pink-400 text-sm font-medium">
                  {user.zodiac}
                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}