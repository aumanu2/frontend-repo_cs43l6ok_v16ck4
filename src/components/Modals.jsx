import { useState } from 'react'

export function Modal({ open, onClose, title, children, actions }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 animate-in">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900">✕</button>
        </div>
        <div className="p-4">{children}</div>
        {actions && <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export function Toast({ show, message, tone='success' }){
  if(!show) return null
  const styles = tone==='success' ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-red-500'
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className={`px-4 py-2 rounded-full text-white bg-gradient-to-r ${styles} shadow-lg`}>{message}</div>
    </div>
  )
}
