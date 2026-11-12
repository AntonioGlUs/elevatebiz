'use client'

import { useEffect, useRef } from 'react'

// Floating images with scroll-linked parallax (GSAP + ScrollTrigger, scrub: the motion follows the scroll position
// directly, it is not a timed animation). Every item drifts upward a little faster than the page (depth) and fades in
// as it enters the viewport. Only transform / opacity are animated. Layout slots (size, offset) are in globals.css (.sf-1 … .sf-4).

// Parallax depth of each item (how much faster than the page it travels). Items lower in a column are never faster
// than the ones above them, so neighbours in the same column cannot run into each other.
const SPEEDS = [0.28, 0.42, 0.2, 0.32]
const MAX_SHIFT = 300 // px
// 3D tilt (degrees) at the extremes of the scroll; the sign alternates so neighbours lean opposite ways
const TILT_X = 16
const TILT_Y = [9, -11, -8, 10]

export default function ServicesFloat({ items }) {
  const root = useRef(null)

  useEffect(() => {
    // GSAP is loaded only when this section is about to come into view (it is not needed for the first screen)
    let cancelled = false
    let mm
    let io
    let ro
    let refreshTimer

    const init = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      mm = gsap.matchMedia()

    // Reduced motion: no movement and no fade, the images simply sit in place
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        small: '(max-width: 720px)',
      },
      (context) => {
        const { motion, small } = context.conditions
        if (!motion) return
        const factor = small ? 0.4 : 1 // on small screens the parallax is reduced
        const tilt = small ? 0.5 : 1 // and so is the 3D tilt

        root.current.querySelectorAll('.sf-item').forEach((wrap, i) => {
          const link = wrap.querySelector('.sf-link')
          const shift = () => {
            const span = window.innerHeight / 2 + wrap.offsetHeight / 2
            return Math.min(MAX_SHIFT, span * SPEEDS[i] * factor)
          }
          // Items on the left of the composition come in from the left edge of the screen, the others from the right
          const fromLeft = i % 2 === 0
          const sideOffset = () => {
            const left = root.current.getBoundingClientRect().left + wrap.offsetLeft
            return fromLeft ? -(left + wrap.offsetWidth + 40) : window.innerWidth - left + 40
          }

          // 1) Side entrance: slides in from the edge of the screen and settles in its place as it reaches ~55% of the
          //    viewport height. The wrapper moves sideways so it never fights with the link's own transforms.
          gsap.fromTo(
            wrap,
            { x: () => sideOffset() },
            {
              x: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wrap,
                start: 'top bottom',
                end: small ? 'top 80%' : 'top 55%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )

          // 2) Parallax (faster than the scroll). The top row keeps drifting upward until it leaves the screen. The
          //    bottom row starts lower and rises into its resting place, so once it arrives it scrolls normally and
          //    the space before the next section stays as designed instead of growing.
          //    On small screens the items are short rows stacked in one column, so the two-row logic does not apply
          //    (its scroll range would be empty for the last two): all four get the same gentle drift instead.
          const lastRow = i >= 2
          if (small) {
            gsap.fromTo(
              link,
              { y: 28 },
              {
                y: -28,
                ease: 'none',
                scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            )
          } else {
            gsap.fromTo(
              link,
              { y: () => (lastRow ? shift() * 0.55 : 0) },
              {
                y: () => (lastRow ? 0 : -shift() * 1.6),
                ease: 'none',
                scrollTrigger: {
                  trigger: wrap,
                  start: 'top 55%',
                  end: lastRow ? 'bottom 75%' : 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            )
          }

          // 3) 3D tilt through the whole pass (forward-to-back and side to side)
          gsap.set(link, { transformPerspective: 1100, transformOrigin: '50% 50%' })
          gsap.fromTo(
            link,
            { rotationX: TILT_X * tilt, rotationY: TILT_Y[i] * tilt, z: -50 * tilt },
            {
              rotationX: -TILT_X * tilt,
              rotationY: -TILT_Y[i] * tilt,
              z: 50 * tilt,
              ease: 'none',
              scrollTrigger: {
                trigger: wrap,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )

          // 4) Very subtle fade-in while it comes in from the side
          gsap.fromTo(
            link,
            { opacity: 0.2 },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: wrap,
                start: 'top bottom',
                end: small ? 'top 80%' : 'top 65%',
                scrub: true,
              },
            },
          )
        })
      },
      root,
    )

      // The scroll positions are measured once. If the page above changes height afterwards (photos or fonts that
      // finish loading, sections that resize), they are measured again, so the items never come in late.
      if (typeof ResizeObserver !== 'undefined') {
        let lastHeight = document.body.offsetHeight
        ro = new ResizeObserver(() => {
          const height = document.body.offsetHeight
          if (height === lastHeight) return
          lastHeight = height
          clearTimeout(refreshTimer)
          refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
        })
        ro.observe(document.body)
      }
    }

    if (typeof IntersectionObserver === 'undefined') {
      init()
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            io.disconnect()
            init()
          }
        },
        { rootMargin: '900px 0px' },
      )
      io.observe(root.current)
    }

    // Everything created above is killed here (ScrollTriggers, tweens, inline styles)
    return () => {
      cancelled = true
      io?.disconnect()
      ro?.disconnect()
      clearTimeout(refreshTimer)
      mm?.revert()
    }
  }, [])

  return (
    <div className="sf container" ref={root}>
      {items.map((item, i) => (
        <div key={item.key} className={`sf-item sf-${i + 1}`}>
          <a href={item.href} target="_blank" rel="noopener" className="sf-link">
            <span className="sf-photo">
              <img src={item.src} alt="" loading="lazy" decoding="async" style={{ objectPosition: item.pos }} />
              <span className="sf-desc">{item.desc}</span>
            </span>
            <b className="sf-title">
              {item.line1} <em>{item.line2}</em>
            </b>
            <span className="sf-desc-m">{item.desc}</span>
          </a>
        </div>
      ))}
    </div>
  )
}
