import { useEffect, useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { BlurText } from '../components/TextFx.jsx';
import { gsap, useGSAP, MOTION_OK, finePointer } from '../lib/gsap.js';

const ITEMS = [
  {
    icon: 'sparkle',
    title: 'Expérience ASKY',
    text: 'Confort à bord, service attentionné et application mobile pour voyager l’esprit léger.',
    img: '/img/experience.jpg',
    tag: 'Services',
  },
  {
    icon: 'book',
    title: 'Magazine de bord Calebasse n°69',
    text: 'Culture, voyages et talents du continent : le magazine qui vous accompagne à bord.',
    img: '/img/calebasse.jpg',
    tag: 'À lire',
  },
  {
    icon: 'star',
    title: 'ASKY Club',
    text: 'Le programme de fidélité : cumulez des miles à chaque vol et profitez d’avantages exclusifs.',
    img: '/img/club.jpg',
    tag: 'Fidélité',
  },
  {
    icon: 'palm',
    title: 'Vacances ASKY',
    text: 'Forfaits touristiques au Bénin, en Côte d’Ivoire, au Sénégal, au Ghana et au Togo.',
    img: '/img/freetown.jpg',
    tag: 'Forfaits',
  },
];

export default function Discover() {
  const root = useRef(null);
  const follow = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.svc', {
          y: 50,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.svcs', start: 'top 82%', once: true },
        });
        gsap.from('.svc__line', {
          scaleX: 0,
          transformOrigin: '0 50%',
          stagger: 0.1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.svcs', start: 'top 82%', once: true },
        });
      });
    },
    { scope: root }
  );

  // Image qui suit le curseur au survol d'une ligne (React Bits)
  useEffect(() => {
    const box = follow.current;
    if (!finePointer() || !box) return;
    const img = box.querySelector('img');
    const fx = gsap.quickTo(box, 'x', { duration: 0.55, ease: 'power3.out' });
    const fy = gsap.quickTo(box, 'y', { duration: 0.55, ease: 'power3.out' });
    const rot = gsap.quickTo(box, 'rotation', { duration: 0.8, ease: 'power3.out' });
    let lastX = 0;
    const move = (e) => {
      const r = root.current.getBoundingClientRect();
      fx(e.clientX - r.left);
      fy(e.clientY - r.top);
      rot(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    const rows = [...root.current.querySelectorAll('.svc')];
    const offs = rows.map((row) => {
      const enter = () => {
        img.src = row.dataset.img;
        box.classList.add('is-visible');
      };
      const leave = () => box.classList.remove('is-visible');
      row.addEventListener('pointerenter', enter);
      row.addEventListener('pointerleave', leave);
      return () => {
        row.removeEventListener('pointerenter', enter);
        row.removeEventListener('pointerleave', leave);
      };
    });
    root.current.addEventListener('pointermove', move);
    const el = root.current;
    return () => {
      offs.forEach((f) => f());
      el.removeEventListener('pointermove', move);
    };
  }, []);

  return (
    <section className="discover section" id="decouvrez" ref={root}>
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">
            <Icon name="sparkle" size={14} /> Découvrez
          </p>
          <BlurText as="h2" className="h2" text="Nos services *et* *produits*" />
          <p className="muted section__sub">Bien plus qu’un billet d’avion : un voyage pensé de la réservation à l’atterrissage.</p>
        </div>

        <ul className="svcs">
          {ITEMS.map((it, i) => (
            <li key={it.title} className="svc" data-img={it.img}>
              <span className="svc__line" />
              <a href="#" className="svc__in">
                <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="svc__ic">
                  <Icon name={it.icon} size={24} />
                </span>
                <span className="svc__title">{it.title}</span>
                <span className="svc__text">{it.text}</span>
                <span className="svc__tag">{it.tag}</span>
                <span className="svc__go">
                  <Icon name="arrowUpRight" size={22} />
                </span>
              </a>
              <img className="svc__thumb" src={it.img} alt="" loading="lazy" />
            </li>
          ))}
          <li className="svc__end">
            <span className="svc__line" />
          </li>
        </ul>
      </div>
      <div className="svc-follow" ref={follow} aria-hidden="true">
        <img src={ITEMS[0].img} alt="" />
      </div>
    </section>
  );
}
