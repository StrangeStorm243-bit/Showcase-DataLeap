import { Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Dataleap Quickstart Hub
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 px-4 py-4 space-y-3">
            <Link
              to="/templates"
              className="block text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              to="/advisor"
              className="block text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Advisor
            </Link>
            <a
              href="https://dataleap.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors text-center"
            >
              Try Dataleap
            </a>
          </div>
        )}
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
