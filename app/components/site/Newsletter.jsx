'use client'

import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../constants'

// something@domain.ext, with no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(field, value, t) {
  if (field === 'name' && !value.trim()) return t.formErrorName
  if (field === 'email' && !EMAIL_PATTERN.test(value.trim())) return t.formErrorEmail
  return undefined
}

// "Not ready to talk yet?" card: the new look with the real form (it posts to the ElevateBiz API)
export default function Newsletter({ t, lang }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [department, setDepartment] = useState('')
  const [errors, setErrors] = useState({})
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  // The pieces start arriving as soon as the card shows on screen
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Check a field when the visitor leaves it
  function handleBlur(e) {
    const field = e.target.name
    setErrors((prev) => ({ ...prev, [field]: validate(field, e.target.value, t) }))
  }

  // Once a field shows an error, clear it as soon as the value becomes valid
  function handleChange(e) {
    const field = e.target.name
    if (errors[field] && !validate(field, e.target.value, t)) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)

    // Validate everything before sending; if something is wrong, focus the first bad field
    const found = {
      name: validate('name', String(form.get('name') ?? ''), t),
      email: validate('email', String(form.get('email') ?? ''), t),
    }
    setErrors(found)
    const firstBad = ['name', 'email'].find((f) => found[f])
    if (firstBad) {
      formEl.querySelector(`[name="${firstBad}"]`)?.focus()
      return
    }

    setStatus('sending')

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          is_community: form.get('is_community') === 'on',
          comments: form.get('comments'),
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setDepartment(data.department)
      setStatus('sent')
      formEl.reset()
      // Back to the normal button text after 20 seconds
      setTimeout(() => setStatus('idle'), 20000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div ref={ref} className={inView ? 'newsletter in' : 'newsletter'}>
      <div>
        <h3 className="nl-item nl-copy" style={{ '--i': 0 }}>
          {t.newsletterTitle}
        </h3>
        <p className="nl-item nl-copy" style={{ '--i': 1 }}>
          {t.newsletterSubtitle}
        </p>
      </div>
      {/* noValidate: our own messages replace the browser's validation pop-ups */}
      <form onSubmit={handleSubmit} noValidate className="nl-form">
        <div className="nl-item nl-field" style={{ '--i': 2 }}>
          <label className="nl-label" htmlFor="contact-name">
            {t.newsletterNameLabel}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            className="nl-input"
            placeholder={t.newsletterNamePlaceholder}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="nl-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="nl-item nl-field" style={{ '--i': 3 }}>
          <label className="nl-label" htmlFor="newsletter-email">
            {t.newsletterLabel}
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            className="nl-input"
            placeholder="you@business.com"
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
          />
          {errors.email && (
            <p id="newsletter-email-error" className="nl-error">
              {errors.email}
            </p>
          )}
        </div>
        <label className="nl-check nl-item" style={{ '--i': 4 }}>
          <input type="checkbox" name="is_community" />
          <span>{t.newsletterCheckboxLabel}</span>
        </label>
        <div className="nl-item nl-field" style={{ '--i': 5 }}>
          <label className="nl-label" htmlFor="contact-comments">
            {t.newsletterCommentsLabel}
          </label>
          <textarea id="contact-comments" name="comments" rows={4} className="nl-input nl-textarea" placeholder={t.newsletterCommentsPlaceholder} />
        </div>
        <button
          type="submit"
          disabled={status === 'sending' || status === 'sent'}
          className={`nl-button nl-item${status === 'sent' ? ' is-sent' : ''}`}
          style={{ '--i': 6 }}
        >
          {status === 'sending' ? t.formSending : status === 'sent' ? t.formSent : status === 'error' ? t.formRetry : t.newsletterButton}
        </button>
        {status === 'sent' && (
          <p className="nl-success" role="status">
            {t.formDepartments[department] ? t.formSuccessDept.replace('{dept}', t.formDepartments[department]) : t.formSuccessGeneric}
          </p>
        )}
        {status === 'error' && (
          <p className="nl-error" role="alert">
            {t.formErrorSend}
          </p>
        )}
      </form>
    </div>
  )
}
