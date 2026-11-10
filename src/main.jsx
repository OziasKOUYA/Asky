import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import NewsPage from './pages/NewsPage.jsx';
import InnerPage from './pages/InnerPage.jsx';
import { NEWS_PATH } from './data/sitemap.js';
import './styles.css';
import './news.css';
import './inner.css';

// Routage par URL : mêmes chemins que flyasky.com/tg/fr/…
const path = decodeURIComponent(window.location.pathname).replace(/\/+$/, '') || '/';
const HOME_PATHS = ['/', '/tg/fr', '/tg', '/index.html'];

let Page;
if (HOME_PATHS.includes(path)) Page = <App />;
else if (path === NEWS_PATH || path === '/actualites.html') Page = <NewsPage />;
else Page = <InnerPage path={path} />;

createRoot(document.getElementById('root')).render(<StrictMode>{Page}</StrictMode>);
