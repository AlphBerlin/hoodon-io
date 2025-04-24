import { useEffect, useRef, useState, useCallback } from 'react';

interface MediaDeviceInfo {
    deviceId: string;
    kind: MediaDeviceKind;
    label: string;
}

interface UseMediaDevicesProps {
    onStreamReady?: (stream: MediaStream) => void;
    defaultAudioDevice?: string;
    defaultVideoDevice?: string;
    enabled?: boolean;
}

interface UseMediaDevicesReturn {
    audioDevices: MediaDeviceInfo[];
    videoDevices: MediaDeviceInfo[];
    currentStream: MediaStream | null;
    setAudioDevice: (deviceId: string) => Promise<void>;
    setVideoDevice: (deviceId: string) => Promise<void>;
    toggleAudio: () => void;
    toggleVideo: () => void;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    error: Error | null;
    requestPermissions: () => Promise<void>;
}

export const useMediaDevices = ({
                                    onStreamReady,
                                    defaultAudioDevice,
                                    defaultVideoDevice,
                                    enabled = true
                                }: UseMediaDevicesProps = {}): UseMediaDevicesReturn => {
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    const currentStreamRef = useRef<MediaStream | null>(null);
    const currentAudioDeviceId = useRef<string | undefined>(defaultAudioDevice);
    const currentVideoDeviceId = useRef<string | undefined>(defaultVideoDevice);

    const stopCurrentStream = useCallback(() => {
        if (currentStreamRef.current) {
            currentStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            currentStreamRef.current = null;
        }
    }, []);

    const getDevices = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const audioDevs = devices.filter(device => device.kind === 'audioinput');
            const videoDevs = devices.filter(device => device.kind === 'videoinput');

            setAudioDevices(audioDevs);
            setVideoDevices(videoDevs);

            // Set default devices if not already set
            if (!currentAudioDeviceId.current && audioDevs.length) {
                currentAudioDeviceId.current = audioDevs[0].deviceId;
            }
            if (!currentVideoDeviceId.current && videoDevs.length) {
                currentVideoDeviceId.current = videoDevs[0].deviceId;
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to enumerate devices'));
        }
    }, []);

    const initializeStream = useCallback(async () => {
        try {
            // Stop any existing stream
            stopCurrentStream();

            if (!enabled) return;

            const constraints: MediaStreamConstraints = {
                audio: currentAudioDeviceId.current ? { deviceId: currentAudioDeviceId.current } : true,
                video: currentVideoDeviceId.current ? { deviceId: currentVideoDeviceId.current } : true
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Set initial track states
            stream.getAudioTracks().forEach(track => {
                track.enabled = isAudioEnabled;
            });
            stream.getVideoTracks().forEach(track => {
                track.enabled = isVideoEnabled;
            });

            currentStreamRef.current = stream;
            onStreamReady?.(stream);

            // Refresh device list after getting permissions
            await getDevices();

            return stream;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to initialize stream'));
            throw err;
        }
    }, [enabled, isAudioEnabled, isVideoEnabled, onStreamReady, getDevices, stopCurrentStream]);

    const setAudioDevice = useCallback(async (deviceId: string) => {
        currentAudioDeviceId.current = deviceId;
        await initializeStream();
    }, [initializeStream]);

    const setVideoDevice = useCallback(async (deviceId: string) => {
        currentVideoDeviceId.current = deviceId;
        await initializeStream();
    }, [initializeStream]);

    const toggleAudio = useCallback(() => {
        if (currentStreamRef.current) {
            const audioTracks = currentStreamRef.current.getAudioTracks();
            const newState = !isAudioEnabled;
            audioTracks.forEach(track => {
                track.enabled = newState;
            });
            setIsAudioEnabled(newState);
        }
    }, [isAudioEnabled]);

    const toggleVideo = useCallback(() => {
        if (currentStreamRef.current) {
            const videoTracks = currentStreamRef.current.getVideoTracks();
            const newState = !isVideoEnabled;
            videoTracks.forEach(track => {
                track.enabled = newState;
            });
            setIsVideoEnabled(newState);
        }
    }, [isVideoEnabled]);

    const requestPermissions = useCallback(async () => {
        await initializeStream();
    }, [initializeStream]);

    // Initial setup
    useEffect(() => {
        getDevices();

        // Listen for device changes
        const handleDeviceChange = () => {
            getDevices();
        };

        navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
            stopCurrentStream();
        };
    }, [getDevices, stopCurrentStream]);

    // Handle enabled state changes
    useEffect(() => {
        if (enabled) {
            initializeStream();
        } else {
            stopCurrentStream();
        }
    }, [enabled, initializeStream, stopCurrentStream]);

    return {
        audioDevices,
        videoDevices,
        currentStream: currentStreamRef.current,
        setAudioDevice,
        setVideoDevice,
        toggleAudio,
        toggleVideo,
        isAudioEnabled,
        isVideoEnabled,
        error,
        requestPermissions
    };
};