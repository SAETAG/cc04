"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Volume2, VolumeX, ArrowLeft, Home } from "lucide-react"

export default function Stage4BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [criteriaChecked, setCriteriaChecked] = useState(Array(10).fill(false))
  const [isMobile, setIsMobile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
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
        audio.src = "/stepfight_4.mp3" // Updated to use stepfight_4.mp3
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

  // Toggle criteria checked
  const toggleCriteria = (index: number) => {
    const newCriteriaChecked = [...criteriaChecked]
    newCriteriaChecked[index] = !newCriteriaChecked[index]
    setCriteriaChecked(newCriteriaChecked)
  }

  // Check if all criteria are checked
  const allCriteriaChecked = criteriaChecked.every((checked) => checked)

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        criteriaChecked,
      })

      // Navigate to clear page
      router.push("/closet/4/clear")
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
          <Link href="/closet/4">
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
              選ばれし者 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">お気に入りを選ぼう</h2>

          <p className="text-white mb-6 text-center">
            クローゼットに戻すべき「お気に入り」と「1年以上着ているもの」を選び出し、「賢者の箱」へ入れましょう。
            <br />
            以下のリストを参考に、あなたのお気に入りを選んでください。
          </p>

          {/* Criteria checklist */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">選ぶ基準</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria1"
                  checked={criteriaChecked[0]}
                  onCheckedChange={() => toggleCriteria(0)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria1" className="text-yellow-300 font-bold cursor-pointer">
                    1. 日常の戦闘服（お気に入りの普段着）
                  </label>
                  <p className="text-white text-sm">👉 週に何度も着る、快適で自分らしさを感じる服</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria2"
                  checked={criteriaChecked[1]}
                  onCheckedChange={() => toggleCriteria(1)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria2" className="text-yellow-300 font-bold cursor-pointer">
                    2. 伝説の鎧（仕事・フォーマル用の服）
                  </label>
                  <p className="text-white text-sm">👉 オフィス・ビジネスシーンで頼れる一着</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria3"
                  checked={criteriaChecked[2]}
                  onCheckedChange={() => toggleCriteria(2)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria3" className="text-yellow-300 font-bold cursor-pointer">
                    3. 勇者のローブ（冠婚葬祭用の服）
                  </label>
                  <p className="text-white text-sm">👉 結婚式・お葬式・特別なイベントで必須の装い</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria4"
                  checked={criteriaChecked[3]}
                  onCheckedChange={() => toggleCriteria(3)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria4" className="text-yellow-300 font-bold cursor-pointer">
                    4. 四季の装束（季節ごとの定番服）
                  </label>
                  <p className="text-white text-sm">👉 春・夏・秋・冬、それぞれの気候に適したアイテム</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria5"
                  checked={criteriaChecked[4]}
                  onCheckedChange={() => toggleCriteria(4)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria5" className="text-yellow-300 font-bold cursor-pointer">
                    5. 旅人の装い（旅行やアウトドア用の服）
                  </label>
                  <p className="text-white text-sm">👉 動きやすく、収納しやすい便利なウェア</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria6"
                  checked={criteriaChecked[5]}
                  onCheckedChange={() => toggleCriteria(5)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria6" className="text-yellow-300 font-bold cursor-pointer">
                    6. 魔法の羽衣（快適なルームウェア・パジャマ）
                  </label>
                  <p className="text-white text-sm">👉 リラックスできて、長く愛用できるもの</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria7"
                  checked={criteriaChecked[6]}
                  onCheckedChange={() => toggleCriteria(6)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria7" className="text-yellow-300 font-bold cursor-pointer">
                    7. 伝説のマント（防寒具・アウター）
                  </label>
                  <p className="text-white text-sm">👉 一年中活躍する、お気に入りのアウター</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria8"
                  checked={criteriaChecked[7]}
                  onCheckedChange={() => toggleCriteria(7)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria8" className="text-yellow-300 font-bold cursor-pointer">
                    8. 精霊の靴下（機能的なインナー＆靴下）
                  </label>
                  <p className="text-white text-sm">👉 気持ちよく着られ、毎日活躍するものだけを残す</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria9"
                  checked={criteriaChecked[8]}
                  onCheckedChange={() => toggleCriteria(8)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria9" className="text-yellow-300 font-bold cursor-pointer">
                    9. 秘宝の手袋（アクセサリー・小物類）
                  </label>
                  <p className="text-white text-sm">👉 お気に入りのベルト、ストール、帽子など</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                <Checkbox
                  id="criteria10"
                  checked={criteriaChecked[9]}
                  onCheckedChange={() => toggleCriteria(9)}
                  className="data-[state=checked]:bg-yellow-500 data-[state=checked]:text-purple-900 border-2 border-yellow-300 h-6 w-6 mt-1"
                />
                <div>
                  <label htmlFor="criteria10" className="text-yellow-300 font-bold cursor-pointer">
                    10. 守護の鎧（特別な思い出が詰まった服）
                  </label>
                  <p className="text-white text-sm">👉 着る機会は少なくても、大切にしたい一着</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !allCriteriaChecked}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "保存中..." : "選別完了！"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

