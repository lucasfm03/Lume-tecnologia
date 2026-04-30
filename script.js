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

function initLumeGame() {
  const canvas = document.getElementById('lume-game-canvas');
  const shell = document.getElementById('lume-game-shell');
  const scoreDOM = document.getElementById('lume-game-score');
  const resultDOM = document.getElementById('lume-game-result');
  const finalScoreDOM = document.getElementById('lume-game-final-score');
  const retryButton = document.getElementById('lume-game-retry');

  if (!canvas || !shell || !scoreDOM || !resultDOM || !finalScoreDOM || !retryButton || !window.THREE) {
    return;
  }

  const minTileIndex = -8;
  const maxTileIndex = 8;
  const tilesPerRow = maxTileIndex - minTileIndex + 1;
  const tileSize = 42;

  const gameState = {
    metadata: [],
    position: {
      currentRow: 0,
      currentTile: 0,
    },
    movesQueue: [],
    gameOver: false,
  };

  const scene = new THREE.Scene();
  const map = new THREE.Group();
  scene.add(map);

  const player = createPlayer();
  scene.add(player);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const directionalLight = createDirectionalLight();
  directionalLight.target = player;
  player.add(directionalLight);

  const camera = createGameCamera();
  player.add(camera);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const carFrontTexture = createTexture(40, 80, [{ x: 0, y: 10, w: 30, h: 60 }]);
  const carBackTexture = createTexture(40, 80, [{ x: 10, y: 10, w: 30, h: 60 }]);
  const carRightSideTexture = createTexture(110, 40, [
    { x: 10, y: 0, w: 50, h: 30 },
    { x: 70, y: 0, w: 30, h: 30 },
  ]);
  const carLeftSideTexture = createTexture(110, 40, [
    { x: 10, y: 10, w: 50, h: 30 },
    { x: 70, y: 10, w: 30, h: 30 },
  ]);
  const truckFrontTexture = createTexture(30, 30, [{ x: 5, y: 0, w: 10, h: 30 }]);
  const truckRightSideTexture = createTexture(25, 30, [{ x: 15, y: 5, w: 10, h: 10 }]);
  const truckLeftSideTexture = createTexture(25, 30, [{ x: 15, y: 15, w: 10, h: 10 }]);

  const moveClock = new THREE.Clock(false);
  const vehicleClock = new THREE.Clock();

  function createGameCamera() {
    const gameCamera = new THREE.OrthographicCamera(-180, 180, 180, -180, 100, 900);
    gameCamera.up.set(0, 0, 1);
    gameCamera.position.set(300, -300, 300);
    gameCamera.lookAt(0, 0, 0);
    return gameCamera;
  }

  function updateCameraProjection() {
    const width = shell.clientWidth || 1;
    const height = shell.clientHeight || 1;
    const size = 300;
    const viewRatio = width / height;
    const cameraWidth = viewRatio < 1 ? size : size * viewRatio;
    const cameraHeight = viewRatio < 1 ? size / viewRatio : size;

    camera.left = cameraWidth / -2;
    camera.right = cameraWidth / 2;
    camera.top = cameraHeight / 2;
    camera.bottom = cameraHeight / -2;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);

    renderer.setSize(width, height, false);
  }

  function createTexture(width, height, rects) {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = width;
    textureCanvas.height = height;
    const context = textureCanvas.getContext('2d');

    if (!context) {
      return new THREE.CanvasTexture(textureCanvas);
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'rgba(0,0,0,0.6)';
    rects.forEach((rect) => {
      context.fillRect(rect.x, rect.y, rect.w, rect.h);
    });

    return new THREE.CanvasTexture(textureCanvas);
  }

  function createDirectionalLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(-100, -100, 200);
    light.up.set(0, 0, 1);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.up.set(0, 0, 1);
    light.shadow.camera.left = -400;
    light.shadow.camera.right = 400;
    light.shadow.camera.top = 400;
    light.shadow.camera.bottom = -400;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 400;
    return light;
  }

  function createWheel(x) {
    const wheel = new THREE.Mesh(
      new THREE.BoxGeometry(12, 33, 12),
      new THREE.MeshLambertMaterial({ color: 0x333333, flatShading: true })
    );
    wheel.position.x = x;
    wheel.position.z = 6;
    return wheel;
  }

  function createCar(initialTileIndex, direction, color) {
    const car = new THREE.Group();
    car.position.x = initialTileIndex * tileSize;
    if (!direction) car.rotation.z = Math.PI;

    const main = new THREE.Mesh(
      new THREE.BoxGeometry(60, 30, 15),
      new THREE.MeshLambertMaterial({ color, flatShading: true })
    );
    main.position.z = 12;
    main.castShadow = true;
    main.receiveShadow = true;
    car.add(main);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
      new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carBackTexture }),
      new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carFrontTexture }),
      new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carRightSideTexture }),
      new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carLeftSideTexture }),
      new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }),
      new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }),
    ]);
    cabin.position.x = -6;
    cabin.position.z = 25.5;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add(cabin);
    car.add(createWheel(18));
    car.add(createWheel(-18));

    return car;
  }

  function createTruck(initialTileIndex, direction, color) {
    const truck = new THREE.Group();
    truck.position.x = initialTileIndex * tileSize;
    if (!direction) truck.rotation.z = Math.PI;

    const cargo = new THREE.Mesh(
      new THREE.BoxGeometry(70, 35, 35),
      new THREE.MeshLambertMaterial({ color: 0xb4c6fc, flatShading: true })
    );
    cargo.position.x = -15;
    cargo.position.z = 25;
    cargo.castShadow = true;
    cargo.receiveShadow = true;
    truck.add(cargo);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), [
      new THREE.MeshLambertMaterial({ color, flatShading: true, map: truckFrontTexture }),
      new THREE.MeshLambertMaterial({ color, flatShading: true }),
      new THREE.MeshLambertMaterial({ color, flatShading: true, map: truckLeftSideTexture }),
      new THREE.MeshLambertMaterial({ color, flatShading: true, map: truckRightSideTexture }),
      new THREE.MeshPhongMaterial({ color, flatShading: true }),
      new THREE.MeshPhongMaterial({ color, flatShading: true }),
    ]);
    cabin.position.x = 35;
    cabin.position.z = 20;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    truck.add(cabin);

    truck.add(createWheel(37));
    truck.add(createWheel(5));
    truck.add(createWheel(-35));

    return truck;
  }

  function createGrass(rowIndex) {
    const grass = new THREE.Group();
    grass.position.y = rowIndex * tileSize;

    const createSection = (color) => new THREE.Mesh(
      new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3),
      new THREE.MeshLambertMaterial({ color })
    );

    const middle = createSection(0xbaf455);
    middle.receiveShadow = true;
    grass.add(middle);

    const left = createSection(0x99c846);
    left.position.x = -tilesPerRow * tileSize;
    grass.add(left);

    const right = createSection(0x99c846);
    right.position.x = tilesPerRow * tileSize;
    grass.add(right);

    return grass;
  }

  function createRoad(rowIndex) {
    const road = new THREE.Group();
    road.position.y = rowIndex * tileSize;

    const createSection = (color) => new THREE.Mesh(
      new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
      new THREE.MeshLambertMaterial({ color })
    );

    const middle = createSection(0x454a59);
    middle.receiveShadow = true;
    road.add(middle);

    const left = createSection(0x393d49);
    left.position.x = -tilesPerRow * tileSize;
    road.add(left);

    const right = createSection(0x393d49);
    right.position.x = tilesPerRow * tileSize;
    road.add(right);

    return road;
  }

  function createTree(tileIndex, height) {
    const tree = new THREE.Group();
    tree.position.x = tileIndex * tileSize;

    const trunk = new THREE.Mesh(
      new THREE.BoxGeometry(15, 15, 20),
      new THREE.MeshLambertMaterial({ color: 0x4d2926, flatShading: true })
    );
    trunk.position.z = 10;
    tree.add(trunk);

    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(30, 30, height),
      new THREE.MeshLambertMaterial({ color: 0x7aa21d, flatShading: true })
    );
    crown.position.z = height / 2 + 20;
    crown.castShadow = true;
    crown.receiveShadow = true;
    tree.add(crown);

    return tree;
  }

  function createPlayer() {
    const playerGroup = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(15, 15, 20),
      new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true })
    );
    body.position.z = 10;
    body.castShadow = true;
    body.receiveShadow = true;
    playerGroup.add(body);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(2, 4, 2),
      new THREE.MeshLambertMaterial({ color: 0xf0619a, flatShading: true })
    );
    cap.position.z = 21;
    cap.castShadow = true;
    cap.receiveShadow = true;
    playerGroup.add(cap);

    const playerContainer = new THREE.Group();
    playerContainer.add(playerGroup);
    return playerContainer;
  }

  function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function generateForestMetadata() {
    const occupiedTiles = new Set();
    const trees = Array.from({ length: 4 }, () => {
      let tileIndex;
      do {
        tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
      } while (occupiedTiles.has(tileIndex));
      occupiedTiles.add(tileIndex);
      return { tileIndex, height: randomElement([20, 45, 60]) };
    });

    return { type: 'forest', trees };
  }

  function generateCarLaneMetadata() {
    const direction = randomElement([true, false]);
    const speed = randomElement([125, 156, 188]);
    const occupiedTiles = new Set();

    const vehicles = Array.from({ length: 3 }, () => {
      let initialTileIndex;
      do {
        initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
      } while (occupiedTiles.has(initialTileIndex));

      occupiedTiles.add(initialTileIndex - 1);
      occupiedTiles.add(initialTileIndex);
      occupiedTiles.add(initialTileIndex + 1);

      return { initialTileIndex, color: randomElement([0xa52523, 0xbdb638, 0x78b14b]) };
    });

    return { type: 'car', direction, speed, vehicles };
  }

  function generateTruckLaneMetadata() {
    const direction = randomElement([true, false]);
    const speed = randomElement([125, 156, 188]);
    const occupiedTiles = new Set();

    const vehicles = Array.from({ length: 2 }, () => {
      let initialTileIndex;
      do {
        initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
      } while (occupiedTiles.has(initialTileIndex));

      occupiedTiles.add(initialTileIndex - 2);
      occupiedTiles.add(initialTileIndex - 1);
      occupiedTiles.add(initialTileIndex);
      occupiedTiles.add(initialTileIndex + 1);
      occupiedTiles.add(initialTileIndex + 2);

      return { initialTileIndex, color: randomElement([0xa52523, 0xbdb638, 0x78b14b]) };
    });

    return { type: 'truck', direction, speed, vehicles };
  }

  function generateRow() {
    const type = randomElement(['car', 'truck', 'forest']);
    if (type === 'car') return generateCarLaneMetadata();
    if (type === 'truck') return generateTruckLaneMetadata();
    return generateForestMetadata();
  }

  function generateRows(amount) {
    return Array.from({ length: amount }, () => generateRow());
  }

  function addRows() {
    const newMetadata = generateRows(20);
    const startIndex = gameState.metadata.length;
    gameState.metadata.push(...newMetadata);

    newMetadata.forEach((rowData, index) => {
      const rowIndex = startIndex + index + 1;

      if (rowData.type === 'forest') {
        const row = createGrass(rowIndex);
        rowData.trees.forEach(({ tileIndex, height }) => row.add(createTree(tileIndex, height)));
        map.add(row);
      }

      if (rowData.type === 'car') {
        const row = createRoad(rowIndex);
        rowData.vehicles.forEach((vehicle) => {
          const car = createCar(vehicle.initialTileIndex, rowData.direction, vehicle.color);
          vehicle.ref = car;
          row.add(car);
        });
        map.add(row);
      }

      if (rowData.type === 'truck') {
        const row = createRoad(rowIndex);
        rowData.vehicles.forEach((vehicle) => {
          const truck = createTruck(vehicle.initialTileIndex, rowData.direction, vehicle.color);
          vehicle.ref = truck;
          row.add(truck);
        });
        map.add(row);
      }
    });
  }

  function initializeMap() {
    gameState.metadata.length = 0;
    map.remove(...map.children);

    for (let rowIndex = 0; rowIndex > -10; rowIndex -= 1) {
      map.add(createGrass(rowIndex));
    }

    addRows();
  }

  function initializePlayer() {
    player.position.x = 0;
    player.position.y = 0;
    player.children[0].position.z = 0;
    player.children[0].rotation.z = 0;

    gameState.position.currentRow = 0;
    gameState.position.currentTile = 0;
    gameState.movesQueue.length = 0;
  }

  function updateScore() {
    scoreDOM.innerText = gameState.position.currentRow.toString();
  }

  function calculateFinalPosition(currentPosition, moves) {
    return moves.reduce((position, direction) => {
      if (direction === 'forward') return { rowIndex: position.rowIndex + 1, tileIndex: position.tileIndex };
      if (direction === 'backward') return { rowIndex: position.rowIndex - 1, tileIndex: position.tileIndex };
      if (direction === 'left') return { rowIndex: position.rowIndex, tileIndex: position.tileIndex - 1 };
      if (direction === 'right') return { rowIndex: position.rowIndex, tileIndex: position.tileIndex + 1 };
      return position;
    }, currentPosition);
  }

  function endsUpInValidPosition(currentPosition, moves) {
    const finalPosition = calculateFinalPosition(currentPosition, moves);

    if (
      finalPosition.rowIndex === -1 ||
      finalPosition.tileIndex === minTileIndex - 1 ||
      finalPosition.tileIndex === maxTileIndex + 1
    ) {
      return false;
    }

    const finalRow = gameState.metadata[finalPosition.rowIndex - 1];
    if (
      finalRow &&
      finalRow.type === 'forest' &&
      finalRow.trees.some((tree) => tree.tileIndex === finalPosition.tileIndex)
    ) {
      return false;
    }

    return true;
  }

  function queueMove(direction) {
    if (gameState.gameOver) return;

    const isValidMove = endsUpInValidPosition(
      {
        rowIndex: gameState.position.currentRow,
        tileIndex: gameState.position.currentTile,
      },
      [...gameState.movesQueue, direction]
    );

    if (!isValidMove) return;
    gameState.movesQueue.push(direction);
  }

  function stepCompleted() {
    const direction = gameState.movesQueue.shift();

    if (direction === 'forward') gameState.position.currentRow += 1;
    if (direction === 'backward') gameState.position.currentRow -= 1;
    if (direction === 'left') gameState.position.currentTile -= 1;
    if (direction === 'right') gameState.position.currentTile += 1;

    if (gameState.position.currentRow > gameState.metadata.length - 10) addRows();
    updateScore();
  }

  function setPlayerPosition(progress) {
    const startX = gameState.position.currentTile * tileSize;
    const startY = gameState.position.currentRow * tileSize;
    let endX = startX;
    let endY = startY;

    if (gameState.movesQueue[0] === 'left') endX -= tileSize;
    if (gameState.movesQueue[0] === 'right') endX += tileSize;
    if (gameState.movesQueue[0] === 'forward') endY += tileSize;
    if (gameState.movesQueue[0] === 'backward') endY -= tileSize;

    player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
    player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
    player.children[0].position.z = Math.sin(progress * Math.PI) * 8;
  }

  function setPlayerRotation(progress) {
    let endRotation = 0;
    if (gameState.movesQueue[0] === 'left') endRotation = Math.PI / 2;
    if (gameState.movesQueue[0] === 'right') endRotation = -Math.PI / 2;
    if (gameState.movesQueue[0] === 'backward') endRotation = Math.PI;

    player.children[0].rotation.z = THREE.MathUtils.lerp(
      player.children[0].rotation.z,
      endRotation,
      progress
    );
  }

  function animatePlayer() {
    if (!gameState.movesQueue.length) return;
    if (!moveClock.running) moveClock.start();

    const stepTime = 0.2;
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);
    setPlayerPosition(progress);
    setPlayerRotation(progress);

    if (progress >= 1) {
      stepCompleted();
      moveClock.stop();
    }
  }

  function animateVehicles() {
    const delta = vehicleClock.getDelta();

    gameState.metadata.forEach((rowData) => {
      if (rowData.type !== 'car' && rowData.type !== 'truck') return;

      const beginningOfRow = (minTileIndex - 2) * tileSize;
      const endOfRow = (maxTileIndex + 2) * tileSize;

      rowData.vehicles.forEach(({ ref }) => {
        if (!ref) return;

        if (rowData.direction) {
          ref.position.x = ref.position.x > endOfRow ? beginningOfRow : ref.position.x + rowData.speed * delta;
        } else {
          ref.position.x = ref.position.x < beginningOfRow ? endOfRow : ref.position.x - rowData.speed * delta;
        }
      });
    });
  }

  function finishGame() {
    if (gameState.gameOver) return;
    gameState.gameOver = true;
    finalScoreDOM.innerText = gameState.position.currentRow.toString();
    resultDOM.classList.add('show');
  }

  function hitTest() {
    if (gameState.gameOver) return;

    const row = gameState.metadata[gameState.position.currentRow - 1];
    if (!row || (row.type !== 'car' && row.type !== 'truck')) return;

    const playerBoundingBox = new THREE.Box3().setFromObject(player);

    row.vehicles.forEach(({ ref }) => {
      if (!ref) return;
      const vehicleBoundingBox = new THREE.Box3().setFromObject(ref);
      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        finishGame();
      }
    });
  }

  function initializeGame() {
    gameState.gameOver = false;
    initializePlayer();
    initializeMap();
    updateScore();
    resultDOM.classList.remove('show');
    vehicleClock.start();
  }

  function animateGame() {
    animateVehicles();
    animatePlayer();
    hitTest();
    renderer.render(scene, camera);
  }

  document.getElementById('lume-game-forward')?.addEventListener('click', () => queueMove('forward'));
  document.getElementById('lume-game-backward')?.addEventListener('click', () => queueMove('backward'));
  document.getElementById('lume-game-left')?.addEventListener('click', () => queueMove('left'));
  document.getElementById('lume-game-right')?.addEventListener('click', () => queueMove('right'));

  retryButton.addEventListener('click', initializeGame);

  window.addEventListener('keydown', (event) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      queueMove('forward');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      queueMove('backward');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      queueMove('left');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      queueMove('right');
    }
  }, { passive: false });

  window.addEventListener('resize', updateCameraProjection);
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(updateCameraProjection);
    resizeObserver.observe(shell);
  }

  updateCameraProjection();
  initializeGame();
  renderer.setAnimationLoop(animateGame);
}

initLumeGame();
