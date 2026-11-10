import { useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { SplitText } from '../components/TextFx.jsx';
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap.js';

const FEATURES = [
  ['ticket', 'Réservez'],
  ['card', 'Payez'],
  ['calendar', 'Gérez'],
  ['checkin', 'Enregistrez-vous'],
];

export default function AppPromo() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Le téléphone pivote en 3D au fil du scroll
        gsap.fromTo(
          '.phone',
          { rotationY: -38, rotationX: 14, rotationZ: 6, y: 120 },
          { rotationY: 14, rotationX: -4, rotationZ: -3, y: -40, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 } }
        );
        gsap.utils.toArray('.app__chip').forEach((c, i) => {
          gsap.fromTo(c, { y: 80 + i * 30 }, { y: -60 - i * 25, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });
        gsap.from('.app__copy > *', { y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.app__copy', start: 'top 80%', once: true } });
      });
    },
    { scope: root }
  );

  return (
    <section className="app section" id="application" ref={root}>
      <div className="container app__in">
        <div className="app__copy">
          <p className="eyebrow eyebrow--light">
            <Icon name="smartphone" size={14} /> Application mobile ASKY
          </p>
          <SplitText as="h2" className="h2 h2--light" text={'Voyager en toute\n*simplicité*'} />
          <p className="app__lead">
            Réservez, payez, gérez vos réservations et enregistrez-vous où que vous soyez. Profitez de remises exclusives, uniquement sur l’application.
          </p>
          <ul className="app__features">
            {FEATURES.map(([ic, t]) => (
              <li key={t}>
                <Icon name={ic} size={20} /> {t}
              </li>
            ))}
          </ul>
          <div className="app__stores">
            <a href="#" aria-label="Télécharger sur Google Play">
              <img src="/img/playstore.png" alt="Disponible sur Google Play" />
            </a>
            <a href="#" aria-label="Télécharger sur l'App Store">
              <img src="/img/appstore.png" alt="Télécharger dans l'App Store" />
            </a>
          </div>
        </div>

        <div className="app__visual">
          <div className="app__halo" />
          <div className="phone">
            <div className="phone__screen">
              <img src="/img/app.jpg" alt="Écran de l'application mobile ASKY" loading="lazy" />
            </div>
            <span className="phone__notch" />
          </div>
          <div className="app__chip app__chip--a">
            <Icon name="checkin" size={18} /> Carte d’embarquement prête
          </div>
          <div className="app__chip app__chip--b">
            <Icon name="sparkle" size={18} /> Remise exclusive appli
          </div>
          <div className="app__chip app__chip--c">
            <Icon name="status" size={18} /> KP · À l’heure
          </div>
        </div>
      </div>
    </section>
  );
}
