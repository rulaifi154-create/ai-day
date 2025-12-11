import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/components/Providers";
import AuthButton from "@/components/AuthButton";

export const metadata = {
  title: "AI-Day 活动",
  description: "AI-Day 活动：提交作品，用 3 票为喜欢的作品投票"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <Providers>
          <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6">
            <header className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-widest text-sky-400">
                  AI-Day
                </div>
                <div className="text-lg font-medium text-slate-100">
                  长期开放的 AI 创意作品活动
                </div>
              </div>
              <div className="flex items-center gap-4">
                <nav className="flex gap-3 text-sm">
                  <a href="/" className="rounded border border-slate-700 px-3 py-1.5 hover:border-sky-400 hover:text-sky-300">
                    首页
                  </a>
                  <a href="/submit" className="rounded border border-slate-700 px-3 py-1.5 hover:border-emerald-400 hover:text-emerald-300">
                    作品提交
                  </a>
                  <a href="/vote" className="rounded border border-slate-700 px-3 py-1.5 hover:border-amber-400 hover:text-amber-300">
                    我要投票
                  </a>
                </nav>
                <AuthButton />
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-500">
              AI-Day 活动 · 持续开放 · 使用 Google 登录参与提交与投票
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}








