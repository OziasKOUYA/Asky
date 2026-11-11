import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger, startSmoothScroll, getLenis } from './lib/gsap.js';
import Loader from './sections/Loader.jsx';
import Header from './sections/Header.jsx';
import Hero from './sections/Hero.jsx';
import QuickServices from './sections/QuickServices.jsx';
import BookSheet from './components/BookSheet.jsx';
import Stats from './sections/Stats.jsx';
import Offers from './sections/Offers.jsx';
import Network from './sections/Network.jsx';
import Discover from './sections/Discover.jsx';
import News from './sections/News.jsx';
import Partners from './sections/Partners.jsx';
import AppPromo from './sections/AppPromo.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const lenis = startSmoothScroll();
    lenis?.stop();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  const onDone = useCallback(() => {
    setReady(true);
    getLenis()?.start();
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <Loader onDone={onDone} />
      <Header />
      <main>
        <Hero ready={ready} />
        <QuickServices />
        <Stats />
        <Offers />
        <Network />
        <Discover />
        <News />
        <Partners />
        <AppPromo />
      </main>
      <Footer />
      <BookSheet />
    </>
  );
}
