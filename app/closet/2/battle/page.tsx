"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Volume2, VolumeX, ArrowLeft, Home, CheckCircle2 } from "lucide-react"

export default function Stage2BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [boxesReady, setBoxesReady] = useState([false, false, false, false])
  const [isSaving, setIsSaving] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()

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
        audio.src = "/stepfight_2.mp3" // Updated to use stepfight_2.mp3
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

  // Toggle box ready state
  const toggleBoxReady = (index: number) => {
    const newBoxesReady = [...boxesReady]
    newBoxesReady[index] = !newBoxesReady[index]
    setBoxesReady(newBoxesReady)
  }

  // Check if all boxes are ready
  const allBoxesReady = boxesReady.every((ready) => ready)

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        boxesReady,
      })

      // Navigate to clear page
      router.push("/closet/2/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
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
          <Link href="/closet/2">
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
              選別の祭壇 - 戦闘フェーズ
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
      <main className="flex-1 flex flex-col items-center p-4 overflow-auto">
        <div className="max-w-2xl w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">4つの箱を用意しよう</h2>

          <p className="text-white mb-6 text-center">
            箱、袋、またはスペースを4つ用意して、アイテムを分類する準備をしましょう。
            <br />
            用意できたらチェックを入れてください。
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
              <Checkbox
                id="box1"
                checked={boxesReady[0]}
                onCheckedChange={() => toggleBoxReady(0)}
                className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6"
              />
              <div className="flex-1">
                <label htmlFor="box1" className="text-lg font-bold text-yellow-300 cursor-pointer">
                  「虚無の箱」
                </label>
                <p className="text-white text-sm">断捨離の決意により、捨てるもの</p>
              </div>
              {boxesReady[0] && <CheckCircle2 className="h-6 w-6 text-green-400" />}
            </div>

            <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
              <Checkbox
                id="box2"
                checked={boxesReady[1]}
                onCheckedChange={() => toggleBoxReady(1)}
                className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6"
              />
              <div className="flex-1">
                <label htmlFor="box2" className="text-lg font-bold text-yellow-300 cursor-pointer">
                  「賢者の箱」
                </label>
                <p className="text-white text-sm">賢く選ばれし、クローゼットへ収納されるもの</p>
              </div>
              {boxesReady[1] && <CheckCircle2 className="h-6 w-6 text-green-400" />}
            </div>

            <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
              <Checkbox
                id="box3"
                checked={boxesReady[2]}
                onCheckedChange={() => toggleBoxReady(2)}
                className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6"
              />
              <div className="flex-1">
                <label htmlFor="box3" className="text-lg font-bold text-yellow-300 cursor-pointer">
                  「転送の箱」
                </label>
                <p className="text-white text-sm">クローゼット以外の場所へ移すもの</p>
              </div>
              {boxesReady[2] && <CheckCircle2 className="h-6 w-6 text-green-400" />}
            </div>

            <div className="flex items-center space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
              <Checkbox
                id="box4"
                checked={boxesReady[3]}
                onCheckedChange={() => toggleBoxReady(3)}
                className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6"
              />
              <div className="flex-1">
                <label htmlFor="box4" className="text-lg font-bold text-yellow-300 cursor-pointer">
                  「運命の箱」
                </label>
                <p className="text-white text-sm">今すぐ捨てることができない、いつかその運命をまつ者たちの箱</p>
              </div>
              {boxesReady[3] && <CheckCircle2 className="h-6 w-6 text-green-400" />}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !allBoxesReady}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "保存中..." : "準備完了！"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

