import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Zap, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Find Your First Dataleap Agent
          <br />
          <span className="text-indigo-400">in 60 Seconds</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
          Browse proven agent templates or let AI match you to the perfect automation.
          Every template is copy-paste ready for Dataleap.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500">
            <Link to="/templates">
              Browse Templates <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Link to="/advisor">
              Get Matched by AI
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Clock className="h-8 w-8 text-indigo-400 mx-auto" />
            <div className="mt-4 text-3xl font-bold">15 hrs/week</div>
            <div className="mt-2 text-sm text-zinc-400">Average time saved per user</div>
          </div>
          <div className="text-center">
            <Zap className="h-8 w-8 text-indigo-400 mx-auto" />
            <div className="mt-4 text-3xl font-bold">Under 5 min</div>
            <div className="mt-2 text-sm text-zinc-400">Average setup time</div>
          </div>
          <div className="text-center">
            <Layers className="h-8 w-8 text-indigo-400 mx-auto" />
            <div className="mt-4 text-3xl font-bold">3,000+</div>
            <div className="mt-2 text-sm text-zinc-400">Supported integrations</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Pick a Template', desc: 'Browse by role or let AI recommend one based on your workflow.' },
            { step: '2', title: 'Copy Instructions', desc: 'Each template has ready-to-paste agent instructions for Dataleap.' },
            { step: '3', title: 'Launch Your Agent', desc: 'Paste into Dataleap, connect your tools, and start automating.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto font-bold">
                {item.step}
              </div>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
