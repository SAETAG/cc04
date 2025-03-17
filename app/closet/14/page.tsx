"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, CassetteTapeIcon as Tape } from "lucide-react"

export default function Stage14() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/steptitle.mp3")
    audioRef.current.play().catch((error) => console.error("Audio playback failed:", error))

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleStartBattle = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    router.push("/closet/14/battle")
  }

  const handleShowVideo = () => {
    setShowVideo(true)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const handleCloseVideo = () => {
    setShowVideo(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch((error) => console.error("Audio playback failed:", error))
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
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
              収納王国
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
        <div className="max-w-4xl w-full bg-gradient-to-r from-purple-900/80 to-teal-900/80 p-6 rounded-lg border-2 border-yellow-400 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              「ここに 'モノの住所' を定め、収納王国に秩序をもたらせ！ これが未来への鍵だ。」
            </h2>

            <div className="bg-purple-900/50 p-4 rounded-lg border border-teal-400 mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">ミッション:</h3>
              <p className="text-lg text-white">衣装ケースやひきだしに、ラベリングする</p>
              <div className="flex justify-center mt-3">
                <Tape className="h-16 w-16 text-yellow-300" />
              </div>

              <div className="mt-4 text-left">
                <h4 className="font-semibold mb-2 text-white">ラベリングのコツ:</h4>
                <ul className="list-disc pl-5 space-y-1 text-white">
                  <li>写真や色分けを活用する</li>
                  <li>ラベルは見やすい位置に貼る</li>
                  <li>収納内容が変わったら、ラベルも更新する</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={handleShowVideo}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-6 rounded-lg border border-blue-400 shadow-lg transition duration-300"
              >
                チュートリアルを見る
              </button>

              <button
                onClick={handleStartBattle}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-2 px-6 rounded-lg border border-red-400 shadow-lg transition duration-300 animate-pulse"
              >
                最終決戦開始！
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Video modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-purple-900 to-teal-900 p-4 rounded-lg border-2 border-yellow-400 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-300">チュートリアルビデオ</h3>
              <button
                onClick={handleCloseVideo}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full rounded-lg"
                controls
                autoPlay
                poster="/placeholder.svg?height=400&width=600"
              >
                <source src="/step14_tutorial.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

