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
