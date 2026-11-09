import { useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { BlurText } from '../components/TextFx.jsx';
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap.js';
import { useTilt } from '../components/useTilt.js';
import { CITIES } from '../data/site.js';

const PARTNERS = [
  { name: 'RAMCO', text: 'Partenaire d’ASKY au Togo.', logo: '/img/logo-ramco.png', url: 'https://ramco.tg/' },
  { name: 'S.A.L.T', text: 'Société Aéroportuaire de Lomé-Tokoin, gestionnaire de l’aéroport de Lomé.', logo: '/img/logo-salt.png', url: 'https://www.aeroportdelome.com/' },
];

export default function Partners() {
  const root = useRef(null);
  useTilt(root, '.partner');

  useGSAP(
    () => {
      // Bande de villes infinie (LogoLoop) : ralentit au survol, sens lié au scroll
      const track = root.current.querySelector('.marquee__track');
      const loop = gsap.to(track, { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.partner', { y: 60, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.partners__grid', start: 'top 85%', once: true } });
        gsap.to(track.parentElement, {
          x: -160,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      const slow = () => gsap.to(loop, { timeScale: 0.2, duration: 0.6 });
      const fast = () => gsap.to(loop, { timeScale: 1, duration: 0.6 });
      track.addEventListener('pointerenter', slow);
      track.addEventListener('pointerleave', fast);
      return () => {
        track.removeEventListener('pointerenter', slow);
        track.removeEventListener('pointerleave', fast);
      };
    },
    { scope: root }
  );

  const names = Object.values(CITIES).map((c) => c.name);

  return (
    <section className="partners section" id="partenaires" ref={root}>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <div className="marquee__group" key={k}>
              {names.map((n) => (
                <span key={n}>
                  {n}
                  <Icon name="plane" size={22} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container partners__in">
        <div>
          <p className="eyebrow">
            <Icon name="handshake" size={14} /> Nos partenaires
          </p>
          <BlurText as="h2" className="h2" text="Ensemble, *plus* *loin*" />
          <p className="muted section__sub">Des acteurs de confiance à nos côtés, au sol comme dans les airs.</p>
        </div>
        <div className="partners__grid">
          {PARTNERS.map((p) => (
            <a className="partner spot" key={p.name} href={p.url} target="_blank" rel="noreferrer">
              <div className="partner__logo">
                <img src={p.logo} alt={p.name} loading="lazy" />
              </div>
              <div className="partner__foot">
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.text}</span>
                </div>
                <span className="partner__go">
                  <Icon name="arrowUpRight" size={20} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
