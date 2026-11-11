import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import QuickBook from './QuickBook.jsx';
import { getLenis } from '../lib/gsap.js';

// Bouton flottant « Réserver un vol » + panneau de réservation (s'ouvre aussi depuis le menu, les offres, les destinations)
export default function BookSheet() {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState({});
  const [fab, setFab] = useState(false);
  const panel = useRef(null);

  useEffect(() => {
    const onBook = (e) => {
      setPreset({ ...(e.detail || {}), _t: Date.now() });
      setOpen(true);
    };
    window.addEventListener('asky:book', onBook);
    // Le bouton apparaît quand le module du hero n'est plus visible
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const footer = document.querySelector('.footer');
        const nearFooter = footer && footer.getBoundingClientRect().top < window.innerHeight * 0.85;
        setFab(window.scrollY > window.innerHeight * 0.35 && !nearFooter);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('asky:book', onBook);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.documentElement.classList.add('no-scroll');
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    panel.current?.focus();
    return () => {
      getLenis()?.start();
      document.documentElement.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" className={`fab ${fab && !open ? 'is-on' : ''}`} onClick={() => (setPreset({ _t: Date.now() }), setOpen(true))} aria-label="Réserver un vol">
        <span className="fab__ic">
          <Icon name="takeoff" size={20} />
        </span>
        <span className="fab__txt">Réserver un vol</span>
      </button>

      {open && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Réserver un vol">
          <button type="button" className="sheet__backdrop" aria-label="Fermer" onClick={() => setOpen(false)} />
          <div className="sheet__panel" ref={panel} tabIndex={-1} data-lenis-prevent>
            <span className="sheet__grab" aria-hidden="true" />
            <div className="sheet__head">
              <div>
                <p className="eyebrow">
                  <Icon name="ticket" size={14} /> Réservation en ligne
                </p>
                <h2 className="sheet__title">
                  Où allons-nous <span className="accent">aujourd’hui ?</span>
                </h2>
              </div>
              <button type="button" className="sheet__close" onClick={() => setOpen(false)} aria-label="Fermer">
                <Icon name="close" size={20} />
              </button>
            </div>
            <QuickBook variant="sheet" preset={preset} />
          </div>
        </div>
      )}
    </>
  );
}
