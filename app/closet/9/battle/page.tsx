"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Volume2, VolumeX, ArrowLeft, Home, Clock } from "lucide-react"

export default function Stage9BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [frequencyChecked, setFrequencyChecked] = useState(Array(5).fill(false))
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/stepfight_9.mp3")
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

  // Toggle frequency checked
  const toggleFrequency = (index: number) => {
    const newFrequencyChecked = [...frequencyChecked]
    newFrequencyChecked[index] = !newFrequencyChecked[index]
    setFrequencyChecked(newFrequencyChecked)

    // チェックボックス操作時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Check if at least 3 frequencies are checked
  const atLeastThreeChecked = frequencyChecked.filter(Boolean).length >= 3

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        frequencyChecked,
      })

      // Navigate to clear page
      router.push("/closet/9/clear")
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
          <Link href="/closet/9">
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
              時の洞窟 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">使用頻度順に並べ替える</h2>

          <p className="text-white mb-6 text-center">
            グルーピングしたものの中で、さらに使用頻度順に並べ替えましょう。
            <br />
            以下の使用頻度カテゴリを参考に、アイテムを整理してください。
          </p>

          {/* Frequency categories */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">使用頻度カテゴリ</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="daily"
                  checked={frequencyChecked[0]}
                  onCheckedChange={() => toggleFrequency(0)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-2 border-green-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="daily" className="text-green-300 font-bold cursor-pointer">
                    毎日使うもの（デイリー）
                  </label>
                  <p className="text-white text-sm">
                    👉 下着、靴下、お気に入りのTシャツなど、毎日使うアイテムは最も取り出しやすい場所に配置しましょう。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="weekly"
                  checked={frequencyChecked[1]}
                  onCheckedChange={() => toggleFrequency(1)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-2 border-blue-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="weekly" className="text-blue-300 font-bold cursor-pointer">
                    週に数回使うもの（ウィークリー）
                  </label>
                  <p className="text-white text-sm">
                    👉 仕事着、普段着など、週に何度か着るアイテムは手の届きやすい場所に配置しましょう。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="monthly"
                  checked={frequencyChecked[2]}
                  onCheckedChange={() => toggleFrequency(2)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-white border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="monthly" className="text-yellow-300 font-bold cursor-pointer">
                    月に数回使うもの（マンスリー）
                  </label>
                  <p className="text-white text-sm">
                    👉
                    特別な日の服、趣味の服など、月に数回使うアイテムは中程度のアクセスしやすさの場所に配置しましょう。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="seasonal"
                  checked={frequencyChecked[3]}
                  onCheckedChange={() => toggleFrequency(3)}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white border-2 border-orange-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="seasonal" className="text-orange-300 font-bold cursor-pointer">
                    季節ごとに使うもの（シーズナル）
                  </label>
                  <p className="text-white text-sm">
                    👉
                    冬のコート、夏の水着など、特定の季節だけ使うアイテムはオフシーズンは収納ボックスなどにしまいましょう。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="rare"
                  checked={frequencyChecked[4]}
                  onCheckedChange={() => toggleFrequency(4)}
                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:text-white border-2 border-purple-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="rare" className="text-purple-300 font-bold cursor-pointer">
                    年に数回またはほとんど使わないもの（アニュアル・レア）
                  </label>
                  <p className="text-white text-sm">
                    👉
                    冠婚葬祭の服、特別なイベント用の服など、めったに使わないアイテムは最も取り出しにくい場所でも構いません。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !atLeastThreeChecked}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <Clock className="h-5 w-5" />
                  使用頻度順に並べ替え完了！
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

