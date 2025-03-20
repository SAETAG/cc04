import * as PlayFab from "playfab-sdk/Scripts/PlayFabClientApi"; // SDK の読み込み（SDKのバージョンによりパスは異なる）

// 初期化設定
PlayFab.settings.titleId = process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID;

export default PlayFab;
