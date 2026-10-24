import styles from "./dental.module.css";
import { Person } from "./art";
import { Carousel, Reveal, Stars } from "./client";
import { BookButton } from "./booking";
import { CLINIC_NAME, CONTACT, HOURS, PORTRAIT_CARDS, SERVICES, TEAM } from "./data";

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.heroPeople} aria-hidden="true">
        <Person skin="#e8b99a" hair="#2b1d16" className={styles.heroPersonA} />
        <Person skin="#8d5a3c" hair="#1c1410" className={styles.heroPersonB} />
      </div>
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
        <p className={styles.small}>(and learn why our patients love to come back)</p>
      </Reveal>
      <div className={styles.rows}>
        {SERVICES.map((name, i) => (
          <Reveal key={name} delay={i * 90}>
            <div className={styles.row}>
              <span>{name}</span>
              <BookButton className={styles.rowBook}>Book</BookButton>
            </div>
          </Reveal>
        ))}
        <Reveal delay={400}>
          <a href="#reviews" className={styles.watch}>
            <span className={styles.watchText}>
              What you can expect at your exam &amp; cleaning
              <small>Watch now.</small>
            </span>
            <Person skin="#f0c8a8" hair="#17120f" scrubs="#6f7a86" className={styles.watchThumb} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Portraits() {
  return (
    <section className={styles.portraits}>
      {PORTRAIT_CARDS.map((card, i) => (
        <Reveal key={card.label} delay={i * 110}>
          <div className={styles.portrait} style={{ background: card.tone }}>
            <Person skin={card.skin} hair={card.hair} scrubs="#6f7a86" className={styles.portraitPerson} />
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
                <Person skin={m.skin} hair={m.hair} scrubs="#6f7a86" className={styles.memberPerson} />
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
