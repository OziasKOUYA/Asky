import { useEffect, useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, scrollToTarget, finePointer } from '../lib/gsap.js';
import { initClouds } from '../lib/clouds.js';
import { CITIES, distanceKm } from '../data/site.js';

const WORD = 'AFRIQUE';
const DESTS = [
  { from: 'LFW', to: 'BGF', label: 'Offre du moment' },
  { from: 'COO', to: 'FIH', label: 'Prochain départ' },
  { from: 'DSS', to: 'NBO', label: 'Nouvelle ligne' },
];

export default function Hero({ ready }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const clouds = useRef(null);

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
            end: () => `+=${window.innerHeight * 4.2}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (s) => clouds.current?.setProgress(Math.min(1, s.progress * 1.05)),
            onToggle: (s) => (s.isActive || s.progress < 1 ? clouds.current?.start() : clouds.current?.stop()),
          },
        });

        // 1. Le texte d'accueil s'efface, les lettres du mot géant s'écartent
        tl.to(q('.hero__copy'), { y: -80, autoAlpha: 0, duration: 1.6 }, 0)
          .to(q('.hero__scroll'), { autoAlpha: 0, duration: 0.6 }, 0)
          .to(q('.hero__word span'), { x: (i) => (i - 3) * window.innerWidth * 0.08, autoAlpha: 0, duration: 3.6 }, 0.4)
          // 2. L'avion prend de l'altitude puis file vers le haut à droite et dépasse la caméra
          .to(q('.hero__plane'), { scale: 1.18, y: () => -window.innerHeight * 0.04, rotation: -3, duration: 3 }, 0)
          .to(q('.hero__streaks'), { autoAlpha: 1, duration: 1.4 }, 2.4)
          .to(
            q('.hero__plane'),
            {
              x: () => window.innerWidth * 1.15,
              y: () => -window.innerHeight * 1.05,
              scale: 3.6,
              rotation: -12,
              duration: 3.2,
              ease: 'power2.in',
            },
            3
          )
          .to(q('.hero__plane-shadow'), { autoAlpha: 0, duration: 1 }, 3)
          .to(q('.hero__dim'), { autoAlpha: 1, duration: 1.6 }, 5)
          .to(q('.hero__streaks'), { autoAlpha: 0, duration: 1.2 }, 5.8);

        // 3. Après le départ : les destinations s'affichent l'une après l'autre
        const showAt = [6.2, 9, 11.8];
        DESTS.forEach((_, i) => {
          const d = q('.dest')[i];
          const dq = gsap.utils.selector(d);
          const t = showAt[i];
          tl.to(d, { autoAlpha: 1, duration: 0.01 }, t)
            .fromTo(dq('.dest__label'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, t)
            .fromTo(dq('.dest__city .ch'), { yPercent: 115 }, { yPercent: 0, stagger: 0.03, duration: 0.9, ease: 'power3.out' }, t + 0.1)
            .fromTo(dq('.dest__code'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 }, t + 0.5)
            .fromTo(dq('.dest__arc-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power1.inOut' }, t + 0.4)
            .to(
              dq('.dest__mini'),
              { motionPath: { path: dq('.dest__arc-path')[0], autoRotate: true }, duration: 1.3, ease: 'power1.inOut' },
              t + 0.4
            )
            .fromTo(dq('.dest__meta > *'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.6 }, t + 0.9);
          if (i < DESTS.length - 1) {
            tl.to(dq('.dest__city .ch'), { yPercent: -115, stagger: 0.02, duration: 0.7, ease: 'power3.in' }, t + 2.1)
              .to(dq('.dest__label, .dest__code, .dest__arc, .dest__meta'), { autoAlpha: 0, duration: 0.6 }, t + 2.2)
              .to(d, { autoAlpha: 0, duration: 0.01 }, t + 2.8);
          }
        });
        tl.to(q('.dest__progress i'), { scaleX: 1, duration: 8.2 }, 6.2);

        // 4. Fondu café vers la section suivante
        tl.to(q('.dest')[2], { autoAlpha: 0, y: -40, duration: 1.2 }, 14.6).to(q('.hero__fade'), { autoAlpha: 1, duration: 1.4 }, 14.4);
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
        .fromTo(q('.hero__plane-intro'), { x: () => -window.innerWidth * 0.7, y: 120, scale: 0.55, rotation: 6 }, { x: 0, y: 0, scale: 1, rotation: 0, duration: 2.2, ease: 'power3.out' }, 0)
        .fromTo(q('.hero__word span'), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.06, duration: 1.4 }, 0.2)
        .fromTo(q('.hero__copy .bw'), { y: 28, autoAlpha: 0, filter: 'blur(10px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.06, duration: 1 }, 0.8)
        .fromTo(q('.hero__copy .fade-in'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.9 }, 1.2)
        .fromTo(q('.hero__scroll > *'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.8);

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
        {Array.from({ length: 14 }).map((_, i) => (
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
        <p className="eyebrow eyebrow--light fade-in">
          <Icon name="sparkle" size={14} /> The Pan African Airline
        </p>
        <h1 className="hero__title" aria-label="Volez au cœur de l'Afrique">
          {['Volez', 'au', 'cœur', 'de'].map((w) => (
            <span key={w} className="bw">
              {w}
            </span>
          ))}
          <span className="bw accent">l’Afrique</span>
        </h1>
        <p className="hero__lead fade-in">
          30 villes, 28 pays, une seule compagnie panafricaine. Au départ de Lomé, ASKY relie l’Afrique de l’Ouest, du Centre, de l’Est et du Sud.
        </p>
        <div className="hero__ctas fade-in">
          <a href="#reserver" className="btn btn--primary btn--lg" onClick={(e) => (e.preventDefault(), scrollToTarget('#reserver'))}>
            Réserver un vol <Icon name="arrow" size={18} />
          </a>
          <a href="#reseau" className="btn btn--glass btn--lg" onClick={(e) => (e.preventDefault(), scrollToTarget('#reseau'))}>
            <Icon name="globe" size={18} /> Voir le réseau
          </a>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Faites défiler pour décoller</span>
        <i />
      </div>

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
                <a href="#reserver" className="btn btn--primary" onClick={(e) => (e.preventDefault(), scrollToTarget('#reserver'))}>
                  Réserver ce vol <Icon name="arrow" size={18} />
                </a>
              </div>
            </div>
          );
        })}
        <div className="dest__progress" aria-hidden="true">
          <i />
        </div>
      </div>

      <div className="hero__fade" />
    </section>
  );
}
