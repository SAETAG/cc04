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

  try {
    // まずメールアドレスでログイン
    const emailLoginResult = await new Promise<PlayFabResult>((resolve, reject) => {
      PlayFab.PlayFabClient.LoginWithEmailAddress(
        { Email: email, Password: password },
        (error: PlayFabError | null, result: PlayFabResult) => {
          if (error) {
            console.error("PlayFab login API error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (!emailLoginResult?.data?.SessionTicket || !emailLoginResult?.data?.PlayFabId) {
      throw new Error("ログインに失敗しました: セッションチケットまたはPlayFabIdが取得できません");
    }

    const token = emailLoginResult.data.SessionTicket;
    const playFabId = emailLoginResult.data.PlayFabId;

    // セッションチケットを設定
    PlayFab.settings.sessionTicket = token;
    console.log("メールログイン成功。SessionTicket:", token);

    // PlayFabIdをカスタムIDとして使用
    const customId = playFabId;

    try {
      // カスタムIDでログイン（既存アカウントとリンク）
      await new Promise<void>((resolve, reject) => {
        PlayFab.PlayFabClient.LinkCustomID(
          {
            CustomId: customId,
            ForceLink: true
          },
          (error: PlayFabError | null, result: PlayFabResult) => {
            if (error) {
              // エラーの場合、既にリンクされている可能性があるので無視
              console.log("CustomID既にリンク済みの可能性があります:", error);
              resolve();
            } else {
              console.log("CustomIDリンク成功:", result);
              resolve();
            }
          }
        );
      });

      // Cookie に保存（有効期限 7 日、全パスで有効）
      Cookies.set("token", token, { expires: 7, path: "/" });
      Cookies.set("customId", customId, { expires: 7, path: "/" });
      
      console.log("認証情報を保存しました");
      console.log("- token:", Cookies.get("token"));
      console.log("- customId:", Cookies.get("customId"));
      console.log("- sessionTicket:", PlayFab.settings.sessionTicket);
      
      return emailLoginResult;
    } catch (linkError) {
      console.error("CustomIDリンク中にエラーが発生しました:", linkError);
      // リンクに失敗しても、メインのログインは成功とみなす
      return emailLoginResult;
    }
  } catch (error) {
    console.error("ログイン処理中にエラーが発生しました:", error);
    throw new Error(error?.errorMessage || "ログインに失敗しました");
  }
};

// セッションを復元する関数
export const restoreSession = async (): Promise<boolean> => {
  if (!PlayFab) {
    throw new Error(
      "PlayFab SDK が利用できません。クライアントサイドで実行されていることを確認してください。"
    );
  }

  try {
    const token = Cookies.get("token");
    const customId = Cookies.get("customId");

    if (!token || !customId) {
      console.log("セッション情報が見つかりません");
      return false;
    }

    // まずカスタムIDでログインを試みる
    try {
      await new Promise<void>((resolve, reject) => {
        PlayFab.PlayFabClient.LoginWithCustomID(
          {
            CustomId: customId,
            CreateAccount: false
          },
          (error: PlayFabError | null, result: PlayFabResult) => {
            if (error) {
              console.error("CustomIDログインエラー:", error);
              reject(error);
            } else {
              console.log("CustomIDログイン成功");
              resolve();
            }
          }
        );
      });

      // セッションチケットを設定
      PlayFab.settings.sessionTicket = token;

      // セッションの有効性を確認
      const isValid = await new Promise<boolean>((resolve) => {
        PlayFab.PlayFabClient.GetUserData(
          { Keys: ["hasCompletedOnboarding"] },
          (error: PlayFabError | null, result: PlayFabResult) => {
            if (error) {
              console.error("セッション確認エラー:", error);
              resolve(false);
            } else {
              console.log("セッション復元成功");
              resolve(true);
            }
          }
        );
      });

      if (!isValid) {
        // セッションが無効な場合はCookieを削除
        Cookies.remove("token", { path: "/" });
        Cookies.remove("customId", { path: "/" });
        return false;
      }

      return true;
    } catch (customLoginError) {
      console.error("カスタムIDログインに失敗しました:", customLoginError);
      // カスタムIDログインに失敗した場合はCookieを削除
      Cookies.remove("token", { path: "/" });
      Cookies.remove("customId", { path: "/" });
      return false;
    }
  } catch (error) {
    console.error("セッション復元中にエラーが発生しました:", error);
    return false;
  }
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
