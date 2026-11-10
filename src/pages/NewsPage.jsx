import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Header from '../sections/Header.jsx';
import Footer from '../sections/Footer.jsx';
import Icon from '../components/Icon.jsx';
import { SplitText, BlurText } from '../components/TextFx.jsx';
import { useTilt } from '../components/useTilt.js';
import { NEWS } from '../data/news.js';
import { CONTACT, LINK } from '../data/site.js';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, startSmoothScroll, getLenis, finePointer } from '../lib/gsap.js';

const CAT_ICON = { Flotte: 'fleet', Réseau: 'globe', Partenariat: 'handshake', Distinction: 'star', Engagement: 'users', Entreprise: 'sparkle' };
const CATS = ['Tout', ...Object.keys(CAT_ICON)];
const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtDate = (d) => fmt.format(new Date(`${d}T12:00:00`));
const readTime = (n) => Math.max(1, Math.round([n.excerpt, ...n.body].join(' ').split(/\s+/).length / 200));
const ARTICLES = NEWS.map((n, id) => ({ ...n, id }));
const ORIGINAL = LINK('/corporate/media/news');

/* ---------- Visuel d'un article (photo ou couverture de marque) ---------- */
function Cover({ n, className = '' }) {
  if (n.img) return <img className={className} src={n.img} alt="" loading="lazy" />;
  return (
    <div className={`cover-fallback ${className}`} aria-hidden="true">
      <Icon name={CAT_ICON[n.cat]} size={46} strokeWidth={1.2} />
      <img src="/img/logo-light.png" alt="" />
    </div>
  );
}

/* ---------- Hero : titre + pile de cartes en 3D ---------- */
function NewsHero({ onOpen }) {
  const root = useRef(null);
  const deck = ARTICLES.filter((n) => n.img).slice(0, 4);
  const years = `${ARTICLES.at(-1).date.slice(0, 4)} — ${ARTICLES[0].date.slice(0, 4)}`;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(q('.nhero__copy > *'), { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'power3.out', delay: 0.15 });
        // Les cartes arrivent en éventail…
        gsap.fromTo(
          q('.deck__card'),
          { y: 260, rotationX: 50, rotationZ: (i) => -14 + i * 9, autoAlpha: 0 },
          { y: 0, rotationX: 0, rotationZ: (i) => -9 + i * 6, autoAlpha: 1, stagger: 0.1, duration: 1.4, ease: 'power3.out', delay: 0.3 }
        );
        // …puis s'écartent au scroll
        gsap.to(q('.deck__card'), {
          x: (i) => (i - 1.5) * 90,
          y: (i) => -40 - i * 18,
          rotationZ: (i) => -16 + i * 11,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
        gsap.to(q('.nhero__glow'), { yPercent: 30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      });
      if (finePointer()) {
        const el = q('.deck')[0];
        const rx = gsap.quickTo(el, 'rotationX', { duration: 1, ease: 'power3.out' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 1, ease: 'power3.out' });
        const move = (e) => {
          ry((e.clientX / window.innerWidth - 0.5) * 22);
          rx(-(e.clientY / window.innerHeight - 0.5) * 14);
        };
        window.addEventListener('pointermove', move);
        return () => window.removeEventListener('pointermove', move);
      }
    },
    { scope: root }
  );

  return (
    <section className="nhero" ref={root}>
      <div className="nhero__glow" aria-hidden="true" />
      <div className="container nhero__in">
        <div className="nhero__copy">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <a href="/">Accueil</a>
            <Icon name="chevron" size={14} />
            <span>À propos</span>
            <Icon name="chevron" size={14} />
            <span>Médias</span>
            <Icon name="chevron" size={14} />
            <span aria-current="page">Nouvelles</span>
          </nav>
          <p className="eyebrow eyebrow--light">
            <Icon name="news" size={14} /> Salle de presse
          </p>
          <h1 className="nhero__title">
            Les nouvelles
            <br />
            <span className="accent">d’ASKY</span>
          </h1>
          <p className="nhero__lead">Flotte, nouvelles destinations, partenariats et distinctions : suivez l’envol de la compagnie aérienne panafricaine.</p>
          <ul className="nhero__chips">
            <li>
              <Icon name="news" size={16} /> {ARTICLES.length} articles
            </li>
            <li>
              <Icon name="calendar" size={16} /> {years}
            </li>
            <li>
              <Icon name="sparkle" size={16} /> {CATS.length - 1} thématiques
            </li>
          </ul>
        </div>

        <div className="deck" aria-hidden="true">
          {deck.map((n, i) => (
            <button type="button" tabIndex={-1} key={n.id} className="deck__card" style={{ zIndex: 10 - i }} onClick={() => onOpen(n.id)}>
              <img src={n.img} alt="" />
              <span className="deck__meta">
                <span className="deck__cat">{n.cat}</span>
                <span className="deck__title">{n.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <a className="nhero__scroll" href="#une" aria-label="Voir l'article à la une">
        <Icon name="chevron" size={20} />
      </a>
    </section>
  );
}

/* ---------- Article à la une ---------- */
function Featured({ n, onOpen }) {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '.feat__media',
          { clipPath: 'inset(14% 18% 14% 18% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 35%', scrub: 0.6 } }
        );
        gsap.fromTo('.feat__media img', { scale: 1.25 }, { scale: 1.02, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.from('.feat__body > *', { y: 36, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } });
      });
    },
    { scope: root }
  );
  return (
    <section className="feat" id="une" ref={root}>
      <div className="container">
        <article className="feat__card">
          <div className="feat__media">
            <Cover n={n} />
            <span className="feat__flag">
              <span className="dot" /> À la une
            </span>
          </div>
          <div className="feat__body">
            <p className="ncard__meta">
              <span className="pill">
                <Icon name={CAT_ICON[n.cat]} size={14} /> {n.cat}
              </span>
              <time dateTime={n.date}>{fmtDate(n.date)}</time>
              <span>· {readTime(n)} min de lecture</span>
            </p>
            <h2 className="feat__title">{n.title}</h2>
            <p className="muted">{n.excerpt}</p>
            <div className="feat__actions">
              <button type="button" className="btn btn--dark btn--lg" onClick={() => onOpen(n.id)}>
                Lire l’article <Icon name="arrow" size={18} />
              </button>
              <a className="btn btn--ghost btn--lg" href={ORIGINAL} target="_blank" rel="noreferrer">
                Sur flyasky.com <Icon name="arrowUpRight" size={18} />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ---------- Barre de filtres (onglets glissants + recherche) ---------- */
function Filters({ cat, setCat, query, setQuery, counts }) {
  const tabs = useRef(null);
  useLayoutEffect(() => {
    const wrap = tabs.current;
    const btn = wrap?.querySelector(`[data-cat="${cat}"]`);
    if (!btn) return;
    const place = () => {
      wrap.style.setProperty('--pill-x', `${btn.offsetLeft}px`);
      wrap.style.setProperty('--pill-w', `${btn.offsetWidth}px`);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [cat]);

  return (
    <div className="filters">
      <div className="container filters__in">
        <div className="filters__tabs" ref={tabs} role="tablist" aria-label="Filtrer par thématique">
          <span className="filters__pill" aria-hidden="true" />
          {CATS.map((c) => (
            <button key={c} type="button" role="tab" data-cat={c} aria-selected={cat === c} className={cat === c ? 'is-active' : ''} onClick={() => setCat(c)}>
              {c !== 'Tout' && <Icon name={CAT_ICON[c]} size={15} />}
              {c}
              <span className="filters__count">{counts[c] || 0}</span>
            </button>
          ))}
        </div>
        <label className="filters__search">
          <Icon name="search" size={18} />
          <span className="sr-only">Rechercher un article</span>
          <input type="search" placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
    </div>
  );
}

/* ---------- Carte d'article ---------- */
function NewsCard({ n, onOpen }) {
  return (
    <article className="ncard tilt spot">
      <button type="button" className="ncard__btn" onClick={() => onOpen(n.id)} aria-label={`Lire : ${n.title}`}>
        <div className="ncard__media">
          <Cover n={n} />
          <span className="ncard__cat">
            <Icon name={CAT_ICON[n.cat]} size={14} /> {n.cat}
          </span>
        </div>
        <div className="ncard__body">
          <p className="ncard__meta">
            <time dateTime={n.date}>{fmtDate(n.date)}</time>
            <span>· {readTime(n)} min</span>
          </p>
          <h3 className="ncard__title">{n.title}</h3>
          <p className="ncard__excerpt">{n.excerpt}</p>
          <span className="ncard__more">
            Lire l’article <Icon name="arrowUpRight" size={16} />
          </span>
        </div>
      </button>
    </article>
  );
}

/* ---------- Chronologie par année ---------- */
function Timeline({ list, onOpen, filterKey }) {
  const root = useRef(null);
  useTilt(root, '.tilt', 5, filterKey);
  const years = useMemo(() => {
    const m = new Map();
    list.forEach((n) => {
      const y = n.date.slice(0, 4);
      if (!m.has(y)) m.set(y, []);
      m.get(y).push(n);
    });
    return [...m.entries()];
  }, [list]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch(root.current.querySelectorAll('.ncard'), {
          start: 'top 92%',
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { y: 60, autoAlpha: 0, rotationX: -14, transformPerspective: 1000 },
              { y: 0, autoAlpha: 1, rotationX: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out', overwrite: true }
            ),
        });
        gsap.utils.toArray('.year__num', root.current).forEach((el) => {
          gsap.fromTo(el, { backgroundSize: '100% 0%' }, { backgroundSize: '100% 100%', ease: 'none', scrollTrigger: { trigger: el.closest('.year'), start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } });
        });
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [filterKey], revertOnUpdate: true }
  );

  return (
    <section className="timeline" ref={root}>
      <div className="container">
        {years.length === 0 && (
          <div className="empty">
            <Icon name="search" size={34} />
            <p>Aucun article ne correspond à votre recherche.</p>
          </div>
        )}
        {years.map(([y, items]) => (
          <div className="year" key={y}>
            <div className="year__side">
              <span className="year__num">{y}</span>
              <span className="year__count">
                {items.length} article{items.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="year__grid">
              {items.map((n) => (
                <NewsCard key={n.id} n={n} onOpen={onOpen} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Lecteur d'article (panneau latéral) ---------- */
function Reader({ id, onClose, onNav }) {
  const panel = useRef(null);
  const n = id === null ? null : ARTICLES[id];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (n === null) return;
    getLenis()?.stop();
    document.documentElement.classList.add('no-scroll');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    panel.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      getLenis()?.start();
      document.documentElement.classList.remove('no-scroll');
    };
  }, [n, onClose, onNav]);

  useEffect(() => {
    if (!n || !panel.current) return;
    panel.current.scrollTop = 0;
    gsap.fromTo(panel.current.querySelectorAll('.reader__anim'), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out', delay: 0.15 });
  }, [n]);

  if (!n) return null;
  const body = n.body.filter(Boolean).length ? n.body.filter(Boolean) : [n.excerpt];
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?article=${n.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  return (
    <div className="reader" role="dialog" aria-modal="true" aria-label={n.title}>
      <button type="button" className="reader__backdrop" aria-label="Fermer l'article" onClick={onClose} />
      <div className="reader__panel" ref={panel} tabIndex={-1} data-lenis-prevent>
        <div className="reader__bar">
          <span className="pill">
            <Icon name={CAT_ICON[n.cat]} size={14} /> {n.cat}
          </span>
          <div className="reader__nav">
            <button type="button" onClick={() => onNav(-1)} disabled={n.id === 0} aria-label="Article plus récent">
              <Icon name="arrow" size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button type="button" onClick={() => onNav(1)} disabled={n.id === ARTICLES.length - 1} aria-label="Article plus ancien">
              <Icon name="arrow" size={18} />
            </button>
            <button type="button" onClick={onClose} aria-label="Fermer">
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>
        <div className="reader__media reader__anim">
          <Cover n={n} />
        </div>
        <div className="reader__content">
          <p className="ncard__meta reader__anim">
            <Icon name="calendar" size={15} />
            <time dateTime={n.date}>{fmtDate(n.date)}</time>
            <span>· {readTime(n)} min de lecture</span>
          </p>
          <h2 className="reader__title reader__anim">{n.title}</h2>
          {body.map((p, i) => (
            <p key={i} className={`reader__p reader__anim ${i === 0 ? 'reader__p--lead' : ''}`}>
              {p}
            </p>
          ))}
          <div className="reader__foot reader__anim">
            <a className="btn btn--dark" href={ORIGINAL} target="_blank" rel="noreferrer">
              Article complet sur flyasky.com <Icon name="arrowUpRight" size={18} />
            </a>
            <button type="button" className="btn btn--ghost" onClick={share}>
              <Icon name={copied ? 'checkin' : 'sparkle'} size={18} /> {copied ? 'Lien copié' : 'Copier le lien'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Bandeau contact presse ---------- */
function PressBand() {
  return (
    <section className="press">
      <div className="container press__in">
        <div>
          <p className="eyebrow">
            <Icon name="mail" size={14} /> Contact presse
          </p>
          <BlurText as="h2" className="h2" text="Une question, *une* *interview* ?" />
          <p className="muted section__sub">Le service communication d’ASKY répond aux journalistes et partenaires médias.</p>
        </div>
        <div className="press__cards">
          <a className="press__card" href={`mailto:${CONTACT.email}`}>
            <span className="press__ic">
              <Icon name="mail" size={22} />
            </span>
            <span>
              <small>E-mail</small>
              <strong>{CONTACT.email}</strong>
            </span>
            <Icon name="arrowUpRight" size={18} className="press__go" />
          </a>
          <a className="press__card" href={`tel:${CONTACT.phones[0].replace(/\s/g, '')}`}>
            <span className="press__ic">
              <Icon name="phone" size={22} />
            </span>
            <span>
              <small>Téléphone</small>
              <strong>{CONTACT.phones[0]}</strong>
            </span>
            <Icon name="arrowUpRight" size={18} className="press__go" />
          </a>
          <a className="press__card" href={CONTACT.socials.linkedin} target="_blank" rel="noreferrer">
            <span className="press__ic">
              <Icon name="linkedin" size={22} />
            </span>
            <span>
              <small>Suivez-nous</small>
              <strong>@ASKY sur LinkedIn</strong>
            </span>
            <Icon name="arrowUpRight" size={18} className="press__go" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function NewsPage() {
  const [cat, setCat] = useState('Tout');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(() => {
    const a = new URLSearchParams(window.location.search).get('article');
    return a !== null && ARTICLES[Number(a)] ? Number(a) : null;
  });

  useEffect(() => {
    startSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  const counts = useMemo(() => {
    const c = { Tout: ARTICLES.length };
    ARTICLES.forEach((n) => (c[n.cat] = (c[n.cat] || 0) + 1));
    return c;
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.slice(1).filter(
      (n) => (cat === 'Tout' || n.cat === cat) && (!q || `${n.title} ${n.excerpt} ${n.body.join(' ')}`.toLowerCase().includes(q))
    );
  }, [cat, query]);

  const nav = useCallback((d) => setOpen((o) => (o === null ? o : Math.min(ARTICLES.length - 1, Math.max(0, o + d)))), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <Header />
      <main className="newspage">
        <NewsHero onOpen={setOpen} />
        <Featured n={ARTICLES[0]} onOpen={setOpen} />
        <div className="container archive__head">
          <SplitText as="h2" className="h2" text="Toutes les *actualités*" />
          <p className="muted">{list.length} article{list.length > 1 ? 's' : ''} affiché{list.length > 1 ? 's' : ''}</p>
        </div>
        <Filters cat={cat} setCat={setCat} query={query} setQuery={setQuery} counts={counts} />
        <Timeline list={list} onOpen={setOpen} filterKey={`${cat}|${query}`} />
        <PressBand />
      </main>
      <Footer />
      <Reader id={open} onClose={close} onNav={nav} />
    </>
  );
}
