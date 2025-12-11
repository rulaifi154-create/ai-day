'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Work {
  id: string;
  title: string;
  description: string;
  created_at: string;
  voteCount: number;
  users: {
    name: string | null;
    email: string;
  };
}

export default function VotePage() {
  const { data: session, status } = useSession();
  const [works, setWorks] = useState<Work[]>([]);
  const [votedWorkIds, setVotedWorkIds] = useState<string[]>([]);
  const [remainingVotes, setRemainingVotes] = useState(3);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [session]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [worksRes, votesRes] = await Promise.all([
        fetch('/api/works'),
        session ? fetch('/api/votes') : Promise.resolve({ json: () => ({ votes: [], remainingVotes: 3 }) }),
      ]);

      const worksData = await worksRes.json();
      setWorks(worksData);

      if (session) {
        const votesData = await votesRes.json();
        setVotedWorkIds(votesData.votes || []);
        setRemainingVotes(votesData.remainingVotes || 3);
      } else {
        setVotedWorkIds([]);
        setRemainingVotes(3);
      }
    } catch (err: any) {
      setError('加载失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (workId: string) => {
    if (!session) {
      setError('请先登录后才能投票');
      return;
    }

    if (votedWorkIds.includes(workId)) {
      setError('你已经投过这个作品了');
      return;
    }

    if (remainingVotes <= 0) {
      setError('你已经用完 3 票了');
      return;
    }

    setVoting(workId);
    setError('');

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '投票失败');
      }

      // 更新本地状态
      setVotedWorkIds([...votedWorkIds, workId]);
      setRemainingVotes(remainingVotes - 1);
      setWorks(works.map((w) => (w.id === workId ? { ...w, voteCount: w.voteCount + 1 } : w)));
    } catch (err: any) {
      setError(err.message || '投票失败，请重试');
    } finally {
      setVoting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-slate-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-50">我要投票</h2>
        <p className="text-sm text-slate-300">
          这里会展示所有已提交的作品。每位登录用户总共有 3 票，每票必须投给不同的作品，投出后不可撤销或修改。
        </p>
        {session && (
          <p className="text-sm font-medium text-amber-300">
            你还有 {remainingVotes} 票可用
          </p>
        )}
      </header>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {works.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
          暂无作品。成为第一个提交作品的人吧！
        </div>
      ) : (
        <div className="space-y-4">
          {works.map((work) => {
            const isVoted = votedWorkIds.includes(work.id);
            const canVote = session && !isVoted && remainingVotes > 0;
            const isVoting = voting === work.id;

            return (
              <div
                key={work.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-50">{work.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      提交者：{work.users?.name || work.users?.email || '匿名'} ·{' '}
                      {new Date(work.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-amber-400">{work.voteCount}</div>
                    <div className="text-xs text-slate-400">票</div>
                  </div>
                </div>
                <p className="mb-4 text-sm text-slate-300">{work.description}</p>
                <button
                  onClick={() => handleVote(work.id)}
                  disabled={!canVote || isVoting}
                  className={`w-full rounded-md px-4 py-2 text-sm font-medium transition ${
                    isVoted
                      ? 'border border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
                      : canVote
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-60'
                      : 'border border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isVoting
                    ? '投票中...'
                    : isVoted
                    ? '已投票'
                    : !session
                    ? '请先登录'
                    : remainingVotes <= 0
                    ? '已用完 3 票'
                    : '投票'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
