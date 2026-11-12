import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { CITIES } from '../data/site.js';
import { gsap } from '../lib/gsap.js';

// Module de réservation compact : visible dès l'arrivée (hero) et dans le panneau « Réserver »
const TABS = [
  { id: 'book', label: 'Vol', long: 'Réserver un vol', icon: 'takeoff' },
  { id: 'manage', label: 'Gérer', long: 'Gérer ma réservation', icon: 'ticket' },
  { id: 'checkin', label: 'Enregistrement', long: 'Enregistrement', icon: 'checkin' },
  { id: 'status', label: 'Statut', long: 'Statut du vol', icon: 'status' },
];
const CITY_LIST = Object.entries(CITIES).sort((a, b) => a[1].name.localeCompare(b[1].name, 'fr'));
const POPULAR = ['ABJ', 'DSS', 'DLA', 'FIH', 'LBV', 'NBO', 'JNB'];
const today = () => new Date().toISOString().slice(0, 10);

export default function QuickBook({ variant = 'dock', preset = {} }) {
  const tabsRef = useRef(null);
  const [tab, setTab] = useState(preset.tab || 'book');
  const [trip, setTrip] = useState('rt');
  const [from, setFrom] = useState(preset.from || 'LFW');
  const [to, setTo] = useState(preset.to || 'BGF');
  const [pax, setPax] = useState(1);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (preset.from) setFrom(preset.from);
    if (preset.to) setTo(preset.to);
    if (preset.tab) setTab(preset.tab);
  }, [preset.from, preset.to, preset.tab]);

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

  const submit = (e) => {
    e.preventDefault();
    setToast('Démo : cette recherche sera reliée au moteur de réservation ASKY.');
    setTimeout(() => setToast(''), 3500);
  };
  const swap = (e) => {
    setFrom(to);
    setTo(from);
    gsap.fromTo(e.currentTarget.querySelector('svg'), { rotate: 0 }, { rotate: 180, duration: 0.45, ease: 'power3.out' });
  };
  const citySelect = (value, onChange, label) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      {CITY_LIST.map(([code, c]) => (
        <option key={code} value={code}>
          {c.name} ({code})
        </option>
      ))}
    </select>
  );

  return (
    <div className={`qb qb--${variant}`}>
      <div className="qb__top">
        <div className="qb__tabs" ref={tabsRef} role="tablist" aria-label="Type de demande">
          <span className="qb__pill" aria-hidden="true" />
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" data-tab={t.id} aria-selected={tab === t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={16} />
              <span className="qb__tab-short">{t.label}</span>
              <span className="qb__tab-long">{t.long}</span>
            </button>
          ))}
        </div>
        {tab === 'book' && (
          <div className="qb__trip" role="radiogroup" aria-label="Type de trajet">
            {[
              ['rt', 'Aller-retour'],
              ['ow', 'Aller simple'],
            ].map(([k, l]) => (
              <button key={k} type="button" role="radio" aria-checked={trip === k} className={trip === k ? 'is-on' : ''} onClick={() => setTrip(k)}>
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="qb__form" onSubmit={submit}>
        {tab === 'book' ? (
          <div className="qb__row qb__row--book">
            <label className="qb__f qb__f--city">
              <span>
                <Icon name="takeoff" size={14} /> De
              </span>
              {citySelect(from, setFrom, 'Ville de départ')}
            </label>
            <button type="button" className="qb__swap" onClick={swap} aria-label="Inverser départ et arrivée">
              <Icon name="swap" size={16} />
            </button>
            <label className="qb__f qb__f--city">
              <span>
                <Icon name="landing" size={14} /> À
              </span>
              {citySelect(to, setTo, "Ville d'arrivée")}
            </label>
            <label className="qb__f">
              <span>
                <Icon name="calendar" size={14} /> Départ
              </span>
              <input type="date" min={today()} defaultValue={today()} />
            </label>
            <label className={`qb__f ${trip === 'ow' ? 'is-off' : ''}`}>
              <span>
                <Icon name="calendar" size={14} /> Retour
              </span>
              <input type="date" min={today()} disabled={trip === 'ow'} />
            </label>
            <label className="qb__f qb__f--pax">
              <span>
                <Icon name="users" size={14} /> Passagers
              </span>
              <select value={pax} onChange={(e) => setPax(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} adulte{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </label>
            <button className="qb__go" type="submit">
              <Icon name="search" size={18} />
              <span>Rechercher</span>
            </button>
          </div>
        ) : (
          <div className="qb__row qb__row--simple">
            <label className="qb__f">
              <span>
                <Icon name={tab === 'status' ? 'plane' : 'ticket'} size={14} /> {tab === 'status' ? 'Numéro de vol' : tab === 'checkin' ? 'Billet ou code' : 'Code de réservation'}
              </span>
              <input type="text" placeholder={tab === 'status' ? 'KP 040' : 'ABC123'} />
            </label>
            <label className="qb__f">
              <span>
                <Icon name={tab === 'status' ? 'calendar' : 'user'} size={14} /> {tab === 'status' ? 'Date du vol' : 'Nom de famille'}
              </span>
              {tab === 'status' ? <input type="date" defaultValue={today()} /> : <input type="text" placeholder="Nom du passager" />}
            </label>
            <button className="qb__go" type="submit">
              <Icon name="arrow" size={18} />
              <span>{tab === 'status' ? 'Voir le statut' : tab === 'checkin' ? 'M’enregistrer' : 'Retrouver'}</span>
            </button>
          </div>
        )}
      </form>
      {tab === 'book' && (
        <div className="qb__pop">
          <span className="qb__pop-label">
            <Icon name="sparkle" size={14} /> Populaires depuis Lomé
          </span>
          {POPULAR.map((code) => (
            <button
              key={code}
              type="button"
              className={to === code ? 'is-on' : ''}
              onClick={() => {
                setTo(code);
                if (from === code) setFrom('LFW');
              }}
            >
              {CITIES[code].name} <small>{code}</small>
            </button>
          ))}
        </div>
      )}
      {toast && (
        <p className="qb__toast" role="status">
          {toast}
        </p>
      )}
    </div>
  );
}
