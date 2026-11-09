import { useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { SplitText } from '../components/TextFx.jsx';
import { OFFERS, CITIES, distanceKm } from '../data/site.js';
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap.js';

export default function Offers() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 900px)`, () => {
        const track = root.current.querySelector('.offers__track');
        const cards = gsap.utils.toArray('.offer', root.current);
        const imgs = gsap.utils.toArray('.offer__img img', root.current);
        const dist = () => track.scrollWidth - window.innerWidth + 80;

        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Effet « coverflow » : chaque carte pivote en 3D selon sa distance au centre de l'écran
        const update = () => {
          const box = root.current.getBoundingClientRect();
          if (box.bottom < 0 || box.top > window.innerHeight) return;
          const cx = window.innerWidth / 2;
          cards.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const d = gsap.utils.clamp(-1.4, 1.4, (r.left + r.width / 2 - cx) / window.innerWidth);
            gsap.set(c, { rotationY: -d * 26, z: -Math.abs(d) * 160, transformPerspective: 1600 });
            if (imgs[i]) gsap.set(imgs[i], { xPercent: -d * 10 });
          });
        };
        gsap.ticker.add(update);
        return () => gsap.ticker.remove(update);
      });

      mm.add(MOTION_OK, () => {
        gsap.from('.offer', {
          y: 80,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="offers" id="offres" ref={root}>
      <div className="offers__pin">
        <div className="container offers__head">
          <div>
            <p className="eyebrow">
              <Icon name="ticket" size={14} /> Offres
            </p>
            <SplitText as="h2" className="h2" text={'Vos prochaines\n*escapades* *africaines*'} />
          </div>
          <p className="offers__intro muted">
            Découvrez nos offres de vols à prix réduits, au départ des grandes villes du réseau. Faites défiler pour parcourir les destinations.
          </p>
        </div>

        <div className="offers__viewport">
          <ul className="offers__track">
            {OFFERS.map((o, i) => {
              const A = CITIES[o.from];
              const B = CITIES[o.to];
              return (
                <li className="offer" key={o.to}>
                  <a href="#reserver" className="offer__link">
                    <div className="offer__img">
                      <img src={o.img} alt={`${B.name}, ${B.country}`} loading="lazy" />
                    </div>
                    <span className="offer__tag">
                      <Icon name="pin" size={14} /> {o.tag}
                    </span>
                    <span className="offer__num">{String(i + 1).padStart(2, '0')}</span>
                    <div className="offer__body">
                      <p className="offer__route">
                        <span>{A.name}</span>
                        <Icon name="plane" size={18} className="offer__plane" />
                        <span>{B.name}</span>
                      </p>
                      <div className="offer__foot">
                        <span className="offer__codes">
                          {o.from} — {o.to} · ≈ {distanceKm(o.from, o.to).toLocaleString('fr-FR')} km
                        </span>
                        <span className="offer__cta">
                          Voir l’offre <Icon name="arrowUpRight" size={16} />
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
            <li className="offer offer--more">
              <a href="#reseau" className="offer__link">
                <Icon name="globe" size={40} />
                <p>
                  Les 30 destinations
                  <br />
                  du réseau ASKY
                </p>
                <span className="btn btn--primary">
                  Explorer la carte <Icon name="arrow" size={18} />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
