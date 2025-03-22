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
      PlayFab.settings.titleId = process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID || "";
      console.log("PlayFab initialized with title ID:", process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID);
    } else {
      console.error("PlayFab SDK not properly loaded");
    }
  } catch (error) {
    console.error("Failed to load PlayFab SDK:", error);
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
    const currentSessionTicket = Cookies.get("token");

    if (!customId) {
      console.error("再認証失敗: カスタムIDが見つかりません");
      Cookies.remove("token");
      reject(new Error("認証情報が見つかりません"));
      return;
    }

    console.log("再認証を試みます - CustomId:", customId);

    PlayFab.PlayFabClient.LoginWithCustomID(
      {
        CustomId: customId,
        CreateAccount: false
      },
      (result: PlayFabResult) => {
        if (result.data.SessionTicket) {
          const newSessionTicket = result.data.SessionTicket;
          if (newSessionTicket !== currentSessionTicket) {
            console.log("新しいセッションチケットを保存します");
            Cookies.set("token", newSessionTicket, { expires: 7 });
            PlayFab.settings.sessionTicket = newSessionTicket;
          }
          console.log("再認証成功");
          resolve();
        } else {
          console.error("再認証失敗: セッションチケットが取得できません");
          reject(new Error("セッションチケットの取得に失敗しました"));
        }
      },
      (error: PlayFabError) => {
        console.error("再認証エラー:", error);
        if (error.errorCode === 1001 || error.errorMessage?.includes("must be logged in")) {
          Cookies.remove("token");
          reject(new Error("セッションが無効です"));
        } else {
          reject(error);
        }
      }
    );
  });
};

// エラーハンドリングを含むPlayFab APIの呼び出しラッパー
const callPlayFabAPI = async <T>(apiCall: () => Promise<T>, retryCount = 0): Promise<T> => {
  try {
    // APIコール前にセッションチケットの存在確認
    const sessionTicket = Cookies.get("token");
    if (!sessionTicket) {
      console.log("セッションチケットが見つかりません。再認証を試みます...");
      await reAuthenticate();
    }

    return await apiCall();
  } catch (error: any) {
    console.log("API呼び出しエラー:", error);

    // セッションエラーの検出
    const isSessionError = 
      error?.errorCode === 1000 || // InvalidSessionTicket
      error?.errorCode === 1001 || // SessionTicketExpired
      error?.errorMessage?.includes("must be logged in");

    if (isSessionError && retryCount < 2) {
      console.log("セッションエラーを検出。再認証を試みます...");
      try {
        await reAuthenticate();
        return await callPlayFabAPI(apiCall, retryCount + 1);
      } catch (reAuthError) {
        console.error("再認証に失敗しました:", reAuthError);
        throw new Error("再認証に失敗しました");
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
