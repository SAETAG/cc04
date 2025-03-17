"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Volume2, VolumeX, ArrowLeft, Star, Lock, Home, Send, X } from "lucide-react"

// Define the stages
const stages = [
  { id: 1, name: "闇の扉", icon: "🚪", unlocked: true },
  { id: 2, name: "選別の祭壇", icon: "🎁", unlocked: false },
  { id: 3, name: "虚無の広間", icon: "📦", unlocked: false },
  { id: 4, name: "選ばれし者", icon: "💖", unlocked: false },
  { id: 5, name: "断捨離の審判", icon: "🗑️", unlocked: false },
  { id: 6, name: "未練の洞窟", icon: "💭", unlocked: false },
  { id: 7, name: "限界の迷宮", icon: "🏰", unlocked: false },
  { id: 8, name: "秩序の神殿", icon: "🌈", unlocked: false },
  { id: 9, name: "時の洞窟", icon: "⏳", unlocked: false },
  { id: 10, name: "最適化の聖域", icon: "📍", unlocked: false },
  { id: 11, name: "記録の書庫", icon: "📖", unlocked: false },
  { id: 12, name: "封印の間", icon: "📸", unlocked: false },
  { id: 13, name: "調整の塔", icon: "🔧", unlocked: false },
  { id: 14, name: "秩序の王国", icon: "🏰", unlocked: false },
]

// Array of clothing emojis for background stamps
const clothingEmojis = [
  "👒",
  "👑",
  "👗",
  "👙",
  "👖",
  "✨",
  "🧤",
  "💃",
  "🦺",
  "🧦",
  "👔",
  "👚",
  "👘",
  "🧣",
  "👜",
  "🧢",
  "👟",
  "👠",
  "🥾",
  "🧥",
]

export default function ClosetPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [selectedStage, setSelectedStage] = useState<number | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [userMessage, setUserMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { sender: "mo-chan", text: "クローゼット王国での冒険はどうですか？何か質問があればどうぞ！" },
  ])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
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
        audio.src = "/closet.mp3"
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

  // Close welcome message
  const closeWelcome = () => {
    setShowWelcome(false)
  }

  // Handle stage selection
  const handleStageSelect = (stageId: number) => {
    const stage = stages.find((s) => s.id === stageId)
    if (stage && stage.unlocked) {
      setSelectedStage(stageId)
      // Navigate to the stage page
      router.push(`/closet/${stageId}`)
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
            text: "なるほど！クローゼットの整理についてですね。ステージを進めていくと、様々な整理術が学べますよ！",
          },
        ])
      }, 1000)

      // Clear input
      setUserMessage("")
    }
  }

  const getStagePosition = (index: number, total: number) => {
    // Create a more pronounced curved path
    const progress = index / (total - 1)

    // Calculate x position using a sine wave for a curved path
    // Multiply by a larger number for more pronounced curves
    const amplitude = 120 // Increased amplitude for wider curves
    const xOffset = Math.sin(progress * Math.PI * 2) * amplitude

    // Increase vertical spacing between stages significantly
    return {
      left: `calc(50% + ${xOffset}px)`,
      top: `${100 + progress * 1800}px`, // Increased from 1200 to 1800 for even more vertical space
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
            クローゼット王国
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
      <main className="flex-1 flex flex-col items-center p-4 relative">
        {/* Welcome message from Mo-chan */}
        {showWelcome && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-teal-900 rounded-xl p-6 max-w-md border-2 border-yellow-500 shadow-lg relative">
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <div className="relative w-24 h-24" style={{ animation: "rpg-float 3s ease-in-out infinite" }}>
                  <Image src="/cow-fairy.webp" alt="片付けの妖精モーちゃん" fill className="object-contain" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-yellow-300 mt-8 mb-4 text-center">モーちゃん</h2>

              <p className="text-white text-center mb-6">
                クローゼット王国へようこそ！１ステージづつ片付けいこう！ステージのボタンを押すとチュートリアル画像が流れて、そのあといよいよ実践が始まるよ！さぁ、一緒に冒険だ！
              </p>

              <div className="flex justify-center">
                <Button
                  onClick={closeWelcome}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold"
                >
                  冒険を始める
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Background clothing stamps - larger and static */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.2,
                fontSize: `${3 + Math.random() * 2}rem`, // Much larger font size
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
                filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))", // Add subtle glow
              }}
            >
              {clothingEmojis[Math.floor(Math.random() * clothingEmojis.length)]}
            </div>
          ))}
        </div>

        {/* Stages path */}
        <div className="w-full max-w-md mx-auto mt-4 pb-20 relative">
          {/* Stages */}
          <div className="relative h-[2000px] w-full overflow-auto">
            {stages.map((stage, index) => {
              const position = getStagePosition(index, stages.length)

              // Calculate connection line position to previous stage
              let connectionStyle = {}
              if (index > 0) {
                const prevPosition = getStagePosition(index - 1, stages.length)
                const startX = Number.parseFloat(prevPosition.left.replace("calc(50% + ", "").replace("px)", ""))
                const startY = Number.parseFloat(prevPosition.top.replace("px", ""))
                const endX = Number.parseFloat(position.left.replace("calc(50% + ", "").replace("px)", ""))
                const endY = Number.parseFloat(position.top.replace("px", ""))

                // Calculate angle and length
                const dx = endX - startX
                const dy = endY - startY
                const length = Math.sqrt(dx * dx + dy * dy)
                const angle = Math.atan2(dy, dx) * (180 / Math.PI)

                connectionStyle = {
                  width: `${length}px`,
                  height: "4px",
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "0 50%",
                  left: `calc(50% + ${startX}px)`,
                  top: `${startY}px`,
                  position: "absolute",
                  background: "linear-gradient(to right, #60a5fa, #3b82f6)",
                  borderRadius: "2px",
                  zIndex: 5,
                }
              }

              return (
                <div key={stage.id}>
                  {/* Connection line to previous stage */}
                  {index > 0 && <div style={connectionStyle as React.CSSProperties} />}

                  {/* Stage button */}
                  <div
                    className="absolute"
                    style={{
                      left: position.left,
                      top: position.top,
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={() => handleStageSelect(stage.id)}
                      disabled={!stage.unlocked}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        stage.unlocked ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-70"
                      }`}
                    >
                      {/* Glowing effect for unlocked stages */}
                      <div
                        className={`absolute inset-0 rounded-full ${
                          stage.unlocked ? "bg-blue-500 animate-pulse" : "bg-gray-600"
                        }`}
                      ></div>

                      {/* Border */}
                      <div className="absolute inset-0 rounded-full border-2 border-yellow-500"></div>

                      {/* Stage content */}
                      <div className="relative z-10 text-3xl">
                        {stage.unlocked ? stage.icon : <Lock className="h-8 w-8 text-gray-300" />}
                      </div>
                    </button>

                    {/* Stage name */}
                    <div className="mt-2 rpg-nameplate bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 px-3 py-1">
                      <p className="text-white text-center text-sm sm:text-base">
                        {stage.name}
                        {stage.id === 1 && (
                          <span className="ml-1 text-yellow-300">
                            <Star className="h-4 w-4 inline" />
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mo-chan character with chat bubble in bottom right */}
        <div className="fixed bottom-4 right-4 z-20">
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
              className="relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer"
              style={{ animation: "rpg-float 3s ease-in-out infinite" }}
              onClick={toggleChat}
            >
              <div className="absolute -inset-1 rounded-full bg-purple-500 bg-opacity-30 animate-pulse"></div>
              <Image src="/cow-fairy.webp" alt="片付けの妖精モーちゃん" fill className="object-contain" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

