import Peer, {DataConnection} from 'peerjs';
import {USER_EVENTS} from "@/config/events";
import {supabase} from "@/lib/supabase/client";

class PeerManager {
    private static instance: PeerManager | null = null;
    private peer: Peer | null = null;
    private connection: DataConnection | null = null;
    private channelName: string | null = null;
    private peerId: string | null = null;
    private initializationPromise: Promise<void> | null = null;
    private reconnectAttempts: number = 0;
    private readonly MAX_RECONNECT_ATTEMPTS = 3;
    private isDestroyed: boolean = false;

    private constructor() {
    }

    public static getInstance(): PeerManager {
        if (!PeerManager.instance) {
            PeerManager.instance = new PeerManager();
        }
        return PeerManager.instance;
    }

    public getPeerId(): string {
        return this.peerId!;
    }

    private generateUniqueId(): string {
        return `peer_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    }

    private async createNewPeer(): Promise<void> {
        if (this.peer) {
            this.peer.destroy();
        }

        return new Promise((resolve, reject) => {
            const uniqueId = this.generateUniqueId();
            let isResolved = false;

            this.peer = new Peer(uniqueId, {
                config: {
                    iceServers: [
                        {urls: 'stun:stun.l.google.com:19302'},
                        {urls: 'stun:stun1.l.google.com:19302'},
                        {urls: 'stun:stun2.l.google.com:19302'}
                    ],
                },
                // debug: 3

            });

            // Set up timeout
            // const timeout = setTimeout(() => {
            //     if (!isResolved) {
            //         console.error('Peer initialization timeout');
            //         this.peer?.destroy();
            //         reject(new Error('Peer initialization timeout'));
            //     }
            // }, 10000);

            this.peer.on('open', (id) => {
                // clearTimeout(timeout);
                this.peerId = id;
                //console.log(`Peer successfully initialized with ID: ${id}`);
                this.reconnectAttempts = 0;
                isResolved = true;
                resolve();
            });

            this.peer.on('error', (error: any) => {
                if (!isResolved) {
                    // clearTimeout(timeout);
                    console.error('Peer error during initialization:', error);
                    isResolved = true;
                    reject(error);
                } else {
                    console.error('Peer error after initialization:', error);
                    this.handleError(error);
                }
            });

            this.peer.on('disconnected', () => {
                if (!this.isDestroyed) {
                    //console.log('Peer disconnected - attempting to reconnect...');
                    this.handleDisconnection().catch(console.error);
                }
            });

            this.peer.on('connection', this.handleConnection.bind(this));
        });
    }

    private async handleError(error: any): Promise<void> {
        if (error.type === 'peer-unavailable') {
            //console.log('Peer unavailable, attempting to reconnect...');
            return this.handleReconnection();
        } else if (error.type === 'disconnected') {
            return this.handleDisconnection();
        }
    }

    private async handleReconnection(): Promise<void> {
        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            throw new Error('Max reconnection attempts reached');
        }

        this.reconnectAttempts++;
        //console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);

        await new Promise(resolve => setTimeout(resolve, 1000 * this.reconnectAttempts));
        return this.createNewPeer();
    }

    private disconnection_retryCount = 0;

    private async handleDisconnection(): Promise<void> {
        if (!this.peer || this.isDestroyed) {
            await supabase.channel(this.channelName!).send({
                type: 'broadcast',
                event: USER_EVENTS.LEAVE,
                payload: {}
            });
            return;
        }

        try {
            if (this.disconnection_retryCount >= this.MAX_RECONNECT_ATTEMPTS) {
                //console.log(`Maximum retries (${this.MAX_RECONNECT_ATTEMPTS}) reached. Notifying failure.`);
                await supabase.channel(this.channelName!).send({
                    type: 'broadcast',
                    event: USER_EVENTS.FAILED_CONNECTION,
                    payload: {}
                });
                this.disconnection_retryCount = 0; // Reset for potential future reconnections
                return;
            }

            this.disconnection_retryCount++;
            //console.log(`Attempting reconnection - attempt ${this.disconnection_retryCount} of ${this.MAX_RECONNECT_ATTEMPTS}`);

            // Wait 1 second before attempting reconnection
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.peer.reconnect();

            // If reconnection successful, reset retry count
            this.disconnection_retryCount = 0;
            //console.log('Reconnection successful');

        } catch (error) {
            console.error(`Reconnection attempt ${this.disconnection_retryCount} failed:`, error);
            return this.handleDisconnection(); // Recursive call for next retry
        }
    }

    private handleConnection(connection: any): void {
        //console.log('New peer connection established:', connection);
        this.connection = connection;

        connection.on('open', () => {
            //console.log('Connection opened successfully');
        });

        connection.on('data', (data: any) => {
            //console.log('Received data:', data);
        });

        connection.on('error', (error: any) => {
            console.error('Connection error:', error);
        });

        connection.on('close', () => {
            //console.log('Connection closed');
            this.connection = null;
        });
    }

    public async initialize(channelName: string): Promise<void> {
        // If already initializing, return existing promise
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.isDestroyed = false;
        this.channelName = channelName;

        try {
            this.initializationPromise = this.createNewPeer();
            await this.initializationPromise;
            return this.initializationPromise;
        } catch (error) {
            this.initializationPromise = null; // Reset on error
            throw error;
        }
    }


    public terminate(): void {
        this.isDestroyed = true;
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        this.peerId = null;
        this.connection = null;
        this.channelName = null;
        this.initializationPromise = null;
        this.reconnectAttempts = 0;
        //console.log('Peer connection terminated');
    }

    public getPeer() {
        return this.peer!;
    }
}

export default PeerManager;
