"use client";

import { useEffect, useRef, useState } from "react";
import DrawLandmarkCanvas from "./DrawLandmarkCanvas";
import AvatarCanvas from "./AvatarCanvas";
import FaceLandmarkManager from "@/lib/class/FaceLandmarkManager";
import avatarManager from "@/lib/class/AvatarManager";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

const FaceLandmarkCanvas = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef(0);
  const [avatarView, setAvatarView] = useState(true);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [modelUrl, setModelUrl] = useState(
    '/asset/raccoon-ex.glb'
  );
  const [videoSize, setVideoSize] = useState<{
    width: number;
    height: number;
  }>();

  const toggleAvatarView = () => setAvatarView((prev) => !prev);
  const toggleAvatarCreatorView = () => setShowAvatarCreator((prev) => !prev);
  const handleAvatarCreationComplete = (url: string) => {
    setModelUrl(url);
    toggleAvatarCreatorView();
  };

  const animate = () => {
    if (
      videoRef.current &&
      videoRef.current.currentTime !== lastVideoTimeRef.current
    ) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      try {
        const faceLandmarkManager = FaceLandmarkManager.getInstance();
        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
      } catch (e) {
        console.error(e);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const getUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setVideoSize({
              width: videoRef.current!.offsetWidth,
              height: videoRef.current!.offsetHeight,
            });
            videoRef.current!.play();

            // Start animation once video is loaded
            requestRef.current = requestAnimationFrame(animate);
          };
        }
      } catch (e) {
        console.error(e);
        alert("Failed to load webcam!");
      }
    };
    getUserCamera();

    return () => cancelAnimationFrame(requestRef.current);
  }, []);
  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setModelUrl(url);
  };
  //console.log("rerender",avatarManager.getInstance().getScene(), avatarManager.getInstance().isModelLoaded);
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-10 mt-5 mb-10">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">3D Model</Label>
          <Input id="picture" type="file" onChange={handleFileChange} accept={'.glb'}/>
        </div>
      </div>
      <div className="flex justify-center">
        <video
            className="w-full h-auto"
            ref={videoRef}
            loop={true}
            muted={true}
          autoPlay={true}
          playsInline={true}
        ></video>
        {videoSize && (
          <>
            {avatarView ? (
              <AvatarCanvas
                width={videoSize.width}
                height={videoSize.height}
                url={modelUrl}
              />
            ) : (
              <DrawLandmarkCanvas
                width={videoSize.width}
                height={videoSize.height}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FaceLandmarkCanvas;
