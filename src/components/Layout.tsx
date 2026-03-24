import { Outlet, Link } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Dataleap Quickstart Hub
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/templates" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Templates
            </Link>
            <Link to="/advisor" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Advisor
            </Link>
            <a
              href="https://dataleap.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors"
            >
              Try Dataleap
            </a>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-zinc-500">
          Built by Niran — applying for Chief of Staff at Dataleap
        </div>
      </footer>
    </div>
  )
}
