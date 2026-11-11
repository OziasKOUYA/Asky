import * as THREE from 'three';

// Mer de nuages « volumétrique » : des centaines de sprites doux répartis en profondeur.
// La caméra avance dans l'axe Z selon la progression du scroll (0 → 1) et suit la souris.

function makeCloudTexture(seed) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  let s = seed;
  const rand = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 30; i++) {
    const x = size / 2 + (rand() - 0.5) * size * 0.58;
    const y = size / 2 + (rand() - 0.5) * size * 0.3 + rand() * 0.08 * size;
    const r = size * (0.1 + rand() * 0.17);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255,255,255,0.5)');
    grad.addColorStop(0.55, 'rgba(255,255,255,0.17)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function initClouds(
  canvas,
  {
    fog = 0xd8b28a,
    palette = ['#f6e6d6', '#ecd2b8', '#e6c19a', '#fbefe2', '#d9a978', '#f3dcc4'],
    bank = '#36190D',
  } = {}
) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  // Sur téléphone : résolution standard, moins de nuages → 60 i/s même sur Android d'entrée de gamme
  renderer.setPixelRatio(touch ? 1 : Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(fog, 40, 220);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);

  const textures = [11, 47, 83, 121].map(makeCloudTexture);
  const colors = palette.map((c) => new THREE.Color(c));
  const sprites = [];
  const END_Z = -230;
  const isMobile = touch || window.innerWidth < 700;
  const COUNT = isMobile ? 60 : 200;

  const addCloud = (x, y, z, w, opacity, color) => {
    const mat = new THREE.SpriteMaterial({
      map: textures[(Math.random() * textures.length) | 0],
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      fog: true,
      rotation: (Math.random() - 0.5) * 0.4,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.set(x, y, z);
    sp.scale.set(w, w * 0.55, 1);
    sp.userData = { spin: (Math.random() - 0.5) * 0.0005, baseX: x, phase: Math.random() * 6 };
    scene.add(sp);
    sprites.push(sp);
  };

  // Mer de nuages sous l'horizon
  for (let i = 0; i < COUNT; i++) {
    const z = -6 - Math.random() * 250;
    const spread = 30 + Math.abs(z) * 0.38;
    const x = (Math.random() - 0.5) * spread * 2;
    const y = -4.5 - Math.random() * 12 + (Math.abs(z) / 250) * 3;
    addCloud(x, y, z, 18 + Math.random() * 36, 0.5 + Math.random() * 0.45, colors[(Math.random() * colors.length) | 0]);
  }
  // Quelques nuages hauts, épars, pour la parallaxe
  for (let i = 0; i < (isMobile ? 8 : 34); i++) {
    const z = -20 - Math.random() * 220;
    addCloud((Math.random() - 0.5) * 120, 6 + Math.random() * 16, z, 14 + Math.random() * 22, 0.25 + Math.random() * 0.25, colors[3]);
  }
  // Banc dense couleur café en fin de parcours : la caméra « rentre » dedans
  for (let i = 0; i < (isMobile ? 26 : 50); i++) {
    const z = END_Z + 4 - Math.random() * 18;
    addCloud((Math.random() - 0.5) * 36, (Math.random() - 0.5) * 20, z, 22 + Math.random() * 26, 0.85, new THREE.Color(bank));
  }

  let target = 0;
  let current = 0;
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  let running = false;
  let raf = 0;

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  const render = () => {
    current += (target - current) * 0.07;
    pointer.cx += (pointer.x - pointer.cx) * 0.04;
    pointer.cy += (pointer.y - pointer.cy) * 0.04;
    const t = performance.now() * 0.001;
    // Léger roulis de croisière + avancée au scroll
    camera.position.z = current * END_Z - (1 - Math.cos(t * 0.25)) * 2.5;
    camera.position.x = pointer.cx * 3;
    camera.position.y = 0.4 - pointer.cy * 1.4 + current * 2.4;
    camera.rotation.z = -pointer.cx * 0.025;
    if (!isMobile) {
      for (const sp of sprites) {
        sp.material.rotation += sp.userData.spin;
        sp.position.x = sp.userData.baseX + Math.sin(t * 0.18 + sp.userData.phase) * 0.7;
      }
    }
    renderer.render(scene, camera);
  };
  const tick = () => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    render();
  };

  return {
    setProgress(p) {
      target = p;
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    start() {
      if (running) return;
      running = true;
      tick();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    renderOnce: render,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      textures.forEach((t) => t.dispose());
      sprites.forEach((s) => s.material.dispose());
      renderer.dispose();
    },
  };
}
