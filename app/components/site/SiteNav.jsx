'use client'

import { useEffect, useState } from 'react'
import { NAV_DATA } from '@/lib/content'
import { BOOK_CALL_HREF, COMING_SOON_HREF } from '../constants'

const PHONE = '+1 650 800 5771'
const BRAND_NAME = 'ElevateBiz'

function Chevron({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5e6d64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={open ? 'nb-chevron nb-chevron-open' : 'nb-chevron'}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

// Floating nav: a transparent bar over the photo at the top; a full-width white bar once the page scrolls
export default function NavBar({ t, lang, setLang, annVisible, annHeight }) {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const top = scrolled ? '0' : `${annVisible ? Math.max(42, annHeight + 3) : 42}px`

  // "More" shares openMenu with the other menus, so only one dropdown is open at a time
  const MORE = -1
  const moreOpen = openMenu === MORE

  const menus = NAV_DATA.map((menu, i) => ({
    label: menu.label[lang],
    open: openMenu === i,
    items: menu.items.map((it) => ({ text: it[lang], href: it.href ?? COMING_SOON_HREF })),
    toggle: () => setOpenMenu(openMenu === i ? null : i),
  }))

  const langClass = (code) => `nb-lang-button${lang === code ? ' nb-lang-button-active' : ''}`

  return (
    <div className={`eb-nav-wrap${scrolled ? '' : ' eb-nav-float'} nb-wrap${scrolled ? ' nb-wrap-scrolled' : ''}`} style={{ top }}>
      <div className={`eb-nav-bar${scrolled ? ' is-scrolled' : ''} nb-bar ${scrolled ? 'nb-bar-scrolled' : 'nb-bar-top'}`}>
        <a className="nb-brand" href="#top">
          <img src="/images/logo-icon-v2.webp" alt="" width="128" height="128" className="nb-logo" />
          <span className="nb-brand-name">{BRAND_NAME}</span>
        </a>

        <div className="eb-nav-menus nb-menus">
          {menus.map((menu, i) => (
            <div key={i} className={`eb-nav-m${i} nb-menu`}>
              <button type="button" onClick={menu.toggle} aria-expanded={menu.open} className="nb-menu-button">
                <span>{menu.label}</span>
                <Chevron open={menu.open} />
              </button>
              {menu.open && (
                <div className="nb-dropdown">
                  {menu.items.map((item, j) => (
                    <a key={j} href={item.href} onClick={() => setOpenMenu(null)} className="nb-dropdown-link">
                      {item.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Menus that don't fit are collapsed here, in order */}
          <div className="eb-nav-more nb-menu">
            <button type="button" onClick={() => setOpenMenu(moreOpen ? null : MORE)} aria-expanded={moreOpen} className="nb-menu-button">
              <span>{lang === 'es' ? 'Más' : 'More'}</span>
              <Chevron open={moreOpen} />
            </button>
            {moreOpen && (
              <div className="nb-dropdown nb-more-dropdown">
                {menus.map((menu, i) => (
                  <div key={i} className={`eb-more-g${i}`}>
                    <p className="nb-more-label">{menu.label}</p>
                    {menu.items.map((item, j) => (
                      <a key={j} href={item.href} onClick={() => setOpenMenu(null)} className="nb-dropdown-link">
                        {item.text}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="nb-actions">
          <div className="nb-lang-toggle">
            <button type="button" onClick={() => setLang('en')} className={langClass('en')}>
              EN
            </button>
            <button type="button" onClick={() => setLang('es')} className={langClass('es')}>
              ES
            </button>
          </div>
          <a href="tel:+16508005771" className="eb-nav-phone nb-phone">
            <PhoneIcon />
            {PHONE}
          </a>
          <a href={BOOK_CALL_HREF} className="eb-nav-book nb-book">
            {t.navBookCall}
          </a>
          <button type="button" className="eb-nav-burger nb-burger" onClick={() => setMobileNavOpen((o) => !o)} aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileNavOpen}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileNavOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel (only shown on small screens) */}
      {mobileNavOpen && (
        <div className="eb-mobile-panel nb-mobile-panel">
          {menus.map((menu, i) => (
            <div key={i} className="nb-mobile-menu">
              <button type="button" onClick={menu.toggle} aria-expanded={menu.open} className="nb-mobile-menu-button">
                <span>{menu.label}</span>
                <Chevron open={menu.open} />
              </button>
              {menu.open && (
                <div className="nb-mobile-items">
                  {menu.items.map((item, j) => (
                    <a key={j} href={item.href} onClick={() => setMobileNavOpen(false)} className="nb-mobile-link">
                      {item.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="tel:+16508005771" className="nb-mobile-phone">
            <PhoneIcon />
            {PHONE}
          </a>
          <a href={BOOK_CALL_HREF} onClick={() => setMobileNavOpen(false)} className="nb-mobile-book">
            {t.navBookCall}
          </a>
        </div>
      )}
    </div>
  )
}
