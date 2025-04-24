'use client'
import * as React from "react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {MicIcon, MicOffIcon, SparklesIcon, VideoIcon, VideoOff} from "lucide-react";
import {PrejoinSettings} from "@/components/meet-ui/PreJoinSettings";
import {Toggle} from "@/components/ui/toggle";
import {HoodPublisher} from "@/components/HoodPublisher";
import {Loader2} from "lucide-react";
import {useStream} from "@/context/stream-context";

export interface PreJoinProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit' | 'onError'> {
    onSubmit?: (values: any) => void;
    onError?: (error: Error) => void;
    userLabel?: string;
    stream?: MediaStream;
}

export default function Prejoin({
                                    userLabel,
                                    onSubmit,
                                    onError,
                                }: PreJoinProps) {
    const [username, setUsername] = useState<string>(userLabel || "Your name");
    const [userChoices, setUserChoices] = React.useState<any>();
    const [loading, setLoading] = React.useState<boolean>(true);

    const {muted,visible, setMuted, setVisible} = useStream();

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onSubmit!(userChoices);
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-md w-full max-w-xl p-2 text-center">
                <div className="flex justify-center text-lg font-medium mb-4 text-black">
                    <div className='mr-2'>
                        Hi
                    </div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className=" border-b-2 bg-gray-200 border-gray-300 focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="relative bg-black rounded-md h-[400px] overflow-hidden">
                    {visible ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                            <div className={`relative w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                                <HoodPublisher
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                                    onCombinedStreamReady={(stream) => {
                                        // Add a small delay to ensure smooth transition
                                        setTimeout(() => setLoading(false), 100);
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                className="w-24 h-24 rounded-full"
                                src="/images/meet-avatar.svg"
                                alt="Default Avatar"
                            />
                        </div>
                    )}

                    {/* Effects Button */}
                    <div className="absolute top-4 right-4 z-30">
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-gray-800/75 hover:bg-gray-700/75 rounded-full"
                        >
                            <SparklesIcon className="text-white" />
                        </Button>
                    </div>

                    {/* Media Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
                        <Toggle
                            variant="outline"
                            className="bg-gray-800/75 hover:bg-gray-700/75 rounded-full"
                            pressed={muted}
                            onPressedChange={() => setMuted((prev) => !prev)}
                        >
                            {!muted ? <MicIcon className="text-white" /> : <MicOffIcon />}
                        </Toggle>
                        <Toggle
                            variant="outline"
                            className="bg-gray-800/75 hover:bg-gray-700/75 rounded-full"
                            pressed={!visible}
                            onPressedChange={() => setVisible(prev => !prev)}
                        >
                            {visible ? <VideoIcon className="text-white" /> : <VideoOff className="text-white" />}
                        </Toggle>
                    </div>

                    {/* Settings Button */}
                    <div className="absolute bottom-4 right-4 z-30">
                        <PrejoinSettings />
                    </div>
                </div>

                <Button
                    className="mt-6 w-full py-3"
                    variant="outline"
                    onClick={handleSubmit}
                >
                    Join meeting
                </Button>
            </div>
        </div>
    );
}