"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Home, Trophy, ArrowRight, Shirt, Star, Beer } from "lucide-react"

export default function Stage11ClearPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiItems, setConfettiItems] = useState<Array<{
    left: string;
    width: string;
    height: string;
    background: string;
    transform: string;
    animationDelay: string;
    animationDuration: string;
  }>>([])

  // シンプルな音声初期化
  useEffect(() => {
    let audioElement: HTMLAudioElement | null = null;

    const initAudio = async () => {
      if (typeof window === "undefined") return;

      try {
        audioElement = new Audio();
        audioElement.src = "/stepclear.mp3";
        audioElement.loop = true;
        audioElement.volume = 0.7;
        audioElement.preload = "auto";

        // オーディオの読み込み状態を監視
        audioElement.addEventListener("canplaythrough", () => {
          setAudioLoaded(true);
          console.log("Audio loaded and ready to play");
        });

        // エラーハンドリングを改善
        audioElement.addEventListener("error", (e) => {
          const error = e.currentTarget as HTMLAudioElement;
          console.error("Audio loading error details:", {
            error: error.error,
            networkState: error.networkState,
            readyState: error.readyState,
            src: error.src
          });
        });

        setAudio(audioElement);
      } catch (error) {
        console.error("Audio initialization error:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error",
          type: typeof error
        });
      }
    };

    initAudio();

    return () => {
      if (audioElement) {
        try {
          audioElement.pause();
          audioElement.src = "";
          setAudio(null);
        } catch (error) {
          console.error("Audio cleanup error:", error);
        }
      }
    };
  }, []);

  // ページ表示後に一度だけ再生を試みる
  useEffect(() => {
    const playAudio = async () => {
      if (!audio || !audioLoaded) return;

      try {
        await audio.play();
        console.log("Audio started playing successfully");
      } catch (error) {
        console.log("Initial auto-play was prevented:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error"
        });
      }
    };

    playAudio();
  }, [audio, audioLoaded]);

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    const handleMuteChange = async () => {
      if (!audio) return;

      try {
        audio.muted = isMuted;

        // ミュート解除時に再生を試みる
        if (!isMuted && audio.paused && audioLoaded) {
          await audio.play();
        }
      } catch (error) {
        console.log("Audio mute/unmute error:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error"
        });
      }
    };

    handleMuteChange();
  }, [isMuted, audio, audioLoaded]);

  // 画面タップで再生を試みる関数
  const tryPlayAudio = async () => {
    if (!audio || !audioLoaded || !audio.paused || isMuted) return;

    try {
      await audio.play();
    } catch (error) {
      console.log("Play on screen tap failed:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // 紙吹雪の初期化（クライアントサイドのみ）
  useEffect(() => {
    const items = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      width: `${5 + Math.random() * 10}px`,
      height: `${10 + Math.random() * 15}px`,
      background: `hsl(${Math.random() * 360}, 100%, 50%)`,
      transform: `rotate(${Math.random() * 360}deg)`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${3 + Math.random() * 5}s`,
    }));
    setConfettiItems(items);
    setShowConfetti(true);
  }, []);

  // Hide confetti after some time
  useEffect(() => {
    if (!showConfetti) return;
    
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showConfetti])

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
          <h1 className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
            ステージクリア！
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

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {confettiItems.map((item, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                top: "-5%",
                left: item.left,
                width: item.width,
                height: item.height,
                background: item.background,
                transform: item.transform,
                animationDelay: item.animationDelay,
                animationDuration: item.animationDuration,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg text-center">
          {/* Trophy icon */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 animate-bounce-slow">
              <Trophy className="w-full h-full text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            ステージクリア！
          </h1>

          <p className="text-white text-lg sm:text-xl mb-6">
            おめでとうございます！「対話の鏡」ステージをクリアしました。
            <br />
            あなたは今の気持ちを勇者の石板に記録しました。
            <br />
            この記録は、今後の整理整頓の際に役立つでしょう。
          </p>

          {/* Obtained Items Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-yellow-300 mb-4">獲得したアイテム</h2>

            <div className="flex flex-col gap-4">
              {/* Item 1: Magic Hanger */}
              <div
                className="bg-purple-800 bg-opacity-70 rounded-lg border border-yellow-500 p-4 flex items-center gap-4 animate-fadeIn"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="bg-yellow-500 rounded-full p-3 flex-shrink-0">
                  <Shirt className="h-8 w-8 text-purple-900" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-yellow-300">魔法のハンガー</h3>
                  <p className="text-white text-sm sm:text-base">
                    どんな衣類も美しく保管し、シワを防ぐ不思議なハンガー
                  </p>
                </div>
              </div>

              {/* Item 2: Experience Points */}
              <div
                className="bg-purple-800 bg-opacity-70 rounded-lg border border-yellow-500 p-4 flex items-center gap-4 animate-fadeIn"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="bg-yellow-500 rounded-full p-3 flex-shrink-0">
                  <Star className="h-8 w-8 text-purple-900" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-yellow-300">経験値50ポイント</h3>
                  <p className="text-white text-sm sm:text-base">あなたの成長を加速させる貴重な経験</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pub">
              <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 border border-amber-400 shadow-lg">
                <Beer className="h-5 w-5" />
                酒場で成果を報告
              </Button>
            </Link>

            <Link href="/closet">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg border border-blue-400 shadow-lg">
                マップに戻る
              </Button>
            </Link>

            <Link href="/closet/12">
              <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 border border-green-400 shadow-lg">
                次のステージへ
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}

