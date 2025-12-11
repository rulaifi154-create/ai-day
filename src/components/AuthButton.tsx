'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <button className="rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-400">
        加载中...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-300">
          {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded border border-slate-700 px-3 py-1.5 text-sm hover:border-red-400 hover:text-red-300"
        >
          退出
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="rounded border border-sky-500 bg-sky-500/10 px-3 py-1.5 text-sm text-sky-300 hover:bg-sky-500/20"
    >
      使用 Google 登录
    </button>
  );
}

