"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Volume2, VolumeX, ArrowLeft, Home, Upload, X, Plus, Save } from "lucide-react"

// Item type definition
type Item = {
  id: string
  image: string
  name: string
  description: string
}

export default function Stage11BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [currentItem, setCurrentItem] = useState<Partial<Item>>({
    id: "",
    image: "",
    name: "",
    description: "",
  })
  const [isAddingItem, setIsAddingItem] = useState(false)
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
    const audioElement = new Audio("/stepfight_11.mp3")
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
        setCurrentItem({
          ...currentItem,
          image: reader.result as string,
        })
      }
      reader.readAsDataURL(file)
    }

    // ファイル選択時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()

    // ファイルアップロードボタンクリック時に音声再生を試みる（ユーザーインタラクション）
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

  // Add new item
  const addItem = () => {
    if (currentItem.image && currentItem.name) {
      const newItem: Item = {
        id: Date.now().toString(),
        image: currentItem.image,
        name: currentItem.name,
        description: currentItem.description || "",
      }

      setItems([...items, newItem])
      setCurrentItem({
        id: "",
        image: "",
        name: "",
        description: "",
      })
      setIsAddingItem(false)
    }

    // アイテム追加時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Remove item
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))

    // アイテム削除時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        items,
      })

      // Navigate to clear page
      router.push("/closet/11/clear")
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
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/closet/11">
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
              記録の書庫 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">アイテムを記録する</h2>

          <p className="text-white mb-6 text-center">
            クローゼットのアイテムを写真に撮って記録しましょう。
            <br />
            アイテムの名前や説明も一緒に記録すると、後で整理しやすくなります。
          </p>

          {/* Item list */}
          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-4">記録したアイテム ({items.length})</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-teal-800 bg-opacity-50 p-3 rounded-lg border border-teal-700 relative"
                  >
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-full sm:w-24 h-24 bg-teal-900 rounded-lg overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-yellow-200 mb-1">{item.name}</h4>
                        {item.description && <p className="text-white text-sm">{item.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add item form */}
          {isAddingItem ? (
            <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-yellow-300">新しいアイテムを追加</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingItem(false)
                    tryPlayAudio()
                  }}
                  className="text-white hover:bg-teal-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="text-white font-medium block mb-2">アイテムの写真</label>

                  {currentItem.image ? (
                    <div className="relative w-full h-48 mb-2">
                      <Image
                        src={currentItem.image || "/placeholder.svg"}
                        alt="アイテムの写真"
                        fill
                        className="object-contain rounded-lg border-2 border-teal-600"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-teal-900 bg-opacity-50 rounded-lg border-2 border-dashed border-teal-600 flex flex-col items-center justify-center mb-2">
                      <Upload className="h-12 w-12 text-teal-400 mb-2" />
                      <p className="text-teal-300 text-center">写真をアップロードしてください</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={triggerFileInput}
                      className="bg-teal-700 hover:bg-teal-800 text-white w-full flex items-center justify-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      写真をアップロード
                    </Button>

                    {isMobile && (
                      <Button
                        onClick={openCamera}
                        className="bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        カメラで撮影
                      </Button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Item name */}
                <div>
                  <label htmlFor="itemName" className="text-white font-medium block mb-2">
                    アイテム名
                  </label>
                  <Input
                    id="itemName"
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    placeholder="例：黒のTシャツ、デニムパンツなど"
                    className="bg-teal-900 border-teal-600 text-white placeholder:text-teal-400"
                    onClick={tryPlayAudio}
                  />
                </div>

                {/* Item description */}
                <div>
                  <label htmlFor="itemDescription" className="text-white font-medium block mb-2">
                    説明（任意）
                  </label>
                  <Textarea
                    id="itemDescription"
                    value={currentItem.description}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    placeholder="例：お気に入りの服、よく着る服、サイズなど"
                    className="bg-teal-900 border-teal-600 text-white placeholder:text-teal-400 h-20"
                    onClick={tryPlayAudio}
                  />
                </div>

                {/* Add button */}
                <Button
                  onClick={addItem}
                  disabled={!currentItem.image || !currentItem.name}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold disabled:opacity-50"
                >
                  アイテムを追加
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => {
                setIsAddingItem(true)
                tryPlayAudio()
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 mb-6 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              新しいアイテムを追加
            </Button>
          )}

          {/* Progress indicator */}
          <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white">記録したアイテム:</span>
              <span className={`font-bold ${items.length >= 5 ? "text-green-400" : "text-yellow-300"}`}>
                {items.length} / 5 (最低目標)
              </span>
            </div>
            <div className="w-full bg-teal-950 rounded-full h-2.5 mt-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-2.5 rounded-full"
                style={{ width: `${Math.min((items.length / 5) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => {
                tryPlayAudio()
                saveRecord()
              }}
              disabled={isSaving || items.length < 1}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  記録を完了する
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

