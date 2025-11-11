import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import { StatCard, Card } from './components/Cards'
import { FunnelChart, RadarChart } from './components/Charts'
import { Modal, Toast } from './components/Modals'
import { Table } from './components/Tables'
import { Home, Briefcase, Users, Calendar, BadgeDollarSign, Rocket, BarChart3, MessageSquare } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || ''

function useFetch(url, deps=[]) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetch(url).then(r => r.json()).then(d => { if(!ignore){ setData(d); setLoading(false)} }).catch(e=>{ if(!ignore){ setError(e); setLoading(false)} })
    return ()=>{ ignore=true }
  }, deps)
  return { data, loading, error, setData }
}

function Dashboard(){
  const { data:metrics } = useFetch(`${API}/api/metrics`, [])
  const { data:analytics } = useFetch(`${API}/api/analytics`, [])
  const { data:interviews } = useFetch(`${API}/api/interviews`, [])

  const spotlight = (interviews||[])[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={metrics?.total_jobs ?? '—'} icon={Briefcase} tone='indigo'/>
        <StatCard label="Active Candidates" value={metrics?.active_candidates ?? '—'} icon={Users} tone='emerald'/>
        <StatCard label="Time-to-Fill" value={`${metrics?.time_to_fill ?? '—'} days`} icon={Rocket} tone='amber'/>
        <StatCard label="Offers Sent" value={metrics?.offers_sent ?? '—'} icon={BadgeDollarSign} tone='fuchsia'/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Task Feed</h3>
            <button className="text-sm px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800">View All</button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <span>Today's Interviews</span>
              <span className="text-neutral-500">{(interviews||[]).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <span>Pending Feedback</span>
              <span className="text-neutral-500">3</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <span>Approvals Waiting</span>
              <span className="text-neutral-500">2</span>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Candidate Spotlight</h3>
          {spotlight ? (
            <div className="flex items-start gap-3">
              <img src={spotlight.avatar_url || 'https://i.pravatar.cc/120'} className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <div className="font-medium">{spotlight.candidate_name || 'Candidate'}</div>
                <div className="text-xs text-neutral-500">Interview at {new Date(spotlight.time).toLocaleTimeString()}</div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">View Profile</button>
                  <a href={spotlight.meeting_url} target="_blank" className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white">Join Call</a>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-500">No upcoming interviews</div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pipeline</h3>
            <button className="text-sm px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800">Refresh</button>
          </div>
          <FunnelChart data={analytics?.funnel || {applications:0, interviews:0, offers:0, hires:0}} />
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">Offer Acceptance Rate</h3>
          <div className="text-3xl font-semibold">{Math.round((analytics?.offer_acceptance_rate || 0)*100)}%</div>
        </Card>
      </div>
    </div>
  )
}

function Jobs(){
  const { data:jobs, setData:setJobs } = useFetch(`${API}/api/jobs`, [])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title:'', department:'', owner:'', location:'Remote' })

  const cols = [
    { header:'Title', accessor:'title'},
    { header:'Department', accessor:'department'},
    { header:'Status', accessor:'status'},
    { header:'Applicants', accessor:'applicants_count'},
    { header:'Owner', accessor:'owner'},
    { header:'Posted', accessor:'date_posted', cell:(v)=> v? new Date(v).toLocaleDateString():'—'},
  ]

  function createJob(){
    fetch(`${API}/api/jobs`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)}).then(()=>{
      setOpen(false)
      // optimistic UI
      setJobs([...(jobs||[]), { ...form, status:'open', applicants_count:0, date_posted:new Date().toISOString() }])
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Job Requisitions</h3>
        <button onClick={()=>setOpen(true)} className="px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">New Job</button>
      </div>
      <Table columns={cols} data={jobs||[]} />

      <Modal open={open} onClose={()=>setOpen(false)} title="Create Job" actions={
        <>
          <button onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800">Cancel</button>
          <button onClick={createJob} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white">Create</button>
        </>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['title','department','owner','location'].map((f)=>(
            <div key={f} className="space-y-1">
              <div className="text-xs text-neutral-500 capitalize">{f}</div>
              <input value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"/>
            </div>
          ))}
          <div className="sm:col-span-2 space-y-1">
            <div className="text-xs text-neutral-500">Description</div>
            <textarea value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})} className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800" rows={4}/>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Candidates(){
  const { data:cands, setData:setCands } = useFetch(`${API}/api/candidates`, [])
  const [modal, setModal] = useState(null)

  const columns = [
    { header:'Name', accessor:'name'},
    { header:'Role', accessor:'current_role'},
    { header:'Stage', accessor:'stage'},
    { header:'Skills', accessor:'skills', cell:(v)=> (v||[]).slice(0,3).map(s=> <span key={s} className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 mr-1">{s}</span>)},
  ]

  return (
    <div className="space-y-4">
      <Table columns={columns} data={cands||[]} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {['applied','screening','interview','offer','hired','rejected'].map(stage => (
          <button key={stage} className="px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-sm">{stage}</button>
        ))}
      </div>
      <Modal open={!!modal} onClose={()=>setModal(null)} title="Candidate Profile" actions={
        <>
          <button onClick={()=>setModal(null)} className="px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800">Close</button>
          <button className="px-3 py-1.5 rounded-md bg-emerald-600 text-white">Shortlist</button>
        </>
      }>
        {modal && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3">
                <img src={modal.avatar_url||'https://i.pravatar.cc/120'} className="h-12 w-12 rounded-full"/>
                <div>
                  <div className="font-medium">{modal.name}</div>
                  <div className="text-xs text-neutral-500">{modal.current_role}</div>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <div className="font-medium mb-1">Assessment</div>
                <div className="flex items-center gap-6">
                  <RadarChart scores={modal.assessment_scores} />
                  <div>
                    {Object.entries(modal.assessment_scores||{}).map(([k,v])=> (
                      <div key={k} className="text-xs"><span className="capitalize">{k}</span>: <span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-medium mb-1">Notes</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{modal.notes||'No notes yet.'}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm">View Resume</button>
                <button className="w-full px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Schedule Interview</button>
                <button className="w-full px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">Advance Stage</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <div className="text-xs text-neutral-500">Click a row to open profile</div>
      <div className="hidden">{ /* row click handler wiring */ }
        {(cands||[]).forEach}
      </div>
    </div>
  )
}

function Interviews(){
  const { data:items } = useFetch(`${API}/api/interviews`, [])
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">Calendar</button>
        <button className="px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800">List</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(items||[]).map(it => (
          <Card key={it._id}>
            <div className="font-medium">{it.candidate_name}</div>
            <div className="text-xs text-neutral-500">{it.interviewer} • {new Date(it.time).toLocaleString()}</div>
            <div className="flex gap-2 mt-3">
              <a href={it.meeting_url} target="_blank" className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm">Join Call</a>
              <button className="px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm">Feedback</button>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="font-semibold mb-2">Candidate Comparison</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(items||[]).slice(0,5).map(it => (
            <div key={it._id} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
              <div className="font-medium text-sm">{it.candidate_name}</div>
              <RadarChart scores={{technical: 80, culture: 75, communication: 85}} />
              <div className="text-xs text-neutral-500">Salary: $—</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Offers(){
  const { data:offers } = useFetch(`${API}/api/offers`, [])
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Offers</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800">Route for Approval</button>
          <button className="px-3 py-1.5 rounded-md bg-emerald-600 text-white">Send Offer Letter</button>
        </div>
      </div>
      <Table columns={[
        {header:'Candidate', accessor:'candidate_name'},
        {header:'Role', accessor:'role'},
        {header:'Salary', accessor:'proposed_salary'},
        {header:'Status', accessor:'status'},
      ]} data={offers||[]} />
      <Card>
        <div className="font-semibold mb-2">Offer Template</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <textarea placeholder="Paste your company-branded template here" className="w-full h-32 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"/>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 text-sm text-neutral-500">E-signature placeholder</div>
        </div>
      </Card>
    </div>
  )
}

function Onboarding(){
  const { data:tasks } = useFetch(`${API}/api/onboarding`, [])
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Onboarding</h3>
      <Table columns={[
        {header:'Candidate', accessor:'candidate_id'},
        {header:'Task', accessor:'task'},
        {header:'Assignee', accessor:'assignee'},
        {header:'Status', accessor:'status'},
      ]} data={tasks||[]} />
      <Card>
        <div className="text-sm text-neutral-500">Assign IT/Admin tasks, upload documents, send welcome pack.</div>
      </Card>
    </div>
  )
}

function Analytics(){
  const { data } = useFetch(`${API}/api/analytics`, [])
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="font-semibold mb-2">Funnel</div>
          <FunnelChart data={data?.funnel || {}} />
        </Card>
        <StatCard label="Offer Acceptance" value={`${Math.round((data?.offer_acceptance_rate||0)*100)}%`} />
      </div>
      <Card>
        <div className="font-semibold mb-2">Top Sources</div>
        <div className="flex flex-wrap gap-2">
          {(data?.top_sources||[]).map(s => (
            <div key={s.source} className="px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm">{s.source} • {s.count}</div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function CommHub(){
  const { data:messages, setData:setMessages } = useFetch(`${API}/api/messages`, [])
  const [text, setText] = useState('')
  function send(){
    if(!text) return
    fetch(`${API}/api/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sender:'You', receiver:'Team', content:text })}).then(()=>{
      setMessages([...(messages||[]), { sender:'You', receiver:'Team', content:text }])
      setText('')
    })
  }
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
        <div className="h-64 overflow-auto space-y-2">
          {(messages||[]).map((m,i)=>(
            <div key={i} className="text-sm"><span className="font-medium">{m.sender}:</span> {m.content}</div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" className="flex-1 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"/>
          <button onClick={send} className="px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">Send</button>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const [tab, setTab] = useState('Dashboard')
  const [toast, setToast] = useState({ show:false, message:'' })

  function onNavigate(next){
    setTab(next)
  }

  useEffect(()=>{
    // seed demo data once at startup
    fetch(`${API}/api/seed`, { method:'POST' }).catch(()=>{})
  },[])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <Navbar active={tab} onNavigate={onNavigate} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab==='Dashboard' && <Dashboard />}
        {tab==='Jobs' && <Jobs />}
        {tab==='Candidates' && <Candidates />}
        {tab==='Interviews' && <Interviews />}
        {tab==='Offers' && <Offers />}
        {tab==='Onboarding' && <Onboarding />}
        {tab==='Analytics' && <Analytics />}
        {tab==='Comm Hub' && <CommHub />}
        {tab==='Settings' && (
          <div className="space-y-4">
            <Card>
              <div className="font-semibold mb-2">Organization</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input placeholder="Company Name" className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"/>
                <input placeholder="Invite team member email" className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"/>
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white">Generate Invite Link</button>
              </div>
            </Card>
            <Card>
              <div className="font-semibold mb-2">Audit Logs</div>
              <div className="text-sm text-neutral-500">Structured events will appear here.</div>
            </Card>
          </div>
        )}
      </main>
      <Toast show={toast.show} message={toast.message} />
    </div>
  )
}
