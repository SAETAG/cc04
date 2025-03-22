"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  Star,
  Lock,
  Home,
  Send,
  X,
} from "lucide-react";
import PlayFab from "@/lib/playfab";
import Cookies from "js-cookie";

// 定義されたステージ（初期状態）
const stages = [
  { id: 1, name: "闇の扉", icon: "🚪", unlocked: true },
  { id: 2, name: "選別の祭壇", icon: "🎁", unlocked: false },
  { id: 3, name: "解放の広間", icon: "📦", unlocked: false },
  { id: 4, name: "選ばれし者", icon: "💖", unlocked: false },
  { id: 5, name: "断捨離の審判", icon: "🗑️", unlocked: false },
  { id: 6, name: "未練の洞窟", icon: "💭", unlocked: false },
  { id: 7, name: "限界の迷宮", icon: "🏰", unlocked: false },
  { id: 8, name: "秩序の神殿", icon: "🌈", unlocked: false },
  { id: 9, name: "時の洞窟", icon: "⏳", unlocked: false },
  { id: 10, name: "収納の回廊", icon: "📍", unlocked: false },
  { id: 11, name: "対話の鏡", icon: "📖", unlocked: false },
  { id: 12, name: "確認の間", icon: "📸", unlocked: false },
  { id: 13, name: "帰還の里", icon: "🔧", unlocked: false },
  { id: 14, name: "最終決戦", icon: "🏰", unlocked: false },
];

// 背景用の絵文字
const clothingEmojis = [
  "👒", "👑", "👗", "👖", "✨", "🧤", "💃", "🦺", "🧦",
  "👔", "👚", "👘", "🧣", "👜", "🧢", "👟", "👠", "🥾", "🧥",
];
const backgroundEmojis = Array(15)
  .fill(null)
  .map((_, i) => ({
    id: i,
    emoji: clothingEmojis[i % clothingEmojis.length],
    style: {
      top: `${i * 6.5}%`,
      left: `${(i * 7) % 100}%`,
      opacity: 0.3,
      fontSize: "3.5rem",
      transform: `rotate(${i % 2 === 0 ? 10 : -10}deg)`,
      filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
    },
  }));

export default function ClosetPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "mo-chan",
      text: "クローゼット王国での冒険はどうですか？何か質問があればどうぞ！",
    },
  ]);
  const [isClient, setIsClient] = useState(false);
  const [stagesData, setStagesData] = useState(stages);
  const hasFetchedRef = useRef(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // クライアントサイドのみ実行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cookie からトークンを取得して、PlayFab.settings.sessionTicket にセット
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenFromCookie = Cookies.get("token");
        if (!tokenFromCookie) {
          console.error("Cookieにトークンがありません");
          router.push("/login");
          return;
        }

        console.log("Token from cookie:", tokenFromCookie);
        // セッションチケットを設定
        PlayFab.settings.sessionTicket = tokenFromCookie;

        // ユーザーデータを取得
        if (!hasFetchedRef.current) {
          try {
            const result: any = await new Promise((resolve, reject) => {
              console.log("GetUserData呼び出し前のセッションチケット:", PlayFab.settings.sessionTicket);
              
              PlayFab.PlayFabClient.GetUserData(
                {
                  Keys: ["stage1_complete", "stage2_complete", "stage3_complete", "stage4_complete", "stage5_complete", "stage6_complete", "stage7_complete", "stage8_complete", "stage9_complete", "stage10_complete", "stage11_complete", "stage12_complete", "stage13_complete"],
                  PlayFabId: null
                },
                function(error: any, result: any) {
                  // APIレスポンスの詳細をログ出力
                  console.log("PlayFab API Response Details:", JSON.stringify({
                    hasResult: !!result,
                    resultType: result ? typeof result : 'undefined',
                    resultKeys: result ? Object.keys(result) : [],
                    hasError: !!error,
                    errorType: error ? typeof error : 'undefined',
                    sessionTicket: PlayFab.settings.sessionTicket
                  }, null, 2));

                  // エラーチェック
                  if (error) {
                    try {
                      const errorInfo = {
                        error: JSON.stringify(error, null, 2),
                        type: typeof error,
                        keys: Object.keys(error),
                        isError: error instanceof Error,
                        hasMessage: 'message' in error,
                        hasErrorMessage: 'errorMessage' in error,
                        hasErrorCode: 'errorCode' in error,
                        errorCode: error.errorCode,
                        errorMessage: error.errorMessage,
                        message: error.message,
                        name: error.name,
                        stack: error.stack
                      };
                      console.log("PlayFab Error Full Structure:", JSON.stringify(errorInfo, null, 2));

                      // セッションエラーの検出
                      const isSessionError = 
                        error.errorCode === 1000 || // InvalidSessionTicket
                        error.errorCode === 1001 || // SessionTicketExpired
                        (error.errorMessage && error.errorMessage.includes("Must be logged in"));

                      if (isSessionError) {
                        console.error("セッションエラーを検出:", JSON.stringify(error, null, 2));
                        Cookies.remove("token");
                        router.push("/login");
                        return;
                      }

                      reject(new Error(error.errorMessage || "不明なエラーが発生しました"));
                      return;
                    } catch (e) {
                      console.error("エラー処理中に例外が発生:", e);
                      reject(new Error("エラー処理中に予期せぬ問題が発生しました"));
                      return;
                    }
                  }

                  // 正常なレスポンスの処理
                  if (!result || !result.data) {
                    console.error("PlayFab: レスポンスが不正です");
                    console.log("Received result:", JSON.stringify(result, null, 2));
                    reject(new Error("PlayFabから不正なレスポンスを受信しました"));
                    return;
                  }

                  // レスポンスの詳細をログ出力
                  console.log("PlayFab Success Response:", JSON.stringify({
                    hasData: !!result.data,
                    dataType: typeof result.data,
                    keys: Object.keys(result),
                    data: result.data
                  }, null, 2));

                  resolve(result);
                }
              );
            });

            // 正常なレスポンスの処理
            console.log("PlayFab Response:", result);
            
            if (result?.data?.Data) {
              const stage1Complete = result.data.Data?.stage1_complete?.Value;
              const stage2Complete = result.data.Data?.stage2_complete?.Value;
              const stage3Complete = result.data.Data?.stage3_complete?.Value;
              const stage4Complete = result.data.Data?.stage4_complete?.Value;
              const stage5Complete = result.data.Data?.stage5_complete?.Value;
              const stage6Complete = result.data.Data?.stage6_complete?.Value;
              const stage7Complete = result.data.Data?.stage7_complete?.Value;
              const stage8Complete = result.data.Data?.stage8_complete?.Value;
              const stage9Complete = result.data.Data?.stage9_complete?.Value;
              const stage10Complete = result.data.Data?.stage10_complete?.Value;
              const stage11Complete = result.data.Data?.stage11_complete?.Value;
              const stage12Complete = result.data.Data?.stage12_complete?.Value;
              const stage13Complete = result.data.Data?.stage13_complete?.Value;
              console.log("stage1_complete:", stage1Complete);
              console.log("stage2_complete:", stage2Complete);
              console.log("stage3_complete:", stage3Complete);
              console.log("stage4_complete:", stage4Complete);
              console.log("stage5_complete:", stage5Complete);
              console.log("stage6_complete:", stage6Complete);
              console.log("stage7_complete:", stage7Complete);
              console.log("stage8_complete:", stage8Complete);
              console.log("stage9_complete:", stage9Complete);
              console.log("stage10_complete:", stage10Complete);
              console.log("stage11_complete:", stage11Complete);
              console.log("stage12_complete:", stage12Complete);
              console.log("stage13_complete:", stage13Complete);
              
              setStagesData((prev) =>
                prev.map((stage) => {
                  if (stage.id === 2 && stage1Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 3 && stage2Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 4 && stage3Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 5 && stage4Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 6 && stage5Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 7 && stage6Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 8 && stage7Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 9 && stage8Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 10 && stage9Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 11 && stage10Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 12 && stage11Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 13 && stage12Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  if (stage.id === 14 && stage13Complete === "true") {
                    return { ...stage, unlocked: true };
                  }
                  return stage;
                })
              );
            } else {
              console.log("ステージデータが存在しません（初回アクセス時は正常）");
            }
            hasFetchedRef.current = true;
          } catch (error: any) {
            console.error("PlayFab処理エラー:", {
              error,
              message: error.message,
              stack: error.stack,
              type: typeof error
            });
          }
        }
      } catch (error: any) {
        console.error("予期せぬエラーが発生しました:", {
          error,
          message: error.message,
          stack: error.stack
        });
        
        // エラーメッセージに基づいて処理
        if (error.message === "Must be logged in to call this method") {
          Cookies.remove("token");
          router.push("/login");
        }
      }
    };

    if (isClient && !hasFetchedRef.current) {
      fetchUserData();
    }

    // コンポーネントのアンマウント時にクリーンアップ
    return () => {
      hasFetchedRef.current = false;
    };
  }, [isClient, router]);

  // 音声の初期化
  useEffect(() => {
    if (!isClient) return;

    let audioElement: HTMLAudioElement | null = new Audio("/closet.mp3");
    audioElement.loop = true;
    audioElement.volume = 0.7;
    
    const playAudio = async () => {
      try {
        if (audioElement) {
          await audioElement.play();
          setAudio(audioElement);
        }
      } catch (error) {
        console.log("Auto-play was prevented:", error);
      }
    };

    playAudio();

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
        audioElement = null;
      }
    };
  }, [isClient]);

  // ミュート状態の反映
  useEffect(() => {
    const handleAudioMute = async () => {
      if (!audio) return;
      audio.muted = isMuted;
      if (!isMuted && audio.paused) {
        try {
          await audio.play();
        } catch (error) {
          console.log("Play on unmute failed:", error);
        }
      }
    };

    handleAudioMute();
  }, [isMuted, audio]);

  // toggleMute 関数の定義
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // チャットの自動スクロール
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // 画面タップで音声再生
  const tryPlayAudio = () => {
    if (!audio || !isClient) return;
    if (audio.paused && !isMuted) {
      audio.play().catch((error) =>
        console.log("Play on screen tap failed:", error)
      );
    }
  };

  const closeWelcome = () => {
    setShowWelcome(false);
    tryPlayAudio();
  };

  const handleStageSelect = (stageId: number) => {
    const stage = stagesData.find((s) => s.id === stageId);
    if (stage && stage.unlocked) {
      setSelectedStage(stageId);
      router.push(`/closet/${stageId}`);
    }
  };

  const toggleChat = () => {
    setShowChat((prev) => !prev);
    if (!showChat && chatInputRef.current) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 300);
    }
    tryPlayAudio();
  };

  const closeChat = () => {
    setShowChat(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userMessage.trim()) {
      setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "mo-chan",
            text: "なるほど！クローゼットの整理についてですね。ステージを進めると、整理術が学べますよ！",
          },
        ]);
      }, 1000);
      setUserMessage("");
    }
  };

  const getStagePosition = (index: number, total: number) => {
    const progress = index / (total - 1);
    const amplitude = 120;
    const xOffset = Math.sin(progress * Math.PI * 2) * amplitude;
    return {
      left: `calc(50% + ${xOffset}px)`,
      top: `${100 + progress * 1800}px`,
    };
  };

  return (
    <div
      className="min-h-screen bg-teal-950 flex flex-col"
      onClick={isClient ? tryPlayAudio : undefined}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
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
            onClick={toggleMute}
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 relative">
        {showWelcome && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-teal-900 rounded-xl p-6 max-w-md border-2 border-yellow-500 shadow-lg relative">
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <div className="relative w-24 h-24" style={{ animation: "rpg-float 3s ease-in-out infinite" }}>
                  {isClient && (
                    <Image
                      src="/cow-fairy.webp"
                      alt="片付けの妖精モーちゃん"
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              </div>
              <h2 className="text-xl font-bold text-yellow-300 mt-8 mb-4 text-center">モーちゃん</h2>
              <p className="text-white text-center mb-6">
                クローゼット王国へようこそ！１ステージづつ片付けいこう！さぁ、一緒に冒険だ！
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={closeWelcome}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold"
                >
                  クローゼット王国へ
                </Button>
              </div>
            </div>
          </div>
        )}

        {isClient && (
          <div className="absolute inset-0 overflow-hidden">
            {backgroundEmojis.map((item) => (
              <div key={item.id} className="absolute" style={item.style as React.CSSProperties}>
                {item.emoji}
              </div>
            ))}
          </div>
        )}

        {/* ステージパス */}
        <div className="w-full max-w-md mx-auto mt-4 pb-20 relative">
          <div className="relative h-[2000px] w-full overflow-auto">
            {stagesData.map((stage, index) => {
              const position = getStagePosition(index, stagesData.length);
              let connectionStyle = {};
              if (index > 0) {
                const prevPosition = getStagePosition(index - 1, stagesData.length);
                const startX = Number.parseFloat(
                  prevPosition.left.replace("calc(50% + ", "").replace("px)", "")
                );
                const startY = Number.parseFloat(prevPosition.top.replace("px", ""));
                const endX = Number.parseFloat(
                  position.left.replace("calc(50% + ", "").replace("px)", "")
                );
                const endY = Number.parseFloat(position.top.replace("px", ""));
                const dx = endX - startX;
                const dy = endY - startY;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
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
                };
              }
              return (
                <div key={stage.id}>
                  {index > 0 && <div style={connectionStyle as React.CSSProperties} />}
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
                      <div
                        className={`absolute inset-0 rounded-full ${
                          stage.unlocked ? "bg-blue-500 animate-pulse" : "bg-gray-600"
                        }`}
                      ></div>
                      <div className="absolute inset-0 rounded-full border-2 border-yellow-500"></div>
                      <div className="relative z-10 text-3xl">
                        {stage.unlocked ? stage.icon : <Lock className="h-8 w-8 text-gray-300" />}
                      </div>
                    </button>
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
              );
            })}
          </div>
        </div>

        {/* チャット UI */}
        <div className="fixed bottom-4 right-4 z-20">
          <div className="relative">
            {showChat && (
              <div className="absolute bottom-full right-0 mb-2 w-64 sm:w-72 bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-3 shadow-lg border-2 border-yellow-500">
                <button
                  onClick={closeChat}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-colors duration-200 border border-yellow-400 shadow-md"
                  aria-label="チャットを閉じる"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="max-h-48 overflow-y-auto pr-1 mb-2 mt-3">
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
                  <Button type="submit" size="icon" className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer"
              style={{ animation: "rpg-float 3s ease-in-out infinite" }}
              onClick={toggleChat}
            >
              <div className="absolute -inset-1 rounded-full bg-purple-500 bg-opacity-30 animate-pulse"></div>
              {isClient && (
                <Image
                  src="/cow-fairy.webp"
                  alt="片付けの妖精モーちゃん"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ユーティリティ関数（ステージ位置計算）
function getStagePosition(index: number, total: number) {
  const progress = index / (total - 1);
  const amplitude = 120;
  const xOffset = Math.sin(progress * Math.PI * 2) * amplitude;
  return {
    left: `calc(50% + ${xOffset}px)`,
    top: `${100 + progress * 1800}px`,
  };
}
