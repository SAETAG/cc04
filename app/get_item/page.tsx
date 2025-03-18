"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home } from "lucide-react"

// アイテムの型定義
interface Item {
  id: string
  name: string
  description: string
  icon: string
  type: "衣類" | "アクセサリー" | "収納" | "装飾" | "特殊"
  obtained: string
}

export default function GetItemPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // サンプルアイテムデータ
  const items: Item[] = [
    {
      id: "1",
      name: "クリスタルクローゼット",
      description:
        "最高級の魔法が込められたクローゼット。中に入れた衣類は自動的に整理され、シワひとつなく保管される。空間も無限大に広がる特殊能力を持つ。",
      icon: "✨👕✨",
      type: "収納",
      obtained: "ボス「リバウンドラゴン」討伐報酬",
    },
    {
      id: "2",
      name: "断捨離の剣",
      description:
        "この剣を持つと、不要なものを見分ける目が養われる。剣を向けると、本当に必要かどうかが一目でわかるようになる。",
      icon: "⚔️",
      type: "特殊",
      obtained: "メインクエスト「迷いの森」クリア報酬",
    },
    {
      id: "3",
      name: "整理整頓のマント",
      description:
        "このマントを身につけると、周囲のものが自然と整理されていく。着用者の思考も整理され、判断力が上がる効果もある。",
      icon: "🧣",
      type: "衣類",
      obtained: "サブクエスト「散らかった書斎」クリア報酬",
    },
    {
      id: "4",
      name: "仕分けの手袋",
      description:
        "この手袋をはめると、触れたものの適切な収納場所がわかるようになる。複数のアイテムに同時に触れると、自動的にカテゴリ分けしてくれる。",
      icon: "🧤",
      type: "アクセサリー",
      obtained: "宝箱から入手",
    },
    {
      id: "5",
      name: "空間節約の靴下",
      description:
        "この靴下を履くと、足跡の周囲のスペースが最適化される。収納スペースを最大限に活用するアイデアが浮かぶようになる。",
      icon: "🧦",
      type: "衣類",
      obtained: "初心者クエスト報酬",
    },
    {
      id: "6",
      name: "魔法の収納ボックス",
      description: "中に入れたものが自動的に圧縮され、通常の3倍の量を収納できる。取り出す時は元のサイズに戻る。",
      icon: "📦",
      type: "収納",
      obtained: "ダンジョン「迷宮の倉庫」で発見",
    },
    {
      id: "7",
      name: "季節感知のハンガー",
      description: "季節に合わせて色が変わるハンガー。今着るべき服と収納すべき服を教えてくれる。",
      icon: "🧷",
      type: "収納",
      obtained: "クラフト報酬",
    },
    {
      id: "8",
      name: "輝く整理棚",
      description:
        "この棚に物を置くと、関連するアイテム同士が光って教えてくれる。セットで使うべきアイテムの管理に最適。",
      icon: "🗄️",
      type: "収納",
      obtained: "レアドロップ",
    },
    {
      id: "9",
      name: "思い出の結晶",
      description: "大切な思い出を保存できる魔法の結晶。物理的なスペースを取らずに、思い出を保管できる。",
      icon: "💎",
      type: "特殊",
      obtained: "イベント「思い出の整理」報酬",
    },
    {
      id: "10",
      name: "ミニマリストの指輪",
      description: "この指輪をつけると、本当に必要なものだけが見えるようになる。不要なものは透明に見える。",
      icon: "💍",
      type: "アクセサリー",
      obtained: "隠しクエスト「本質への旅」報酬",
    },
    {
      id: "11",
      name: "時空ポケット",
      description: "小さく見えて中は広大な空間が広がるポケット。季節外のアイテムを保管するのに最適。",
      icon: "👝",
      type: "収納",
      obtained: "レジェンダリークエスト報酬",
    },
    {
      id: "12",
      name: "整頓の妖精の羽",
      description: "この羽を部屋に飾ると、夜中に妖精が訪れて少しずつ整理整頓してくれる。",
      icon: "🪶",
      type: "装飾",
      obtained: "妖精の森で発見",
    },
  ]

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
        audio.volume = 0.7
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
          <Link href="/user">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
            獲得アイテム一覧
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

      {/* Main content - Item List */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border-2 p-4 bg-gradient-to-r from-teal-800 to-teal-900 text-white border-teal-700 shadow-md"
              >
                <div className="flex items-start">
                  {/* アイテムアイコン */}
                  <div className="w-12 h-12 flex items-center justify-center text-3xl bg-teal-900/30 rounded-full mr-3 border border-teal-600">
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    {/* アイテム名 */}
                    <h3 className="font-bold text-lg text-yellow-300">{item.name}</h3>

                    {/* 入手場所 */}
                    <div className="text-xs mt-1 mb-2 text-teal-300">入手: {item.obtained}</div>

                    {/* アイテムの説明 */}
                    <p className="text-sm mt-2 text-white">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer with item count */}
      <footer className="bg-teal-900 p-3 border-t border-teal-700 text-center text-teal-300 text-sm">
        <p>獲得アイテム数: {items.length}</p>
      </footer>
    </div>
  )
}

