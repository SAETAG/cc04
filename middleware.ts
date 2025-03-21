import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // クッキー "token" に認証情報があると仮定
  const token = request.cookies.get('token')?.value;

  // 認証が必要なパス
  const protectedPaths = ['/home', '/closet', '/forest', '/lake', '/mountain', '/user'];

  // 現在のリクエストパスが保護対象か確認
  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    // 認証情報がなければログインページへリダイレクト
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// matcher を使って、特定のパスにのみミドルウェアを適用
export const config = {
  matcher: [
    '/home/:path*',
    '/closet/:path*',
    '/forest/:path*',
    '/lake/:path*',
    '/mountain/:path*',
    '/user/:path*'
  ],
};
