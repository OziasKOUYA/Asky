import { useEffect, useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, finePointer, isTouch, SCRUB, openBooking } from '../lib/gsap.js';
import QuickBook from '../components/QuickBook.jsx';
import { initClouds } from '../lib/clouds.js';
import { CITIES, distanceKm } from '../data/site.js';

const WORD = 'AFRIQUE';
const STEPS = ['Décollage', 'Lomé → Bangui', 'Cotonou → Kinshasa', 'Dakar → Nairobi'];
const STEP_AT = [0, 3.3, 5.4, 7.5];
const TOTAL = 10.3;
const DESTS = [
  { from: 'LFW', to: 'BGF', label: 'Offre du moment' },
  { from: 'COO', to: 'FIH', label: 'Prochain départ' },
  { from: 'DSS', to: 'NBO', label: 'Nouvelle ligne' },
];

export default function Hero({ ready }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const clouds = useRef(null);
  const stepRef = useRef(0);

  // Scène Three.js (nuages) — créée une fois
  useEffect(() => {
    clouds.current = initClouds(canvas.current);
    clouds.current.start();
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      clouds.current?.setPointer(x, y);
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      clouds.current?.dispose();
      clouds.current = null;
    };
  }, []);

  // Scénario au scroll (épinglé)
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q('.hero__plane'), { xPercent: -50, yPercent: -50 });
      gsap.set(q('.dest'), { autoAlpha: 0 });
      gsap.set(q('.dest__mini'), { x: 6, y: 78, rotation: -31 });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * (isTouch ? 2.7 : 3.3)}`,
            scrub: SCRUB,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              clouds.current?.setProgress(Math.min(1, s.progress * 1.05));
              // Étape active du guide de défilement
              const t = s.progress * TOTAL;
              let k = 0;
              STEP_AT.forEach((at, i) => t >= at - 0.15 && (k = i));
              if (k !== stepRef.current) {
                stepRef.current = k;
                root.current.querySelectorAll('.rail__step').forEach((el, i) => {
                  el.classList.toggle('is-active', i === k);
                  el.classList.toggle('is-done', i < k);
                });
              }
              root.current.classList.toggle('is-scrolled', s.progress > 0.01);
            },
            onToggle: (s) => (s.isActive || s.progress < 1 ? clouds.current?.start() : clouds.current?.stop()),
          },
        });

        // 1. Le texte d'accueil s'efface, les lettres du mot géant s'écartent
        tl.to(q('.hero__copy'), { y: -70, autoAlpha: 0, duration: 0.8 }, 0)
          .to(q('.hero__dock'), { y: 90, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 0)
          .to(q('.hero__word span'), { x: (i) => (i - 3) * window.innerWidth * 0.08, autoAlpha: 0, duration: 1.5 }, 0.1)
          // 2. L'avion prend de l'altitude puis file vers le haut à droite et dépasse la caméra
          .to(q('.hero__plane'), { scale: 1.14, y: () => -window.innerHeight * 0.05, rotation: -3, duration: 1.1, ease: 'power1.out' }, 0)
          .to(q('.hero__streaks'), { autoAlpha: 1, duration: 0.5 }, 0.6)
          .to(
            q('.hero__plane'),
            {
              x: () => window.innerWidth * 1.15,
              y: () => -window.innerHeight * 1.05,
              scale: 3.6,
              rotation: -12,
              duration: 2.3,
              ease: 'power2.in',
            },
            0.9
          )
          .to(q('.hero__plane-shadow'), { autoAlpha: 0, duration: 0.5 }, 0.8)
          .to(q('.hero__dim'), { autoAlpha: 1, duration: 0.8 }, 2.4)
          .to(q('.hero__streaks'), { autoAlpha: 0, duration: 0.6 }, 2.9);

        // 3. Après le départ : les destinations s'affichent l'une après l'autre
        const showAt = [3.3, 5.4, 7.5];
        DESTS.forEach((_, i) => {
          const d = q('.dest')[i];
          const dq = gsap.utils.selector(d);
          const t = showAt[i];
          tl.to(d, { autoAlpha: 1, duration: 0.01 }, t)
            .fromTo(dq('.dest__label'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, t)
            .fromTo(dq('.dest__city .ch'), { yPercent: 115 }, { yPercent: 0, stagger: 0.025, duration: 0.7, ease: 'power3.out' }, t + 0.1)
            .fromTo(dq('.dest__code'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, t + 0.35)
            .fromTo(dq('.dest__arc-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' }, t + 0.3)
            .to(dq('.dest__mini'), { motionPath: { path: dq('.dest__arc-path')[0], autoRotate: true }, duration: 1, ease: 'power1.inOut' }, t + 0.3)
            .fromTo(dq('.dest__meta > *'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.5 }, t + 0.7);
          if (i < DESTS.length - 1) {
            tl.to(dq('.dest__city .ch'), { yPercent: -115, stagger: 0.015, duration: 0.5, ease: 'power3.in' }, t + 1.6)
              .to(dq('.dest__label, .dest__code, .dest__arc, .dest__meta'), { autoAlpha: 0, duration: 0.45 }, t + 1.65)
              .to(d, { autoAlpha: 0, duration: 0.01 }, t + 2.1);
          }
        });
        tl.fromTo(q('.rail__fill'), { scaleY: 0 }, { scaleY: 1, duration: TOTAL }, 0);

        // 4. Fondu café vers la section suivante
        tl.to(q('.dest')[2], { autoAlpha: 0, y: -40, duration: 0.7 }, 9.4).to(q('.hero__fade'), { autoAlpha: 1, duration: 1 }, 9.3);
      });

      // Version sans animation : l'avion reste en place, la première destination est visible
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('.dest')[0], { autoAlpha: 1 });
      });
    },
    { scope: root }
  );

  // Intro (après le loader) + flottement permanent + inclinaison à la souris
  useGSAP(
    () => {
      if (!ready) return;
      const q = gsap.utils.selector(root);
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .fromTo(q('.hero__plane-intro'), { x: () => -window.innerWidth * 0.7, y: 120, scale: 0.55, rotation: 6 }, { x: 0, y: 0, scale: 1, rotation: 0, duration: isTouch ? 1.3 : 1.7, ease: 'power3.out' }, 0)
        .fromTo(q('.hero__word span'), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.06, duration: 1.4 }, 0.2)
        .fromTo(q('.hero__copy .bw'), { y: 28, autoAlpha: 0, filter: isTouch ? 'none' : 'blur(10px)' }, { y: 0, autoAlpha: 1, filter: isTouch ? 'none' : 'blur(0px)', stagger: 0.06, duration: 1 }, 0.5)
        .fromTo(q('.hero__copy .fade-in'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.9 }, 0.4)
        .fromTo(q('.hero__dock-in'), { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, 0.6)
        .fromTo(q('.hero__rule'), { scaleY: 0 }, { scaleY: 1, duration: 0.9 }, 1.1)
        .fromTo(q('.rail__in'), { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9 }, 1.4);

      gsap.to(q('.hero__plane-float'), { y: -14, rotation: -1.2, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      if (finePointer()) {
        const img = q('.hero__plane-img')[0];
        const rx = gsap.quickTo(img, 'rotationX', { duration: 1.2, ease: 'power3.out' });
        const ry = gsap.quickTo(img, 'rotationY', { duration: 1.2, ease: 'power3.out' });
        const word = q('.hero__word')[0];
        const wx = gsap.quickTo(word, 'x', { duration: 1.4, ease: 'power3.out' });
        const onMove = (e) => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          ry(x * 18);
          rx(-y * 12);
          wx(-x * 40);
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
      }
    },
    { scope: root, dependencies: [ready] }
  );

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root} aria-label="Bienvenue à bord d'ASKY">
      <div className="hero__sky" />
      <canvas className="hero__clouds" ref={canvas} aria-hidden="true" />
      <div className="hero__streaks" aria-hidden="true">
        {Array.from({ length: isTouch ? 6 : 14 }).map((_, i) => (
          <i key={i} style={{ '--i': i, top: `${8 + ((i * 37) % 84)}%`, animationDelay: `${(i * 0.23) % 1.4}s` }} />
        ))}
      </div>

      <div className="hero__word" aria-hidden="true">
        {[...WORD].map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      <div className="hero__plane">
        <div className="hero__plane-intro">
          <div className="hero__plane-float">
            <img className="hero__plane-img" src="/img/plane.webp" alt="Boeing 737-800 aux couleurs d'ASKY en vol" width="1800" height="666" />
            <div className="hero__plane-shadow" />
          </div>
        </div>
      </div>

      <div className="hero__scrim" />
      <div className="hero__dim" />

      <div className="container hero__copy">
        <p className="hero__badge fade-in">
          <span className="hero__badge-logo" aria-hidden="true">
            <img src="/img/logo-light.png" alt="" />
          </span>
          <span className="hero__badge-text">The Pan African Airline</span>
          <span className="hero__badge-sep" aria-hidden="true" />
          <span className="hero__badge-since">Depuis 2010</span>
        </p>
        <h1 className="hero__title" aria-label="Volez au cœur de l'Afrique">
          {['Volez', 'au', 'cœur', 'de'].map((w) => (
            <span key={w} className="bw">
              {w}
            </span>
          ))}
          <span className="bw accent">l’Afrique</span>
        </h1>
        <div className="hero__lead-row fade-in">
          <span className="hero__rule" aria-hidden="true" />
          <p className="hero__lead">
            <span className="hero__lead-full">
              Une seule compagnie pour relier l’Afrique de l’Ouest, du Centre, de l’Est et du Sud. Décollez de Lomé vers 30 destinations, à bord de Boeing 737 modernes.
            </span>
            <span className="hero__lead-short">Décollez de Lomé vers 30 destinations africaines, à bord de Boeing 737 modernes.</span>
          </p>
        </div>
      </div>

      {/* Réservation visible dès l'arrivée */}
      <div className="container hero__dock">
        <div className="hero__dock-in">
          <QuickBook variant="dock" />
        </div>
      </div>

      {/* Guide de défilement vertical : où l'on est dans l'histoire */}
      <nav className="rail" aria-hidden="true">
        <div className="rail__in">
          <span className="rail__hint">
            <span className="rail__mouse">
              <i />
            </span>
            <span className="rail__hint-txt">Défilez</span>
            <Icon name="chevron" size={16} className="rail__arrow" />
          </span>
          <div className="rail__track">
            <i className="rail__fill" />
            <ol>
              {STEPS.map((st, i) => (
                <li key={st} className={`rail__step ${i === 0 ? 'is-active' : ''}`} style={{ top: `${(STEP_AT[i] / TOTAL) * 100}%` }}>
                  <span className="rail__dot" />
                  <span className="rail__label">{st}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>

      {/* Destinations affichées après le départ de l'avion */}
      <div className="dests">
        {DESTS.map((d, i) => {
          const A = CITIES[d.from];
          const Bc = CITIES[d.to];
          return (
            <div className="dest" key={d.to} aria-hidden={i > 0}>
              <p className="dest__label">
                <span className="dot" /> {d.label}
              </p>
              <div className="dest__row">
                <div className="dest__end">
                  <h2 className="dest__city">
                    {[...A.name].map((c, j) => (
                      <span key={j} className="ch">
                        {c}
                      </span>
                    ))}
                  </h2>
                  <p className="dest__code">
                    {d.from} · {A.country}
                  </p>
                </div>
                <svg className="dest__arc" viewBox="0 0 300 90" aria-hidden="true">
                  <path className="dest__arc-path" d="M6 78 Q150 -12 294 78" fill="none" />
                  <path className="dest__arc-base" d="M6 78 Q150 -12 294 78" />
                  <path className="dest__arc-line" d="M6 78 Q150 -12 294 78" pathLength="1" />
                  <circle cx="6" cy="78" r="4.5" />
                  <circle cx="294" cy="78" r="4.5" />
                  <g className="dest__mini">
                    <path d="M14 0 L-8 -6 L-5 0 L-8 6 Z" />
                  </g>
                </svg>
                <div className="dest__end dest__end--to">
                  <h2 className="dest__city">
                    {[...Bc.name].map((c, j) => (
                      <span key={j} className="ch">
                        {c}
                      </span>
                    ))}
                  </h2>
                  <p className="dest__code">
                    {d.to} · {Bc.country}
                  </p>
                </div>
              </div>
              <div className="dest__meta">
                <span className="chip">
                  <Icon name="globe" size={16} /> ≈ {distanceKm(d.from, d.to).toLocaleString('fr-FR')} km
                </span>
                <span className="chip">
                  <Icon name="fleet" size={16} /> Boeing 737
                </span>
                <button type="button" className="btn btn--primary" onClick={() => openBooking({ from: d.from, to: d.to, tab: 'book' })}>
                  Réserver ce vol <Icon name="arrow" size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hero__fade" />
    </section>
  );
}
