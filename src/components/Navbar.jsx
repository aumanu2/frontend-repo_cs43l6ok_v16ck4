import { useState } from 'react'
import { Menu, Search, Bell, Settings, User } from 'lucide-react'

export default function Navbar({ active, onNavigate }) {
  const [q, setQ] = useState('')
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        <button className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Menu className="h-5 w-5" />
        </button>
        <div className="font-semibold text-lg tracking-tight">LevelUp ATS</div>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          {['Dashboard','Jobs','Candidates','Interviews','Offers','Onboarding','Analytics','Comm Hub'].map((item) => (
            <button key={item} onClick={() => onNavigate(item)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${active===item? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900':'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              {item}
            </button>
          ))}
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search candidates, jobs..." className="pl-9 pr-3 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-800 outline-none focus:ring-2 ring-neutral-300 dark:ring-neutral-700"/>
          </div>
          <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={()=>onNavigate('Settings')}>
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 grid place-items-center text-white text-xs">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
