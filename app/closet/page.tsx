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
        const customIdFromCookie = Cookies.get("customId");
        
        if (!tokenFromCookie || !customIdFromCookie) {
          console.error("必要なCookieが見つかりません");
          router.push("/login");
          return;
        }

        console.log("Token from cookie:", tokenFromCookie);
        console.log("CustomId from cookie:", customIdFromCookie);
        
        // セッションチケットを設定
        PlayFab.settings.sessionTicket = tokenFromCookie;

        // セッションの再認証を試みる
        try {
          await new Promise((resolve, reject) => {
            PlayFab.PlayFabClient.LoginWithCustomID({
              CustomId: customIdFromCookie,
              CreateAccount: false
            }, (error: any, result: any) => {
              if (error) {
                console.error("セッション再認証エラー:", error);
                reject(error);
                return;
              }
              
              // 新しいセッションチケットを保存
              const newSessionTicket = result.data.SessionTicket;
              PlayFab.settings.sessionTicket = newSessionTicket;
              Cookies.set("token", newSessionTicket, { expires: 7 });
              resolve(result);
            });
          });
          
          console.log("セッション再認証成功");
        } catch (error: any) {
          console.error("セッション再認証失敗:", error);
          Cookies.remove("token");
          Cookies.remove("customId");
          router.push("/login");
          return;
        }

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
    if (audio) {
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  const handleStageSelect = (stageId: number) => {
    setSelectedStage(stageId);
    router.push(`/closet/${stageId}/battle`);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat && chatInputRef.current) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  };

  const closeChat = () => {
    setShowChat(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);
    setUserMessage("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "mo-chan",
          text: "申し訳ありません。現在メンテナンス中です。",
        },
      ]);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
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
    <div className="relative min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 overflow-hidden">
      {/* 背景の絵文字アニメーション */}
      {backgroundEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute animate-float"
          style={item.style}
        >
          {item.emoji}
        </div>
      ))}

      {/* ヘッダー */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <Link href="/">
          <Button variant="outline" size="icon">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
        <Button variant="outline" size="icon" onClick={toggleMute}>
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stagesData.map((stage, index) => (
            <div
              key={stage.id}
              className={`relative p-4 rounded-lg border-2 ${
                stage.unlocked
                  ? "border-yellow-400 bg-purple-800 bg-opacity-80 cursor-pointer hover:bg-purple-700"
                  : "border-gray-600 bg-gray-800 bg-opacity-80 cursor-not-allowed"
              }`}
              onClick={() => stage.unlocked && handleStageSelect(stage.id)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{stage.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">
                  ステージ {stage.id}
                </h3>
                <p className="text-sm text-gray-300">{stage.name}</p>
              </div>
              {!stage.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <Lock className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* チャットボタン */}
      <div className="fixed bottom-4 right-4 z-20">
        <Button
          onClick={toggleChat}
          className="rounded-full w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-purple-900"
        >
          <Send className="w-6 h-6" />
        </Button>
      </div>

      {/* チャットウィンドウ */}
      {showChat && (
        <div className="fixed bottom-20 right-4 w-80 bg-purple-900 rounded-lg shadow-xl z-20 border-2 border-yellow-500">
          <div className="flex justify-between items-center p-3 border-b border-yellow-500">
            <h3 className="text-yellow-300 font-bold">モーちゃんに相談する</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChat}
              className="text-yellow-300 hover:text-yellow-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 overflow-y-auto p-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-yellow-500 text-purple-900"
                      : "bg-purple-700 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-yellow-500">
            <div className="flex gap-2">
              <Input
                ref={chatInputRef}
                type="text"
                placeholder="メッセージを入力..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="flex-1 bg-purple-800 border-yellow-500 text-white placeholder-purple-300"
              />
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-purple-900"
              >
                送信
              </Button>
            </div>
          </form>
        </div>
      )}
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
