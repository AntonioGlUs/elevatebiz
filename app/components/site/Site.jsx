'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { TEXT, STATS, CLIENTS, TEAM_MEMBERS, FAQ_DATA, CHAT_SCRIPT } from '@/lib/content'
import { EXTRA, SERVICE_PHOTOS } from '@/lib/extra'
import { BOOK_CALL_HREF, COMING_SOON_HREF } from '../constants'
import ServicesFloat from './ServicesFloat'
import NavBar from './SiteNav'
import LeadRouting from './LeadRouting'
import Newsletter from './Newsletter'
import CookieNotice from '../CookieNotice'
import Chatbot from '../Chatbot'

// "saved every week" -> "Saved every week."
const sentence = (s) => {
  const t = s.charAt(0).toUpperCase() + s.slice(1)
  return /[.!?]$/.test(t) ? t : `${t}.`
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Last `n` words of a heading in the accent italic
function Title({ text, n = 2 }) {
  const w = text.split(' ')
  if (w.length <= n) return <em>{text}</em>
  return (
    <>
      {w.slice(0, -n).join(' ')} <em>{w.slice(-n).join(' ')}</em>
    </>
  )
}

function CountUp({ to, run }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    if (reduceMotion()) return setV(to)
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1400)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return v
}

/* ---------- Mission cards: icon tile + 3D tilt on hover ---------- */
const MISSION_ICONS = [
  // sparkle
  <svg key="s" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.9 2.6 8 8 10-5.4 2-7.4 5.1-8 10-.6-4.9-2.6-8-8-10 5.4-2 7.4-5.1 8-10Z" /></svg>,
  // gear
  <svg key="g" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>,
  // heart
  <svg key="h" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8Z" /></svg>,
  // arrow up-right
  <svg key="a" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>,
]

function MissionCard({ icon, title, text }) {
  const inner = useRef(null)

  // The card tilts toward the mouse and rises off the page; a soft glare follows the pointer
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || reduceMotion()) return
    const el = inner.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${((px - 0.5) * 16).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${((0.5 - py) * 16).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
  }
  const onLeave = () => {
    const el = inner.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div className="m-card" onPointerMove={onMove} onPointerLeave={onLeave}>
      <article className="m-card-inner" ref={inner}>
        <span className="m-icon">{icon}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </article>
    </div>
  )
}

// Photos of the hero banner (pos = which part of the photo stays in view on narrow screens)
const HERO_SLIDES = [
  { src: '/images/hero-building.webp', pos: '60% center' },
  { src: '/images/hero-executive-2.webp', pos: '60% center' },
  // zoom = [start, end] scale of the slow zoom (default 1 to 1.14); below 1 the photo is pulled back and its top and bottom edges fade into the dark background
  { src: '/images/hero-woman-phone.webp', pos: '90% center', zoom: [0.88, 0.93] },
]

/* ---------- WhatsApp conversation: the customer on the left, the business (bot) on the right ---------- */
const WA_ICON = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }

function WhatsAppDemo({ t, lang }) {
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)
  const box = useRef(null)

  const cardRef = useRef(null)

  // The card trails the scroll a little and settles back to its place ("bouncing"), capped at 40px
  useEffect(() => {
    if (reduceMotion()) return
    let smooth = window.scrollY
    let raf = 0
    const tick = () => {
      smooth += (window.scrollY - smooth) * 0.09
      const diff = window.scrollY - smooth
      const lag = Math.max(-40, Math.min(40, diff * -0.15))
      if (cardRef.current) cardRef.current.style.transform = `translateY(${lag.toFixed(1)}px)`
      if (Math.abs(diff) > 0.25) raf = requestAnimationFrame(tick)
      else {
        raf = 0
        if (cardRef.current) cardRef.current.style.transform = ''
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  // Plays the script once the card is on screen, holds the full chat for 7 s, then clears and starts over
  useEffect(() => {
    if (!seen) return
    if (reduceMotion()) return setVisible(CHAT_SCRIPT.length)
    let timer
    const play = (i) => {
      if (i >= CHAT_SCRIPT.length) {
        timer = setTimeout(() => {
          setVisible(0)
          setTyping(false)
          timer = setTimeout(() => play(0), 700)
        }, 7000)
        return
      }
      if (CHAT_SCRIPT[i].from === 'bot') {
        setTyping(true)
        timer = setTimeout(() => {
          setTyping(false)
          setVisible(i + 1)
          timer = setTimeout(() => play(i + 1), 500)
        }, 900)
      } else {
        timer = setTimeout(() => {
          setVisible(i + 1)
          play(i + 1)
        }, 700)
      }
    }
    timer = setTimeout(() => play(0), 900)
    return () => clearTimeout(timer)
  }, [seen])

  const renderMsg = (m, i) => {
    const out = m.from === 'bot'
    return (
      <div key={i} className={out ? 'wa-row out' : 'wa-row'}>
        <div className={out ? 'wa-bubble out' : 'wa-bubble'}>
          <div className="wa-text">{m.text[lang]}</div>
          <div className="wa-meta">
            <span>{m.time}</span>
            {out && (
              <svg width="15" height="10" viewBox="0 0 16 11" fill="none" strokeWidth="1.5" stroke="#53bdeb" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 5.5L5 9.5L11 1.5" />
                <path d="M5.5 5.5L9.5 9.5L15.5 1.5" />
              </svg>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wa-stage" ref={box} aria-hidden="true">
      <img className="wa-robot" src="/images/robot-pointing.webp" alt="" width="412" height="440" loading="lazy" />
      <div className="wa-card" ref={cardRef}>
        <div className="wa-header">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2" {...WA_ICON}>
            <path d="M15 19l-7-7 7-7" />
          </svg>
          <div className="wa-avatar">
            <img src="/images/wa-avatar.webp" alt="" width="38" height="38" />
          </div>
          <div className="wa-contact">
            <b>{t.waName}</b>
            <span>{t.waOnline}</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8" {...WA_ICON}>
            <path d="M23 7l-7 5 7 5V7Z" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
          <svg className="wa-call" width="19" height="19" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8" {...WA_ICON}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
          </svg>
        </div>

        {/* An invisible copy of the whole conversation reserves its final height, so the card never resizes as messages arrive */}
        <div className="wa-messages">
          <div className="wa-ghost" aria-hidden="true">
            {CHAT_SCRIPT.map(renderMsg)}
          </div>
          <div className="wa-live">
            {CHAT_SCRIPT.slice(0, visible).map(renderMsg)}
            {typing && (
              <div className="wa-row out">
                <div className="wa-typing">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="wa-input">
          <svg width="22" height="22" viewBox="0 0 24 24" stroke="#54656f" strokeWidth="1.7" {...WA_ICON}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
          </svg>
          <div className="wa-field">{t.waMessagePlaceholder}</div>
          <div className="wa-mic">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2" {...WA_ICON}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Site() {
  const [lang, setLang] = useState('en')
  // Initial language: saved choice, else the browser's language
  useEffect(() => {
    const saved = localStorage.getItem('eb-lang')
    if (saved === 'en' || saved === 'es') setLang(saved)
    else if (navigator.language.toLowerCase().startsWith('es')) setLang('es')
  }, [])
  const t = TEXT[lang]
  const x = EXTRA[lang]

  const [annOpen, setAnnOpen] = useState(true)
  const [annArrived, setAnnArrived] = useState(false)
  const [annHeight, setAnnHeight] = useState(0)
  const annRef = useRef(null)
  const [tab, setTab] = useState(0)
  const [howActive, setHowActive] = useState(1)
  const [howIn, setHowIn] = useState(false)
  const howRef = useRef(null)
  const [faqOpen, setFaqOpen] = useState(null)
  const [quote, setQuote] = useState(0)
  const [statsIn, setStatsIn] = useState(false)
  // Same storefront by day or by night; "?time=day|night" forces it (decided in the browser)
  const [period, setPeriod] = useState(null)
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get('time')
    const hour = new Date().getHours()
    setPeriod(forced === 'day' || forced === 'night' ? forced : hour >= 7 && hour < 17 ? 'day' : 'night')
  }, [])
  const statsRef = useRef(null)
  const canvasRef = useRef(null)
  const annVisible = annOpen && annArrived

  // Hero banner: the background photos fade into each other
  const [heroIdx, setHeroIdx] = useState(0)
  // The timer restarts whenever the photo changes, so a manual click gets the full 7 seconds too
  useEffect(() => {
    if (HERO_SLIDES.length < 2) return
    const timer = setTimeout(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 7000)
    return () => clearTimeout(timer)
  }, [heroIdx])

  // The announcement bar hides by itself 5 seconds after the page loads
  useEffect(() => {
    const timer = setTimeout(() => setAnnOpen(false), 5000)
    return () => clearTimeout(timer)
  }, [])
  // The bar floats over the hero, so the hero keeps a gap at the top for it (34 is the usual bar height)
  const heroOffset = annHeight || 34

  // The bar slides in a moment after the page loads; its height is measured for the nav and the hero
  useEffect(() => {
    const timer = setTimeout(() => setAnnArrived(true), 400)
    const measure = () => annRef.current && setAnnHeight(annRef.current.getBoundingClientRect().height)
    measure()
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [])

  // The page background follows the section crossing the middle of the screen (white, cream or dark)
  useEffect(() => {
    const canvas = canvasRef.current
    const secs = [...canvas.querySelectorAll('[data-env]')]
    let raf = 0
    const update = () => {
      raf = 0
      const mid = window.innerHeight / 2
      const cur = secs.find((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= mid && r.bottom > mid
      })
      if (cur && canvas.dataset.env !== cur.dataset.env) canvas.dataset.env = cur.dataset.env
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('eb-lang', lang)
    } catch {
      /* private mode: language just won't be remembered */
    }
  }, [lang])

  // Smooth scrolling
  useEffect(() => {
    if (reduceMotion()) return
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -80 } })
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // The timeline plays its entrance once it is on screen
  useEffect(() => {
    const el = howRef.current
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHowIn(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Reveal on scroll
  useEffect(() => {
    const targets = [
      ...document.querySelectorAll(
        '.sec:not(#demo) .eyebrow, .sec:not(#demo) h2:not(.mission-title), .sec:not(#demo) .intro, .mission-head, .m-card, .card, .lr-box, .platform, .testi',
      ),
    ]
    document.querySelectorAll('.card, .m-card').forEach((el) => {
      el.style.setProperty('--d', `${[...el.parentElement.children].indexOf(el) * 0.1}s`)
    })
    targets.forEach((el) => el.classList.add('reveal'))
    // The "See it in action" copy slides in from the left and the chat card from the right
    const sides = [
      ['#demo .demo > div:first-child', 'reveal-left'],
      ['#demo .demo > .wa-stage', 'reveal-right'],
    ]
    sides.forEach(([sel, cls]) => {
      const el = document.querySelector(sel)
      if (el) {
        el.classList.add(cls)
        targets.push(el)
      }
    })
    // Slow, perceptible entrances: each element waits until it is well inside the screen, pauses a beat,
    // and the ones that arrive together play one after another.
    const stagger = (rows, cls, base, step, opts = { threshold: 0.35, rootMargin: '0px 0px -14% 0px' }) => {
      rows.forEach((el) => el.classList.add(cls))
      const io2 = new IntersectionObserver(
        (entries) => {
          entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
            .forEach((e, k) => {
              e.target.style.setProperty('--d', `${base + k * step}s`)
              e.target.classList.add('in')
              io2.unobserve(e.target)
            })
        },
        opts,
      )
      rows.forEach((el) => io2.observe(el))
      return io2
    }
    // FAQ rows fly in from the bottom-left; the service cards rise
    const faqIo = stagger([...document.querySelectorAll('.faq-item')], 'reveal-bl', 0.3, 0.24)
    const svcIo = stagger([...document.querySelectorAll('.svc-card')], 'reveal-rise', 0.12, 0.17, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' })
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15 },
    )
    targets.forEach((el) => io.observe(el))
    const sio = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStatsIn(true)
          sio.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    sio.observe(statsRef.current)
    return () => {
      io.disconnect()
      sio.disconnect()
      faqIo.disconnect()
      svcIo.disconnect()
    }
  }, [])

  // Testimonials auto-advance with the progress bar's animation end
  const quotes = x.quotes

  const [h1a, ...h1rest] = t.heroTitle.split('. ')

  return (
    <>
      <div className="site">
      {/* The announcement bar floats over the top of the page and slides in from above the screen */}
      <div className="ann-wrap" style={{ visibility: annVisible ? 'visible' : 'hidden', transition: annVisible ? 'visibility 0s' : 'visibility 0s linear 900ms' }}>
        <div className="ann-slide" style={{ transform: annVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
          <div ref={annRef} className="eb-ann ann-bar">
            <span className="ann-text">
              <a href="mailto:hello@elevatebiz.ai?subject=Special%20programs%20inquiry" className="ann-link">
                {t.annBold}
              </a>
              {t.annRest}
            </span>
            <button type="button" onClick={() => setAnnOpen(false)} aria-label={t.annClose} className="ann-close">
              <span className="eb-ann-close-text ann-close-text">{t.annClose}</span>
              <span className="ann-close-x">×</span>
            </button>
          </div>
        </div>
      </div>

      <NavBar t={t} lang={lang} setLang={setLang} annVisible={annVisible} annHeight={annHeight} />

      <div className="canvas" ref={canvasRef} data-env="white">
      <main id="top">
        <section className="hero" data-env="white" style={{ paddingTop: heroOffset }}>
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className={`hero-bg${i === heroIdx ? ' is-on' : ''}${slide.zoom && slide.zoom[1] < 1 ? ' is-pulled' : ''}`}
              aria-hidden="true"
              style={{ '--photo': `url(${slide.src})`, '--photo-pos': slide.pos, ...(slide.zoom ? { '--zoom-from': slide.zoom[0], '--zoom-to': slide.zoom[1] } : {}) }}
            />
          ))}
          {HERO_SLIDES.length > 1 && (
          <div className="hero-controls">
            <div className="hero-dots">
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  className={i === heroIdx ? 'is-on' : ''}
                  aria-label={`${lang === 'es' ? 'Imagen' : 'Image'} ${i + 1}`}
                  aria-current={i === heroIdx}
                  onClick={() => setHeroIdx(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="hero-next hero-prev"
              aria-label={lang === 'es' ? 'Imagen anterior' : 'Previous image'}
              onClick={() => setHeroIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 5-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="hero-next"
              aria-label={lang === 'es' ? 'Siguiente imagen' : 'Next image'}
              onClick={() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
          )}
          <div className="hero-glow" aria-hidden="true" />
          <div className="container">
            <h1>
              {h1a}. <em>{h1rest.join('. ')}</em>
            </h1>
            <p className="lead">{t.heroSubtitle}</p>
            <div className="actions">
              <a href={BOOK_CALL_HREF} className="btn">
                {t.heroBtnPrimary}
              </a>
              <a href="#como-funciona" className="btn btn-ghost">
                {t.heroBtnSecondary}
              </a>
            </div>
          </div>
        </section>

        <section className="logos" data-env="white" aria-label={t.trustedBy}>
          <p className="eyebrow">{t.trustedBy}</p>
          <div className="marquee">
            <div className="track">
              {[...CLIENTS, ...CLIENTS].map((c, i) => (
                <span key={i}>
                  <i style={{ background: c.bg, color: c.fg }}>{c.initial}</i>
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className={statsIn ? 'impact container sec in' : 'impact container sec'} ref={statsRef} data-env="white">
          <p className="eyebrow">{x.stats.eyebrow}</p>
          <h2>
            <Title text={x.stats.title} n={x.stats.accentWords} />
          </h2>
          <div className="impact-grid">
            {STATS.map((s, i) => (
              <div key={s.target} className="impact-col" style={{ '--i': i }}>
                <strong className="impact-num">
                  {s.prefix}
                  <CountUp to={s.target} run={statsIn} />
                  <span className={s.suffix.trim().startsWith('/') ? 'impact-suf full' : 'impact-suf'}>{s.suffix}</span>
                </strong>
                <span className="impact-dash" aria-hidden="true" />
                <h3>{s.eyebrow[lang]}</h3>
                <p>{sentence(s.label[lang])}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container sec" data-env="white">
          <div className="mission-head">
            <p className="mission-eyebrow">{x.mission.eyebrow}</p>
            <h2 className="mission-title">
              <b>{x.mission.bold}</b> <em>{x.mission.italic}</em>
            </h2>
            <p className="mission-sub">{x.mission.subtitle}</p>
          </div>
          <div className="mission-cards">
            {x.mission.cards.map((c, i) => (
              <MissionCard key={c.title} icon={MISSION_ICONS[i]} title={c.title} text={c.text} />
            ))}
          </div>
        </section>

        <section id="demo" className="container sec" data-env="white">
          <div className="demo">
            <div>
              <p className="eyebrow">{t.seeItTitle.toUpperCase()}</p>
              <h2>
                <Title text={t.seeItTitle} n={1} />
              </h2>
              <p className="intro">{t.seeItSubtitle}</p>
              <ul className="checks">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n}>
                    <span className="chk" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l4 4 10-10" />
                      </svg>
                    </span>
                    <span>{t[`seeItCheck${n}`]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <WhatsAppDemo t={t} lang={lang} />
          </div>
        </section>

        <section id="servicios" className="sec services" data-env="white">
          <div className="container">
            <p className="eyebrow">{x.eyebrows.services}</p>
            <h2>
              <Title text={t.servicesTitle} />
            </h2>
          </div>
          <ServicesFloat
            items={[0, 1, 2, 3].map((i) => ({
              key: i,
              href: COMING_SOON_HREF,
              src: SERVICE_PHOTOS[i].src,
              pos: SERVICE_PHOTOS[i].pos,
              line1: x.services[i].line1,
              line2: x.services[i].line2,
              desc: t[`svc${i + 1}Desc`],
            }))}
          />
        </section>

        <section id="como-funciona" className="container sec" data-env="white">
          <p className="eyebrow">{x.how.eyebrow}</p>
          <h2>
            <Title text={x.how.title} n={1} />
          </h2>
          <p className="intro">{x.how.sub}</p>
          <ol ref={howRef} className={howIn ? 'hw-steps in' : 'hw-steps'} onMouseLeave={() => setHowActive(1)}>
            {x.how.steps.map((s, i) => (
              <li key={s.tag} className={i === howActive ? 'hw-step on' : 'hw-step'} style={{ '--i': i }} onMouseEnter={() => setHowActive(i)}>
                <div className="hw-track">
                  <span className="hw-dot">0{i + 1}</span>
                  <span className="hw-line" aria-hidden="true" />
                </div>
                <p className="hw-tag">{s.tag}</p>
                <h3>{s.title}</h3>
                <p className="hw-text">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="container sec" data-env="dark">
          <p className="eyebrow">{x.eyebrows.routing}</p>
          <h2>
            <Title text={t.whoTitle} n={3} />
          </h2>
          <p className="intro">{t.diagSubtitle}</p>
          <LeadRouting t={t} lang={lang} />
        </section>

        <section id="plataforma" className="container sec" data-env="dark">
          <p className="eyebrow">{x.eyebrows.platform}</p>
          <h2>
            <Title text={x.platformTitle} n={3} />
          </h2>
          <div className="platform">
            <div>
              <div className="tabs" role="tablist">
                {x.platformTabs.map((p, i) => (
                  <button key={p} role="tab" aria-selected={tab === i} className={tab === i ? 'tab active' : 'tab'} onClick={() => setTab(i)}>
                    <span>0{i + 1}</span> {p}
                  </button>
                ))}
              </div>
              <ul className="points" key={tab}>
                {x.platformPoints[tab].map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
            <div className="mock" key={`m${tab}`}>
              <div className="mock-head">
                <b>{tab === 0 ? x.mockTitle : t.waName}</b>
                <span>{x.mockNote}</span>
              </div>
              {tab === 0 ? (
                x.mockRows.map((r, i) => (
                  <div key={r.who} className="mock-row" style={{ '--i': i, marginLeft: i * 14 }}>
                    <i>{r.who[0]}</i>
                    <div>
                      <b>{r.who}</b>
                      <span>{r.what}</span>
                    </div>
                    <span className="when">{r.when}</span>
                    <em className={`st st${i % 3}`}>{r.st}</em>
                  </div>
                ))
              ) : (
                <div className="mock-chat">
                  {CHAT_SCRIPT.slice(0, 3).map((m, i) => (
                    <p key={i} className={m.from === 'user' ? 'bubble in' : 'bubble out'} style={{ '--i': i }}>
                      {m.text[lang]}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="clientes" className="container sec" data-env="dark">
          <p className="eyebrow">{x.eyebrows.clients}</p>
          <h2>
            <Title text={x.clientsTitle} />
          </h2>
          <div className="testi">
            <div className="testi-tabs" role="tablist">
              {quotes.map((q, i) => (
                <button key={q.company} role="tab" aria-selected={quote === i} className={quote === i ? 'testi-tab on' : 'testi-tab'} onClick={() => setQuote(i)}>
                  {q.company}
                  {quote === i && <span key={quote} className="progress" onAnimationEnd={() => setQuote((quote + 1) % quotes.length)} />}
                </button>
              ))}
            </div>
            <figure key={quote} className="testi-body">
              <blockquote>“{quotes[quote].text}”</blockquote>
              <figcaption>
                <b>{x.exampleName}</b>
                <span>{quotes[quote].role}</span>
              </figcaption>
            </figure>
          </div>
          <p className="note">{x.clientsNote}</p>
        </section>

        <section id="faq" className="container sec" data-env="white">
          <p className="eyebrow">{x.eyebrows.faq}</p>
          <h2>
            <Title text={t.faqTitle} n={2} />
          </h2>
          <p className="intro">{t.faqSubtitle}</p>
          <div className="faq">
            {FAQ_DATA.map((f, i) => {
              const open = faqOpen === i
              return (
                <div key={f.number} className={open ? 'faq-item open' : 'faq-item'}>
                  <button type="button" className="faq-q" aria-expanded={open} aria-controls={`faq-a-${i}`} onClick={() => setFaqOpen(open ? null : i)}>
                    <span className="faq-n">{f.number}</span>
                    <span className="faq-t">{f.title[lang]}</span>
                    <i className="faq-icon" aria-hidden="true" />
                  </button>
                  <div className="faq-a" id={`faq-a-${i}`} role="region">
                    <div className="faq-a-inner">
                      <div className="answer">
                        <b>{f.subtitle[lang]}</b>
                        <ul>
                          {f.steps[lang].map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                        <p>{f.actionLabel[lang]}</p>
                        <a href={BOOK_CALL_HREF} className="faq-link">
                          {f.actionText[lang]} →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="container sec" data-env="white">
          <Newsletter t={t} lang={lang} />
        </section>

        <section id="contacto" className="cta-band" data-env="white">
          <div className="cta-copy">
            <p className="cta-eyebrow">{x.closing.eyebrow}</p>
            <h2 className="cta-title">
              {x.closing.title} <em>{x.closing.accent}</em>
            </h2>
            <p className="cta-sub">{x.closing.sub}</p>
          </div>
          <a href={BOOK_CALL_HREF} className="cta-button">
            {x.closing.button}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </section>
      </main>

      <footer className="ft" data-env="white">
        <div className="ft-top">
          <div>
            <div className="ft-brand">
              <img src="/images/logo-icon-v2.webp" alt="" width="128" height="128" loading="lazy" className="ft-logo" />
              <span className="ft-brand-name">ElevateBiz</span>
            </div>
            <p className="ft-tagline">{x.closing.tagline}</p>
          </div>
          <div className="ft-contact">
            <p className="ft-label">{x.closing.contact}</p>
            <a href="mailto:hello@elevatebiz.ai" className="ft-email">
              hello@elevatebiz.ai
            </a>
            <div className="ft-links">
              <a href="https://www.instagram.com/elevatebiz.ai/">Instagram</a>
              <a href={COMING_SOON_HREF}>LinkedIn</a>
              <a href={COMING_SOON_HREF}>Facebook</a>
            </div>
          </div>
        </div>
        <div className="ft-bottom">
          <span>
            {t.footerCopyright}
          </span>
          <a href="/privacy/" className="ft-privacy">
            {x.closing.privacy}
          </a>
        </div>
        <p className="ft-demo">{x.closing.demo}</p>
      </footer>
      </div>

      </div>
      <CookieNotice t={t} />
      {/* The chatbot lives here (not in the root layout) so demo sites can have their own bot */}
      <Chatbot />
    </>
  )
}

