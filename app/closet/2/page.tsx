"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, Play } from "lucide-react"

export default function Stage2Page() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Create audio element
        const audio = new Audio()

        // Set up event listeners
        audio.addEventListener("canplaythrough", () => {
          setAudioLoaded(true)
          if (!isMuted) {
            audio.play().catch((e) => {
              console.log("Audio play was prevented: ", e)
              // This is often due to browser autoplay policies
            })
          }
        })

        audio.addEventListener("error", (e) => {
          console.log("Audio loading error: ", e)
          setAudioLoaded(false)
        })

        // Set properties
        audio.src = "/steptitle.mp3"
        audio.loop = true
        audio.volume = 0.7 // Set to 70% volume
        audio.muted = isMuted

        // Store reference
        audioRef.current = audio

        // Clean up
        return () => {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ""
            audioRef.current = null
          }
        }
      } catch (error) {
        console.error("Audio initialization error:", error)
      }
    }
  }, [])

  // Toggle mute
  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    if (audioRef.current) {
      audioRef.current.muted = newMutedState

      // If unmuting and audio is loaded but not playing, try to play
      if (!newMutedState && audioLoaded && audioRef.current.paused) {
        audioRef.current.play().catch((e) => {
          console.log("Audio play was prevented on unmute: ", e)
        })
      }
    }
  }

  // Handle video playback
  const playTutorial = () => {
    setShowVideo(true)

    // Pause the background music while the video is playing
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  // Handle video end
  const handleVideoEnd = () => {
    setVideoEnded(true)

    // Resume the background music when the video ends
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch((e) => console.log("Could not resume audio:", e))
    }
  }

  // Close video modal
  const closeVideo = () => {
    setShowVideo(false)

    // Resume the background music when the video is closed
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch((e) => console.log("Could not resume audio:", e))
    }
  }

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/closet">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
              ステージ 2
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
          {/* Stage title and description */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              選別の祭壇　～4つの箱～
            </h1>
            <p className="text-white text-base sm:text-lg">
              片付けの第一歩は、アイテムを分類するための「箱」を用意すること。4つの箱を準備して、選別の儀式を始めよう。
            </p>
          </div>

          {/* Box icon */}
          <div className="flex justify-center mb-8">
            <div className="text-7xl animate-pulse">🎁</div>
          </div>

          {/* Box descriptions */}
          <div className="space-y-4 mb-8">
            <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">「虚無の箱」</h3>
              <p className="text-white">断捨離の決意により、捨てるもの</p>
            </div>

            <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">「賢者の箱」</h3>
              <p className="text-white">賢く選ばれし、クローゼットへ収納されるもの</p>
            </div>

            <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">「転送の箱」</h3>
              <p className="text-white">クローゼット以外の場所へ移すもの</p>
            </div>

            <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">「運命の箱」</h3>
              <p className="text-white">今すぐ捨てることができない、いつかその運命をまつ者たちの箱</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={playTutorial}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 border border-blue-400 shadow-lg"
            >
              <Play className="h-5 w-5" />
              まずは戦い方（片付け方）を動画で予習する
            </Button>

            <Link href="/closet/2/battle">
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg border border-red-400 shadow-lg">
                戦う（片付ける）
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Video modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-teal-900 rounded-xl p-4 max-w-3xl w-full border-2 border-yellow-500 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-300">チュートリアル動画</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={closeVideo}
                className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700"
              >
                閉じる
              </Button>
            </div>

            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src="/step2_tutorial.mp4"
                controls
                autoPlay
                className="w-full h-full"
                onEnded={handleVideoEnd}
              />
            </div>

            {videoEnded && (
              <div className="mt-4 text-center">
                <p className="text-white mb-2">動画を見終わりました！準備はできましたか？</p>
                <Link href="/closet/2/battle">
                  <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold">
                    戦いに進む
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

