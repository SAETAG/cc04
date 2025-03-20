// lib/playfab.ts
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
