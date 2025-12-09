export default function SubmitPage() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-50">作品提交</h2>
        <p className="mt-1 text-sm text-slate-300">
          登录后填写作品名称和简介，提交后作品会自动出现在「我要投票」页面，供所有人投票。
        </p>
      </div>

      <form className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="title">
            作品名称
          </label>
          <input
            id="title"
            name="title"
            placeholder="例如：AI 智能写作助手"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="description">
            作品简介
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="简要描述你的作品在解决什么问题、如何使用 AI、带来什么价值（建议 20-300 字）。"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          登录后可提交作品（稍后接入提交功能）
        </button>
      </form>
    </div>
  );
}


