import { useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { BlurText, CountUp } from '../components/TextFx.jsx';
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap.js';
import { useTilt } from '../components/useTilt.js';

const SHAREHOLDERS = ['BIDC', 'BOAD', 'Groupe Ecobank', 'Ethiopian Airlines', 'État togolais'];

export default function Stats() {
  const root = useRef(null);
  useTilt(root, '.tilt');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.bento__cell', {
          y: 70,
          autoAlpha: 0,
          rotationX: -12,
          transformPerspective: 1200,
          stagger: 0.09,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.bento', start: 'top 82%', once: true },
        });
        gsap.fromTo('.bento__plane', { xPercent: -30, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: '.bento__fleet', start: 'top 95%', end: 'top 35%', scrub: 1 } });
        // Mots qui s'allument au fil du scroll
        gsap.fromTo('.about__lead .lw', { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.about__lead', start: 'top 80%', end: 'bottom 45%', scrub: 1 } });
      });
    },
    { scope: root }
  );

  const lead =
    'ASKY, la Compagnie Aérienne Panafricaine, est une compagnie commerciale engagée en faveur du développement durable, en partenariat stratégique et technique avec Ethiopian Airlines.';

  return (
    <section className="stats section" ref={root} id="apropos">
      <div className="container">
        <div className="about">
          <p className="eyebrow">
            <Icon name="sparkle" size={14} /> La compagnie panafricaine
          </p>
          <BlurText as="h2" className="h2 about__title" text="Une compagnie, *tout* *un* *continent*" />
          <p className="about__lead">
            {lead.split(' ').map((w, i) => (
              <span key={i} className={`lw ${['Panafricaine,', 'Ethiopian', 'Airlines.'].includes(w) ? 'accent' : ''}`}>
                {w}{' '}
              </span>
            ))}
          </p>
        </div>

        <div className="bento">
          <article className="bento__cell bento__cities tilt spot">
            <div className="bento__ic">
              <Icon name="pin" size={24} />
            </div>
            <p className="bento__num">
              <CountUp to={30} />
            </p>
            <h3>villes desservies</h3>
            <p className="muted">De Dakar à Nairobi, de Nouakchott à Johannesburg.</p>
            <div className="bento__dots" aria-hidden="true">
              {Array.from({ length: 30 }).map((_, i) => (
                <i key={i} style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          </article>

          <article className="bento__cell bento__countries tilt spot">
            <div className="bento__ic">
              <Icon name="globe" size={24} />
            </div>
            <p className="bento__num">
              <CountUp to={28} />
            </p>
            <h3>pays africains</h3>
            <p className="muted">Une connectivité intra-africaine sans détour.</p>
          </article>

          <article className="bento__cell bento__hub tilt spot">
            <div className="bento__ic bento__ic--light">
              <Icon name="hub" size={24} />
            </div>
            <h3 className="bento__big">Hub de Lomé</h3>
            <p>Aéroport international Gnassingbé Eyadéma, cœur du réseau ASKY et point de correspondance vers tout le continent.</p>
          </article>

          <article className="bento__cell bento__fleet tilt spot">
            <div className="bento__fleet-text">
              <div className="bento__ic">
                <Icon name="fleet" size={24} />
              </div>
              <p className="bento__num">
                <CountUp to={17} />
              </p>
              <h3>appareils modernes</h3>
              <ul className="pills">
                <li>Boeing 737 MAX</li>
                <li>Boeing 737-800</li>
                <li>Boeing 737-700</li>
              </ul>
            </div>
            <img className="bento__plane" src="/img/plane.webp" alt="" loading="lazy" />
          </article>

          <article className="bento__cell bento__partner tilt spot">
            <div className="bento__ic">
              <Icon name="handshake" size={24} />
            </div>
            <h3>Actionnaires</h3>
            <ul className="bento__list">
              {SHAREHOLDERS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
