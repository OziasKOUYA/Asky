import { useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { gsap, useGSAP, MOTION_OK, openBooking } from '../lib/gsap.js';

const R = '/tg/fr/fly/booking';
const ITEMS = [
  { icon: 'ticket', title: 'Gérer ma réservation', text: 'Dates, sièges, bagages supplémentaires', href: `${R}/manage` },
  { icon: 'checkin', title: 'Enregistrement en ligne', text: 'Dès 24 h avant le départ', href: `${R}/check-in` },
  { icon: 'status', title: 'Statut du vol', text: 'Départs et arrivées en direct', href: `${R}/status` },
  { icon: 'calendar', title: 'Horaires des vols', text: 'Jours et heures entre 30 villes', href: `${R}/schedule` },
  { icon: 'bag', title: 'Bagages', text: 'Franchises et tarifs', href: '/tg/fr/plan/essentials/luggage' },
];

// Juste après le hero : les services du voyageur, accessibles en un geste
export default function QuickServices() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.qs__card', { y: 50, autoAlpha: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.qs__grid', start: 'top 88%', once: true } });
      });
    },
    { scope: root }
  );
  return (
    <section className="qs" id="reserver" ref={root}>
      <div className="container">
        <div className="qs__head">
          <div>
            <p className="eyebrow eyebrow--light">
              <Icon name="ticket" size={14} /> Votre voyage
            </p>
            <h2 className="h2 h2--light">
              Tout, <span className="accent">en un clic</span>
            </h2>
          </div>
          <button type="button" className="btn btn--primary btn--lg" onClick={() => openBooking()}>
            <Icon name="takeoff" size={18} /> Réserver un vol
          </button>
        </div>
        <ul className="qs__grid">
          {ITEMS.map((it) => (
            <li key={it.title}>
              <a className="qs__card" href={it.href}>
                <span className="qs__ic">
                  <Icon name={it.icon} size={22} />
                </span>
                <strong>{it.title}</strong>
                <small>{it.text}</small>
                <Icon name="arrowUpRight" size={18} className="qs__go" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
