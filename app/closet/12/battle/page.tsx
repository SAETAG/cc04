"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Volume2, VolumeX, ArrowLeft, Home, Camera, Upload, Save } from "lucide-react"

export default function Stage12BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [closetImage, setClosetImage] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Check if device is mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
  }, [])

  // シンプルな音声初期化
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const audioElement = new Audio("/stepfight_12.mp3")
        audioElement.loop = true
        audioElement.volume = 0.7
        audioElement.preload = "auto"

        // オーディオの読み込み状態を監視
        audioElement.addEventListener("canplaythrough", () => {
          setAudioLoaded(true)
          console.log("Audio loaded and ready to play")
        })

        audioElement.addEventListener("error", (e) => {
          console.error("Audio loading error:", e)
        })

        setAudio(audioElement)

        return () => {
          audioElement.pause()
          audioElement.src = ""
          setAudio(null)
        }
      } catch (error) {
        console.error("Audio initialization error:", error)
      }
    }
  }, [])

  // ページ表示後に一度だけ再生を試みる
  useEffect(() => {
    if (audio && audioLoaded) {
      // モバイルでは自動再生できないことが多いが、一応試みる
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Initial auto-play was prevented:", error)
          // エラーは想定内なので何もしない
        })
      }
    }
  }, [audio, audioLoaded])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (audio) {
      audio.muted = isMuted

      // ミュート解除時に再生を試みる
      if (!isMuted && audio.paused && audioLoaded) {
        const playPromise = audio.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Play on unmute failed:", error)
          })
        }
      }
    }
  }, [isMuted, audio, audioLoaded])

  // 画面タップで再生を試みる関数
  const tryPlayAudio = () => {
    if (audio && audio.paused && !isMuted && audioLoaded) {
      // ユーザーインタラクションの中で再生を試みる（モバイルで重要）
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Play on screen tap failed:", error)
        })
      }
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setClosetImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }

    // ファイル選択時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()

    // ボタンクリック時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Open camera on mobile devices
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.capture = "environment"
      fileInputRef.current.click()
    }

    // カメラボタンクリック時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    // 保存ボタンクリック時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        closetImage,
        description,
      })

      // Navigate to clear page
      router.push("/closet/12/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col" onClick={tryPlayAudio}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-950 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/closet/12">
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
              封印の間 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">完成の証を残す</h2>

          <p className="text-white mb-6 text-center">
            整理整頓が完了したクローゼットの写真を撮って、あなたの成果を記録しましょう。
            <br />
            この写真は、あなたの達成の証となります。
          </p>

          {/* Closet image upload */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">クローゼットの写真</h3>

            {closetImage ? (
              <div className="relative w-full h-64 sm:h-80 mb-4">
                <Image
                  src={closetImage || "/placeholder.svg"}
                  alt="整理されたクローゼット"
                  fill
                  className="object-contain rounded-lg border-2 border-teal-600"
                />
              </div>
            ) : (
              <div className="w-full h-64 sm:h-80 bg-teal-800 bg-opacity-50 rounded-lg border-2 border-dashed border-teal-600 flex flex-col items-center justify-center mb-4">
                <Camera className="h-16 w-16 text-teal-400 mb-4" />
                <p className="text-teal-300 text-center px-4">
                  整理整頓が完了したクローゼットの写真をアップロードしてください
                  <br />
                  <span className="text-sm opacity-80">
                    ビフォー・アフターの比較ができるよう、最初のステージと同じアングルで撮ると効果的です
                  </span>
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={triggerFileInput}
                className="bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-2 w-full"
              >
                <Upload className="h-4 w-4" />
                写真をアップロード
              </Button>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* Title and description */}
          <div className="space-y-4 mb-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">感想・メモ</h3>

            <div>
              <label htmlFor="description" className="text-white font-medium block mb-2">
                感想・メモ（任意）
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例：片付けてみて感じたこと、工夫したポイント、今後の目標など"
                className="bg-teal-800 border-teal-600 text-white placeholder:text-teal-400 h-32"
                onClick={tryPlayAudio}
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !closetImage}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  完成を記録する
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

