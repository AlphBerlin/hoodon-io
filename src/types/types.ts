import {FaceLandmarkerResult} from "@mediapipe/tasks-vision";

export interface User {
  id: number
  name: string
  age: number
  bio: string
  jobTitle: string
  location: string
  flag: string
  verified: boolean
  mbti: string
  zodiac: string
  photos: string[]
  questions: { question: string; answer: string }[]
}


export interface JoinRequest {
  id: string;
  user: any;
  timestamp: number;
  timeoutId: NodeJS.Timeout;
}

export interface ChannelContextType {
  channelName: string | null;
  channelData: any | null;
  loading: boolean;
  error: string | null;
  requestJoin: (channelName: string) => void;
  subscribe: () => void;
  lobby: boolean;
  joinRequests: JoinRequest[];
  handleJoinRequest: (requestId: string, approved: boolean) => void;
}
type LandmarkFrame = {
  timestamp: number;
  landmarks: FaceLandmarkerResult;
};

export type RecordingState = {
  isRecording: boolean;
  frames: LandmarkFrame[];
  startTime: number | null;
};
export interface SpriteSheetConfig {
  cols: number;
  rows: number;
  frameCount: number;
  fps?: number;
  scale?: number;
  loop?: boolean;
  autoplay?: boolean;
}
// types.ts
export interface ColorPickerProps {
  onColorChange: (color: string) => void;
  defaultColor?: string;
}

export interface ColorVariant {
  base: string;
  variant: number;
}
