import PlayFab from "./playfab";
import Cookies from "js-cookie"; // Cookie 保存用ライブラリ

interface PlayFabError {
  errorMessage: string;
  errorCode: number;
  errorDetails?: Record<string, string[]>;
}

interface PlayFabResult {
  data: any;
}

// サインアップ（ユーザー登録）関数
export const signUp = async ({
  name,
  email,
  password,
}: { name: string; email: string; password: string }): Promise<any> => {
  if (!PlayFab) {
    throw new Error(
      "PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。"
    );
  }

  return new Promise((resolve, reject) => {
    PlayFab.PlayFabClient.RegisterPlayFabUser(
      {
        Email: email,
        Password: password,
        Username: name,
        RequireBothUsernameAndEmail: true,
      },
      (error: PlayFabError | null, result: PlayFabResult) => {
        if (error && error.errorMessage) {
          console.error("PlayFab signUp API error:", error);
          if (error.errorDetails) {
            console.error("Error details:", JSON.stringify(error.errorDetails, null, 2));
          }
          reject(new Error(error.errorMessage));
        } else {
          console.log("サインアップ成功:", result);
          resolve(result);
        }
      }
    );
  });
};

// ログイン関数（Cookie と PlayFab.settings に SessionTicket を保存）
export const login = async ({ email, password }: { email: string; password: string }): Promise<any> => {
  if (!PlayFab) {
    throw new Error(
      "PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。"
    );
  }
  return new Promise((resolve, reject) => {
    PlayFab.PlayFabClient.LoginWithEmailAddress(
      { Email: email, Password: password },
      async (error: PlayFabError | null, result: PlayFabResult) => {
        if (error && error.errorMessage) {
          console.error("PlayFab login API error:", error);
          reject(new Error(error.errorMessage));
        } else if (result && result.data && result.data.SessionTicket) {
          const token = result.data.SessionTicket;
          const playFabId = result.data.PlayFabId;
          console.log("ログイン後のSessionTicket:", token);

          // 先にセッションチケットを設定
          PlayFab.settings.sessionTicket = token;
          
          try {
            // カスタムIDの取得を試みる
            const customId = await getOrCreateCustomId(playFabId);

            // Cookie に保存（有効期限 7 日、全パスで有効）
            Cookies.set("token", token, { expires: 7, path: "/" });
            Cookies.set("customId", customId, { expires: 7, path: "/" });
            
            console.log("Cookieに保存されたtoken:", Cookies.get("token"));
            console.log("Cookieに保存されたcustomId:", Cookies.get("customId"));
            console.log("PlayFab.settings.sessionTicket:", PlayFab.settings.sessionTicket);
            
            resolve(result);
          } catch (customError) {
            console.error("カスタムID処理中にエラーが発生しました:", customError);
            // カスタムID処理に失敗しても、メインのログインは成功とみなす
            resolve(result);
          }
        } else {
          console.error("PlayFab login API error: no SessionTicket", { error, result });
          reject(new Error("ログインに失敗しました"));
        }
      }
    );
  });
};

// カスタムIDを取得または作成する関数
const getOrCreateCustomId = async (playFabId: string): Promise<string> => {
  try {
    // まず既存のカスタムIDを取得
    const userData = await new Promise<PlayFabResult>((resolveData, rejectData) => {
      PlayFab.PlayFabClient.GetUserData(
        {
          Keys: ["customId"]
        },
        (dataError: PlayFabError | null, dataResult: PlayFabResult) => {
          if (dataError) {
            console.error("ユーザーデータ取得エラー:", dataError);
            rejectData(dataError);
          } else {
            resolveData(dataResult);
          }
        }
      );
    });

    let customId = userData?.data?.Data?.customId?.Value;

    if (!customId) {
      // カスタムIDが存在しない場合は新規作成
      customId = playFabId; // PlayFabIdをそのままカスタムIDとして使用
      
      // カスタムIDをユーザーデータに保存
      await new Promise<void>((resolveSave, rejectSave) => {
        PlayFab.PlayFabClient.UpdateUserData(
          {
            Data: { customId },
            Permission: "Private"
          },
          (saveError: PlayFabError | null) => {
            if (saveError) {
              console.error("カスタムID保存エラー:", saveError);
              rejectSave(saveError);
            } else {
              console.log("カスタムID保存成功");
              resolveSave();
            }
          }
        );
      });
    }

    // カスタムIDでログイン
    await new Promise((resolveCustom, rejectCustom) => {
      PlayFab.PlayFabClient.LoginWithCustomID(
        {
          CustomId: customId,
          CreateAccount: true
        },
        (customError: PlayFabError | null, customResult: PlayFabResult) => {
          if (customError) {
            console.error("CustomIDログインエラー:", customError);
            rejectCustom(customError);
          } else {
            console.log("CustomIDログイン成功:", customResult);
            resolveCustom(customResult);
          }
        }
      );
    });

    return customId;
  } catch (error) {
    console.error("カスタムID処理エラー:", error);
    throw error;
  }
};

// 初回ログインかどうかを確認する関数
export const checkIsFirstLogin = async (loginResult: any): Promise<boolean> => {
  if (!PlayFab) {
    throw new Error(
      "PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。"
    );
  }
  return new Promise((resolve, reject) => {
    PlayFab.PlayFabClient.GetUserData(
      {
        Keys: ["hasCompletedOnboarding"],
      },
      (error: PlayFabError | null, result: PlayFabResult) => {
        if (error && error.errorMessage) {
          console.error("PlayFab GetUserData API error:", error);
          reject(new Error(error.errorMessage || "ユーザーデータの取得に失敗しました"));
        } else {
          console.log("GetUserData result:", result);
          const data = result?.data?.Data;
          const hasCompletedOnboarding =
            data &&
            data.hasCompletedOnboarding &&
            data.hasCompletedOnboarding.Value === "true";
          resolve(!hasCompletedOnboarding);
        }
      }
    );
  });
};

// プロローグ完了後に呼び出す関数
export const markOnboardingComplete = async (): Promise<any> => {
  if (!PlayFab) {
    throw new Error(
      "PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。"
    );
  }
  return new Promise((resolve, reject) => {
    PlayFab.PlayFabClient.UpdateUserData(
      {
        Data: {
          hasCompletedOnboarding: "true",
        },
      },
      (error: PlayFabError | null, result: PlayFabResult) => {
        if (error && error.errorMessage) {
          console.error("PlayFab UpdateUserData API error:", error);
          reject(new Error(error.errorMessage || "ユーザーデータの更新に失敗しました"));
        } else {
          console.log("ユーザーデータ更新成功:", result);
          resolve(result);
        }
      }
    );
  });
};
