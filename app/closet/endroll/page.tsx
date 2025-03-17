"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Home, Zap, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

export default function Endroll() {
  const router = useRouter();
  const [audioPlayed, setAudioPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false); // 🔥 最初からBGMをオン
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    audioRef.current = new Audio("/endroll.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.muted = isMuted; // 🔥 ミュート状態を反映

    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setAudioPlayed(true);
            console.log("Audio playing successfully");
          })
          .catch((error) => {
            if (error.name !== "AbortError") {
              console.error("Audio playback failed:", error);
            }
          });
      }
    };

    playAudio();

    // iOS Safariなどでの自動再生制限対策
    document.addEventListener("click", playAudio, { once: true });

    return () => {
      document.removeEventListener("click", playAudio);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isMuted, volume]);

  const handleBackToHome = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    router.push("/home");
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      audioRef.current.muted = !isMuted; // 🔥 ミュート状態を反映
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* 音量コントロール */}
      <div className="fixed bottom-4 right-4 bg-gray-800 rounded-full p-2 shadow-lg z-50">
        <button
          onClick={toggleMute}
          className="text-white hover:text-yellow-400 transition-colors"
          aria-label={isMuted ? "ミュート解除" : "ミュート"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>
    </div>
  );
}
