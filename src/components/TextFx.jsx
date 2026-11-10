import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap.js';

// Composants de texte animés inspirés de React Bits (BlurText, SplitText, CountUp, ShinyText).
// Utilisés sur une partie des titres seulement, pour garder du contraste entre les sections.

// BlurText : les mots sortent du flou un par un à l'entrée dans l'écran
export function BlurText({ as: Tag = 'h2', text, className = '', delay = 0, start = 'top 85%', stagger = 0.07 }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current.querySelectorAll('.bw'), {
          opacity: 0,
          filter: 'blur(12px)',
          y: 26,
          stagger,
          delay,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start, once: true },
        });
      });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className} aria-label={typeof text === 'string' ? text : undefined}>
      {splitWords(text).map((w, i) =>
        w === '\n' ? (
          <br key={i} />
        ) : (
          <span key={i} className={`bw ${w.accent ? 'accent' : ''}`} aria-hidden="true">
            {w.t}
            {' '}
          </span>
        )
      )}
    </Tag>
  );
}

// SplitText : les lettres montent depuis un masque
export function SplitText({ as: Tag = 'h2', text, className = '', start = 'top 85%', stagger = 0.022, scrub = false }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current.querySelectorAll('.ch'), {
          yPercent: 110,
          rotate: 6,
          opacity: 0,
          stagger,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: scrub
            ? { trigger: ref.current, start, end: 'top 40%', scrub: 0.6 }
            : { trigger: ref.current, start, once: true },
        });
      });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={text.replace(/\*/g, '')}>
      {splitWords(text).map((w, i) =>
        w === '\n' ? (
          <br key={i} />
        ) : (
          <span key={i} className={`sw ${w.accent ? 'accent' : ''}`} aria-hidden="true">
            {[...w.t].map((c, j) => (
              <span key={j} className="ch">
                {c}
              </span>
            ))}
          </span>
        )
      )}
    </Tag>
  );
}

// CountUp : compteur déclenché à l'entrée dans l'écran
export function CountUp({ to, suffix = '', duration = 2, className = '' }) {
  const ref = useRef(null);
  useGSAP(() => {
    const el = ref.current;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: to,
      duration,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString('fr-FR') + suffix),
    });
  });
  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

// ShinyText : reflet lumineux qui balaie le texte (CSS)
export function ShinyText({ children, className = '' }) {
  return <span className={`shiny ${className}`}>{children}</span>;
}

// « Mot *accentué* » → [{t:'Mot'}, {t:'accentué', accent:true}] ; « \n » = retour à la ligne
function splitWords(text) {
  const out = [];
  text.split(/(\n)/).forEach((part) => {
    if (part === '\n') return out.push('\n');
    part
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => {
        const accent = w.startsWith('*') && w.endsWith('*');
        out.push({ t: accent ? w.slice(1, -1) : w, accent });
      });
  });
  return out;
}
