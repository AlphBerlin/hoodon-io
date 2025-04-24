'use client'

import {useCallback, useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {User} from '@/types/types'
import {currentUser, mockUsers} from './mockData'
import ProfileStack from '@/components/ProfileStack'
import {ProfileCard} from '@/components/ProfileCard'
import RetroMatchButton from '@/components/RetroMatchButton'
import {MatchAnimation} from '@/components/MatchAnimation'
import {ConnectionRequest} from '@/components/ConnectionRequest'
import {ProfileEditor} from '@/components/ProfileEditor'
import {supabase} from "@/lib/supabase/client";
import {HOST_EVENTS, USER_EVENTS} from "@/config/events";
import {useChannel} from "@/context/channel-context";
import PeerManager from "@/lib/peer-manager";
import {updateChannel} from "@/lib/channel-api-handler";

export default function MatchMaker() {
    const [isMatched, setIsMatched] = useState(false)
    const [matchedUser, setMatchedUser] = useState<User | null>(null)
    const [findMatchTriggered, setFindMatchTriggered] = useState(false)
    const [showConnectionRequest, setShowConnectionRequest] = useState(false)
    const [inVideoCall, setInVideoCall] = useState(false)
    const [showMatchProfile, setShowMatchProfile] = useState(false)
    const {channelName, lobby} = useChannel()

    const handleMatch = useCallback((user: User) => {
        setMatchedUser(user)
        setIsMatched(true)
    }, [])

    const handleFindMatch = useCallback(() => {
        setFindMatchTriggered(true)
        setTimeout(() => {
            setFindMatchTriggered(false)
            handleMatch(mockUsers[Math.floor(Math.random() * mockUsers.length)])
        }, 2000)
    }, [handleMatch])

    const handleAnimationComplete = useCallback(() => {
        setTimeout(() => {
            setIsMatched(false)
            setShowConnectionRequest(true)
        }, 2000)
    }, [])

    const handleAcceptConnection = useCallback(async () => {
        await supabase.channel(channelName!).send({
            type: 'broadcast',
            event: USER_EVENTS.APPROVED,
            payload: {...matchedUser, requestPeer: PeerManager.getInstance().getPeerId()}
        })
        setShowConnectionRequest(false)
        setInVideoCall(true)
    }, [])

    const handleRejectConnection = useCallback(async () => {
        await supabase.channel(channelName!).send({
            type: 'broadcast',
            event: USER_EVENTS.DENIED,
            payload: matchedUser
        });
        setShowConnectionRequest(false)
        setMatchedUser(null)
    }, [])

    const handleEndCall = useCallback(() => {
        setInVideoCall(false)
        setMatchedUser(null)
    }, [])

    const handleViewMatch = useCallback(() => {
        setShowMatchProfile(true)
    }, [])


    useEffect(() => {
        if(lobby){
            //console.log(`lobby ${lobby}`)
            setMatchedUser({
                age: 0,
                bio: "",
                flag: "",
                id: 0,
                jobTitle: "",
                location: "",
                mbti: "",
                photos: [],
                questions: [],
                verified: false,
                zodiac: "",
                name:'hello helo0'})
            setIsMatched(true)
        }
    }, [lobby]);
    return (
        <div className={'w-full max-w-6xl flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8'}>
            <div className="w-full sm:w-1/2 flex flex-col items-center">
                <div className="mb-6 sm:hidden w-full max-w-[200px]">
                    <RetroMatchButton onClick={handleFindMatch}/>
                </div>
                <ProfileStack users={mockUsers} onMatch={handleMatch} findMatchTriggered={findMatchTriggered}/>
                <div className="mt-8 hidden sm:block">
                    <RetroMatchButton onClick={handleFindMatch}/>
                </div>
            </div>

            <AnimatePresence>
                {isMatched && matchedUser && (
                    <MatchAnimation
                        matchedUser={matchedUser.name}
                        customText="It's a Boo-tiful Match!"
                        textColor="#4ade80"
                        onAnimationComplete={handleAnimationComplete}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showConnectionRequest && matchedUser && (
                    <ConnectionRequest
                        user={matchedUser}
                        onAccept={handleAcceptConnection}
                        onReject={handleRejectConnection}
                    />
                )}
            </AnimatePresence>

            {/*<AnimatePresence>*/}
            {/*  {inVideoCall && matchedUser && (*/}
            {/*    <Meet user={matchedUser} onEndCall={handleEndCall} />*/}
            {/*  )}*/}
            {/*</AnimatePresence>*/}


            <AnimatePresence>
                {showMatchProfile && matchedUser && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <div className="rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <ProfileCard user={matchedUser} onViewMatch={() => setShowMatchProfile(false)}/>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

