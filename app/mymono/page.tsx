"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function MyMonoPage() {
  const [isMuted, setIsMuted] = useState(true)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const audioElement = new Audio("/information.mp3")
    audioElement.loop = true
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

  useEffect(() => {
    if (audio) {
      audio.muted = isMuted
    }
  }, [isMuted, audio])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleEnterClick = () => {
    router.push("/mymono/list")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMute}
          className="bg-amber-100 border-amber-300 hover:bg-amber-200"
        >
          {isMuted ? "🔇" : "🔊"}
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Link href="/home">
          <Button variant="outline" size="sm" className="bg-amber-100 border-amber-300 hover:bg-amber-200">
            ← マップに戻る
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-amber-50 rounded-lg shadow-2xl p-8 border-4 border-amber-300 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-800 mb-6 text-center">金の蔵</h1>

        <div className="relative w-full h-40 md:h-60 mb-8">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=300&width=500')] bg-center bg-cover opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-amber-50 bg-opacity-90 rounded-lg border border-amber-200 max-w-2xl">
              <p className="text-amber-900 text-lg md:text-xl leading-relaxed">
                ここは、勇者様がいままで整理収納したアイテムが並んでいます。どうぞ、こころゆくまでご覧になっていってください。
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleEnterClick}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-xl rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 border-2 border-amber-400"
        >
          金の蔵へ入る
        </Button>
      </div>

      <div className="mt-8 text-amber-700 text-sm">
        <p>※ 整理収納したアイテムを美術館のように展示しています</p>
      </div>
    </main>
  )
}

