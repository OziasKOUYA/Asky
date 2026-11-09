import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Défilement doux (Lenis) relié à ScrollTrigger
let lenis = null;
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
export const getLenis = () => lenis;

export function scrollToTarget(target, offset = -90) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.6 });
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
}
