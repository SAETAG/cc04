"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, VolumeX, ArrowLeft, Home } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Card data
const infoCards = [
  {
    id: "mochan",
    title: "モーちゃんについて",
    content:
      "モーちゃんは、整理収納のあらゆる知識を有するおかたづけマスターです。お片付けで迷ったことがあったら、ホーム画面のチャットでモーちゃんに話しかけてみましょう♪",
    hasImage: true,
    imageSrc: "/cow-fairy.webp",
    imageAlt: "モーちゃん",
    icon: "🧚‍♀️",
  },
  {
    id: "pub",
    title: "酒場について",
    content: "酒場では、自分の戦果報告や、他の人の整理収納チップスを見ることができます。ぜひ飲みに来てくださいね！",
    hasImage: false,
    icon: "🍺",
  },
  {
    id: "kingdom",
    title: "クローゼット王国について",
    content:
      "あなたが冒険をするダンジョンです！ステージをクリアしたら、次回ログインした時はその次のステージからプレイできるようになります。",
    hasImage: false,
    icon: "🏰",
  },
  {
    id: "treasury",
    title: "マイコレクションについて",
    content: "マイコレクションでは、あなたの持ち物リストが見れます。ぜひ、全部のお洋服のリスト化を目指してくださいね！",
    hasImage: false,
    icon: "💰",
  },
  {
    id: "feedback",
    title: "フィードバックを送る",
    content:
      "アプリの改善のため、ぜひあなたの意見をお聞かせください。フィードバックはアプリの品質向上に役立てさせていただきます。",
    hasImage: false,
    icon: "📝",
    isFeedback: true,
  },
]

export default function InformationPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [rating, setRating] = useState(0)
  const [goodPoints, setGoodPoints] = useState("")
  const [improvementPoints, setImprovementPoints] = useState("")
  const [unnecessaryFeatures, setUnnecessaryFeatures] = useState<string[]>([])
  const [desiredFeatures, setDesiredFeatures] = useState<string[]>([])
  const [otherFeedback, setOtherFeedback] = useState("")

  // Initialize audio - シンプルな方法で初期化
  useEffect(() => {
    const audioElement = new Audio("/information.mp3")
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

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Reset feedback form when dialog closes
  const resetFeedbackForm = () => {
    setRating(0)
    setGoodPoints("")
    setImprovementPoints("")
    setUnnecessaryFeatures([])
    setDesiredFeatures([])
    setOtherFeedback("")
  }

  // Handle star rating click
  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
  }

  // Handle form submission
  const handleSubmitFeedback = () => {
    console.log("Feedback submitted:", {
      rating,
      unnecessaryFeatures,
      desiredFeatures,
      otherFeedback,
    })
    // Here you would typically send this data to your backend

    // Reset form after submission
    resetFeedbackForm()

    // Close dialog (would need to control dialog open state to do this programmatically)
    // For now, we'll rely on the DialogClose component
  }

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

  return (
    <div className="min-h-screen bg-blue-950 flex flex-col" onClick={tryPlayAudio}>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
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
              className="bg-blue-800 border-yellow-600 text-white hover:bg-blue-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
            案内所
          </h1>
        </div>

        <div className="flex gap-2">
          {/* BGM on/off button */}
          <Button
            variant="outline"
            size="icon"
            className="bg-blue-800 border-yellow-600 text-white hover:bg-blue-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>

          {/* Home button */}
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-blue-800 border-yellow-600 text-white hover:bg-blue-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-6 text-center drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
            クローゼット王国の案内
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {infoCards.map((card) => (
              <Dialog key={card.id} onOpenChange={(open) => !open && card.id === "feedback" && resetFeedbackForm()}>
                <DialogTrigger asChild>
                  <Card className="bg-blue-800/80 border-2 border-blue-600 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      <div className="text-4xl mb-4">{card.icon}</div>
                      <h3 className="text-xl font-bold text-yellow-300 text-center mb-2">{card.title}</h3>
                      <p className="text-blue-200 text-center line-clamp-2">{card.content.substring(0, 60)}...</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent
                  className={`${card.id === "feedback" ? "bg-gradient-to-b from-white to-pink-100" : "bg-gradient-to-b from-blue-900 to-blue-950"} border-2 border-yellow-500 max-w-md w-full overflow-y-auto max-h-[90vh]`}
                >
                  <DialogHeader>
                    <DialogTitle
                      className={`text-xl font-bold ${card.id === "feedback" ? "text-purple-800" : "text-yellow-300"} text-center mb-4`}
                    >
                      {card.id === "feedback" ? "アプリに関するフィードバックのお願い" : card.title}
                    </DialogTitle>
                  </DialogHeader>
                  {card.id === "feedback" ? (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      <div className="space-y-2">
                        <label className="block text-purple-800 font-medium">このアプリの評価をお聞かせください</label>
                        <div className="flex justify-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingClick(star)}
                              className={`text-3xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-500 transition-colors`}
                              aria-label={`${star}つ星`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-purple-800 font-medium">
                          1. 無くてもいいと思った機能（複数選択可、1つ以上必須）
                        </label>
                        <div className="space-y-2">
                          {[
                            { id: "feature1", label: "酒場の成果報告機能" },
                            { id: "feature2", label: "酒場の整理収納知識の共有機能" },
                            { id: "feature3", label: "マイコレクション（持ち物の写真一覧表示）の機能" },
                            { id: "feature4", label: "モーちゃん（AI）機能" },
                            { id: "feature5", label: "クローゼット王国の片づけ14ステップ（もっと少ステップでいい）" },
                            { id: "feature6", label: "特になし" },
                          ].map((feature) => (
                            <div key={feature.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature.id}
                                checked={unnecessaryFeatures.includes(feature.label)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    if (feature.label === "特になし") {
                                      setUnnecessaryFeatures(["特になし"])
                                    } else {
                                      setUnnecessaryFeatures((prev) =>
                                        prev.includes("特になし")
                                          ? [...prev.filter((f) => f !== "特になし"), feature.label]
                                          : [...prev, feature.label],
                                      )
                                    }
                                  } else {
                                    setUnnecessaryFeatures((prev) => prev.filter((f) => f !== feature.label))
                                  }
                                }}
                              />
                              <label htmlFor={feature.id} className="text-gray-700 cursor-pointer">
                                {feature.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-purple-800 font-medium">
                          2. 追加して欲しいと思う機能（複数選択可、1つ以上必須）
                        </label>
                        <div className="space-y-2">
                          {[
                            { id: "desired1", label: "もっと気軽にできるサブクエスト（掃除機がけなど）機能" },
                            { id: "desired2", label: "パズルなどのゲーム機能" },
                            { id: "desired3", label: "レアアイテムやランキング機能" },
                            { id: "desired4", label: "プロの整理収納アドバイザーにチャットで相談できる機能" },
                            { id: "desired5", label: "クローゼット以外の整理収納支援機能" },
                            { id: "desired6", label: "特になし" },
                          ].map((feature) => (
                            <div key={feature.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature.id}
                                checked={desiredFeatures.includes(feature.label)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    if (feature.label === "特になし") {
                                      setDesiredFeatures(["特になし"])
                                    } else {
                                      setDesiredFeatures((prev) =>
                                        prev.includes("特になし")
                                          ? [...prev.filter((f) => f !== "特になし"), feature.label]
                                          : [...prev, feature.label],
                                      )
                                    }
                                  } else {
                                    setDesiredFeatures((prev) => prev.filter((f) => f !== feature.label))
                                  }
                                }}
                              />
                              <label htmlFor={feature.id} className="text-gray-700 cursor-pointer">
                                {feature.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="otherFeedback" className="block text-purple-800 font-medium">
                          3. その他、良かった点や今後改善を期待する点を自由にお書きください
                        </label>
                        <textarea
                          id="otherFeedback"
                          value={otherFeedback}
                          onChange={(e) => setOtherFeedback(e.target.value)}
                          className="w-full h-24 p-2 border border-pink-300 rounded-md bg-white text-gray-800 focus:outline-none focus:border-purple-400"
                          placeholder="任意入力"
                        />
                      </div>

                      <div className="flex justify-between">
                        <DialogClose asChild>
                          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                            キャンセル
                          </button>
                        </DialogClose>
                        <DialogClose asChild>
                          <button
                            onClick={handleSubmitFeedback}
                            disabled={unnecessaryFeatures.length === 0 || desiredFeatures.length === 0}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            送信する
                          </button>
                        </DialogClose>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      {card.hasImage && (
                        <div className="flex justify-center">
                          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                            <Image
                              src={card.imageSrc || "/placeholder.svg?height=200&width=200"}
                              alt={card.imageAlt || card.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-blue-100 text-center leading-relaxed">{card.content}</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

