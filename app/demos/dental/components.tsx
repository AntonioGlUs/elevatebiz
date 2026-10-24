import styles from "./dental.module.css";
import { Carousel, Reveal, ServicesMenu, Stars } from "./client";
import { BookButton } from "./booking";
import { CLINIC_NAME, CONTACT, HOURS, PHOTOS, PORTRAIT_CARDS, REVIEWS, TEAM } from "./data";

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <img
        src="/images/dental/team-banner.webp"
        alt="The dental team smiling together in a bright reception area"
        width={1536}
        height={1024}
        fetchPriority="high"
        className={styles.heroBanner}
      />
      <div className={styles.heroShade} />
      <div className={styles.heroText}>
        <h1 className={styles.heroTitle}>Smiles worth sharing.</h1>
        <p className={styles.heroSub}>
          Why patients rate {CLINIC_NAME}
          <br />
          <strong>5 STARS</strong> year after year!
        </p>
        <div className={styles.heroButtons}>
          <a href="#reviews" className={styles.pill}>
            Read Our Reviews
          </a>
          <BookButton className={styles.pill}>Book Now</BookButton>
        </div>
      </div>
    </section>
  );
}

export function Comfort() {
  return (
    <section id="services" className={styles.section}>
      <Reveal>
        <h2 className={styles.serifTitle}>
          Experience <span className={styles.accent}>personalized</span> comfort
        </h2>
        <p className={styles.small}>Explore our services and find the care that fits your smile.</p>
      </Reveal>
      <Reveal delay={120}>
        <ServicesMenu />
      </Reveal>
    </section>
  );
}

export function Portraits() {
  return (
    <section className={styles.portraits}>
      {PORTRAIT_CARDS.map((card, i) => (
        <Reveal key={card.label} delay={i * 110}>
          <div className={styles.portrait} style={{ background: card.tone }}>
            <img src={card.photo} alt={card.alt} width={1448} height={1086} loading="lazy" className={styles.portraitPerson} style={{ objectPosition: card.pos }} />
            <a href="#team" className={styles.labelPill}>
              {card.label}
            </a>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

export function Redefining() {
  return (
    <section id="reviews" className={`${styles.section} ${styles.split}`}>
      <Reveal>
        <Carousel />
      </Reveal>
      <Reveal delay={150}>
        <Stars />
        <h2 className={styles.serifTitle}>
          <span className={styles.accent}>Redefining</span> what a dental visit should feel like.
        </h2>
        <blockquote className={styles.quote}>
          “Can you love your dentist? After a visit here, you absolutely can. Kind, professional and never rushed.”
          <cite>— Sample patient</cite>
        </blockquote>
        <BookButton className={styles.pillOutline}>Check Out 1000s of 5 Star Reviews</BookButton>
      </Reveal>
    </section>
  );
}

export function Reviews() {
  return (
    <section className={styles.section}>
      <Reveal>
        <h2 className={styles.serifTitle}>
          What our <span className={styles.accent}>patients</span> say
        </h2>
      </Reveal>
      <div className={styles.reviewGrid}>
        {REVIEWS.map((r, i) => (
          <Reveal key={r.name} delay={i * 110}>
            <figure className={styles.review}>
              <div className={styles.reviewStars} aria-label="Five star rating">
                ★★★★★
              </div>
              <blockquote>“{r.quote}”</blockquote>
              <figcaption>
                {r.name} <span>· Sample patient</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section id="team" className={styles.section}>
      <Reveal>
        <h2 className={styles.serifTitle}>Our team is everything</h2>
      </Reveal>
      <div className={styles.teamGrid}>
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={i * 110}>
            <article className={styles.member}>
              <div className={styles.memberArt}>
                <img src={m.photo} alt={`${m.name}, ${m.role}`} width={1165} height={1350} loading="lazy" className={styles.memberPerson} />
                <BookButton className={styles.bookTag}>BOOK</BookButton>
              </div>
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="book" className={styles.footer}>
      <Reveal className={styles.footerHead}>
        <h2 className={styles.serifTitle}>
          Dental visits you want to tell everyone about?
        </h2>
        <p>We’re up for that challenge.</p>
        <BookButton className={styles.footerBook}>Book your visit</BookButton>
      </Reveal>
      <div className={styles.footerCols}>
        <div>
          <h3>Contact</h3>
          <p>{CONTACT.email}</p>
          <p>Call/Text {CONTACT.phone}</p>
        </div>
        <div>
          <h3>Find us</h3>
          {CONTACT.address.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div>
          <h3>Hours</h3>
          {HOURS.map((h) => (
            <p key={h.days}>
              {h.days}
              <br />
              {h.time}
            </p>
          ))}
        </div>
      </div>
      <p className={styles.copy}>© {new Date().getFullYear()} {CLINIC_NAME}. All rights reserved.</p>
    </footer>
  );
}
