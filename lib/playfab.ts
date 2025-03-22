import Cookies from "js-cookie";

let PlayFab: any = null;

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
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    PlayFab.PlayFabClient.UpdateUserData(
      {
        Data: data,
        Permission: "Public", // 必要に応じて "Private" に変更
      },
      (result: any) => {
        console.log("User data updated successfully:", result);
        resolve(result);
      },
      (error: any) => {
        console.error("Error updating user data:", error);
        reject(error);
      }
    );
  });
};

// ステージのクリアデータを保存するための関数
export const saveStageComplete = async (stageNumber: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    // セッションチケットの確認
    const sessionTicket = Cookies.get("token");
    if (!sessionTicket) {
      console.error("セッションチケットが見つかりません");
      reject(new Error("セッションチケットが見つかりません"));
      return;
    }

    // セッションチケットの設定
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
      (result: any) => {
        console.log(`UpdateUserData レスポンス:`, result);
        // resultがnullでも成功とみなす（PlayFabの仕様）
        resolve();
      },
      (error: any) => {
        console.error(`ステージ${stageNumber}のクリアデータの保存エラー詳細:`, {
          error,
          sessionTicket: PlayFab.settings.sessionTicket
        });
        reject(error?.errorMessage || error || "不明なエラーが発生しました");
      }
    );
  });
};

// ステージのクリアデータを取得するための関数
export const getStageComplete = async (stageNumber: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // セッションチケットの確認と設定
    const sessionTicket = Cookies.get("token");
    if (!sessionTicket) {
      console.error("セッションチケットが見つかりません");
      reject(new Error("セッションチケットが見つかりません"));
      return;
    }

    // セッションチケットの設定
    PlayFab.settings.sessionTicket = sessionTicket;
    console.log(`GetUserData呼び出し前のセッションチケット:`, sessionTicket);

    PlayFab.PlayFabClient.GetUserData(
      {
        Keys: [`stage${stageNumber}_complete`]
      },
      (result: any) => {
        console.log(`GetUserData レスポンス (stage${stageNumber}):`, result);
        const isComplete = result?.data?.Data?.[`stage${stageNumber}_complete`]?.Value === "true";
        console.log(`ステージ${stageNumber}完了状態:`, isComplete);
        resolve(isComplete);
      },
      (error: any) => {
        console.error(`ステージ${stageNumber}のクリアデータの取得エラー:`, error);
        reject(error?.errorMessage || error || "不明なエラーが発生しました");
      }
    );
  });
};
