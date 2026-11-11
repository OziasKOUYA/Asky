import { useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { CONTACT, LINK } from '../data/site.js';
import { gsap, useGSAP, MOTION_OK, openBooking } from '../lib/gsap.js';

const R = '/tg/fr';
const COLS = [
  { title: 'Découvrez', links: [['ASKY Club', `${R}/explore/asky-club/overview`], ['Expérience ASKY', `${R}/explore/services/asky-experience`], ['Newsletter', `${R}/explore/support/subscription`], ['Commentaires', `${R}/explore/support/feedback`]] },
  { title: 'Informations', links: [['Bagages', `${R}/plan/essentials/luggage`], ['Formalités', `${R}/plan/requirements/formalities`], ['Statut du vol', `${R}/fly/booking/status`], ['Horaires des vols', `${R}/fly/booking/schedule`]] },
  { title: 'Voyagez', links: [['Gérer ma réservation', `${R}/fly/booking/manage`], ['Enregistrement', `${R}/fly/booking/check-in`], ['Notre réseau', `${R}/fly/network/international`], ['Notre flotte', `${R}/fly/fleet`]] },
  { title: "À propos d'ASKY", links: [['La compagnie', `${R}/corporate/about/asky`], ['Chiffres clés', `${R}/corporate/about/figures`], ['Carrière', `${R}/corporate/career`], ['Nouvelles', `${R}/corporate/media/news`]] },
];

export default function Footer() {
  const root = useRef(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo('.cta__plane', { x: '-30vw', y: 60, rotation: 4 }, { x: '18vw', y: -40, rotation: -4, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        gsap.from('.footer__col, .footer__brand > *', { y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.footer__grid', start: 'top 90%', once: true } });
      });
    },
    { scope: root }
  );

  return (
    <footer className="footer" id="contact" ref={root}>
      <div className="container">
        <div className="cta">
          <div className="cta__bg" />
          <img className="cta__plane" src="/img/plane.webp" alt="" loading="lazy" />
          <div className="cta__copy">
            <p className="eyebrow eyebrow--light">
              <Icon name="takeoff" size={14} /> Prêt à embarquer ?
            </p>
            <h2 className="h2 h2--light">
              Votre prochain voyage
              <br />
              commence <span className="accent">ici</span>
            </h2>
            <div className="cta__actions">
              <a href="/tg/fr/fly/booking" className="btn btn--primary btn--lg" onClick={(e) => document.querySelector('.fab') && (e.preventDefault(), openBooking())}>
                Réserver un vol <Icon name="arrow" size={18} />
              </a>
              <a href={CONTACT.whatsapp} className="btn btn--glass btn--lg" target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} /> Nous écrire
              </a>
            </div>
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/img/logo-light.png" alt="ASKY — The Pan African Airline" className="footer__logo" />
            <p>La compagnie aérienne panafricaine. Basée à Lomé, ASKY relie 30 villes dans 28 pays africains.</p>
            <ul className="footer__contacts">
              {CONTACT.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s/g, '')}`}>
                    <span className="footer__ic">
                      <Icon name="phone" size={16} />
                    </span>
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${CONTACT.email}`}>
                  <span className="footer__ic">
                    <Icon name="mail" size={16} />
                  </span>
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
                  <span className="footer__ic">
                    <Icon name="whatsapp" size={16} />
                  </span>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {COLS.map((c) => (
            <div className="footer__col" key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map(([l, href]) => (
                  <li key={l}>
                    <a href={href}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer__col footer__news">
            <h4>Abonnez-vous</h4>
            <p>Recevez nos offres exclusives et les dernières nouvelles directement dans votre boîte mail.</p>
            <form
              className="newsletter"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="sr-only" htmlFor="nl-mail">
                Adresse e-mail
              </label>
              <input id="nl-mail" type="email" required placeholder="Votre adresse e-mail" />
              <button type="submit" aria-label="S'abonner">
                <Icon name="arrow" size={18} />
              </button>
            </form>
            {sent && <p className="newsletter__ok">Merci ! Votre inscription est bien prise en compte (démo).</p>}
            <div className="footer__social">
              {[
                ['facebook', CONTACT.socials.facebook, 'Facebook'],
                ['x', CONTACT.socials.x, 'X (Twitter)'],
                ['instagram', CONTACT.socials.instagram, 'Instagram'],
                ['linkedin', CONTACT.socials.linkedin, 'LinkedIn'],
                ['whatsapp', CONTACT.whatsapp, 'WhatsApp'],
              ].map(([ic, href, label]) => (
                <a key={ic} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <Icon name={ic} size={18} />
                </a>
              ))}
            </div>
            <div className="footer__stores">
              <img src="/img/playstore.png" alt="Google Play" />
              <img src="/img/appstore.png" alt="App Store" />
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} ASKY Airlines — The Pan African Airline. Tous droits réservés.</p>
          <div>
            <a href={LINK('')} target="_blank" rel="noreferrer">
              Plan du site
            </a>
            <a href="https://www.flyasky.com/tg/fr/explore/support/privacy" target="_blank" rel="noreferrer">
              Politique de confidentialité
            </a>
            <a href="/tg/fr/explore/support/feedback">Contact</a>
            <button type="button" className="footer__lang">
              <span className="flag-tg" aria-hidden="true" /> Togo · Français
            </button>
          </div>
        </div>
      </div>
      <div className="footer__stripe" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </footer>
  );
}
