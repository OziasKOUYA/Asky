// Arborescence du site : mêmes URL que flyasky.com/tg/fr, titres en français.
// `ext` = page non refaite ici → lien vers le site actuel (ou vers un service externe).
const R = '/tg/fr';
const ORIG = 'https://www.flyasky.com';

export const HOME = `${R}/`;
export const NEWS_PATH = `${R}/corporate/media/news`;

export const SECTIONS = [
  {
    key: 'plan',
    label: 'Planifiez',
    path: `${R}/plan`,
    icon: 'calendar',
    tagline: 'Tout ce qu’il faut savoir avant le départ : documents, bagages et services.',
    visual: '/img/pages/fr-formalites.jpg',
    groups: [
      {
        title: 'Conditions',
        path: `${R}/plan/requirements`,
        icon: 'shield',
        pages: [
          { path: `${R}/plan/requirements/formalities`, title: 'Formalités', icon: 'checkin' },
          { path: `${R}/plan/requirements/documents`, title: 'Documents de voyage', icon: 'ticket' },
          { path: `${R}/plan/requirements/admpolicies`, title: 'Politique ADM', icon: 'book' },
        ],
      },
      {
        title: 'Essentiel',
        path: `${R}/plan/essentials`,
        icon: 'bag',
        pages: [
          { path: `${R}/plan/essentials/luggage`, title: 'Bagages', icon: 'bag' },
          { path: `${R}/plan/essentials/animals`, title: 'Animaux', icon: 'leaf' },
          { path: `${R}/plan/essentials/forbidden-goods`, title: 'Marchandises interdites', icon: 'shield' },
          { path: `${R}/plan/essentials/permitted-goods`, title: 'Marchandises autorisées', icon: 'checkin' },
        ],
      },
      {
        title: 'Besoins spécifiques',
        path: `${R}/plan/specials`,
        icon: 'users',
        pages: [
          { path: `${R}/plan/specials/unaccompanied-minors`, title: 'Mineurs non accompagnés', icon: 'user' },
          { path: `${R}/plan/specials/pregnant-women`, title: 'Femmes enceintes', icon: 'users' },
          { path: `${R}/plan/specials/reduced-mobility`, title: 'Mobilité réduite', icon: 'seat' },
        ],
      },
      {
        title: 'Services',
        path: `${R}/plan/services`,
        icon: 'sparkle',
        pages: [
          { path: `${R}/plan/services/family-and-groups`, title: 'Famille et groupes', icon: 'users' },
          { path: `${R}/plan/services/on-ground`, title: 'Au sol', icon: 'checkin' },
          { path: `${R}/plan/services/on-board`, title: 'À bord', icon: 'seat' },
          { path: `${R}/plan/services/after-landing`, title: 'Après l’atterrissage', icon: 'landing' },
        ],
      },
    ],
  },
  {
    key: 'fly',
    label: 'Voyagez',
    path: `${R}/fly`,
    icon: 'takeoff',
    tagline: 'Réservez, gérez votre vol, enregistrez-vous et découvrez notre réseau et notre flotte.',
    visual: 'plane',
    groups: [
      {
        title: 'Réservation',
        path: `${R}/fly/booking`,
        icon: 'ticket',
        pages: [
          { path: `${R}/fly/booking/manage`, title: 'Gérer ma réservation', icon: 'ticket', widget: 'manage' },
          { path: `${R}/fly/booking/check-in`, title: 'Enregistrement en ligne', icon: 'checkin', widget: 'checkin' },
          { path: `${R}/fly/booking/status`, title: 'Statut du vol', icon: 'status', widget: 'status' },
          { path: `${R}/fly/booking/schedule`, title: 'Horaires des vols', icon: 'calendar', widget: 'schedule' },
        ],
      },
      {
        title: 'Réseau',
        path: `${R}/fly/network`,
        icon: 'globe',
        pages: [{ path: `${R}/fly/network/international`, title: 'Réseau international', icon: 'globe', map: true }],
      },
      {
        title: 'Flotte',
        path: `${R}/fly/fleet`,
        icon: 'fleet',
        pages: [
          { path: `${R}/fly/fleet/modern-aircrafts`, title: 'Une flotte moderne', icon: 'fleet' },
          { path: `${R}/fly/fleet/boeing-737-max`, title: 'Boeing 737 MAX', icon: 'plane', lead: 'Fiche technique du Boeing 737 MAX : capacité, dimensions, masses et rayon d’action du fleuron de la flotte ASKY.' },
          { path: `${R}/fly/fleet/boeing-737-800-aircraft`, title: 'Boeing 737-800', icon: 'plane', lead: 'Fiche technique du Boeing 737-800 Next Generation, pilier du réseau régional d’ASKY.' },
        ],
      },
    ],
  },
  {
    key: 'explore',
    label: 'Découvrez',
    path: `${R}/explore`,
    icon: 'sparkle',
    tagline: 'ASKY Club, services à bord et assistance : profitez pleinement de chaque voyage.',
    visual: '/img/pages/en-services-a-bord.jpg',
    groups: [
      {
        title: 'ASKY Club',
        path: `${R}/explore/asky-club`,
        icon: 'star',
        pages: [
          { path: `${R}/explore/asky-club/overview`, title: 'Aperçu du programme', icon: 'star' },
          { path: 'https://ffkp.loyaltyplus.aero/kployalty/index.jsf', title: 'Rejoindre ASKY Club', icon: 'user', ext: true },
        ],
      },
      {
        title: 'Services',
        path: `${R}/explore/services`,
        icon: 'sparkle',
        pages: [{ path: `${R}/explore/services/asky-experience`, title: 'Expérience ASKY', icon: 'sparkle' }],
      },
      {
        title: 'Assistance',
        path: `${R}/explore/support`,
        icon: 'mail',
        pages: [
          { path: `${R}/explore/support/feedback`, title: 'Commentaires', icon: 'mail', form: 'feedback' },
          { path: `${R}/explore/support/subscription`, title: 'Newsletter', icon: 'news', form: 'subscription' },
        ],
      },
    ],
  },
  {
    key: 'corporate',
    label: 'À propos d’ASKY',
    path: `${R}/corporate`,
    icon: 'handshake',
    tagline: 'La compagnie panafricaine basée à Lomé : notre histoire, nos chiffres, nos équipes.',
    visual: '/img/asky-737.jpg',
    groups: [
      {
        title: 'À propos de nous',
        path: `${R}/corporate/about`,
        icon: 'handshake',
        pages: [
          { path: `${R}/corporate/about/asky`, title: 'La compagnie ASKY', icon: 'sparkle' },
          { path: `${R}/corporate/about/figures`, title: 'Chiffres clés', icon: 'status', lead: 'Plus de 7 millions de passagers transportés depuis 2010 : l’évolution du trafic, du réseau et des effectifs d’ASKY.' },
          { path: `${R}/corporate/about/activities`, title: 'Nos activités', icon: 'fleet' },
          { path: `${R}/corporate/about/leadership`, title: 'Direction', icon: 'users', custom: 'leadership' },
        ],
      },
      {
        title: 'Carrière',
        path: `${R}/corporate/career`,
        icon: 'user',
        pages: [
          { path: `${ORIG}${R}/corporate/career/airline-jobs`, title: 'Emplois dans l’aérien', icon: 'plane', ext: true },
          { path: `${ORIG}${R}/corporate/career/student-graduates`, title: 'Étudiants diplômés', icon: 'book', ext: true },
          { path: `${ORIG}${R}/corporate/career/job-offers`, title: 'Offres d’emploi', icon: 'news', ext: true },
        ],
      },
      {
        title: 'Médias',
        path: NEWS_PATH,
        icon: 'news',
        pages: [{ path: NEWS_PATH, title: 'Nouvelles', icon: 'news' }],
      },
    ],
  },
];

// Index : chemin → { page, group, section }
export const INDEX = {};
SECTIONS.forEach((section) => {
  INDEX[section.path] = { kind: 'section', section };
  section.groups.forEach((group) => {
    if (!INDEX[group.path]) INDEX[group.path] = { kind: 'group', group, section };
    group.pages.forEach((page) => {
      if (!page.ext && page.path !== NEWS_PATH) INDEX[page.path] = { kind: 'page', page, group, section };
    });
  });
});

export const ORIGINAL = (path) => `${ORIG}${path}`;
export const isExternal = (href) => /^https?:/.test(href);
