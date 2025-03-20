declare module "playfab-sdk/Scripts/PlayFabClientApi" {
  // PlayFab SDKの基本的な型定義
  export interface PlayFabSettings {
    titleId: string
    // 他の設定プロパティがあれば追加
  }

  export interface PlayFabError {
    errorMessage: string
    errorCode: number
    errorDetails?: Record<string, string[]>
  }

  export interface PlayFabResult {
    data: any
    // 他のプロパティがあれば追加
  }

  export type PlayFabCallback = (result: PlayFabResult, error: PlayFabError | null) => void

  // PlayFab APIメソッドの型定義
  export function RegisterPlayFabUser(
    request: {
      Email: string
      Password: string
      Username: string
      RequireBothUsernameAndEmail: boolean
    },
    callback: PlayFabCallback,
  ): void

  export function LoginWithEmailAddress(
    request: {
      Email: string
      Password: string
    },
    callback: PlayFabCallback,
  ): void

  export function GetUserData(
    request: {
      Keys: string[]
    },
    callback: PlayFabCallback,
  ): void

  export function UpdateUserData(
    request: {
      Data: Record<string, string>
    },
    callback: PlayFabCallback,
  ): void

  // 設定オブジェクト
  export const settings: PlayFabSettings
}

