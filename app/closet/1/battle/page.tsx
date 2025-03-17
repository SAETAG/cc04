"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Volume2, VolumeX, ArrowLeft, Home, Upload, Camera } from "lucide-react"

export default function Stage1BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [problems, setProblems] = useState("")
  const [ideals, setIdeals] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Check if device is mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
  }, [])

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
        audio.src = "/stepfight_1.mp3" // Updated to use stepfight_1.mp3
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

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Open camera on mobile devices
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.capture = "environment"
      fileInputRef.current.click()
    }
  }

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        imageUrl: imagePreview ? "Image uploaded" : "No image",
        problems,
        ideals,
      })

      // Navigate to clear page
      router.push("/closet/1/clear")
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
          <Link href="/closet/1">
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
              闇の扉 - 戦闘フェーズ
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
          {/* Photo upload section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-yellow-300 mb-4">今のクローゼットの写真を撮ってみよう</h2>

            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative w-full max-w-md h-64 mb-4">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="クローゼットの写真"
                    fill
                    className="object-contain rounded-lg border-2 border-teal-600"
                  />
                </div>
              ) : (
                <div className="w-full max-w-md h-64 bg-teal-800 bg-opacity-50 rounded-lg border-2 border-dashed border-teal-600 flex flex-col items-center justify-center mb-4">
                  <Upload className="h-12 w-12 text-teal-400 mb-2" />
                  <p className="text-teal-300 text-center">写真をアップロードするか、カメラで撮影してください</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={triggerFileInput}
                  className="bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  写真をアップロード
                </Button>

                {isMobile && (
                  <Button
                    onClick={openCamera}
                    className="bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    カメラで撮影
                  </Button>
                )}
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Problems section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-yellow-300 mb-2">今のクローゼットの不満点を書き出してみよう</h2>
            <p className="text-white mb-4">
              あなたのクローゼットの一番の悩みは「リバウンドラゴン」でしたね。具体的にどんなことに困っていますか？
            </p>

            <div className="bg-teal-800 bg-opacity-50 p-3 rounded-lg mb-2">
              <p className="text-teal-300 text-sm">
                例：服が多すぎて何があるか把握できない、いつも同じ服ばかり着てしまう、など
              </p>
            </div>

            <Textarea
              value={problems}
              onChange={(e) => setProblems(e.target.value)}
              placeholder="あなたの不満点を入力してください..."
              className="w-full h-32 bg-teal-800 border-teal-600 text-white placeholder:text-teal-400"
            />
          </div>

          {/* Ideals section */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-yellow-300 mb-2">理想のクローゼットを妄想して書き出してみよう</h2>
            <p className="text-white mb-4">
              あなたの一番理想の姿は「クリスタルクローゼット」でしたね。具体的にどんなクローゼットにしたいですか？
            </p>

            <div className="bg-teal-800 bg-opacity-50 p-3 rounded-lg mb-2">
              <p className="text-teal-300 text-sm">例：一目で全ての服が見渡せる、色別に整理されている、など</p>
            </div>

            <Textarea
              value={ideals}
              onChange={(e) => setIdeals(e.target.value)}
              placeholder="あなたの理想を入力してください..."
              className="w-full h-32 bg-teal-800 border-teal-600 text-white placeholder:text-teal-400"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6"
            >
              {isSaving ? "保存中..." : "記録を保存する"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

