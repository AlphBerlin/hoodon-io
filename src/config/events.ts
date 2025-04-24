export const USER_EVENTS = {
    TOGGLE_VIDEO: 'user:toggle-video',
    TOGGLED_VIDEO: 'user:toggled-video',
    TOGGLE_AUDIO: 'user:toggle-audio',
    TOGGLED_AUDIO: 'user:toggled-audio',
    STOP_SHARE_SCREEN: 'user:stop-share-screen',
    STOPPED_SHARE_SCREEN: 'user:stopped-share-screen',
    SHARE_SCREEN: 'user:share-screen',
    SHARED_SCREEN: 'user:shared-screen',
    LEAVE: 'user:leave',
    LEFT: 'user:left',
    JOIN: 'user:join',
    JOINED: 'user:joined',
    APPROVED: 'user:approved',
    DENIED: 'user:denied',
    REQUEST_JOIN: 'user:request-join',
    FAILED_CONNECTION: 'user:failed-connection',
    REMOVE_CONNECTION: 'user:remove-connection',
}

export const HOST_EVENTS = {
    MUTE_USER: 'host:mute-user',
    MUTED_USER: 'host:muted-user',
    REMOVE_USER_SHARED_SCREEN: 'host:remove-user-shared-screen',
    REMOVED_USER_SHARED_SCREEN: 'host:removed-user-shared-screen',
    ACCEPT_INVITE: 'host:accept-invite',
}

export const ROOM_EVENTS = {
    JOIN: 'room:join',
    JOINED: 'room:joined',
    READY: 'room:ready',
}

export const CHAT_EVENTS = {
    POST: 'chat:post',
    GET: 'chat:get',
}

export const channels ={
    room: (roomId:string) => `room:${roomId}`
}