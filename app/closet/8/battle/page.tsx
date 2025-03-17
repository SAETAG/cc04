"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Volume2, VolumeX, ArrowLeft, Home, Layers } from "lucide-react"

export default function Stage8BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
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
        audio.src = "/stepfight_8.mp3"
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

  // Handle type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setShowInstructions(true)
  }

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        selectedType,
      })

      // Navigate to clear page
      router.push("/closet/8/clear")
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
          <Link href="/closet/8">
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
              秩序の神殿 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">テーマに沿ってモノをグルーピング</h2>

          {!showInstructions ? (
            <>
              <p className="text-white mb-6 text-center">
                まず、あなたのライフスタイルに最も近いタイプを選んでください。
                <br />
                選んだタイプに合わせた分類手順を表示します。
              </p>

              {/* Type selection */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-300 mb-4">あなたのタイプは？</h3>

                <RadioGroup value={selectedType || ""} onValueChange={setSelectedType} className="space-y-6">
                  <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="work" id="work" className="mt-1 border-2 border-yellow-300" />
                      <div className="flex-1">
                        <Label htmlFor="work" className="text-yellow-300 font-bold cursor-pointer text-lg">
                          👩‍💼 仕事が多い人（ビジネスカジュアル・スーツが多い人）
                        </Label>
                        <p className="text-white text-base mt-1">
                          スーツやオフィスカジュアル服での出勤が多い人向け。シーン別×アイテム別で分類します。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="home" id="home" className="mt-1 border-2 border-yellow-300" />
                      <div className="flex-1">
                        <Label htmlFor="home" className="text-yellow-300 font-bold cursor-pointer text-lg">
                          🏡 おうち時間が多い人（リモートワーク・専業主婦・フリーランス）
                        </Label>
                        <p className="text-white text-base mt-1">
                          家での時間が長い人向け。快適さ×シーン別で分類します。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="fashion" id="fashion" className="mt-1 border-2 border-yellow-300" />
                      <div className="flex-1">
                        <Label htmlFor="fashion" className="text-yellow-300 font-bold cursor-pointer text-lg">
                          👗 ファッション好きな人（トレンド・おしゃれを楽しみたい人）
                        </Label>
                        <p className="text-white text-base mt-1">
                          服が多く、おしゃれを楽しみたい人向け。アイテム別×シーズン別で分類します。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="simple" id="simple" className="mt-1 border-2 border-yellow-300" />
                      <div className="flex-1">
                        <Label htmlFor="simple" className="text-yellow-300 font-bold cursor-pointer text-lg">
                          🛠️ とりあえず一番簡単に分けたい人（整理が苦手な人）
                        </Label>
                        <p className="text-white text-base mt-1">
                          シンプルに、最小限の労力で整理したい人向け。ゾーン別でシンプルに分類します。
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => setShowInstructions(true)}
                    disabled={!selectedType}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    分類手順を見る
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Instructions based on selected type */}
              <div className="mb-8">
                {selectedType === "work" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      👩‍💼 仕事が多い人（ビジネスカジュアル・スーツが多い人）
                    </h3>
                    <p className="text-white">👉 【シーン別 × アイテム別】で分類する！</p>

                    <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                      <h4 className="text-lg font-bold text-yellow-300 mb-2">📌 手順</h4>
                      <div className="space-y-4 text-white">
                        <div>
                          <p className="font-bold">① シーンごとに大きく分ける（仕事 / 休日 / フォーマル）</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ 仕事用（スーツ・オフィスカジュアル・ビジネスシューズ）</li>
                            <li>✅ 休日用（カジュアルウェア・スニーカー・リラックスウェア）</li>
                            <li>✅ フォーマル（冠婚葬祭・結婚式・特別な場面用）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">② 仕事用の服をさらに分ける</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ トップス（シャツ・ブラウス・ニット）</li>
                            <li>✅ ボトムス（スラックス・スカート）</li>
                            <li>✅ アウター（ジャケット・コート）</li>
                            <li>✅ 靴（革靴・パンプス）</li>
                            <li>✅ 小物（ネクタイ・ベルト・ストッキング・カバン）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">③ 休日用の服をさらに分ける</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ トップス（Tシャツ・パーカー・ニット）</li>
                            <li>✅ ボトムス（デニム・スカート・ジョガーパンツ）</li>
                            <li>✅ アウター（カジュアルジャケット・カーディガン）</li>
                            <li>✅ 靴（スニーカー・ブーツ・サンダル）</li>
                            <li>✅ 小物（キャップ・バッグ・アクセサリー）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">④ 下着・靴下・部屋着・パジャマをまとめる</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ 下着・靴下 → 毎日使うものとして、まとめて収納</li>
                            <li>✅ 部屋着・パジャマ → すぐ取り出せる場所に配置</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 bg-teal-900 bg-opacity-50 p-3 rounded-lg">
                        <h5 className="text-yellow-300 font-bold">📌 ポイント！</h5>
                        <ul className="text-teal-300 list-disc list-inside ml-2 mt-1">
                          <li>仕事用の服は「統一感」を意識して分けると、毎朝コーデが楽！</li>
                          <li>シーンごとにゾーンを作ると、探しやすくなる！</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "home" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      🏡 おうち時間が多い人（リモートワーク・専業主婦・フリーランス）
                    </h3>
                    <p className="text-white">👉 【快適さ × シーン別】で分類する！</p>

                    <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                      <h4 className="text-lg font-bold text-yellow-300 mb-2">📌 手順</h4>
                      <div className="space-y-4 text-white">
                        <div>
                          <p className="font-bold">① 大まかに3つのグループに分ける（家・ちょっと外出・しっかり外出）</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ 家で着る服（ルームウェア・パジャマ）</li>
                            <li>✅ ちょっと外出服（近所・スーパー・コンビニ用）</li>
                            <li>✅ しっかり外出服（おでかけ・レジャー・友達と会う用）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">② 家で着る服を分ける</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ 部屋着（Tシャツ・スウェット・ゆるニット）</li>
                            <li>✅ パジャマ（上下セット・ルームローブ）</li>
                            <li>✅ 防寒用アイテム（ルームソックス・ガウン・ブランケット）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">③ ちょっと外出服を分ける</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ トップス（シンプルなカットソー・羽織れるカーディガン）</li>
                            <li>✅ ボトムス（デニム・ジョガーパンツ・スカート）</li>
                            <li>✅ 靴（スニーカー・サンダル）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">④ しっかり外出服を分ける</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ トップス（ブラウス・おしゃれニット・アウター）</li>
                            <li>✅ ボトムス（キレイめパンツ・スカート）</li>
                            <li>✅ 靴（パンプス・ブーツ）</li>
                            <li>✅ 小物（バッグ・ストール・アクセサリー）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">⑤ 下着・靴下をまとめる</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ 下着・インナー類は1ヶ所にまとめる</li>
                            <li>✅ 靴下は「厚手/薄手」で分けると使いやすい！</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 bg-teal-900 bg-opacity-50 p-3 rounded-lg">
                        <h5 className="text-yellow-300 font-bold">📌 ポイント！</h5>
                        <ul className="text-teal-300 list-disc list-inside ml-2 mt-1">
                          <li>「すぐ着られる快適服」を手前に収納する！</li>
                          <li>ルームウェアと外出服を混ぜないことで、外出時の準備がスムーズに！</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "fashion" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      👗 ファッション好きな人（トレンド・おしゃれを楽しみたい人）
                    </h3>
                    <p className="text-white">👉 【アイテム別 × シーズン別】で分類する！</p>

                    <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                      <h4 className="text-lg font-bold text-yellow-300 mb-2">📌 手順</h4>
                      <div className="space-y-4 text-white">
                        <div>
                          <p className="font-bold">① アイテムごとに分類する</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ トップス（Tシャツ・ニット・ブラウス）</li>
                            <li>✅ ボトムス（デニム・スラックス・スカート）</li>
                            <li>✅ ワンピース・セットアップ</li>
                            <li>✅ アウター（コート・ジャケット）</li>
                            <li>✅ 靴（スニーカー・ブーツ・パンプス・サンダル）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">② 季節ごとに分類する</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ 春夏用（薄手・涼しい素材）</li>
                            <li>✅ 秋冬用（厚手・防寒アイテム）</li>
                            <li>✅ オールシーズン用（どの季節でも使えるアイテム）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">③ 小物・アクセサリーも分ける</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ バッグ（ショルダー・トート・クラッチ）</li>
                            <li>✅ 帽子（キャップ・ハット・ニット帽）</li>
                            <li>✅ アクセサリー（ピアス・ネックレス・ベルト）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">④ 下着・靴下・ストッキングをまとめる</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ シーン別（普段用 / 特別用）で分ける</li>
                            <li>✅ カラーごとに並べると選びやすい！</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 bg-teal-900 bg-opacity-50 p-3 rounded-lg">
                        <h5 className="text-yellow-300 font-bold">📌 ポイント！</h5>
                        <ul className="text-teal-300 list-disc list-inside ml-2 mt-1">
                          <li>「着たい服がすぐ見つかる収納」にすることが大事！</li>
                          <li>カラーグラデーションで並べると、コーデがしやすい✨</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "simple" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      🛠️ とりあえず一番簡単に分けたい人（整理が苦手な人）
                    </h3>
                    <p className="text-white">👉 【ゾーン別でシンプルに分類！】</p>

                    <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg border border-teal-700">
                      <h4 className="text-lg font-bold text-yellow-300 mb-2">📌 手順</h4>
                      <div className="space-y-4 text-white">
                        <div>
                          <p className="font-bold">① 大きく2つに分ける（普段着 / たまに着る服）</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ 普段着（毎日着る服・すぐ取り出したいもの）</li>
                            <li>✅ たまに着る服（フォーマル・シーズンオフの服）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">② さらにざっくり分類する</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ トップス（Tシャツ・ブラウス・ニット）</li>
                            <li>✅ ボトムス（デニム・スカート・スラックス）</li>
                            <li>✅ アウター（コート・ジャケット）</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold">③ 下着・靴下・小物をまとめる</p>
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>✅ 靴下・下着 → 1ヶ所にまとめる（分類不要！）</li>
                            <li>✅ 小物（バッグ・帽子） → ボックスにまとめてポイッ！</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 bg-teal-900 bg-opacity-50 p-3 rounded-lg">
                        <h5 className="text-yellow-300 font-bold">📌 ポイント！</h5>
                        <ul className="text-teal-300 list-disc list-inside ml-2 mt-1">
                          <li>とにかく「手間をかけずにパッと取れる収納」を作る！</li>
                          <li>完璧を目指さず「とりあえず分ける」だけでスッキリする！</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={saveRecord}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    "保存中..."
                  ) : (
                    <>
                      <Layers className="h-5 w-5" />
                      グルーピング完了！
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

