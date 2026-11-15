'use client'

import { useEffect } from 'react'
import { NAV_DATA } from '@/lib/content'

// Same list as the Demos menu in the nav, so both stay in sync
const DEMOS = NAV_DATA.find((menu) => menu.label.en === 'Demos')?.items ?? []

const COPY = {
  en: { title: 'Demos by industry', intro: 'See how AI works in a business like yours.', soon: 'Soon', close: 'Close' },
  es: { title: 'Demos por industria', intro: 'Mira cómo funciona la IA en un negocio como el tuyo.', soon: 'Pronto', close: 'Cerrar' },
}

// Pop-up with the list of demo industries, opened from the hero "Demos" button on phones
export default function DemosSheet({ lang, open, onClose }) {
  const c = COPY[lang] ?? COPY.en

  // Escape closes it
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="demos-sheet-overlay" onClick={onClose} data-lenis-prevent>
      <div className="demos-sheet" role="dialog" aria-modal="true" aria-label={c.title} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="demos-sheet-close" onClick={onClose} aria-label={c.close}>
          ×
        </button>
        <h2 className="demos-sheet-title">{c.title}</h2>
        <p className="demos-sheet-intro">{c.intro}</p>
        <ul className="demos-sheet-list">
          {DEMOS.map((item) => (
            <li key={item.en}>
              {item.href ? (
                // Demos that exist are links; trailing slash matches the static export folders
                <a href={`${item.href}/`} className="demos-sheet-item">
                  <span>{item[lang] ?? item.en}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              ) : (
                <div className="demos-sheet-item demos-sheet-item-soon">
                  <span>{item[lang] ?? item.en}</span>
                  <em>{c.soon}</em>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
