"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, VolumeX, ArrowLeft, Home, Trophy, Book } from "lucide-react"

export default function PubLobbyPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/pub.mp3")
    audioElement.loop = true
    audioElement.volume = 0.7
    setAudio(audioElement)

    try {
      audioElement.play().catch((error) => {
        console.log("Auto-play was prevented:", error)
      })
    } catch (error) {
      console.log("Audio play error:", error)
    }

    return () => {
      audioElement.pause()
      audioElement.src = ""
    }
  }, [])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (audio) {
      audio.muted = isMuted

      // ミュート解除時に再生を試みる
      if (!isMuted && audio.paused) {
        try {
          audio.play().catch((error) => {
            console.log("Play on unmute failed:", error)
          })
        } catch (error) {
          console.log("Play error:", error)
        }
      }
    }
  }, [isMuted, audio])

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // 画面タップで再生を試みる関数
  const tryPlayAudio = () => {
    if (audio && audio.paused && !isMuted) {
      try {
        audio.play().catch((error) => {
          console.log("Play on screen tap failed:", error)
        })
      } catch (error) {
        console.log("Play error:", error)
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-amber-900 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-blend-overlay"
      onClick={tryPlayAudio}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/pub">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
            酒場のロビー
          </h1>
        </div>

        <div className="flex gap-2">
          {/* BGM on/off button */}
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>

          {/* Home button */}
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
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-64px)]">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-8 text-center drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
          どこへ行きますか？
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Achievement Board Card */}
          <Link href="/pub/board" className="w-full">
            <Card className="h-full bg-gradient-to-b from-amber-800 to-amber-950 border-2 border-yellow-600 shadow-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6 flex flex-col items-center justify-between h-full">
                <Trophy className="h-16 w-16 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-yellow-300 mb-4 text-center">勇者の戦果報告ボードを見る</h3>
                <p className="text-amber-100 text-center mb-6">
                  他の冒険者たちの片付け成果を見て、モチベーションを高めましょう！
                </p>
                <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-amber-950 font-bold w-full">
                  ボードを見る
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Wisdom Book Card */}
          <Link href="/pub/tips" className="w-full">
            <Card className="h-full bg-gradient-to-b from-amber-800 to-amber-950 border-2 border-yellow-600 shadow-lg hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6 flex flex-col items-center justify-between h-full">
                <Book className="h-16 w-16 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-yellow-300 mb-4 text-center">知恵の書を見る</h3>
                <p className="text-amber-100 text-center mb-6">
                  片付けの達人たちが残した知恵と技を学び、あなたのクローゼットを最適化しましょう！
                </p>
                <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-amber-950 font-bold w-full">
                  知恵を学ぶ
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}

