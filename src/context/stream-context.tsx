import React, { createContext, useContext, ReactNode } from 'react';

type Status = 'loading' | 'idle' | 'rejected' | 'success';
type Nullable<T> = T | null;

interface StreamContextType {
    stream: MediaStream;
    setStream: React.Dispatch<React.SetStateAction<MediaStream>>;
    setMuted: React.Dispatch<React.SetStateAction<boolean>>;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    muted: boolean;
    visible: boolean;
    toggle: (kind: 'audio' | 'video') => () => void;
    toggleAudio: () => void;
    toggleVideo: () => void;
    isLoading: boolean;
    isError: boolean;
    hoodOn: boolean;
    isSuccess: boolean;
    toggleHoodOn: ()=>void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

function useStreamContextProvider(stream: MediaStream) {
    const [state, setState] = React.useState<MediaStream>(stream);
    const [status, setStatus] = React.useState<Status>('loading');
    const [muted, setMuted] = React.useState<boolean>(false);
    const [visible, setVisible] = React.useState<boolean>(true);
    const [hoodOn, setHoodOn] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (stream) {
            setStatus('idle');
            const [audio, video] = stream.getTracks();
            setState(stream);
        }
    }, [stream]);

    const toggle = (kind: 'audio' | 'video') => () => {
        kind === 'audio' ? setMuted(prev=>!prev) : setVisible(prev=>!prev);
    };

    const toggleAudio = toggle('audio');
    const toggleVideo = toggle('video');
    const toggleHoodOn = ()=> setHoodOn((prevState) => !prevState);

    return {
        stream: state,
        setStream: setState,
        muted,
        visible,
        toggle,
        toggleAudio,
        toggleVideo,
        isLoading: status === 'loading',
        isError: status === 'rejected',
        isSuccess: status === 'success' || status === 'idle',
        hoodOn,
        toggleHoodOn,
        setMuted,
        setVisible,
    };
}

interface StreamProviderProps {
    children: ReactNode;
    stream?: MediaStream;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({
                                                                  children,
                                                                  stream,
                                                              }) => {
    const value = useStreamContextProvider(stream!);

    return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
};

export function useStream(): StreamContextType {
    const context = useContext(StreamContext);
    if (!context) {
        throw new Error('useStreamContext must be used within a StreamProvider');
    }
    return context;
}
