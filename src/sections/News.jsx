import { useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { SplitText } from '../components/TextFx.jsx';
import { gsap, useGSAP, MOTION_OK, NEWS_URL } from '../lib/gsap.js';

export default function News() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Image qui s'ouvre (clip-path) puis parallaxe
        gsap.fromTo(
          '.news__media',
          { clipPath: 'inset(16% 20% 16% 20% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: '.news__media', start: 'top 90%', end: 'top 30%', scrub: 0.6 } }
        );
        gsap.fromTo('.news__media img', { scale: 1.25, yPercent: -6 }, { scale: 1.05, yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.news__media', start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.from('.news__body > *', { y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.news__body', start: 'top 80%', once: true } });
      });
    },
    { scope: root }
  );

  return (
    <section className="news section" id="nouvelles" ref={root}>
      <div className="container">
        <div className="section__head section__head--row">
          <div>
            <p className="eyebrow">
              <Icon name="news" size={14} /> Nouvelles
            </p>
            <SplitText as="h2" className="h2" text="À la une" />
          </div>
          <a className="btn btn--ghost" href={NEWS_URL}>
            Toutes les actualités <Icon name="arrowUpRight" size={18} />
          </a>
        </div>

        <article className="news__card">
          <div className="news__media">
            <img src="/img/unhcr.jpg" alt="Signature du partenariat entre le HCR et ASKY" loading="lazy" />
            <span className="news__badge">
              <Icon name="handshake" size={16} /> Partenariat
            </span>
          </div>
          <div className="news__body">
            <time className="news__date" dateTime="2026-10-05">
              <Icon name="calendar" size={16} /> 5 octobre 2026 · Lomé
            </time>
            <h3 className="news__title">Le HCR et ASKY s’associent pour élargir l’accès des réfugiés à l’emploi et aux opportunités économiques</h3>
            <p className="muted">
              Un partenariat de trois ans pour la formation technique et professionnelle, les bourses, les stages et l’accès à l’emploi dans le secteur de l’aviation, au Sénégal, au Ghana,
              au Bénin, au Togo, au Nigeria et en Côte d’Ivoire. Le premier partenariat du HCR avec une compagnie aérienne régionale en Afrique de l’Ouest et du Centre.
            </p>
            <ul className="news__facts">
              <li>
                <strong>3 ans</strong>
                <span>de partenariat</span>
              </li>
              <li>
                <strong>6 pays</strong>
                <span>dans un premier temps</span>
              </li>
              <li>
                <strong>1er</strong>
                <span>accord de ce type en Afrique subsaharienne</span>
              </li>
            </ul>
            <a className="btn btn--dark" href={`${NEWS_URL}?article=0`}>
              Lire la suite <Icon name="arrow" size={18} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
