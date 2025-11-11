import { useEffect, useRef } from 'react'

export function FunnelChart({ data }) {
  const total = Math.max(...Object.values(data || {a:0})) || 1
  const stages = Object.entries(data || {})
  return (
    <div className="space-y-2">
      {stages.map(([label, value], idx) => (
        <div key={label} className="w-full">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="capitalize">{label}</span>
            <span>{value}</span>
          </div>
          <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500`} style={{width:`${(value/total)*100}%`}}></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function RadarChart({ scores }){
  // simple placeholder radar visualization with concentric rings
  const s = scores || {technical:0, culture:0, communication:0}
  const avg = Math.round((Object.values(s).reduce((a,b)=>a+b,0)/3) || 0)
  return (
    <div className="p-3">
      <div className="text-xs text-neutral-500 mb-1">Avg: {avg}</div>
      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 border border-neutral-200 dark:border-neutral-800 grid place-items-center">
        <div className="text-sm font-semibold">{avg}</div>
      </div>
    </div>
  )
}
