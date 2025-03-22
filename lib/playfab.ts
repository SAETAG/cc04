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
        console.log("PlayFab initialized with title ID:", titleId);
        console.log("PlayFab settings:", {
          titleId: PlayFab.settings.titleId,
          sessionTicket: PlayFab.settings.sessionTicket,
          debugLog: PlayFab.settings.debugLog,
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

// セッションの再認証を行う関数
const reAuthenticate = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const customId = Cookies.get("customId");
    if (!customId) {
      reject(new Error("カスタムIDが見つかりません"));
      return;
    }

    PlayFab.PlayFabClient.LoginWithCustomID(
      {
        CustomId: customId,
        CreateAccount: false
      },
      (result: PlayFabResult) => {
        if (result.data.SessionTicket) {
          const newSessionTicket = result.data.SessionTicket;
          Cookies.set("token", newSessionTicket, { expires: 7 });
          PlayFab.settings.sessionTicket = newSessionTicket;
          console.log("再認証成功:", newSessionTicket);
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
    console.log("PlayFab設定:", {
      titleId: PlayFab.settings.titleId,
      sessionTicket: PlayFab.settings.sessionTicket,
      debugLog: PlayFab.settings.debugLog
    });

    // まず統計データが存在するか確認
    PlayFab.PlayFabClient.GetPlayerStatistics(
      {
        StatisticNames: ["Experience", "DailyExperience", "WeeklyExperience"]
      },
      (result: PlayFabResult) => {
        console.log("統計データの確認結果:", result);
        console.log("統計データの確認詳細:", {
          hasResult: !!result,
          resultType: result ? typeof result : 'undefined',
          resultKeys: result ? Object.keys(result) : [],
          hasData: !!result?.data,
          dataType: result?.data ? typeof result?.data : 'undefined',
          dataKeys: result?.data ? Object.keys(result?.data) : [],
          hasStatistics: !!result?.data?.Statistics,
          statisticsLength: result?.data?.Statistics?.length || 0
        });
        
        // 統計データが既に存在する場合は初期化をスキップ
        if (result?.data?.Statistics && result.data.Statistics.length > 0) {
          console.log("統計データは既に存在します");
          resolve();
          return;
        }

        // 統計データが存在しない場合は初期化を実行
        const statistics = [
          {
            StatisticName: "Experience",
            Value: 0
          },
          {
            StatisticName: "DailyExperience",
            Value: 0
          },
          {
            StatisticName: "WeeklyExperience",
            Value: 0
          }
        ];

        console.log("統計データの初期化リクエスト:", {
          Statistics: statistics
        });

        PlayFab.PlayFabClient.UpdatePlayerStatistics(
          {
            Statistics: statistics
          },
          (updateResult: PlayFabResult) => {
            console.log("統計データの初期化結果:", updateResult);
            console.log("統計データの初期化詳細:", {
              hasResult: !!updateResult,
              resultType: updateResult ? typeof updateResult : 'undefined',
              resultKeys: updateResult ? Object.keys(updateResult) : [],
              hasData: !!updateResult?.data,
              dataType: updateResult?.data ? typeof updateResult?.data : 'undefined',
              dataKeys: updateResult?.data ? Object.keys(updateResult?.data) : []
            });

            if (!updateResult) {
              reject(new Error("統計データの初期化に失敗: 結果がnullです"));
              return;
            }
            resolve();
          },
          (error: PlayFabError) => {
            console.error("統計データの初期化エラー:", error);
            console.error("エラー詳細:", {
              errorMessage: error.errorMessage,
              errorCode: error.errorCode,
              errorDetails: error.errorDetails,
              sessionTicket: PlayFab.settings.sessionTicket
            });
            reject(new Error(`統計データの初期化に失敗: ${error.errorMessage}`));
          }
        );
      },
      (error: PlayFabError) => {
        console.error("統計データの確認エラー:", error);
        console.error("エラー詳細:", {
          errorMessage: error.errorMessage,
          errorCode: error.errorCode,
          errorDetails: error.errorDetails,
          sessionTicket: PlayFab.settings.sessionTicket
        });
        reject(new Error(`統計データの確認に失敗: ${error.errorMessage}`));
      }
    );
  });
};

// 経験値を取得する関数
export const getExperience = async (): Promise<{
  total: number;
  daily: number;
  weekly: number;
}> => {
  return callPlayFabAPI(async () => {
    return new Promise((resolve, reject) => {
      const sessionTicket = Cookies.get("token");
      if (!sessionTicket) {
        reject(new Error("セッションチケットが見つかりません"));
        return;
      }

      PlayFab.settings.sessionTicket = sessionTicket;
      console.log("経験値取得開始 - セッションチケット:", sessionTicket);

      // 全ての統計データを取得
      PlayFab.PlayFabClient.GetPlayerStatistics(
        {
          StatisticNames: ["Experience", "DailyExperience", "WeeklyExperience"]
        },
        (result: PlayFabResult) => {
          console.log("GetPlayerStatistics レスポンス:", result);
          console.log("GetPlayerStatistics 詳細:", {
            hasResult: !!result,
            resultType: result ? typeof result : 'undefined',
            resultKeys: result ? Object.keys(result) : [],
            hasData: !!result?.data,
            dataType: result?.data ? typeof result?.data : 'undefined',
            dataKeys: result?.data ? Object.keys(result?.data) : [],
            hasStatistics: !!result?.data?.Statistics,
            statisticsLength: result?.data?.Statistics?.length || 0,
            sessionTicket: PlayFab.settings.sessionTicket
          });
          
          // 結果がnullまたはundefinedの場合
          if (!result) {
            console.warn("GetPlayerStatisticsの結果がnullです");
            // 統計データが存在しない場合は初期化
            initializeExperience()
              .then(() => {
                console.log("統計データの初期化成功");
                resolve({ total: 0, daily: 0, weekly: 0 });
              })
              .catch(error => {
                console.error("統計データの初期化に失敗:", error);
                reject(new Error(`統計データの初期化に失敗: ${error.message}`));
              });
            return;
          }

          // 統計データが存在しない場合
          if (!result.data?.Statistics || result.data.Statistics.length === 0) {
            console.warn("統計データが存在しません");
            // 統計データが存在しない場合は初期化
            initializeExperience()
              .then(() => {
                console.log("統計データの初期化成功");
                resolve({ total: 0, daily: 0, weekly: 0 });
              })
              .catch(error => {
                console.error("統計データの初期化に失敗:", error);
                reject(new Error(`統計データの初期化に失敗: ${error.message}`));
              });
            return;
          }

          const stats = result.data.Statistics;
          const experience = {
            total: stats.find((s: { StatisticName: string; Value: number }) => s.StatisticName === "Experience")?.Value || 0,
            daily: stats.find((s: { StatisticName: string; Value: number }) => s.StatisticName === "DailyExperience")?.Value || 0,
            weekly: stats.find((s: { StatisticName: string; Value: number }) => s.StatisticName === "WeeklyExperience")?.Value || 0
          };

          console.log("取得した経験値:", experience);
          resolve(experience);
        },
        (error: PlayFabError) => {
          console.error("経験値の取得に失敗:", error);
          console.error("エラー詳細:", {
            errorMessage: error.errorMessage,
            errorCode: error.errorCode,
            errorDetails: error.errorDetails,
            sessionTicket: PlayFab.settings.sessionTicket
          });
          reject(new Error(`経験値の取得に失敗: ${error.errorMessage}`));
        }
      );
    });
  });
};

// 経験値を更新する関数を改善
export const updateExperience = async (expAmount: number): Promise<void> => {
  return callPlayFabAPI(async () => {
    return new Promise((resolve, reject) => {
      const sessionTicket = Cookies.get("token");
      if (!sessionTicket) {
        reject(new Error("セッションチケットが見つかりません"));
        return;
      }

      PlayFab.settings.sessionTicket = sessionTicket;
      console.log("UpdateExperience - セッションチケット:", sessionTicket);

      // 現在の経験値を取得
      getExperience()
        .then(currentExp => {
          // 新しい経験値を計算
          const newTotalExp = currentExp.total + expAmount;
          const newDailyExp = currentExp.daily + expAmount;
          const newWeeklyExp = currentExp.weekly + expAmount;

          console.log("更新前の経験値:", currentExp);
          console.log("更新後の経験値:", {
            total: newTotalExp,
            daily: newDailyExp,
            weekly: newWeeklyExp
          });

          const statistics = [
            {
              StatisticName: "Experience",
              Value: newTotalExp
            },
            {
              StatisticName: "DailyExperience",
              Value: newDailyExp
            },
            {
              StatisticName: "WeeklyExperience",
              Value: newWeeklyExp
            }
          ];

          console.log("UpdatePlayerStatistics リクエスト:", {
            Statistics: statistics
          });

          // 経験値を更新
          PlayFab.PlayFabClient.UpdatePlayerStatistics(
            {
              Statistics: statistics
            },
            (updateResult: PlayFabResult) => {
              console.log("UpdatePlayerStatistics レスポンス:", updateResult);
              console.log("UpdatePlayerStatistics 詳細:", {
                hasResult: !!updateResult,
                resultType: updateResult ? typeof updateResult : 'undefined',
                resultKeys: updateResult ? Object.keys(updateResult) : [],
                hasData: !!updateResult?.data,
                dataType: updateResult?.data ? typeof updateResult?.data : 'undefined',
                dataKeys: updateResult?.data ? Object.keys(updateResult?.data) : []
              });
              
              if (!updateResult) {
                console.error("UpdatePlayerStatisticsの結果がnullです");
                reject(new Error("経験値の更新に失敗: 結果がnullです"));
                return;
              }

              if (!updateResult.data) {
                console.error("UpdatePlayerStatisticsのデータが存在しません");
                reject(new Error("経験値の更新に失敗: データが存在しません"));
                return;
              }

              console.log(`経験値を更新しました：
                累積: ${currentExp.total} → ${newTotalExp} (+${expAmount})
                日次: ${currentExp.daily} → ${newDailyExp} (+${expAmount})
                週次: ${currentExp.weekly} → ${newWeeklyExp} (+${expAmount})`);
              resolve();
            },
            (error: PlayFabError) => {
              console.error("経験値の更新に失敗:", error);
              console.error("エラー詳細:", {
                errorMessage: error.errorMessage,
                errorCode: error.errorCode,
                errorDetails: error.errorDetails
              });
              reject(new Error(`経験値の更新に失敗: ${error.errorMessage}`));
            }
          );
        })
        .catch(error => {
          console.error("現在の経験値の取得に失敗:", error);
          reject(error);
        });
    });
  });
};
