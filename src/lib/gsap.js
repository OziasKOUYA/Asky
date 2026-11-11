import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Écran tactile (Android, iPhone, tablettes) : on allège tout ce qui coûte cher au GPU
export const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
document.documentElement.classList.toggle('is-touch', isTouch);

// Lissage des animations liées au scroll : plus réactif au doigt
export const SCRUB = isTouch ? 0.35 : 0.9;

// Mobile : la barre d'adresse qui apparaît/disparaît ne doit pas recalculer toute la page (cause n°1 de saccades sur Android)
ScrollTrigger.config({ ignoreMobileResize: true });

// Défilement doux (Lenis) à la souris uniquement : sur écran tactile, le défilement natif est le plus fluide
let lenis = null;
export function startSmoothScroll() {
  if (lenis || isTouch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
export const getLenis = () => lenis;

// Défile vers une ancre de la page ; si elle n'existe pas ici, on rejoint l'accueil
export function scrollToTarget(target, offset = -90) {
  if (!document.querySelector(target)) {
    window.location.href = `/tg/fr/${target}`;
    return;
  }
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.2 });
  else {
    const y = document.querySelector(target).getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

// Ouvre le module de réservation (accueil) ; `detail` peut pré-remplir { from, to, tab }
export function openBooking(detail = {}) {
  window.dispatchEvent(new CustomEvent('asky:book', { detail }));
}

export const NEWS_URL = '/tg/fr/corporate/media/news';
