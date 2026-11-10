import { useLayoutEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { CITIES } from '../data/site.js';
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap.js';

const TABS = [
  { id: 'book', label: 'Réserver un vol', icon: 'takeoff' },
  { id: 'manage', label: 'Gérer ma réservation', icon: 'ticket' },
  { id: 'checkin', label: 'Enregistrement', icon: 'checkin' },
  { id: 'status', label: 'Statut du vol', icon: 'status' },
  { id: 'schedule', label: 'Horaires', icon: 'calendar' },
];
const HINTS = {
  manage: 'Modifiez vos dates, ajoutez des bagages ou choisissez votre siège.',
  checkin: 'L’enregistrement en ligne ouvre 24 h avant le départ.',
  status: 'Suivez votre vol en temps réel : départ, arrivée, retards éventuels.',
  schedule: 'Consultez les jours et heures de vol entre deux villes du réseau ASKY.',
};
const CITY_LIST = Object.entries(CITIES).sort((a, b) => a[1].name.localeCompare(b[1].name, 'fr'));
const today = new Date().toISOString().slice(0, 10);

export default function Booking({ initialTab = 'book', embedded = false }) {
  const root = useRef(null);
  const tabsRef = useRef(null);
  const [tab, setTab] = useState(initialTab);
  const [trip, setTrip] = useState('rt');
  const [from, setFrom] = useState('LFW');
  const [to, setTo] = useState('BGF');
  const [pax, setPax] = useState({ adt: 1, chd: 0, inf: 0 });
  const [paxOpen, setPaxOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Pastille glissante sous l'onglet actif
  useLayoutEffect(() => {
    const wrap = tabsRef.current;
    const btn = wrap?.querySelector(`[data-tab="${tab}"]`);
    if (!btn) return;
    const place = () => {
      wrap.style.setProperty('--pill-x', `${btn.offsetLeft}px`);
      wrap.style.setProperty('--pill-w', `${btn.offsetWidth}px`);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [tab]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.booking__card', {
          y: 120,
          rotationX: -18,
          autoAlpha: 0,
          transformPerspective: 1400,
          transformOrigin: '50% 100%',
          duration: 1.3,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.booking__card', start: 'top 92%', once: true },
        });
        gsap.from('.quick__item', {
          y: 40,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.quick', start: 'top 90%', once: true },
        });
      });
    },
    { scope: root }
  );

  useGSAP(
    () => {
      gsap.fromTo('.booking__pane', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' });
    },
    { scope: root, dependencies: [tab] }
  );

  const submit = (e) => {
    e.preventDefault();
    setToast('Démo : cette recherche sera reliée au moteur de réservation ASKY.');
    setTimeout(() => setToast(''), 3800);
  };
  const totalPax = pax.adt + pax.chd + pax.inf;
  const step = (k, d) =>
    setPax((p) => {
      const v = Math.max(k === 'adt' ? 1 : 0, Math.min(9, p[k] + d));
      return { ...p, [k]: k === 'inf' ? Math.min(v, p.adt) : v };
    });

  return (
    <section className={`booking ${embedded ? 'booking--embedded' : ''}`} id={embedded ? undefined : 'reserver'} ref={root}>
      <div className="container">
        <div className="booking__head" hidden={embedded}>
          <p className="eyebrow eyebrow--light">
            <Icon name="ticket" size={14} /> Réservation en ligne
          </p>
          <h2 className="h2 h2--light">
            Où allons-nous <span className="accent">aujourd’hui ?</span>
          </h2>
        </div>

        <div className="booking__card">
          <div className="tabs" ref={tabsRef} role="tablist">
            <span className="tabs__pill" aria-hidden="true" />
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                data-tab={t.id}
                aria-selected={tab === t.id}
                className={`tabs__btn ${tab === t.id ? 'is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <Icon name={t.icon} size={18} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <form className="booking__pane" onSubmit={submit} key={tab}>
            {tab === 'book' && (
              <>
                <div className="booking__opts">
                  <div className="seg">
                    <button type="button" className={trip === 'rt' ? 'is-on' : ''} onClick={() => setTrip('rt')}>
                      Aller-retour
                    </button>
                    <button type="button" className={trip === 'ow' ? 'is-on' : ''} onClick={() => setTrip('ow')}>
                      Aller simple
                    </button>
                  </div>
                  <label className="check">
                    <input type="checkbox" /> <span>Réserver avec des miles</span>
                  </label>
                </div>
                <div className="fields fields--book">
                  <label className="field">
                    <span className="field__label">
                      <Icon name="takeoff" size={16} /> De
                    </span>
                    <select value={from} onChange={(e) => setFrom(e.target.value)}>
                      {CITY_LIST.map(([code, c]) => (
                        <option key={code} value={code}>
                          {c.name} ({code})
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="swap"
                    aria-label="Inverser départ et arrivée"
                    onClick={(e) => {
                      setFrom(to);
                      setTo(from);
                      gsap.fromTo(e.currentTarget, { rotate: 0 }, { rotate: 180, duration: 0.5, ease: 'power3.out' });
                    }}
                  >
                    <Icon name="swap" size={18} />
                  </button>
                  <label className="field">
                    <span className="field__label">
                      <Icon name="landing" size={16} /> À
                    </span>
                    <select value={to} onChange={(e) => setTo(e.target.value)}>
                      {CITY_LIST.map(([code, c]) => (
                        <option key={code} value={code}>
                          {c.name} ({code})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field__label">
                      <Icon name="calendar" size={16} /> Départ
                    </span>
                    <input type="date" min={today} defaultValue={today} />
                  </label>
                  <label className={`field ${trip === 'ow' ? 'is-disabled' : ''}`}>
                    <span className="field__label">
                      <Icon name="calendar" size={16} /> Retour
                    </span>
                    <input type="date" min={today} disabled={trip === 'ow'} />
                  </label>
                  <div className="field field--pax">
                    <span className="field__label">
                      <Icon name="users" size={16} /> Passagers
                    </span>
                    <button type="button" className="pax__btn" onClick={() => setPaxOpen((o) => !o)} aria-expanded={paxOpen}>
                      {totalPax} passager{totalPax > 1 ? 's' : ''} <Icon name="chevron" size={14} />
                    </button>
                    {paxOpen && (
                      <div className="pax">
                        {[
                          ['adt', 'Adulte', '12+ ans'],
                          ['chd', 'Enfant', '2 - 12 ans'],
                          ['inf', 'Nourrisson', 'Moins de 2 ans'],
                        ].map(([k, l, s]) => (
                          <div className="pax__row" key={k}>
                            <div>
                              <strong>{l}</strong>
                              <small>{s}</small>
                            </div>
                            <div className="pax__ctl">
                              <button type="button" onClick={() => step(k, -1)} aria-label={`Retirer un ${l}`}>
                                −
                              </button>
                              <span>{pax[k]}</span>
                              <button type="button" onClick={() => step(k, 1)} aria-label={`Ajouter un ${l}`}>
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn btn--dark btn--block" onClick={() => setPaxOpen(false)}>
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                  <label className="field">
                    <span className="field__label">
                      <Icon name="seat" size={16} /> Classe
                    </span>
                    <select defaultValue="eco">
                      <option value="eco">Économique</option>
                      <option value="bus">Affaires</option>
                    </select>
                  </label>
                </div>
                <button className="btn btn--primary btn--lg btn--block booking__go" type="submit">
                  <Icon name="search" size={18} /> Rechercher des vols
                </button>
              </>
            )}

            {tab === 'schedule' && (
              <>
                <p className="booking__hint">{HINTS.schedule}</p>
                <div className="fields fields--schedule">
                  <label className="field">
                    <span className="field__label">
                      <Icon name="takeoff" size={16} /> De
                    </span>
                    <select value={from} onChange={(e) => setFrom(e.target.value)}>
                      {CITY_LIST.map(([code, c]) => (
                        <option key={code} value={code}>
                          {c.name} ({code})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field__label">
                      <Icon name="landing" size={16} /> À
                    </span>
                    <select value={to} onChange={(e) => setTo(e.target.value)}>
                      {CITY_LIST.map(([code, c]) => (
                        <option key={code} value={code}>
                          {c.name} ({code})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field__label">
                      <Icon name="calendar" size={16} /> Semaine du
                    </span>
                    <input type="date" min={today} defaultValue={today} />
                  </label>
                  <button className="btn btn--primary btn--lg" type="submit">
                    Voir les horaires <Icon name="arrow" size={18} />
                  </button>
                </div>
              </>
            )}

            {tab !== 'book' && tab !== 'schedule' && (
              <>
                <p className="booking__hint">{HINTS[tab]}</p>
                <div className="fields fields--simple">
                  <label className="field">
                    <span className="field__label">
                      <Icon name={tab === 'status' ? 'plane' : 'ticket'} size={16} />
                      {tab === 'status' ? 'Numéro de vol' : tab === 'checkin' ? 'Numéro de billet ou code' : 'Code de réservation'}
                    </span>
                    <input type="text" placeholder={tab === 'status' ? 'KP 040' : 'Ex. : ABC123'} />
                  </label>
                  <label className="field">
                    <span className="field__label">
                      <Icon name={tab === 'status' ? 'calendar' : 'user'} size={16} />
                      {tab === 'status' ? 'Date du vol' : 'Nom de famille'}
                    </span>
                    {tab === 'status' ? <input type="date" defaultValue={today} /> : <input type="text" placeholder="Nom du passager" />}
                  </label>
                  <button className="btn btn--primary btn--lg" type="submit">
                    {tab === 'status' ? 'Voir le statut' : tab === 'checkin' ? 'M’enregistrer' : 'Retrouver'} <Icon name="arrow" size={18} />
                  </button>
                </div>
              </>
            )}
          </form>
          {toast && <div className="toast" role="status">{toast}</div>}
        </div>

        <ul className="quick" hidden={embedded}>
          {[
            ['checkin', 'Enregistrement en ligne', 'Gagnez du temps à l’aéroport', 'checkin'],
            ['ticket', 'Gérer ma réservation', 'Sièges, bagages, changements', 'manage'],
            ['status', 'Informations de vol', 'Horaires et statut en direct', 'status'],
            ['bag', 'Bagages', 'Franchise et tarifs', null],
          ].map(([icon, t, s, target]) => (
            <li key={t} className="quick__item">
              <button type="button" onClick={() => target && setTab(target)}>
                <span className="quick__ic">
                  <Icon name={icon} size={22} />
                </span>
                <span>
                  <strong>{t}</strong>
                  <small>{s}</small>
                </span>
                <Icon name="arrowUpRight" size={18} className="quick__go" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
