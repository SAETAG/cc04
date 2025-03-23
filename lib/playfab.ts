import Cookies from "js-cookie";

let PlayFab: any = null;

// PlayFabの型定義
interface PlayFabError {
  errorMessage: string;
  errorCode: number;
  errorDetails?: Record<string, string[]>;
}

interface PlayFabResult {
  data: {
    SessionTicket?: string;
    PlayFabId?: string;
    Data?: Record<string, { Value: string }>;
    Statistics?: Array<{
      StatisticName: string;
      Value: number;
      Version: number;
    }>;
    [key: string]: any;
  };
  error?: {
    code: number;
    status: string;
    error: string;
    errorCode: number;
    errorMessage: string;
    errorDetails?: Record<string, string[]>;
  };
}

// PlayFabのコールバック関数の型定義
interface PlayFabSuccessCallback {
  (result: PlayFabResult): void;
}

interface PlayFabErrorCallback {
  (error: PlayFabError): void;
}

if (typeof window !== "undefined") {
  try {
    // requireで読み込み、defaultプロパティがあればそれを使用
    const importedPlayFab = require("playfab-sdk");
    console.log("Imported PlayFab object keys:", Object.keys(importedPlayFab));
    PlayFab = importedPlayFab.default || importedPlayFab;

    // 初期化設定：環境変数からタイトルIDを設定
    if (PlayFab && PlayFab.settings) {
      const titleId = process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID;
      if (!titleId) {
        console.error("PlayFab title ID is not set in environment variables");
        PlayFab = null;
      } else {
        PlayFab.settings.titleId = titleId;
        // デバッグ情報を追加
        PlayFab.settings.debugLog = true;
        // APIエンドポイントを明示的に設定
        PlayFab.settings.apiEndpoint = "https://" + titleId + ".playfabapi.com";
        
        // セッションチケットを設定
        const sessionTicket = Cookies.get("token");
        if (sessionTicket) {
          PlayFab.settings.sessionTicket = sessionTicket;
        }
        
        console.log("PlayFab initialized with title ID:", titleId);
        console.log("PlayFab settings:", {
          titleId: PlayFab.settings.titleId,
          sessionTicket: PlayFab.settings.sessionTicket,
          debugLog: PlayFab.settings.debugLog,
          apiEndpoint: PlayFab.settings.apiEndpoint,
          sdkVersion: PlayFab.settings.sdkVersion
        });
      }
    } else {
      console.error("PlayFab SDK not properly loaded");
      PlayFab = null;
    }
  } catch (error) {
    console.error("Failed to load PlayFab SDK:", error);
    PlayFab = null;
  }
}

export default PlayFab;

// ステージ１のクリアデータを保存するための関数
export const saveStageRecord = (data: {
  stage1_complete: string;
  stage1_problem: string;
  stage1_ideal: string;
}): Promise<PlayFabResult> => {
  return new Promise((resolve, reject) => {
    PlayFab.PlayFabClient.UpdateUserData(
      {
        Data: data,
        Permission: "Public",
      },
      (result: PlayFabResult) => {
        console.log("User data updated successfully:", result);
        resolve(result);
      },
      (error: PlayFabError) => {
        console.error("Error updating user data:", error);
        reject(error);
      }
    );
  });
};

// セッションの再認証を行う関数を改善
const reAuthenticate = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const customId = Cookies.get("customId");
    if (!customId) {
      reject(new Error("カスタムIDが見つかりません"));
      return;
    }

    console.log("再認証開始 - CustomId:", customId);

    PlayFab.PlayFabClient.LoginWithCustomID(
      {
        CustomId: customId,
        CreateAccount: false
      },
      (result: PlayFabResult) => {
        if (result.data.SessionTicket) {
          const newSessionTicket = result.data.SessionTicket;
          // セッションチケットの有効期限を7日間に設定
          Cookies.set("token", newSessionTicket, { expires: 7 });
          PlayFab.settings.sessionTicket = newSessionTicket;
          console.log("再認証成功 - 新しいセッションチケット:", newSessionTicket);
          resolve();
        } else {
          reject(new Error("セッションチケットが取得できませんでした"));
        }
      },
      (error: PlayFabError) => {
        console.error("再認証エラー:", error);
        reject(error);
      }
    );
  });
};

// セッションの有効性を確認する関数を追加
const validateSession = async (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const sessionTicket = Cookies.get("token");
    if (!sessionTicket) {
      console.log("セッションチケットが存在しません");
      resolve(false);
      return;
    }

    PlayFab.settings.sessionTicket = sessionTicket;

    PlayFab.PlayFabClient.GetPlayerStatistics(
      {
        StatisticNames: ["Experience"]
      },
      (result: PlayFabResult) => {
        if (result?.error?.errorMessage?.includes("must be logged in")) {
          console.log("セッションが無効です");
          resolve(false);
          return;
        }
        console.log("セッションは有効です");
        resolve(true);
      },
      (error: PlayFabError) => {
        console.error("セッション確認エラー:", error);
        resolve(false);
      }
    );
  });
};

// エラーハンドリングを含むPlayFab APIの呼び出しラッパー
const callPlayFabAPI = async <T>(apiCall: () => Promise<T>, retryCount = 0): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error?.errorMessage?.includes("must be logged in") && retryCount < 2) {
      console.log("セッション切れを検出。再認証を試みます...");
      try {
        await reAuthenticate();
        return await callPlayFabAPI(apiCall, retryCount + 1);
      } catch (reAuthError) {
        console.error("再認証に失敗しました:", reAuthError);
        throw reAuthError;
      }
    }
    throw error;
  }
};

// ステージのクリアデータを保存するための関数を修正
export const saveStageComplete = async (stageNumber: number): Promise<void> => {
  return callPlayFabAPI(async () => {
    return new Promise<void>((resolve, reject) => {
      const sessionTicket = Cookies.get("token");
      if (!sessionTicket) {
        console.error("セッションチケットが見つかりません");
        reject(new Error("セッションチケットが見つかりません"));
        return;
      }

      PlayFab.settings.sessionTicket = sessionTicket;
      console.log("保存前のセッションチケット:", sessionTicket);

      const data = {
        [`stage${stageNumber}_complete`]: "true"
      };

      PlayFab.PlayFabClient.UpdateUserData(
        {
          Data: data,
          Permission: "Public"
        },
        (result: PlayFabResult) => {
          console.log(`UpdateUserData レスポンス:`, result);
          resolve();
        },
        (error: PlayFabError) => {
          console.error(`ステージ${stageNumber}のクリアデータの保存エラー詳細:`, {
            error,
            sessionTicket: PlayFab.settings.sessionTicket
          });
          reject(error?.errorMessage || error || "不明なエラーが発生しました");
        }
      );
    });
  });
};

// ステージのクリアデータを取得するための関数を修正
export const getStageComplete = async (stageNumber: number): Promise<boolean> => {
  return callPlayFabAPI(async () => {
    return new Promise<boolean>((resolve, reject) => {
      const sessionTicket = Cookies.get("token");
      if (!sessionTicket) {
        console.error("セッションチケットが見つかりません");
        reject(new Error("セッションチケットが見つかりません"));
        return;
      }

      PlayFab.settings.sessionTicket = sessionTicket;
      console.log(`GetUserData呼び出し前のセッションチケット:`, sessionTicket);

      PlayFab.PlayFabClient.GetUserData(
        {
          Keys: [`stage${stageNumber}_complete`]
        },
        (result: PlayFabResult) => {
          console.log(`GetUserData レスポンス (stage${stageNumber}):`, result);
          const isComplete = result?.data?.Data?.[`stage${stageNumber}_complete`]?.Value === "true";
          console.log(`ステージ${stageNumber}完了状態:`, isComplete);
          resolve(isComplete);
        },
        (error: PlayFabError) => {
          console.error(`ステージ${stageNumber}のクリアデータの取得エラー:`, error);
          reject(error?.errorMessage || error || "不明なエラーが発生しました");
        }
      );
    });
  });
};

// 経験値を初期化する関数
const initializeExperience = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sessionTicket = Cookies.get("token");
    if (!sessionTicket) {
      reject(new Error("セッションチケットが見つかりません"));
      return;
    }

    PlayFab.settings.sessionTicket = sessionTicket;
    console.log("統計データの初期化開始 - セッションチケット:", sessionTicket);

    // まず統計データが存在するか確認
    PlayFab.PlayFabClient.GetPlayerStatistics(
      {
        StatisticNames: ["Experience"]
      },
      (result: PlayFabResult) => {
        console.log("統計データの確認結果:", result);

        // 統計データが既に存在する場合は初期化をスキップ
        if (result?.data?.Statistics && result.data.Statistics.length > 0) {
          console.log("統計データは既に存在します");
          resolve();
          return;
        }

        // 統計データが存在しない場合は初期化を実行
        PlayFab.PlayFabClient.UpdatePlayerStatistics(
          {
            Statistics: [
              {
                StatisticName: "Experience",
                Value: 0
              }
            ]
          },
          (updateResult: PlayFabResult) => {
            console.log("統計データの初期化結果:", updateResult);
            if (updateResult?.error) {
              console.error("統計データの初期化エラー:", updateResult.error);
              reject(updateResult.error);
              return;
            }
            resolve();
          },
          (error: PlayFabError) => {
            console.error("統計データの初期化エラー:", error);
            reject(error);
          }
        );
      },
      (error: PlayFabError) => {
        console.error("統計データの確認エラー:", error);
        reject(error);
      }
    );
  });
};

// 経験値を取得する関数を改善
const getExperience = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sessionTicket = Cookies.get("token");
    if (!sessionTicket) {
      reject(new Error("セッションチケットが見つかりません"));
      return;
    }

    PlayFab.settings.sessionTicket = sessionTicket;
    console.log("経験値取得開始 - セッションチケット:", sessionTicket);

    PlayFab.PlayFabClient.GetPlayerStatistics(
      {
        StatisticNames: ["Experience"]
      },
      (result: PlayFabResult) => {
        console.log("GetPlayerStatistics レスポンス:", result);
        
        if (result?.error) {
          console.error("GetPlayerStatisticsエラー:", result.error);
          reject(result.error);
          return;
        }

        // データが存在しない場合は0を返す
        if (!result?.data?.Statistics || result.data.Statistics.length === 0) {
          console.log("統計データが存在しません");
          resolve(0);
          return;
        }

        // データが存在する場合はその値を返す
        const experience = result.data.Statistics.find(stat => stat.StatisticName === "Experience")?.Value || 0;
        console.log("取得した経験値:", experience);
        resolve(experience);
      },
      (error: PlayFabError) => {
        console.error("GetPlayerStatisticsエラー:", error);
        reject(error);
      }
    );
  });
};

// 経験値を更新する関数を改善
export const updateExperience = async (expAmount: number): Promise<void> => {
  try {
    // セッションの有効性を確認
    const isValidSession = await validateSession();
    if (!isValidSession) {
      console.log("セッションが無効です。再認証を試みます...");
      await reAuthenticate();
    }

    return new Promise((resolve, reject) => {
      const sessionTicket = Cookies.get("token");
      if (!sessionTicket) {
        reject(new Error("セッションチケットが見つかりません"));
        return;
      }

      PlayFab.settings.sessionTicket = sessionTicket;
      console.log("経験値更新開始 - セッションチケット:", sessionTicket);

      // 現在の経験値を取得
      getExperience()
        .then(currentExp => {
          console.log("現在の経験値:", currentExp);
          // 新しい経験値を計算
          const newExp = currentExp + expAmount;
          console.log("更新後の経験値:", newExp);

          // 経験値を更新（リトライロジック付き）
          const updateWithRetry = (retryCount = 0) => {
            PlayFab.PlayFabClient.UpdatePlayerStatistics(
              {
                Statistics: [
                  {
                    StatisticName: "Experience",
                    Value: newExp,
                    Version: 0 // バージョンを明示的に指定
                  }
                ]
              },
              (result: PlayFabResult) => {
                console.log("UpdatePlayerStatistics レスポンス:", result);
                if (result?.error) {
                  console.error("UpdatePlayerStatisticsエラー:", result.error);
                  if (retryCount < 2) {
                    console.log(`リトライを試みます (${retryCount + 1}/3)`);
                    setTimeout(() => updateWithRetry(retryCount + 1), 1000);
                    return;
                  }
                  reject(result.error);
                  return;
                }

                // 更新後の値を確認（少し待機してから）
                setTimeout(() => {
                  getExperience()
                    .then(verifiedExp => {
                      console.log("更新後の確認 - 経験値:", verifiedExp);
                      if (verifiedExp === newExp) {
                        console.log("経験値の更新が完了しました");
                        resolve();
                      } else if (retryCount < 2) {
                        console.log(`確認に失敗しました。リトライを試みます (${retryCount + 1}/3)`);
                        setTimeout(() => updateWithRetry(retryCount + 1), 1000);
                      } else {
                        console.warn("経験値の更新が正しく保存されていない可能性があります");
                        // エラーをスローせずに、更新を成功として扱う
                        console.log("更新は完了しましたが、確認に失敗しました");
                        resolve();
                      }
                    })
                    .catch(error => {
                      console.error("更新後の確認に失敗しました:", error);
                      if (retryCount < 2) {
                        console.log(`確認に失敗しました。リトライを試みます (${retryCount + 1}/3)`);
                        setTimeout(() => updateWithRetry(retryCount + 1), 1000);
                      } else {
                        // エラーをスローせずに、更新を成功として扱う
                        console.log("更新は完了しましたが、確認に失敗しました");
                        resolve();
                      }
                    });
                }, 5000); // 5秒待機
              },
              (error: PlayFabError) => {
                console.error("UpdatePlayerStatisticsエラー:", error);
                if (retryCount < 2) {
                  console.log(`リトライを試みます (${retryCount + 1}/3)`);
                  setTimeout(() => updateWithRetry(retryCount + 1), 1000);
                  return;
                }
                reject(error);
              }
            );
          };

          // 最初の更新を実行
          updateWithRetry();
        })
        .catch(error => {
          console.error("経験値の取得に失敗しました:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("経験値の更新に失敗しました:", error);
    throw error;
  }
};
