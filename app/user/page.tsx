"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Volume2, VolumeX, ArrowLeft, Home, Edit2, Check } from "lucide-react"

export default function UserPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [userName, setUserName] = useState("勇者名")
  const [tempName, setTempName] = useState(userName)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 職業、ボス、最終報酬の情報（実際のアプリではこれらはデータベースやローカルストレージから取得する）
  const userInfo = {
    job: "断捨離の剣士",
    boss: "リバウンドラゴン",
    reward: "クリスタルクローゼット",
  }

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
        audio.src = "/home.mp3" // ホームと同じBGMを使用
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

  // 名前編集モードを開始
  const startEditName = () => {
    setIsEditingName(true)
    setTempName(userName)
    // 入力フィールドにフォーカスを当てる
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  // 名前を保存
  const saveName = () => {
    if (tempName.trim()) {
      setUserName(tempName)
    }
    setIsEditingName(false)
  }

  // Enterキーで保存
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveName()
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
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
            ユーザー情報
          </h1>
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
        <div className="max-w-md w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
          {/* User avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 bg-teal-800 rounded-full border-2 border-yellow-500 flex items-center justify-center overflow-hidden">
              <div className="text-4xl">👤</div>
            </div>
          </div>

          {/* User info */}
          <div className="space-y-4">
            {/* User name - editable */}
            <div className="flex items-center justify-between bg-teal-800 p-3 rounded-lg border border-teal-700">
              <span className="text-white font-medium">プレイヤーネーム：</span>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="bg-teal-700 border-teal-600 text-white w-32"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={saveName}
                      className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-teal-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-300 font-bold">{userName}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={startEditName}
                      className="h-8 w-8 text-teal-300 hover:text-teal-200 hover:bg-teal-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Job */}
            <div className="flex items-center justify-between bg-teal-800 p-3 rounded-lg border border-teal-700">
              <span className="text-white font-medium">職業：</span>
              <span className="text-yellow-300 font-bold">{userInfo.job}</span>
            </div>

            {/* Boss */}
            <div className="flex items-center justify-between bg-teal-800 p-3 rounded-lg border border-teal-700">
              <span className="text-white font-medium">ボス：</span>
              <span className="text-yellow-300 font-bold">{userInfo.boss}</span>
            </div>

            {/* Reward */}
            <div className="flex items-center justify-between bg-teal-800 p-3 rounded-lg border border-teal-700">
              <span className="text-white font-medium">最終報酬：</span>
              <span className="text-yellow-300 font-bold">{userInfo.reward}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

