export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-50">AI-Day 活动主页</h2>
        <p className="text-sm text-slate-300">
          AI-Day 是一个长期开放的活动，你可以随时提交自己的 AI 相关作品，并为你喜欢的作品投票。
          每位登录用户拥有 3 张选票，只能投给 3 个不同的作品，投出后不能撤销。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <a
          href="/submit"
          className="group rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 p-5 transition hover:border-emerald-400 hover:bg-emerald-500/10"
        >
          <h3 className="mb-1 text-lg font-medium text-emerald-300 group-hover:text-emerald-200">
            去提交作品
          </h3>
          <p className="text-sm text-slate-300">
            填写作品名称和简介，一键提交你的 AI 创意作品，提交后将自动出现在投票页。
          </p>
        </a>

        <a
          href="/vote"
          className="group rounded-xl border border-amber-400/40 bg-gradient-to-br from-amber-500/10 to-amber-500/0 p-5 transition hover:border-amber-300 hover:bg-amber-500/10"
        >
          <h3 className="mb-1 text-lg font-medium text-amber-300 group-hover:text-amber-200">
            我要去投票
          </h3>
          <p className="text-sm text-slate-300">
            查看所有已提交的作品，用你手中的 3 票支持你最喜欢的 3 个不同作品。
          </p>
        </a>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
        提示：所有功能都需要登录后才能使用，后续我们会接入 Google 登录，确保每个人都有 3 票且不可重复或撤销。
      </section>
    </div>
  );
}


