"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, ChevronRight } from "lucide-react"

// Define the stages
const stages = [
  {
    id: 1,
    name: "トップス",
    icon: "👕",
    tutorial: ["トップスを整理しましょう", "似た色や種類ごとに分けると良いでしょう"],
  },
  { id: 2, name: "ボトムス", icon: "👖", tutorial: ["ボトムスを整理しましょう", "季節ごとに分けると良いでしょう"] },
  { id: 3, name: "アウター", icon: "🧥", tutorial: ["アウターを整理しましょう", "使用頻度で分けると良いでしょう"] },
  { id: 4, name: "シューズ", icon: "👟", tutorial: ["シューズを整理しましょう", "用途別に分けると良いでしょう"] },
  { id: 5, name: "バッグ", icon: "👜", tutorial: ["バッグを整理しましょう", "サイズ別に分けると良いでしょう"] },
  {
    id: 6,
    name: "アクセサリー",
    icon: "💍",
    tutorial: ["アクセサリーを整理しましょう", "小分けケースを活用しましょう"],
  },
  { id: 7, name: "帽子", icon: "👒", tutorial: ["帽子を整理しましょう", "型崩れしないように注意しましょう"] },
  {
    id: 8,
    name: "下着・靴下",
    icon: "🧦",
    tutorial: ["下着・靴下を整理しましょう", "引き出しの中で仕切りを使うと便利です"],
  },
  {
    id: 9,
    name: "パジャマ",
    icon: "🌙",
    tutorial: ["パジャマを整理しましょう", "使用頻度の高いものは手前に置きましょう"],
  },
  {
    id: 10,
    name: "スポーツウェア",
    icon: "🏃",
    tutorial: ["スポーツウェアを整理しましょう", "種目別に分けると良いでしょう"],
  },
  {
    id: 11,
    name: "フォーマル",
    icon: "👔",
    tutorial: ["フォーマルウェアを整理しましょう", "カバーをかけて保管しましょう"],
  },
  { id: 12, name: "季節物", icon: "🍂", tutorial: ["季節物を整理しましょう", "オフシーズンはしまっておきましょう"] },
  { id: 13, name: "小物", icon: "🧣", tutorial: ["小物を整理しましょう", "見える収納を心がけましょう"] },
  {
    id: 14,
    name: "最終ステージ",
    icon: "🏆",
    tutorial: ["おめでとうございます！", "全てのステージをクリアしました！"],
  },
]

export default function StagePage({ params }: { params: { stageId: string } }) {
  const stageId = Number.parseInt(params.stageId)
  const stage = stages.find((s) => s.id === stageId) || stages[0]

  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)
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
        audio.src = "/setting.mp3" // Reusing the setting music for now
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

  // Handle tutorial navigation
  const nextTutorialStep = () => {
    if (tutorialStep < stage.tutorial.length - 1) {
      setTutorialStep(tutorialStep + 1)
    } else {
      setShowTutorial(false)
    }
  }

  // Complete stage and return to closet
  const completeStage = () => {
    // Here you would update the progress in a real app
    router.push("/closet")
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
              ステージ {stage.id}:
            </span>
            <span className="text-lg sm:text-xl text-white">
              {stage.name} {stage.icon}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Tutorial overlay */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-teal-900 rounded-xl p-6 max-w-md border-2 border-yellow-500 shadow-lg relative">
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <div className="relative w-24 h-24" style={{ animation: "rpg-float 3s ease-in-out infinite" }}>
                  <Image src="/cow-fairy.webp" alt="片付けの妖精モーちゃん" fill className="object-contain" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-yellow-300 mt-8 mb-4 text-center">
                チュートリアル {tutorialStep + 1}/{stage.tutorial.length}
              </h2>

              <p className="text-white text-center mb-6 text-lg">{stage.tutorial[tutorialStep]}</p>

              <div className="flex justify-center">
                <Button
                  onClick={nextTutorialStep}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold"
                >
                  {tutorialStep < stage.tutorial.length - 1 ? (
                    <>
                      次へ <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "始める"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stage content - only shown after tutorial */}
        {!showTutorial && (
          <div className="w-full max-w-2xl bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              {stage.name}のステージ
            </h2>

            <div className="text-white space-y-4">
              <p className="text-center">このステージでは{stage.name}を整理します。</p>

              {/* Here you would add the actual stage content/game */}
              <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-600 my-6">
                <p className="text-center text-yellow-200">ここに実際のゲームコンテンツが入ります</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={completeStage}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold"
              >
                ステージクリア
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

