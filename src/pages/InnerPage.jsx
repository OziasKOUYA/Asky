import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../sections/Header.jsx';
import Footer from '../sections/Footer.jsx';
import Booking from '../sections/Booking.jsx';
import Network from '../sections/Network.jsx';
import Icon from '../components/Icon.jsx';
import { SplitText } from '../components/TextFx.jsx';
import { useTilt } from '../components/useTilt.js';
import PAGES from '../data/pages.json';
import { SECTIONS, INDEX, HOME, NEWS_PATH, ORIGINAL, isExternal } from '../data/sitemap.js';
import { CONTACT } from '../data/site.js';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, startSmoothScroll, getLenis, finePointer } from '../lib/gsap.js';

/* ---------- utilitaires ---------- */
const strip = (h = '') => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const fold = (t = '') => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const slug = (t) => fold(t).slice(0, 40) || 'section';
const extProps = (href) => (isExternal(href) ? { target: '_blank', rel: 'noreferrer' } : {});
const words = (blocks) => blocks.reduce((n, b) => n + strip(b.html || b.text || (b.items || []).join(' ') || '').split(' ').length, 0);

function excerptOf(path, max = 150) {
  const d = PAGES[path];
  const p = d?.blocks.find((b) => b.t === 'p' && strip(b.html).length > 60);
  if (!p) return '';
  const t = strip(p.html);
  return t.length > max ? `${t.slice(0, max).replace(/\s\S*$/, '')}…` : t;
}
const imageOf = (path) => PAGES[path]?.blocks.find((b) => b.t === 'img')?.src;

// Toutes les pages internes dans l'ordre du menu (pour « précédent / suivant »)
const ORDER = SECTIONS.flatMap((s) => s.groups.flatMap((g) => g.pages.filter((p) => !p.ext && p.path !== NEWS_PATH).map((p) => ({ ...p, section: s }))));

const WIDGET_LEAD = {
  manage: 'Retrouvez votre réservation pour modifier vos dates, ajouter des bagages ou choisir votre siège.',
  checkin: 'Enregistrez-vous en ligne dès 24 h avant le départ et gagnez du temps à l’aéroport.',
  status: 'Suivez votre vol en temps réel : heure de départ, d’arrivée et éventuels retards.',
  schedule: 'Consultez les jours et horaires de vol entre les 30 villes du réseau ASKY.',
};
const FORM_LEAD = {
  feedback: 'Votre avis nous aide à améliorer chaque voyage. Partagez votre expérience avec nous.',
  subscription: 'Recevez nos offres exclusives et nos dernières nouvelles directement dans votre boîte mail.',
};

/* ---------- Hero des pages ---------- */
function PageHero({ title, lead, crumbs, section, icon, visual, meta }) {
  const root = useRef(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(q('.phero__copy > *:not(h1)'), { y: 30, autoAlpha: 0, stagger: 0.07, duration: 0.9, ease: 'power3.out', delay: 0.1 });
        gsap.fromTo(
          q('.phero__visual'),
          { y: 80, rotationX: 28, rotationY: -18, autoAlpha: 0 },
          { y: 0, rotationX: 6, rotationY: -10, autoAlpha: 1, duration: 1.4, ease: 'power3.out', delay: 0.2, transformPerspective: 1400 }
        );
        gsap.to(q('.phero__visual-in'), { yPercent: 18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 } });
        gsap.to(q('.phero__copy'), { y: 80, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 } });
        gsap.to(q('.phero__float'), { y: -14, rotation: 4, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
      if (finePointer()) {
        const el = q('.phero__visual')[0];
        const rx = gsap.quickTo(el, 'rotationX', { duration: 1.1, ease: 'power3.out' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 1.1, ease: 'power3.out' });
        const move = (e) => {
          ry(-10 + (e.clientX / window.innerWidth - 0.5) * 22);
          rx(6 - (e.clientY / window.innerHeight - 0.5) * 14);
        };
        window.addEventListener('pointermove', move);
        return () => window.removeEventListener('pointermove', move);
      }
    },
    { scope: root }
  );

  const plane = visual === 'plane';
  return (
    <section className={`phero phero--${section?.key || 'none'}`} ref={root}>
      <div className="phero__glow" aria-hidden="true" />
      <div className="container phero__in">
        <div className="phero__copy">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            {crumbs.map((c, i) => (
              <span key={c.label + i} className="crumbs__item">
                {i > 0 && <Icon name="chevron" size={14} />}
                {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
              </span>
            ))}
          </nav>
          {section && (
            <p className="eyebrow eyebrow--light">
              <Icon name={section.icon} size={14} /> {section.label}
            </p>
          )}
          <SplitText as="h1" className="phero__title" text={title} start="top 100%" />
          {lead && <p className="phero__lead">{lead}</p>}
          {meta && <ul className="phero__meta">{meta}</ul>}
        </div>

        <div className={`phero__visual ${plane ? 'phero__visual--plane' : ''}`} aria-hidden="true">
          <div className="phero__visual-in">
            {plane ? (
              <>
                <div className="phero__sky" />
                <img className="phero__plane" src="/img/plane.webp" alt="" />
              </>
            ) : (
              <img className="phero__photo" src={visual} alt="" />
            )}
          </div>
          <span className="phero__float">
            <Icon name={icon || section?.icon || 'plane'} size={28} />
          </span>
        </div>
      </div>
      <svg className="phero__curve" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 80 C 360 0 1080 0 1440 80 Z" />
      </svg>
    </section>
  );
}

/* ---------- Rendu des blocs de contenu ---------- */
function Spec({ rows }) {
  return (
    <div className="spec">
      {rows.map((r, i) => (
        <div className="spec__item" key={i}>
          <span className="spec__label">{strip(r[0])}</span>
          <strong className="spec__value" dangerouslySetInnerHTML={{ __html: r[1].replace(/^(<br>)+|(<br>)+$/g, '') || '—' }} />
        </div>
      ))}
    </div>
  );
}

function Bars({ rows }) {
  const ref = useRef(null);
  const data = rows.slice(1).map((r) => ({ y: strip(r[0]), v: Number(strip(r[1]).replace(/\s/g, '')) })).filter((d) => /^\d{4}$/.test(d.y) && !Number.isNaN(d.v));
  const max = Math.max(...data.map((d) => d.v));
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current.querySelectorAll('.bars__bar'), { scaleY: 0, transformOrigin: '50% 100%', stagger: 0.05, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } });
        gsap.from(ref.current.querySelectorAll('.bars__val'), { autoAlpha: 0, y: 8, stagger: 0.05, duration: 0.5, delay: 0.4, scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } });
      });
    },
    { scope: ref }
  );
  return (
    <figure className="bars" ref={ref}>
      <figcaption>{strip(rows[0][1])} par année</figcaption>
      <div className="bars__plot">
        {data.map((d) => (
          <div className="bars__col" key={d.y} title={`${d.y} : ${d.v.toLocaleString('fr-FR')}`}>
            <span className="bars__val">{Math.round(d.v / 1000)}k</span>
            <span className="bars__bar" style={{ height: `${(d.v / max) * 100}%` }} />
            <span className="bars__year">{d.y.slice(2)}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

function Table({ rows }) {
  const head = rows[0];
  const isSpec = rows.every((r) => r.length === 2) && rows.length >= 3 && rows.filter((r) => /<strong>/.test(r[0])).length >= rows.length - 1;
  if (/ann[ée]e/i.test(strip(head[0])) && rows.length > 4) return <Bars rows={rows} />;
  if (isSpec) return <Spec rows={rows.filter((r) => strip(r[1]))} />;
  return (
    <div className="tbl">
      <table>
        <thead>
          <tr>
            {head.map((c, i) => (
              <th key={i}>{strip(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} data-label={strip(head[j])} dangerouslySetInnerHTML={{ __html: c }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.t === 'h') return <h2 key={i} id={slug(b.text)} className="prose__h reveal">{b.text}</h2>;
    if (b.t === 'p') return <p key={i} className="reveal" dangerouslySetInnerHTML={{ __html: b.html }} />;
    if (b.t === 'ul')
      return (
        <ul key={i} className="prose__list reveal">
          {b.items.map((it, j) => (
            <li key={j}>
              <span className="prose__tick">
                <Icon name="checkin" size={16} />
              </span>
              <span dangerouslySetInnerHTML={{ __html: it }} />
            </li>
          ))}
        </ul>
      );
    if (b.t === 'table') return <div key={i} className="reveal"><Table rows={b.rows} /></div>;
    if (b.t === 'img')
      return (
        <figure key={i} className="prose__img reveal">
          <img src={b.src} alt={b.alt || ''} loading="lazy" />
        </figure>
      );
    return null;
  });
}

/* ---------- Cartes de navigation ---------- */
function PageCard({ p, big = false }) {
  const img = !p.ext && imageOf(p.path);
  return (
    <a className={`pcard tilt spot ${big ? 'pcard--big' : ''}`} href={p.path} {...extProps(p.path)}>
      {img && (
        <span className="pcard__media">
          <img src={img} alt="" loading="lazy" />
        </span>
      )}
      <span className="pcard__body">
        <span className="pcard__ic">
          <Icon name={p.icon || 'arrow'} size={22} />
        </span>
        <strong className="pcard__title">{p.title}</strong>
        <span className="pcard__text">{p.ext ? 'Service en ligne ASKY — ouvre un nouvel onglet.' : p.lead || WIDGET_LEAD[p.widget] || FORM_LEAD[p.form] || excerptOf(p.path) || (p.custom === 'leadership' ? 'Les dirigeants qui pilotent le développement de la compagnie.' : 'Découvrir la page.')}</span>
        <span className="pcard__go">
          {p.ext ? 'Ouvrir' : 'Découvrir'} <Icon name={p.ext ? 'arrowUpRight' : 'arrow'} size={16} />
        </span>
      </span>
    </a>
  );
}

/* ---------- Pages spéciales ---------- */
const LEADERS = [
  { name: 'Gervais Koffi Gbondjide DJONDO', role: 'Fondateur et Président du Conseil d’Administration', note: 'Honoré aux BOMA Africa Awards 2024 à Accra.' },
  { name: 'Esayas Woldemariam HAILU', role: 'Directeur Général', note: '« Nous voyons un lien direct entre notre activité et le développement de l’Afrique. »' },
  { name: 'Daté Dovéné TEVI-BENISSAN', role: 'Directeur Commercial', note: 'En charge du développement commercial et des partenariats de vente.' },
];

function Leadership() {
  return (
    <div className="leaders">
      {LEADERS.map((l) => (
        <article className="leader tilt spot reveal" key={l.name}>
          <span className="leader__avatar" aria-hidden="true">
            {l.name
              .split(' ')
              .filter((w) => w === w.toUpperCase() || /^[A-Z]/.test(w))
              .slice(0, 2)
              .map((w) => w[0])
              .join('')}
          </span>
          <strong className="leader__name">{l.name}</strong>
          <span className="leader__role">{l.role}</span>
          <p className="leader__note">{l.note}</p>
        </article>
      ))}
    </div>
  );
}

function FormFeedback() {
  const [sent, setSent] = useState(false);
  const [rate, setRate] = useState(0);
  return (
    <form className="pform reveal" onSubmit={(e) => (e.preventDefault(), setSent(true))}>
      <div className="pform__grid">
        <label className="field">
          <span className="field__label">
            <Icon name="user" size={16} /> Nom complet
          </span>
          <input required placeholder="Votre nom" />
        </label>
        <label className="field">
          <span className="field__label">
            <Icon name="mail" size={16} /> E-mail
          </span>
          <input type="email" required placeholder="vous@exemple.com" />
        </label>
        <label className="field">
          <span className="field__label">
            <Icon name="plane" size={16} /> N° de vol (facultatif)
          </span>
          <input placeholder="KP 040" />
        </label>
        <label className="field">
          <span className="field__label">
            <Icon name="news" size={16} /> Sujet
          </span>
          <select defaultValue="exp">
            <option value="exp">Expérience à bord</option>
            <option value="sol">Services au sol</option>
            <option value="bag">Bagages</option>
            <option value="res">Réservation</option>
            <option value="club">ASKY Club</option>
            <option value="autre">Autre</option>
          </select>
        </label>
        <label className="field pform__full">
          <span className="field__label">
            <Icon name="mail" size={16} /> Votre message
          </span>
          <textarea required rows={5} placeholder="Racontez-nous votre expérience…" />
        </label>
      </div>
      <div className="pform__rate" role="radiogroup" aria-label="Note globale">
        <span>Votre note</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} role="radio" aria-checked={rate === n} className={n <= rate ? 'is-on' : ''} onClick={() => setRate(n)} aria-label={`${n} sur 5`}>
            <Icon name="star" size={22} />
          </button>
        ))}
      </div>
      <button className="btn btn--primary btn--lg" type="submit">
        Envoyer mon commentaire <Icon name="arrow" size={18} />
      </button>
      {sent && <p className="pform__ok">Merci ! Votre commentaire a bien été pris en compte (démo).</p>}
    </form>
  );
}

function FormSubscription() {
  const [sent, setSent] = useState(false);
  return (
    <form className="pform reveal" onSubmit={(e) => (e.preventDefault(), setSent(true))}>
      <p className="pform__intro">Soyez le premier à recevoir des offres exclusives et les dernières nouvelles sur nos produits et services directement dans votre boîte aux lettres électronique.</p>
      <div className="pform__grid">
        <label className="field">
          <span className="field__label">
            <Icon name="user" size={16} /> Prénom
          </span>
          <input required />
        </label>
        <label className="field">
          <span className="field__label">
            <Icon name="user" size={16} /> Nom de famille
          </span>
          <input required />
        </label>
        <label className="field pform__full">
          <span className="field__label">
            <Icon name="mail" size={16} /> Adresse e-mail
          </span>
          <input type="email" required placeholder="vous@exemple.com" />
        </label>
      </div>
      <label className="check pform__check">
        <input type="checkbox" required /> <span>J’accepte de recevoir les newsletters et offres d’ASKY Airlines.</span>
      </label>
      <button className="btn btn--primary btn--lg" type="submit">
        Je m’abonne <Icon name="arrow" size={18} />
      </button>
      {sent && <p className="pform__ok">Merci ! Votre inscription est bien prise en compte (démo).</p>}
    </form>
  );
}

/* ---------- Barre latérale ---------- */
function Sidebar({ section, group, current }) {
  return (
    <aside className="side">
      {group && (
        <nav className="side__box" aria-label={`Rubrique ${group.title}`}>
          <a className="side__title" href={group.path}>
            <Icon name={group.icon} size={18} /> {group.title}
          </a>
          <ul>
            {group.pages.map((p) => (
              <li key={p.path}>
                <a href={p.path} {...extProps(p.path)} className={p.path === current ? 'is-current' : ''} aria-current={p.path === current ? 'page' : undefined}>
                  <Icon name={p.icon} size={16} /> {p.title}
                  {p.ext && <Icon name="arrowUpRight" size={13} />}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {section && (
        <nav className="side__box side__box--soft" aria-label={`Autres pages : ${section.label}`}>
          <span className="side__sub">Aussi dans « {section.label} »</span>
          <ul>
            {section.groups
              .filter((g) => g !== group)
              .map((g) => (
                <li key={g.path}>
                  <a href={g.path}>
                    <Icon name={g.icon} size={16} /> {g.title}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      )}
      <div className="side__help">
        <strong>Besoin d’aide ?</strong>
        <p>Notre service client vous répond 7 j/7.</p>
        {CONTACT.phones.map((p) => (
          <a key={p} href={`tel:${p.replace(/\s/g, '')}`}>
            <Icon name="phone" size={16} /> {p}
          </a>
        ))}
        <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={16} /> WhatsApp
        </a>
      </div>
    </aside>
  );
}

/* ---------- Précédent / suivant + appel à l'action ---------- */
function NextPrev({ current }) {
  const i = ORDER.findIndex((p) => p.path === current);
  if (i < 0) return null;
  const prev = ORDER[i - 1];
  const next = ORDER[i + 1];
  return (
    <nav className="np container" aria-label="Pages voisines">
      {prev ? (
        <a className="np__link" href={prev.path}>
          <span className="np__dir">
            <Icon name="arrow" size={18} style={{ transform: 'rotate(180deg)' }} /> Page précédente
          </span>
          <strong>{prev.title}</strong>
          <span className="np__sec">{prev.section.label}</span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a className="np__link np__link--next" href={next.path}>
          <span className="np__dir">
            Page suivante <Icon name="arrow" size={18} />
          </span>
          <strong>{next.title}</strong>
          <span className="np__sec">{next.section.label}</span>
        </a>
      )}
    </nav>
  );
}

/* ---------- Page ---------- */
export default function InnerPage({ path }) {
  const root = useRef(null);
  const entry = INDEX[path];
  const data = PAGES[path];

  useEffect(() => {
    startSmoothScroll();
    getLenis()?.start();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  useTilt(root, '.tilt', 6);

  // Apparition des blocs au fil du scroll
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch(root.current.querySelectorAll('.reveal, .pcard, .np__link'), {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.8, ease: 'power3.out', overwrite: true }),
        });
        gsap.utils.toArray('.prose__img', root.current).forEach((el) => {
          gsap.fromTo(el, { clipPath: 'inset(12% 14% 12% 14% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: 0.6 } });
        });
      });
    },
    { scope: root }
  );

  const view = useMemo(() => {
    const home = { label: 'Accueil', href: HOME };
    if (!entry) return { kind: '404' };
    const { section, group, page } = entry;
    if (entry.kind === 'section') {
      return { kind: 'section', section, title: section.label, lead: section.tagline, crumbs: [home, { label: section.label }], icon: section.icon, visual: section.visual };
    }
    if (entry.kind === 'group') {
      return {
        kind: 'group',
        section,
        group,
        title: group.title,
        lead: excerptOf(group.pages[0]?.path, 200) ? `${group.pages.length} page${group.pages.length > 1 ? 's' : ''} pour tout savoir : ${group.pages.map((p) => p.title.toLowerCase()).join(', ')}.` : section.tagline,
        crumbs: [home, { label: section.label, href: section.path }, { label: group.title }],
        icon: group.icon,
        visual: section.visual === 'plane' ? 'plane' : imageOf(group.pages.find((p) => imageOf(p.path))?.path) || section.visual,
      };
    }
    // page de contenu
    let blocks = data ? data.blocks.slice() : [];
    const firstImg = blocks.find((b) => b.t === 'img');
    const planeVisual = section.visual === 'plane' || path.includes('/fleet');
    if (firstImg && !planeVisual) blocks = blocks.filter((b) => b !== firstImg);
    // retire les titres qui répètent le titre de la page
    const t1 = fold(page.title);
    const t2 = fold(data?.title);
    blocks = blocks.filter((b, i) => !(b.t === 'h' && i < 3 && fold(b.text).length > 3 && [t1, t2].some((t) => t && (fold(b.text) === t || t.includes(fold(b.text)) || fold(b.text).includes(t)))));
    const leadBlock = blocks.find((b) => b.t === 'p' && strip(b.html).length > 50);
    const lead = page.lead
      ? page.lead
      : page.widget
      ? WIDGET_LEAD[page.widget]
      : page.custom === 'leadership'
        ? 'Les femmes et les hommes qui pilotent le développement de la compagnie panafricaine.'
        : page.form === 'subscription'
          ? 'Recevez nos offres exclusives et nos dernières nouvelles directement dans votre boîte mail.'
          : page.form === 'feedback'
            ? 'Votre avis nous aide à améliorer chaque voyage. Partagez votre expérience avec nous.'
            : leadBlock
              ? strip(leadBlock.html).slice(0, 230).replace(/\s\S*$/, '') + (strip(leadBlock.html).length > 230 ? '…' : '')
              : section.tagline;
    if (leadBlock && !page.widget && strip(leadBlock.html).length <= 230) blocks = blocks.filter((b) => b !== leadBlock);
    if (page.widget) blocks = blocks.filter((b) => b.t !== 'h' && b.t !== 'p');
    const heads = blocks.filter((b) => b.t === 'h');
    const minutes = Math.max(1, Math.round(words(blocks) / 200));
    return {
      kind: 'page',
      section,
      group,
      page,
      blocks,
      heads,
      minutes,
      title: page.title,
      lead,
      crumbs: [home, { label: section.label, href: section.path }, { label: group.title, href: group.path }, { label: page.title }],
      icon: page.icon,
      visual: planeVisual ? 'plane' : firstImg?.src || section.visual,
    };
  }, [entry, data, path]);

  useEffect(() => {
    document.title = view.kind === '404' ? 'Page introuvable — ASKY' : `${view.title} — ASKY, la compagnie aérienne panafricaine`;
  }, [view]);

  if (view.kind === '404') {
    return (
      <div ref={root}>
        <Header />
        <main>
          <PageHero title="Page introuvable" lead="Cette page n’existe pas ou a été déplacée. Choisissez une rubrique pour reprendre votre voyage." crumbs={[{ label: 'Accueil', href: HOME }, { label: 'Erreur 404' }]} visual="plane" icon="globe" />
          <section className="hub container">
            <div className="hub__grid">
              {SECTIONS.map((s) => (
                <PageCard key={s.key} p={{ path: s.path, title: s.label, icon: s.icon }} />
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const meta =
    view.kind === 'page' ? (
      <>
        <li>
          <Icon name="status" size={16} /> {view.minutes} min de lecture
        </li>
        <li>
          <Icon name={view.group.icon} size={16} /> {view.group.title}
        </li>
        {data && (
          <li>
            <a href={ORIGINAL(view.page.path)} target="_blank" rel="noreferrer">
              <Icon name="arrowUpRight" size={16} /> Page d’origine
            </a>
          </li>
        )}
      </>
    ) : null;

  return (
    <div ref={root}>
      <Header />
      <main className="inner">
        <PageHero title={view.title} lead={view.lead} crumbs={view.crumbs} section={view.section} icon={view.icon} visual={view.visual} meta={meta} />

        {view.kind === 'section' && (
          <section className="hub container">
            {view.section.groups.map((g) => (
              <div className="hub__group" key={g.path}>
                <div className="hub__head reveal">
                  <span className="hub__ic">
                    <Icon name={g.icon} size={24} />
                  </span>
                  <h2 className="h2 hub__title">{g.title}</h2>
                  <a className="btn btn--ghost" href={g.path}>
                    Voir la rubrique <Icon name="arrow" size={16} />
                  </a>
                </div>
                <div className="hub__grid">
                  {g.pages.map((p) => (
                    <PageCard key={p.path} p={p} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {view.kind === 'group' && (
          <section className="hub container">
            {view.group.path === '/tg/fr/fly/booking' && <Booking embedded />}
            <div className="hub__grid hub__grid--big">
              {view.group.pages.map((p, i) => (
                <PageCard key={p.path} p={p} big={i === 0 && view.group.pages.length > 2} />
              ))}
            </div>
            {view.group.path === '/tg/fr/fly/network' && <div className="inner__map"><Network /></div>}
          </section>
        )}

        {view.kind === 'page' && (
          <>
            <section className="container inner__grid">
              <Sidebar section={view.section} group={view.group} current={view.page.path} />
              <article className="prose">
                {view.heads.length >= 3 && (
                  <nav className="toc reveal" aria-label="Sommaire">
                    <span>Sur cette page</span>
                    {view.heads.map((h) => (
                      <a
                        key={h.text}
                        href={`#${slug(h.text)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const l = getLenis();
                          if (l) l.scrollTo(`#${slug(h.text)}`, { offset: -110 });
                          else document.getElementById(slug(h.text))?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                )}
                {view.page.widget && <Booking embedded initialTab={view.page.widget} />}
                {view.page.custom === 'leadership' && <Leadership />}
                {view.page.form === 'feedback' && <FormFeedback />}
                {view.page.form === 'subscription' && <FormSubscription />}
                <Blocks blocks={view.blocks} />
              </article>
            </section>
            {view.page.map && (
              <div className="inner__map">
                <Network />
              </div>
            )}
            <NextPrev current={view.page.path} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
