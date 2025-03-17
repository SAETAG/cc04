"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Volume2, VolumeX, User, LogOut, Send, Scroll, X } from "lucide-react"

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [userMessage, setUserMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { sender: "mo-chan", text: "おかたづけのことならなんでも相談してね！" },
  ])
  const [currentQuest, setCurrentQuest] = useState("クローゼット王国を救え！")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

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
        audio.src = "/home.mp3"
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

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages])

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

  // Toggle chat bubble
  const toggleChat = () => {
    setShowChat(!showChat)
    // Focus the input when opening chat
    if (!showChat && chatInputRef.current) {
      setTimeout(() => {
        chatInputRef.current?.focus()
      }, 300)
    }
  }

  // Close chat bubble
  const closeChat = () => {
    setShowChat(false)
  }

  // Handle chat form submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userMessage.trim()) {
      // Add user message
      setChatMessages([...chatMessages, { sender: "user", text: userMessage }])

      // Simulate Mo-chan's response after a short delay
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "mo-chan",
            text: "なるほど！お片付けの相談ですね。もう少し詳しく教えてもらえますか？",
          },
        ])
      }, 1000)

      // Clear input
      setUserMessage("")
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

        <h1 className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
          Closet Chronicle
        </h1>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Link href="/user">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Current Quest Bar */}
      <div className="bg-gradient-to-r from-teal-800 via-purple-800 to-teal-800 border-b-2 border-yellow-500 p-2 px-4 flex items-center shadow-md">
        <div className="flex items-center space-x-2">
          <Scroll className="h-5 w-5 text-yellow-300" />
          <span className="text-white font-medium text-sm sm:text-base">現在のクエスト：</span>
          <span className="text-yellow-300 font-bold text-sm sm:text-base drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]">
            {currentQuest}
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col relative">
        {/* Map area */}
        <div className="flex-1 p-3 relative">
          <div className="relative w-full h-[calc(100vh-8rem)] rounded-lg overflow-hidden border-2 border-purple-400 shadow-lg">
            {/* Map background */}
            <div className="absolute inset-0">
              <Image src="/map.webp" alt="クローゼット王国の地図" fill className="object-cover" priority />
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-400 z-10"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-400 z-10"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-400 z-10"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-400 z-10"></div>

            {/* Map locations in triangle formation */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Information Center - Top */}
              <Link
                href="/information"
                className="absolute top-[20%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 cursor-pointer">
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-20 animate-pulse rounded-lg"></div>
                  <div className="absolute inset-0 border-2 border-yellow-500 rounded-lg"></div>
                  <Image
                    src="/information.webp"
                    alt="案内所"
                    width={80}
                    height={80}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="rpg-nameplate mt-1 bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900">
                  <p className="text-white text-center text-xs sm:text-sm">案内所</p>
                </div>
              </Link>

              {/* Gold Storage - Top Left */}
              <Link
                href="/mymono"
                className="absolute top-[30%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 cursor-pointer">
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-20 animate-pulse rounded-lg"></div>
                  <div className="absolute inset-0 border-2 border-yellow-500 rounded-lg"></div>
                  <Image
                    src="/mymono.webp"
                    alt="金の蔵"
                    width={80}
                    height={80}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="rpg-nameplate mt-1 bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900">
                  <p className="text-white text-center text-xs sm:text-sm">金の蔵</p>
                </div>
              </Link>

              {/* Closet Kingdom - Bottom Left */}
              <Link
                href="/closet"
                className="absolute top-[65%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 cursor-pointer">
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-20 animate-pulse rounded-lg"></div>
                  <div className="absolute inset-0 border-2 border-yellow-500 rounded-lg"></div>
                  <Image
                    src="/kingdom.webp"
                    alt="クローゼット王国"
                    width={80}
                    height={80}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="rpg-nameplate mt-1 bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900">
                  <p className="text-white text-center text-xs sm:text-sm">クローゼット王国</p>
                </div>
              </Link>

              {/* Pub - Bottom Right - Moved more to the left */}
              <Link
                href="/pub"
                className="absolute top-[65%] left-[65%] transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 z-10"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 cursor-pointer">
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-20 animate-pulse rounded-lg"></div>
                  <div className="absolute inset-0 border-2 border-yellow-500 rounded-lg"></div>
                  <Image
                    src="/pub.webp"
                    alt="酒場"
                    width={80}
                    height={80}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="rpg-nameplate mt-1 bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900">
                  <p className="text-white text-center text-xs sm:text-sm">酒場</p>
                </div>
              </Link>

              {/* Mo-chan character inside the map */}
              <div className="absolute bottom-[10%] right-[10%] z-20">
                <div className="relative">
                  {/* Chat bubble */}
                  {showChat && (
                    <div className="absolute bottom-full right-0 mb-2 w-64 sm:w-72 bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-3 shadow-lg border-2 border-yellow-500 chat-bubble">
                      {/* Close button */}
                      <button
                        onClick={closeChat}
                        className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-colors duration-200 border border-yellow-400 shadow-md"
                        aria-label="チャットを閉じる"
                      >
                        <X className="h-3 w-3" />
                      </button>

                      <div className="max-h-48 overflow-y-auto pr-1 mb-2 mt-3 chat-messages">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : ""}`}>
                            <div
                              className={`inline-block p-2 rounded-lg ${
                                msg.sender === "user"
                                  ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md"
                                  : "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>

                      <form onSubmit={handleChatSubmit} className="flex gap-1">
                        <Input
                          ref={chatInputRef}
                          type="text"
                          placeholder="メッセージを入力..."
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          className="flex-1 bg-purple-100 border-purple-300 text-purple-900 text-sm"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* Mo-chan */}
                  <div
                    className="relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer rounded-full overflow-hidden"
                    style={{ animation: "rpg-float 3s ease-in-out infinite" }}
                    onClick={toggleChat}
                  >
                    <div className="absolute -inset-1 rounded-full bg-purple-500 bg-opacity-30 animate-pulse"></div>
                    <Image
                      src="/cow-fairy.webp"
                      alt="片付けの妖精モーちゃん"
                      fill
                      className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

