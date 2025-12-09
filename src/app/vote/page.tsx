export default function VotePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-50">我要投票</h2>
        <p className="text-sm text-slate-300">
          这里会展示所有已提交的作品。每位登录用户总共有 3 票，每票必须投给不同的作品，投出后不可撤销或修改。
        </p>
        <p className="text-xs text-amber-300">
          当前：仅展示静态占位内容。稍后我们会接入真实作品列表和投票逻辑。
        </p>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        暂无作品数据。完成数据库与登录接入后，这里将展示所有作品，并显示你剩余的 3 张选票。
      </div>
    </div>
  );
}


