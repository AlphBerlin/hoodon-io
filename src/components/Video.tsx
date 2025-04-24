import React, {useEffect, useRef, useState} from 'react'
import {Maximize2, Minimize2} from 'lucide-react'
import {Button} from "@/components/ui/button";

interface VideoProps {
    label: string
    isMinimized: boolean
    isExpanded: boolean
    onToggleExpand: () => void
    children?: React.ReactNode
}

const Video: React.FC<VideoProps> = ({
                                         label,
                                         isMinimized,
                                         isExpanded,
                                         onToggleExpand,
                                         children,
                                     }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState({x: 16, y: 16})
    const videoRef = useRef<HTMLDivElement>(null)
    const dragOffsetRef = useRef({x: 0, y: 0})

    const getCorners = () => {
        const padding = 16
        const videoWidth = 192 // md:w-48 = 192px
        const videoHeight = 144 // md:h-36 = 144px

        return [
            {x: padding, y: padding}, // Top Left
            {x: window.innerWidth - videoWidth - padding, y: padding}, // Top Right
            {x: padding, y: window.innerHeight - videoHeight - padding}, // Bottom Left
            {x: window.innerWidth - videoWidth - padding, y: window.innerHeight - videoHeight - padding}, // Bottom Right
        ]
    }

    const findNearestCorner = (mouseX: number, mouseY: number) => {
        const corners = getCorners()
        let nearestCorner = corners[0]
        let minDistance = Number.MAX_VALUE

        corners.forEach(corner => {
            const distance = Math.sqrt(
                Math.pow(mouseX - corner.x, 2) + Math.pow(mouseY - corner.y, 2)
            )
            if (distance < minDistance) {
                minDistance = distance
                nearestCorner = corner
            }
        })

        return nearestCorner
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && videoRef.current) {
                // During drag, follow the mouse position considering the initial click offset
                const newX = e.clientX - dragOffsetRef.current.x
                const newY = e.clientY - dragOffsetRef.current.y

                // Ensure the video stays within window bounds
                const videoWidth = 192
                const videoHeight = 144
                const maxX = window.innerWidth - videoWidth
                const maxY = window.innerHeight - videoHeight

                setPosition({
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY))
                })
            }
        }

        const handleMouseUp = (e: MouseEvent) => {
            if (isDragging) {
                // On release, snap to nearest corner
                const nearestCorner = findNearestCorner(e.clientX, e.clientY)
                setPosition(nearestCorner)
                setIsDragging(false)
            }
        }

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMinimized && !isExpanded && videoRef.current) {
            e.preventDefault()
            setIsDragging(true)

            // Calculate and store the offset between click position and video corner
            const rect = videoRef.current.getBoundingClientRect()
            dragOffsetRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        }
    }
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        // Ensure videoRef and dragOffsetRef are valid before proceeding
        if (isMinimized && !isExpanded && videoRef.current) {
            e.preventDefault(); // Prevent unintended behaviors like scrolling
            setIsDragging(true);

            // Get the first touch point
            const touch = e.touches[0];
            const rect = videoRef.current.getBoundingClientRect();

            // Calculate and store the offset between touch position and video corner
            dragOffsetRef.current = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        }
    };

    const videoClass = isExpanded
        ? 'fixed inset-4 md:inset-8 z-40'
        : isMinimized
            ? 'w-28 h-20 sm:w-32 sm:h-24 md:w-48 md:h-36 fixed shadow-lg rounded-lg overflow-hidden'
            : 'w-full h-full rounded-lg overflow-hidden'

    // Only apply transition when not dragging
    const transitionClass = isDragging ? '' : 'transition-all duration-300 ease-in-out'

    return (
        <div
            ref={videoRef}
            className={`${videoClass} ${transitionClass}`}
            style={{
                zIndex: isExpanded ? 10 : isMinimized ? 40 : 1,
                left: isMinimized && !isExpanded ? position.x : undefined,
                top: isMinimized && !isExpanded ? position.y : undefined,
                cursor: isMinimized && !isExpanded ? 'move' : 'default'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className="relative w-full h-full bg-gradient-to-r from-primary/50 to-secondary/50 group rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">

                    {children ? children : <span
                        className=" text-base sm:text-lg md:text-2xl transition-opacity duration-300">{label}</span>}
                </div>
                <Button
                    className="absolute top-2 right-2 bg-primary/60 dark:bg-primary/60 p-1 rounded-full opacity-100 transition-opacity duration-300 hover:bg-secondary/50"
                    onClick={onToggleExpand}
                    aria-label={isExpanded ? "Minimize" : "Maximize"}
                >
                    {isExpanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                </Button>
            </div>
        </div>
    )
}

export default Video