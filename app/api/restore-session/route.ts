import { restoreSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isSessionValid = await restoreSession();
    
    if (!isSessionValid) {
      return NextResponse.json(
        { error: "セッションが無効です" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("セッション復元エラー:", error);
    return NextResponse.json(
      { error: "セッションの復元に失敗しました" },
      { status: 500 }
    );
  }
} 