// THREE.JS 3D BACKGROUND
let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create particles
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

    // Blue to purple gradient
    const colorChoice = Math.random();
    if (colorChoice > 0.5) {
      colors[i * 3] = 0.06;     // R
      colors[i * 3 + 1] = 0.69;  // G
      colors[i * 3 + 2] = 1;     // B
    } else {
      colors[i * 3] = 0.49;     // R
      colors[i * 3 + 1] = 0.23;  // G
      colors[i * 3 + 2] = 0.93;  // B
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Add floating geometric shapes
  addFloatingShapes();

  animate();
}

function addFloatingShapes() {
  const shapes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(3, 0),
    new THREE.OctahedronGeometry(2.5, 0),
    new THREE.TetrahedronGeometry(2, 0)
  ];

  for (let i = 0; i < 15; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0x10b1ff : 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.x = (Math.random() - 0.5) * 150;
    mesh.position.y = (Math.random() - 0.5) * 150;
    mesh.position.z = (Math.random() - 0.5) * 100;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    mesh.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01
      },
      floatSpeed: Math.random() * 0.02 + 0.01,
      floatOffset: Math.random() * Math.PI * 2
    };
    
    scene.add(mesh);
    shapes.push(mesh);
  }
  
  window.floatingShapes = shapes;
}

function animate() {
  requestAnimationFrame(animate);

  // Smooth mouse follow
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  
  particleSystem.rotation.x += 0.0003;
  particleSystem.rotation.y += 0.0005;
  
  particleSystem.rotation.x += (targetY - particleSystem.rotation.x) * 0.05;
  particleSystem.rotation.y += (targetX - particleSystem.rotation.y) * 0.05;

  // Animate floating shapes
  if (window.floatingShapes) {
    const time = Date.now() * 0.001;
    window.floatingShapes.forEach(shape => {
      shape.rotation.x += shape.userData.rotationSpeed.x;
      shape.rotation.y += shape.userData.rotationSpeed.y;
      shape.position.y += Math.sin(time + shape.userData.floatOffset) * shape.userData.floatSpeed;
    });
  }

  renderer.render(scene, camera);
}

// Mouse move for parallax
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = e.clientY - window.innerHeight / 2;
});

// Window resize
window.addEventListener('resize', () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

// Initialize Three.js
initThreeJS();

// Page Loader
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2200);
});

// Hamburger
function toggleMenu() {
  const menu = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

// Close menu on link click with smooth scroll
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#') && href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

// Close menu on backdrop click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (document.body.classList.contains('menu-open') && 
      !menu.contains(e.target) && 
      !hamburger.contains(e.target)) {
    toggleMenu();
  }
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Nav shadow on scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 40
    ? 'rgba(10,22,40,0.97)'
    : 'rgba(10,22,40,0.85)';
});

// 3D Card Tilt Effect
function init3DCardTilt() {
  const cards = document.querySelectorAll('.console-card, .product-card, .service-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// Initialize 3D card tilt
init3DCardTilt();

// Form send
function sendForm() {
  const nameInput = document.querySelector('input[placeholder*="chamar"]');
  const phoneInput = document.querySelector('input[type="tel"]');
  const subjectInput = document.querySelector('input[placeholder*="site"]');
  const msgTextArea = document.querySelector('textarea');

  const name = nameInput ? nameInput.value : '';
  const phone = phoneInput ? phoneInput.value : '';
  const subject = subjectInput ? subjectInput.value : '';
  const msg = msgTextArea ? msgTextArea.value : '';

  if (!name || !phone) {
    alert('Por favor, preencha pelo menos o nome e o telefone.');
    return;
  }
  const text = encodeURIComponent(
    `Olá! Me chamo ${name}.\nTelefone: ${phone}\nAssunto: ${subject}\nMensagem: ${msg}`
  );
  window.open(`https://wa.me/5586920011227?text=${text}`, '_blank');
}
