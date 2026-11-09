import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { MENU, CONTACT } from '../data/site.js';
import { gsap, scrollToTarget, getLenis } from '../lib/gsap.js';

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

  const go = (target) => {
    setMobile(false);
    setOpen(null);
    scrollToTarget(target);
  };

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
            <a href="#contact">Contact</a>
            <a href="#">Plan du site</a>
            <button className="topbar__lang" type="button">
              <span className="flag-tg" aria-hidden="true" /> Togo · FR <Icon name="chevron" size={13} />
            </button>
          </div>
        </div>
      </div>

      <nav className="nav" onMouseLeave={leave} aria-label="Menu principal">
        <div className="container nav__in">
          <a href="#top" className="nav__logo" onClick={(e) => (e.preventDefault(), go('#top'))} aria-label="ASKY, accueil">
            <img src="/img/logo.png" alt="ASKY — The Pan African Airline" />
          </a>

          <ul className="nav__links">
            {MENU.map((m, i) => (
              <li key={m.label} onMouseEnter={() => enter(i)}>
                <button
                  type="button"
                  className={`nav__link ${open === i ? 'is-active' : ''}`}
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {m.label}
                  <Icon name="chevron" size={14} />
                </button>
              </li>
            ))}
            <li>
              <a className="nav__link" href="#reseau" onClick={(e) => (e.preventDefault(), go('#reseau'))}>
                Réseau
              </a>
            </li>
          </ul>

          <div className="nav__actions">
            <a href="#reserver" className="btn btn--ghost nav__manage" onClick={(e) => (e.preventDefault(), go('#reserver'))}>
              <Icon name="ticket" size={18} /> Mes voyages
            </a>
            <a href="#reserver" className="btn btn--primary" onClick={(e) => (e.preventDefault(), go('#reserver'))}>
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
                <span className="eyebrow">{MENU[open].label}</span>
                <p>
                  {
                    [
                      'Tout ce qu’il faut savoir avant le départ : documents, bagages et services.',
                      'Réservez, gérez votre vol, enregistrez-vous et suivez votre avion en temps réel.',
                      'ASKY Club, vacances en Afrique et expérience à bord.',
                      'La compagnie panafricaine basée à Lomé : notre histoire, nos équipes, nos actualités.',
                    ][open]
                  }
                </p>
              </div>
              {MENU[open].columns.map((c) => (
                <div className="mega__col" key={c.title}>
                  <h4>{c.title}</h4>
                  <ul>
                    {c.links.map((l) => (
                      <li key={l}>
                        <a href="#">{l}</a>
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
          {MENU.map((m) => (
            <details key={m.label}>
              <summary>
                {m.label} <Icon name="chevron" size={18} />
              </summary>
              <div className="mnav__links">
                {m.columns.flatMap((c) => c.links.slice(0, 3)).map((l) => (
                  <a key={l} href="#">
                    {l}
                  </a>
                ))}
              </div>
            </details>
          ))}
          <a className="mnav__plain" href="#reseau" onClick={(e) => (e.preventDefault(), go('#reseau'))}>
            Notre réseau
          </a>
        </div>
        <div className="mnav__foot">
          <a href="#reserver" className="btn btn--primary btn--block" onClick={(e) => (e.preventDefault(), go('#reserver'))}>
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
