import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { CONTACT } from '../data/site.js';
import { SECTIONS, HOME, NEWS_PATH, isExternal } from '../data/sitemap.js';
import { gsap, getLenis, openBooking } from '../lib/gsap.js';

const here = () => window.location.pathname.replace(/\/+$/, '') || '/';
const isHome = () => ['/', '/tg/fr', '/index.html'].includes(here());
const extProps = (href) => (isExternal(href) ? { target: '_blank', rel: 'noreferrer' } : {});

// Ancre de l'accueil si on y est, sinon page équivalente
function goTo(anchor, fallback) {
  if (anchor === '#reserver' && isHome()) return openBooking();
  const el = document.querySelector(anchor);
  if (el) {
    const l = getLenis();
    if (l) l.scrollTo(anchor, { offset: -90, duration: 1.2 });
    else el.scrollIntoView({ behavior: 'smooth' });
  } else window.location.href = fallback;
}

export default function Header() {
  const [open, setOpen] = useState(null); // index du méga-menu ouvert
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panelRef = useRef(null);
  const closeTimer = useRef(0);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Masque le header en descendant, le ré-affiche en remontant
      setHidden(y > 700 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open === null || !panelRef.current) return;
    gsap.fromTo(
      panelRef.current.querySelectorAll('.mega__col'),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.45, ease: 'power3.out' }
    );
  }, [open]);

  useEffect(() => {
    const l = getLenis();
    if (mobile) l?.stop();
    else l?.start();
    document.documentElement.classList.toggle('no-scroll', mobile);
  }, [mobile]);

  const enter = (i) => {
    clearTimeout(closeTimer.current);
    setOpen(i);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const go = (anchor, fallback) => {
    setMobile(false);
    setOpen(null);
    goTo(anchor, fallback);
  };
  const BOOK = '/tg/fr/fly/booking';

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''} ${hidden && open === null ? 'is-hidden' : ''}`}>
      <div className="topbar">
        <div className="container topbar__in">
          <div className="topbar__left">
            {CONTACT.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, '')}`}>
                <Icon name="phone" size={14} /> {p}
              </a>
            ))}
          </div>
          <div className="topbar__right">
            <a href="#contact" onClick={(e) => (e.preventDefault(), go('#contact', '#contact'))}>
              Contact
            </a>
            <a href="https://www.flyasky.com/tg/fr/sitemap" target="_blank" rel="noreferrer">
              Plan du site
            </a>
            <button className="topbar__lang" type="button">
              <span className="flag-tg" aria-hidden="true" /> Togo · FR <Icon name="chevron" size={13} />
            </button>
          </div>
        </div>
      </div>

      <nav className="nav" onMouseLeave={leave} aria-label="Menu principal">
        <div className="container nav__in">
          <a href={HOME} className="nav__logo" onClick={(e) => isHome() && (e.preventDefault(), go('#top', HOME))} aria-label="ASKY, accueil">
            <img src="/img/logo.png" alt="ASKY — The Pan African Airline" />
          </a>

          <ul className="nav__links">
            {SECTIONS.map((m, i) => (
              <li key={m.key} onMouseEnter={() => enter(i)}>
                <button
                  type="button"
                  className={`nav__link ${open === i || here().startsWith(m.path) ? 'is-active' : ''}`}
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {m.label}
                  <Icon name="chevron" size={14} />
                </button>
              </li>
            ))}
            <li>
              <a className={`nav__link ${here() === NEWS_PATH ? 'is-active' : ''}`} href={NEWS_PATH}>
                Actualités
              </a>
            </li>
          </ul>

          <div className="nav__actions">
            <a href="/tg/fr/fly/booking/manage" className="btn btn--ghost nav__manage">
              <Icon name="ticket" size={18} /> Mes voyages
            </a>
            <a href={BOOK} className="btn btn--primary" onClick={(e) => (e.preventDefault(), go('#reserver', BOOK))}>
              Réserver <Icon name="arrow" size={18} />
            </a>
            <button className="nav__burger" type="button" aria-label="Ouvrir le menu" onClick={() => setMobile(true)}>
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>

        {open !== null && (
          <div className="mega" ref={panelRef} onMouseEnter={() => enter(open)}>
            <div className="container mega__in">
              <div className="mega__intro">
                <span className="eyebrow">{SECTIONS[open].label}</span>
                <p>{SECTIONS[open].tagline}</p>
                <a className="mega__all" href={SECTIONS[open].path}>
                  Toute la rubrique <Icon name="arrow" size={16} />
                </a>
              </div>
              {SECTIONS[open].groups.map((c) => (
                <div className="mega__col" key={c.title}>
                  <h4>
                    <a href={c.path}>{c.title}</a>
                  </h4>
                  <ul>
                    {c.pages.map((l) => (
                      <li key={l.path}>
                        <a href={l.path} {...extProps(l.path)} className={here() === l.path ? 'is-current' : ''}>
                          {l.title}
                          {l.ext && <Icon name="arrowUpRight" size={13} />}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className={`mnav ${mobile ? 'is-open' : ''}`} aria-hidden={!mobile}>
        <div className="mnav__head">
          <img src="/img/logo-light.png" alt="ASKY" />
          <button type="button" aria-label="Fermer le menu" onClick={() => setMobile(false)}>
            <Icon name="close" size={26} />
          </button>
        </div>
        <div className="mnav__body">
          {SECTIONS.map((m) => (
            <details key={m.key}>
              <summary>
                {m.label} <Icon name="chevron" size={18} />
              </summary>
              <div className="mnav__groups">
                {m.groups.map((c) => (
                  <div key={c.title} className="mnav__group">
                    <a className="mnav__gtitle" href={c.path}>
                      {c.title}
                    </a>
                    {c.pages.map((l) => (
                      <a key={l.path} href={l.path} {...extProps(l.path)}>
                        {l.title}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </details>
          ))}
          <a className="mnav__plain" href={NEWS_PATH}>
            Actualités
          </a>
        </div>
        <div className="mnav__foot">
          <a href={BOOK} className="btn btn--primary btn--block" onClick={(e) => (e.preventDefault(), go('#reserver', BOOK))}>
            Réserver un vol <Icon name="arrow" size={18} />
          </a>
          <a href={`tel:${CONTACT.phones[0].replace(/\s/g, '')}`} className="mnav__phone">
            <Icon name="phone" size={16} /> {CONTACT.phones[0]}
          </a>
        </div>
      </div>
    </header>
  );
}
