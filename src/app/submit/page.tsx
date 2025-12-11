'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!session) {
      setError('请先登录');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('作品名称和简介不能为空');
      return;
    }

    if (description.trim().length < 20 || description.trim().length > 300) {
      setError('作品简介应在 20-300 字之间');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '提交失败');
      }

      setSuccess(true);
      setTitle('');
      setDescription('');
      setTimeout(() => {
        router.push('/vote');
      }, 1500);
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="max-w-xl space-y-6">
        <div className="text-slate-400">加载中...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">作品提交</h2>
          <p className="mt-1 text-sm text-slate-300">
            请先使用 Google 登录后才能提交作品。
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300">
          请先登录后再提交作品
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-50">作品提交</h2>
        <p className="mt-1 text-sm text-slate-300">
          填写作品名称和简介，提交后作品会自动出现在「我要投票」页面，供所有人投票。
        </p>
      </div>

      {success && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          提交成功！正在跳转到投票页...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="title">
            作品名称 <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：AI 智能写作助手"
            maxLength={100}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="description">
            作品简介 <span className="text-red-400">*</span>
            <span className="ml-2 text-xs text-slate-400">
              ({description.length}/300，至少 20 字)
            </span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="简要描述你的作品在解决什么问题、如何使用 AI、带来什么价值（建议 20-300 字）。"
            maxLength={300}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || description.trim().length < 20}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '提交中...' : '提交作品'}
        </button>
      </form>
    </div>
  );
}
