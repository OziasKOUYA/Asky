// Données réelles issues de flyasky.com/tg/fr (novembre 2026).

export const CONTACT = {
  phones: ['+228 22 23 05 00', '+228 70 69 15 15'],
  email: 'communication@flyasky.com',
  whatsapp: 'https://wa.me/+22870691515',
  socials: {
    facebook: 'https://www.facebook.com/ThePanAfricanAirlines',
    x: 'https://twitter.com/ASKY_airlines',
    instagram: 'https://www.instagram.com/asky_airlines/',
    linkedin: 'https://www.linkedin.com/company/asky-airlines-pan-african-airlines',
  },
};

const B = 'https://www.flyasky.com/tg/fr';

// Menu principal (structure du site actuel)
export const MENU = [
  {
    label: 'Planifiez',
    columns: [
      { title: 'Conditions', links: ['Formalités', 'Documents', 'ADM Policies'] },
      { title: 'Essentiel', links: ['Bagages', 'Animaux', 'Marchandises interdites', 'Marchandises autorisées'] },
      { title: 'Spéciales', links: ['Mineurs non accompagnés', 'Femmes enceintes', 'Mobilité réduite', 'Masse corporelle élevée'] },
      { title: 'Services', links: ['Famille et groupes', 'Au sol', 'À bord', "Après l'atterrissage"] },
    ],
  },
  {
    label: 'Voyagez',
    columns: [
      { title: 'Réservation', links: ['Vol', 'Gérez', 'Enregistrement'] },
      { title: 'Statut', links: ['Statut du vol', 'Calendrier'] },
      { title: 'Réseau', links: ['International', 'Carte du réseau'] },
      { title: 'Flotte', links: ['Avions modernes', 'Boeing 737 MAX', 'Boeing 737-800', 'Boeing 737-700'] },
    ],
  },
  {
    label: 'Découvrez',
    columns: [
      { title: 'ASKY Club', links: ['Aperçu', 'Rejoindre'] },
      { title: 'Les vacances', links: ['Présentation', 'Forfaits Bénin', "Forfaits Côte d'Ivoire", 'Forfaits Sénégal', 'Forfaits Ghana', 'Forfaits Togo'] },
      { title: 'Services', links: ['Expérience ASKY', 'Programme de fidélité'] },
      { title: 'Assistance', links: ['Commentaires', 'Subscription'] },
    ],
  },
  {
    label: "À propos d'ASKY",
    columns: [
      { title: 'À propos de nous', links: ['Société', 'Les figures', 'Activités', 'Leadership'] },
      { title: 'Carrière', links: ['Emplois dans les compagnies aériennes', 'Étudiants diplômés', "Offres d'emplois"] },
      { title: 'Médias', links: ['Nouvelles', 'Communiqué de presse'] },
      { title: 'Légal', links: ['Politique de dénonciation'] },
    ],
  },
];

// Villes desservies (carte « Le réseau ASKY ») — [longitude, latitude]
export const CITIES = {
  LFW: { name: 'Lomé', country: 'Togo', c: [1.23, 6.13], hub: true },
  CKY: { name: 'Conakry', country: 'Guinée', c: [-13.68, 9.64], hub: true },
  ABJ: { name: 'Abidjan', country: "Côte d'Ivoire", c: [-4.03, 5.36] },
  ABV: { name: 'Abuja', country: 'Nigeria', c: [7.49, 9.06] },
  ACC: { name: 'Accra', country: 'Ghana', c: [-0.19, 5.6] },
  BKO: { name: 'Bamako', country: 'Mali', c: [-8.0, 12.64] },
  BGF: { name: 'Bangui', country: 'Centrafrique', c: [18.56, 4.39] },
  BJL: { name: 'Banjul', country: 'Gambie', c: [-16.58, 13.45] },
  OXB: { name: 'Bissau', country: 'Guinée-Bissau', c: [-15.6, 11.86] },
  BZV: { name: 'Brazzaville', country: 'Congo', c: [15.24, -4.26] },
  COO: { name: 'Cotonou', country: 'Bénin', c: [2.42, 6.37] },
  DSS: { name: 'Dakar', country: 'Sénégal', c: [-17.47, 14.72] },
  DLA: { name: 'Douala', country: 'Cameroun', c: [9.7, 4.05] },
  FNA: { name: 'Freetown', country: 'Sierra Leone', c: [-13.23, 8.48] },
  JNB: { name: 'Johannesburg', country: 'Afrique du Sud', c: [28.05, -26.2] },
  FIH: { name: 'Kinshasa', country: 'RD Congo', c: [15.31, -4.32] },
  LOS: { name: 'Lagos', country: 'Nigeria', c: [3.38, 6.52] },
  LBV: { name: 'Libreville', country: 'Gabon', c: [9.45, 0.39] },
  LAD: { name: 'Luanda', country: 'Angola', c: [13.23, -8.84] },
  SSG: { name: 'Malabo', country: 'Guinée équatoriale', c: [8.78, 3.75] },
  ROB: { name: 'Monrovia', country: 'Libéria', c: [-10.8, 6.3] },
  NBO: { name: 'Nairobi', country: 'Kenya', c: [36.82, -1.29] },
  NIM: { name: 'Niamey', country: 'Niger', c: [2.11, 13.51] },
  NKC: { name: 'Nouakchott', country: 'Mauritanie', c: [-15.98, 18.08] },
  NDJ: { name: "N'Djamena", country: 'Tchad', c: [15.04, 12.13] },
  OUA: { name: 'Ouagadougou', country: 'Burkina Faso', c: [-1.53, 12.37] },
  PNR: { name: 'Pointe-Noire', country: 'Congo', c: [11.86, -4.78] },
  RAI: { name: 'Praia', country: 'Cap-Vert', c: [-23.51, 14.93] },
  TMS: { name: 'São Tomé', country: 'São Tomé-et-Principe', c: [6.73, 0.34] },
  NSI: { name: 'Yaoundé', country: 'Cameroun', c: [11.5, 3.85] },
};

// Liaisons (d'après la carte officielle du réseau) : hub de Lomé + hub secondaire de Conakry
export const ROUTES = [
  ...['ABJ', 'ACC', 'COO', 'LOS', 'ABV', 'NIM', 'OUA', 'BKO', 'ROB', 'FNA', 'CKY', 'DSS', 'NDJ', 'BGF', 'NBO', 'DLA', 'NSI', 'SSG', 'LBV', 'TMS', 'BZV', 'FIH', 'PNR', 'LAD', 'JNB'].map((t) => ['LFW', t]),
  ['CKY', 'NKC'],
  ['CKY', 'DSS'],
  ['CKY', 'BJL'],
  ['CKY', 'OXB'],
  ['DSS', 'RAI'],
];

// Offres (bannières « Offres » du site)
export const OFFERS = [
  { from: 'LFW', to: 'BGF', img: '/img/bangui.jpg', tag: 'Centrafrique' },
  { from: 'COO', to: 'FIH', img: '/img/kinshasa.jpg', tag: 'RD Congo' },
  { from: 'DSS', to: 'NBO', img: '/img/nairobi.jpg', tag: 'Kenya' },
  { from: 'LOS', to: 'FNA', img: '/img/freetown.jpg', tag: 'Sierra Leone' },
  { from: 'FIH', to: 'JNB', img: '/img/johannesburg.jpg', tag: 'Afrique du Sud' },
  { from: 'ACC', to: 'ROB', img: '/img/monrovia.jpg', tag: 'Libéria' },
];

// Distance orthodromique en km (pour les cartes de vol)
export function distanceKm(a, b) {
  const [lon1, lat1] = CITIES[a].c.map((v) => (v * Math.PI) / 180);
  const [lon2, lat2] = CITIES[b].c.map((v) => (v * Math.PI) / 180);
  const h = Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2;
  return Math.round((2 * 6371 * Math.asin(Math.sqrt(h))) / 10) * 10;
}

export const LINK = (p = '') => `${B}${p}`;
