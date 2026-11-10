import { useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import Icon from '../components/Icon.jsx';
import { SplitText } from '../components/TextFx.jsx';
import africa from '../data/africa.json';
import { CITIES, ROUTES, distanceKm } from '../data/site.js';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, finePointer } from '../lib/gsap.js';

const W = 800;
const H = 860;

// Pays desservis (nom anglais Natural Earth) → allumés quand la route arrive
const COUNTRY_OF = {
  LFW: 'Togo', CKY: 'Guinea', ABJ: "Côte d'Ivoire", ABV: 'Nigeria', ACC: 'Ghana', BKO: 'Mali', BGF: 'Central African Rep.',
  BJL: 'Gambia', OXB: 'Guinea-Bissau', BZV: 'Congo', COO: 'Benin', DSS: 'Senegal', DLA: 'Cameroon', FNA: 'Sierra Leone',
  JNB: 'South Africa', FIH: 'Dem. Rep. Congo', LOS: 'Nigeria', LBV: 'Gabon', LAD: 'Angola', SSG: 'Eq. Guinea', ROB: 'Liberia',
  NBO: 'Kenya', NIM: 'Niger', NKC: 'Mauritania', NDJ: 'Chad', OUA: 'Burkina Faso', PNR: 'Congo', RAI: 'Cabo Verde',
  TMS: 'São Tomé and Principe', NSI: 'Cameroon',
};

// Position des étiquettes (côté) pour éviter les chevauchements en Afrique de l'Ouest
const LABEL = {
  NKC: 'l', DSS: 'l', BJL: 'l', OXB: 'l', RAI: 'b', CKY: 'l', FNA: 'lb', ROB: 'lb', ABJ: 'lb', ACC: 'b', LFW: 't', COO: 'rt',
  LOS: 'rb', ABV: 'r', NIM: 'rt', OUA: 't', BKO: 'lt', NDJ: 'r', BGF: 'r', DLA: 'rt', NSI: 'rb', SSG: 'lb', LBV: 'r', TMS: 'l',
  BZV: 'lt', FIH: 'rb', PNR: 'lb', LAD: 'l', JNB: 'r', NBO: 'r',
};

const REGIONS = [
  { name: "Afrique de l'Ouest", codes: ['LFW', 'ABJ', 'ABV', 'ACC', 'BKO', 'BJL', 'OXB', 'CKY', 'COO', 'DSS', 'FNA', 'LOS', 'ROB', 'NIM', 'NKC', 'OUA', 'RAI'] },
  { name: 'Afrique centrale', codes: ['BGF', 'BZV', 'DLA', 'FIH', 'LBV', 'SSG', 'NDJ', 'PNR', 'TMS', 'NSI'] },
  { name: 'Afrique australe & de l’Est', codes: ['LAD', 'JNB', 'NBO'] },
];

export default function Network() {
  const root = useRef(null);
  const [hover, setHover] = useState(null); // code de ville survolée
  const [count, setCount] = useState(0);

  const { countries, routes, cities } = useMemo(() => {
    // Les îles lointaines de l'océan Indien élargiraient trop le cadre : on cadre sur le continent
    const land = { ...africa, features: africa.features.filter((f) => !['Mauritius', 'Seychelles'].includes(f.properties.name)) };
    const proj = geoMercator().fitExtent(
      [
        [14, 14],
        [W - 14, H - 14],
      ],
      land
    );
    const path = geoPath(proj);
    const pt = (code) => proj(CITIES[code].c);
    const countries = land.features.map((f) => ({ name: f.properties.name, d: path(f) }));
    const routes = ROUTES.map(([a, b]) => {
      const [x1, y1] = pt(a);
      const [x2, y2] = pt(b);
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      // Courbe : point de contrôle décalé perpendiculairement (arc d'avion)
      const k = Math.min(0.32, 16 / len + 0.18);
      const s = dx >= 0 ? -1 : 1;
      const cx = (x1 + x2) / 2 + s * -dy * k;
      const cy = (y1 + y2) / 2 + s * dx * k;
      return { a, b, len, d: `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}` };
    }).sort((r1, r2) => (r1.a === r2.a ? r1.len - r2.len : r1.a === 'LFW' ? -1 : 1));
    const cities = Object.entries(CITIES).map(([code, c]) => ({ code, ...c, p: pt(code) }));
    return { countries, routes, cities };
  }, []);

  const served = useMemo(() => new Set(Object.values(COUNTRY_OF)), []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.set(q('.route__line'), { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(q('.city'), { scale: 0, transformOrigin: 'center', transformBox: 'fill-box' });
        gsap.set(q('.city--hub'), { scale: 1 });
        gsap.set(q('.city__label'), { autoAlpha: 0 });
        gsap.set(q('.fleet__plane'), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 1.8}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              const done = Math.round(gsap.utils.clamp(0, 1, (s.progress - 0.12) / 0.78) * 30);
              setCount((c) => (c === done ? c : done));
            },
          },
        });

        // La carte se redresse en 3D
        tl.fromTo(q('.map__stage'), { rotationX: 48, rotationZ: -8, scale: 0.86, y: 60 }, { rotationX: 0, rotationZ: 0, scale: 1, y: 0, duration: 2.2, ease: 'power2.out' }, 0)
          .fromTo(q('.map__country'), { autoAlpha: 0 }, { autoAlpha: 1, stagger: { each: 0.01, from: 'random' }, duration: 0.6 }, 0)
          .to(q('.city__label--hub'), { autoAlpha: 1, duration: 0.4 }, 1);

        // Les routes se tracent une par une depuis le hub ; la ville s'allume à l'arrivée
        const t0 = 1.6;
        const each = 0.22;
        routes.forEach((r, i) => {
          const at = t0 + i * each;
          tl.to(q(`.route[data-r="${i}"] .route__line`), { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }, at)
            .to(q(`.city[data-c="${r.b}"]`), { scale: 1, duration: 0.3, ease: 'back.out(3)' }, at + 0.7)
            .to(q(`.city__label[data-c="${r.b}"]`), { autoAlpha: 1, duration: 0.3 }, at + 0.7)
            .to(q(`.map__country[data-n="${COUNTRY_OF[r.b]}"]`), { fill: '#8A4526', duration: 0.4 }, at + 0.7);
        });
        // Une fois toutes les lignes tracées : un petit avion par liaison au départ de Lomé
        tl.to(q('.fleet'), { autoAlpha: 1, duration: 0.6 }, t0 + routes.length * each + 0.5);

        const fleet = gsap.timeline({ paused: true });
        q('.fleet__plane').forEach((plane, k) => {
          const line = q(`.route[data-r="${plane.dataset.r}"] .route__line`)[0];
          const len = Number(plane.dataset.len);
          const dur = 3.2 + len / 95; // vol plus long pour les destinations lointaines
          const one = gsap.timeline({ repeat: -1, repeatDelay: 0.8 + ((k * 0.53) % 1.6) });
          one
            .fromTo(plane, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, 0)
            .to(plane, { motionPath: { path: line, autoRotate: 90, start: 0, end: 1 }, duration: dur, ease: 'sine.inOut' }, 0)
            .to(plane, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, dur - 0.5);
          fleet.add(one, (k * 0.61) % 5.5);
        });
        const fleetST = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: () => `+=${window.innerHeight * 4.6}`,
          onToggle: (s) => (s.isActive ? fleet.play() : fleet.pause()),
        });

        // Inclinaison de la carte à la souris
        let offMove;
        if (finePointer()) {
          const stage = q('.map__tilt')[0];
          const rx = gsap.quickTo(stage, 'rotationX', { duration: 1, ease: 'power3.out' });
          const ry = gsap.quickTo(stage, 'rotationY', { duration: 1, ease: 'power3.out' });
          const move = (e) => {
            const r = stage.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) return;
            rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
            ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          };
          window.addEventListener('pointermove', move);
          offMove = () => window.removeEventListener('pointermove', move);
        }
        return () => {
          fleet.kill();
          fleetST.kill();
          offMove?.();
        };
      });

      mm.add('(prefers-reduced-motion: reduce)', () => setCount(30));
    },
    { scope: root }
  );

  const hovered = hover ? CITIES[hover] : null;
  const hp = hover ? cities.find((c) => c.code === hover).p : null;

  return (
    <section className="network" id="reseau" ref={root}>
      <div className="network__glow" aria-hidden="true" />
      <div className="container network__in">
        <div className="network__side">
          <p className="eyebrow eyebrow--light">
            <Icon name="globe" size={14} /> Notre réseau
          </p>
          <SplitText as="h2" className="h2 h2--light" text={'Tout le continent,\n*un* *seul* *ciel*'} />
          <p className="network__lead">
            Depuis son hub de Lomé, ASKY relie 30 villes dans 28 pays africains, de l’Atlantique à l’océan Indien.
          </p>

          <div className="network__counter">
            <span className="network__num">{String(count).padStart(2, '0')}</span>
            <span>
              villes
              <br />
              connectées
            </span>
          </div>

          <ul className="legend">
            <li>
              <i className="legend__hub" /> Hubs de Lomé et Conakry
            </li>
            <li>
              <i className="legend__route" /> Liaisons ASKY
            </li>
          </ul>

          <div className="regions">
            <h4>Survolez une ville</h4>
            <ul>
              {REGIONS.flatMap((r) => r.codes)
                .sort((a, b) => CITIES[a].name.localeCompare(CITIES[b].name, 'fr'))
                .map((c) => (
                  <li key={c}>
                    <button type="button" onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(c)} onBlur={() => setHover(null)} className={hover === c ? 'is-on' : ''}>
                      {CITIES[c].name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="map">
          <div className="map__tilt">
            <div className="map__stage">
              <svg viewBox={`0 0 ${W} ${H}`} className={`map__svg ${hover ? 'has-hover' : ''}`} role="img" aria-label="Carte du réseau ASKY en Afrique">
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.2" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="cityGlow">
                    <stop offset="0" stopColor="#F2A41E" stopOpacity=".55" />
                    <stop offset="1" stopColor="#F2A41E" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse">
                    <circle cx="1.5" cy="1.5" r=".9" fill="rgba(255,255,255,.07)" />
                  </pattern>
                </defs>

                <g className="map__land">
                  {countries.map((c, i) => (
                    <path key={i} className={`map__country ${served.has(c.name) ? 'is-served' : ''}`} data-n={c.name} d={c.d} />
                  ))}
                </g>
                <g className="map__dots" style={{ pointerEvents: 'none' }}>
                  {countries.map((c, i) => (
                    <path key={i} d={c.d} fill="url(#dots)" />
                  ))}
                </g>

                <g className="routes" filter="url(#glow)">
                  {routes.map((r, i) => (
                    <g key={i} className={`route ${hover && (r.b === hover || r.a === hover) ? 'is-on' : ''}`} data-r={i} data-b={r.b}>
                      <path className="route__line" d={r.d} pathLength="1" />
                    </g>
                  ))}
                </g>

                <g className="fleet" aria-hidden="true">
                  {routes.map((r, i) =>
                    r.a === 'LFW' ? (
                      <g key={i} className="fleet__plane" data-r={i} data-len={Math.round(r.len)}>
                        <g transform="scale(0.62)">
                          <circle r="9" className="fleet__halo" />
                          <path d="M0 -11 L3 -3 L11 2 L11 4 L3 2 L2 8 L5 10 L5 11 L0 10 L-5 11 L-5 10 L-2 8 L-3 2 L-11 4 L-11 2 L-3 -3 Z" />
                        </g>
                      </g>
                    ) : null
                  )}
                </g>

                {cities.map((c) => {
                  const [x, y] = c.p;
                  const side = LABEL[c.code] || 'r';
                  const horiz = side.includes('l') || side.includes('r');
                  const lx = side.includes('l') ? -8 : side.includes('r') ? 8 : 0;
                  const ly = side.includes('t') ? (horiz ? -5 : c.hub ? -14 : -11) : side.includes('b') ? (horiz ? 13 : 18) : 4;
                  const anchor = side.includes('l') ? 'end' : side.includes('r') ? 'start' : 'middle';
                  return (
                    <g key={c.code} onMouseEnter={() => setHover(c.code)} onMouseLeave={() => setHover(null)} onClick={() => setHover((h) => (h === c.code ? null : c.code))} className="city__hit">
                      <g className={`city ${c.hub ? 'city--hub' : ''} ${hover === c.code ? 'is-on' : ''}`} data-c={c.code}>
                        <circle cx={x} cy={y} r={c.hub ? 18 : 11} fill="url(#cityGlow)" />
                        {c.hub && <circle className="city__pulse" cx={x} cy={y} r="7" />}
                        <circle className="city__dot" cx={x} cy={y} r={c.hub ? 5.5 : 3.4} />
                        <circle cx={x} cy={y} r="14" fill="transparent" />
                      </g>
                      <text className={`city__label ${c.hub ? 'city__label--hub' : ''}`} data-c={c.code} x={x + lx} y={y + ly} textAnchor={anchor}>
                        {c.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {hovered && (
                <div className="map__tip" style={{ left: `${(hp[0] / W) * 100}%`, top: `${(hp[1] / H) * 100}%` }}>
                  <strong>{hovered.name}</strong>
                  <span>
                    {hovered.country} · {hover}
                  </span>
                  {hover !== 'LFW' && <span className="map__tip-km">≈ {distanceKm('LFW', hover).toLocaleString('fr-FR')} km de Lomé</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
