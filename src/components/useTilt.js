import { useEffect } from 'react';
import { gsap, finePointer } from '../lib/gsap.js';

// Carte qui s'incline en 3D sous le pointeur + halo lumineux (SpotlightCard de React Bits)
export function useTilt(scopeRef, selector = '.tilt', max = 7) {
  useEffect(() => {
    if (!finePointer() || !scopeRef.current) return;
    const cards = [...scopeRef.current.querySelectorAll(selector)];
    const offs = cards.map((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      gsap.set(card, { transformPerspective: 1000 });
      const move = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--x', `${x * 100}%`);
        card.style.setProperty('--y', `${y * 100}%`);
        ry((x - 0.5) * max * 2);
        rx(-(y - 0.5) * max * 2);
      };
      const leave = () => {
        rx(0);
        ry(0);
      };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      return () => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
      };
    });
    return () => offs.forEach((f) => f());
  }, [scopeRef, selector, max]);
}
