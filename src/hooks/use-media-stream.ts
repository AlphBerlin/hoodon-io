import React from 'react';

type Status = 'loading' | 'idle' | 'rejected' | 'success';
type Nullable<T> = T | null;

export default function useStream(stream: Nullable<MediaStream> = null) {
    const [state, setState] = React.useState<Nullable<MediaStream>>(stream);
    const [status, setStatus] = React.useState<Status>('loading');

    const [m, setM] = React.useState(false);
    const [v, setV] = React.useState(true);
    //console.log('state stream', state);

    React.useEffect(() => {
        if (stream) {
            setStatus('idle');
            const [audio, video] = stream.getTracks();
            setState(stream)
            setM(!audio.enabled);
            setV(video?.enabled);
        } else {
            /*throw new Error(`Unsupported media stream ${stream}`);
            (async function createStream() {
                try {
                    const stream = getMediaStream()

                    setState(stream);
                    setStatus('success');
                } catch (error) {
                    setStatus('rejected');
                    console.error('Access denied for audio and video stream', error);
                }
            })();*/
        }
    }, [stream]);


    function toggle(kind: 'audio' | 'video') {
        return (s = state) => {
            //console.log('toggle stream', state);

            if (!s) throw new Error('Failed. Could not find stream');

            const track = s.getTracks().find((track) => track.kind == kind);

            if (!track)
                throw new Error(`Failed. Could not find ${kind} track in given stream`);

            if (track.enabled) {
                track.enabled = false;
                track.kind == 'audio' ? setM(true) : setV(false);
            } else {
                track.enabled = true;
                track.kind == 'audio' ? setM(false) : setV(true);
            }
        };
    }

    async function toggleVideo() {
        if (!state) throw new Error('There is no a video stream to toggle');

        const videoTrack = state.getVideoTracks()[0];

        if (videoTrack.readyState === 'live') {
            videoTrack.enabled = false;
            videoTrack.stop();
            setV(false);
        } else {
            setV(true);
        }
    }

    return {
        stream: state,
        muted: m,
        visible: v,
        toggle,
        toggleAudio: toggle('audio'),
        toggleVideo: toggle('video'),
        isLoading: status == 'loading',
        isError: status == 'rejected',
        isSuccess: status == 'success' || status == 'idle',
    };
}
