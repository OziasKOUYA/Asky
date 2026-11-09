import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

// Écran de chargement : logo + piste avec avion, attend l'image de l'avion et la police
export default function Loader({ onDone }) {
  const root = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = '/img/plane.webp';
    const waits = [img.decode().catch(() => {}), document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1300))];
    const obj = { p: 0 };
    const bar = root.current.querySelector('.loader__bar i');
    const plane = root.current.querySelector('.loader__plane');
    const prog = gsap.to(obj, {
      p: 0.85,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        bar.style.transform = `scaleX(${obj.p})`;
        plane.style.left = `${obj.p * 100}%`;
      },
    });
    Promise.all(waits).then(() => {
      if (cancelled) return;
      prog.kill();
      gsap
        .timeline()
        .to(obj, {
          p: 1,
          duration: 0.4,
          onUpdate: () => {
            bar.style.transform = `scaleX(${obj.p})`;
            plane.style.left = `${obj.p * 100}%`;
          },
        })
        .to(root.current.querySelector('.loader__in'), { y: -30, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
        .add(() => onDone?.(), '-=0.15')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut' }, '-=0.1')
        .set(root.current, { display: 'none' });
    });
    return () => {
      cancelled = true;
      prog.kill();
    };
  }, [onDone]);

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__in">
        <img src="/img/logo-light.png" alt="" className="loader__logo" />
        <div className="loader__track">
          <div className="loader__bar">
            <i />
          </div>
          <svg className="loader__plane" viewBox="-12 -12 24 24" width="22" height="22">
            <path d="M0 -11 L3 -3 L11 2 L11 4 L3 2 L2 8 L5 10 L5 11 L0 10 L-5 11 L-5 10 L-2 8 L-3 2 L-11 4 L-11 2 L-3 -3 Z" transform="rotate(90)" />
          </svg>
        </div>
        <p>Préparation à l’embarquement…</p>
      </div>
    </div>
  );
}
