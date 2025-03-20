import PlayFab from "./playfab";

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
    throw new Error("PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。");
  }

  return new Promise((resolve, reject) => {
    // ※コールバックのパラメーター順序を (error, result) に変更
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
          reject(error.errorMessage);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// ログイン関数
export const login = async ({ email, password }: { email: string; password: string }): Promise<any> => {
  if (!PlayFab) {
    throw new Error("PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。");
  }
  return new Promise((resolve, reject) => {
    // ※コールバックのパラメーター順序を (error, result) に変更
    PlayFab.PlayFabClient.LoginWithEmailAddress(
      { Email: email, Password: password },
      (error: PlayFabError | null, result: PlayFabResult) => {
        if (error && error.errorMessage) {
          console.error("PlayFab login API error:", error);
          reject(error.errorMessage);
        } else if (result && result.data && result.data.SessionTicket) {
          resolve(result);
        } else {
          console.error("PlayFab login API error: no SessionTicket", { error, result });
          reject("ログインに失敗しました");
        }
      }
    );
  });
};

// 初回ログインかどうかを確認する関数
export const checkIsFirstLogin = async (loginResult: any): Promise<boolean> => {
  if (!PlayFab) {
    throw new Error("PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。");
  }
  return new Promise((resolve, reject) => {
    PlayFab.PlayFabClient.GetUserData(
      {
        Keys: ["hasCompletedOnboarding"],
      },
      (error: PlayFabError | null, result: PlayFabResult) => {
        if (error && error.errorMessage) {
          console.error("PlayFab GetUserData API error:", error);
          reject(error.errorMessage || "ユーザーデータの取得に失敗しました");
        } else {
          const hasCompletedOnboarding =
            result.data.Data &&
            result.data.Data.hasCompletedOnboarding &&
            result.data.Data.hasCompletedOnboarding.Value === "true";
          resolve(!hasCompletedOnboarding);
        }
      }
    );
  });
};

// プロローグ完了後に呼び出す関数
export const markOnboardingComplete = async (): Promise<any> => {
  if (!PlayFab) {
    throw new Error("PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。");
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
          reject(error.errorMessage || "ユーザーデータの更新に失敗しました");
        } else {
          resolve(result);
        }
      }
    );
  });
};
