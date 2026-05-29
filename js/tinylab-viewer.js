import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MODEL_URL = 'images/tinylab-model.glb';
const HIGHLIGHT_COLOR = new THREE.Color(0x146ca6);
const VIEWER_BASE_COLOR = 0x5c636b;
const VIEWER_ROUGHNESS = 0.32;
const VIEWER_METALNESS = 0.18;

function applyViewerMaterial(material) {
  if (!material) return;
  if (material.color) material.color.setHex(VIEWER_BASE_COLOR);
  if ('roughness' in material) material.roughness = VIEWER_ROUGHNESS;
  if ('metalness' in material) material.metalness = VIEWER_METALNESS;
  material.side = THREE.DoubleSide;
}

function setupViewerLights(targetScene) {
  targetScene.add(new THREE.AmbientLight(0xffffff, 0.28));

  const hemi = new THREE.HemisphereLight(0xffffff, 0x9aa3ad, 0.5);
  targetScene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(5, 9, 7);
  targetScene.add(key);

  const fill = new THREE.DirectionalLight(0xf0f4f8, 0.42);
  fill.position.set(-6, 4, 4);
  targetScene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 0.72);
  rim.position.set(-1, 5, -7);
  targetScene.add(rim);
}

const MODULES = {
  'flow-cell': { name: 'Flow Cell Module', file: 'images/flow-cell-module.glb' },
  'microgc':   { name: 'MicroGC Module', file: 'images/microgc-module.glb' },
  'microreactor': { name: 'Microreactor Module', file: 'images/microreactor-module.glb' },
  'ptv': { name: 'PTV Module', file: 'images/ptv-module.glb' }
};

// Part index → module slug (extracted from CAD comparison)
const PART_TO_MODULE = {"270":"microgc","271":"microgc","272":"microgc","273":"microgc","274":"microgc","275":"microgc","276":"microgc","277":"microgc","278":"microgc","279":"microgc","280":"microgc","281":"microgc","282":"microgc","283":"microgc","284":"microgc","285":"microgc","286":"microgc","287":"microgc","288":"microgc","289":"microgc","290":"microgc","291":"microgc","292":"microgc","293":"microgc","294":"microgc","295":"microgc","296":"microgc","297":"microgc","298":"microgc","299":"microgc","300":"microgc","301":"microgc","302":"microgc","303":"microgc","304":"microgc","305":"microgc","306":"microgc","307":"microgc","308":"microgc","309":"microgc","310":"microgc","311":"microgc","312":"microgc","313":"microgc","314":"microgc","315":"microgc","316":"microgc","317":"microgc","318":"microgc","319":"microgc","320":"microgc","321":"microgc","322":"microgc","323":"microgc","324":"microgc","325":"microgc","326":"microgc","327":"microgc","328":"microgc","329":"microgc","330":"microgc","331":"microgc","332":"microgc","131":"microreactor","132":"microreactor","133":"microreactor","134":"microreactor","135":"microreactor","136":"microreactor","137":"microreactor","138":"microreactor","139":"microreactor","140":"microreactor","141":"microreactor","142":"microreactor","143":"microreactor","144":"microreactor","145":"microreactor","146":"microreactor","147":"microreactor","148":"microreactor","149":"microreactor","150":"microreactor","151":"microreactor","152":"microreactor","153":"microreactor","154":"microreactor","155":"microreactor","156":"microreactor","157":"microreactor","158":"microreactor","159":"microreactor","160":"microreactor","161":"microreactor","162":"microreactor","163":"microreactor","164":"microreactor","165":"microreactor","166":"microreactor","167":"microreactor","168":"microreactor","169":"microreactor","170":"microreactor","171":"microreactor","172":"microreactor","173":"microreactor","174":"microreactor","175":"microreactor","176":"microreactor","177":"microreactor","178":"microreactor","179":"microreactor","180":"microreactor","181":"microreactor","182":"microreactor","183":"microreactor","184":"microreactor","185":"microreactor","186":"microreactor","187":"microreactor","188":"microreactor","189":"microreactor","190":"microreactor","191":"microreactor","192":"microreactor","193":"microreactor","194":"microreactor","195":"microreactor","196":"microreactor","197":"microreactor","198":"microreactor","199":"microreactor","200":"microreactor","201":"microreactor","202":"microreactor","203":"microreactor","204":"microreactor","205":"microreactor","206":"microreactor","207":"microreactor","208":"microreactor","209":"microreactor","210":"microreactor","211":"microreactor","212":"microreactor","213":"microreactor","214":"microreactor","215":"microreactor","216":"microreactor","217":"microreactor","218":"microreactor","219":"microreactor","220":"microreactor","221":"microreactor","222":"microreactor","223":"microreactor","224":"microreactor","225":"microreactor","226":"microreactor","227":"microreactor","228":"microreactor","229":"microreactor","230":"microreactor","231":"microreactor","232":"microreactor","233":"microreactor","234":"microreactor","235":"microreactor","236":"microreactor","237":"microreactor","238":"microreactor","239":"microreactor","240":"microreactor","241":"ptv","242":"ptv","243":"ptv","244":"ptv","245":"ptv","246":"ptv","247":"ptv","248":"ptv","249":"ptv","250":"ptv","251":"ptv","252":"ptv","253":"ptv","254":"ptv","255":"ptv","256":"ptv","257":"ptv","258":"ptv","259":"ptv","260":"ptv","261":"ptv","262":"ptv","263":"ptv","264":"ptv","265":"ptv","266":"ptv","267":"ptv","268":"ptv","269":"ptv","0":"flow-cell","1":"flow-cell","2":"flow-cell","3":"flow-cell","4":"flow-cell","5":"flow-cell","29":"flow-cell","30":"flow-cell","31":"flow-cell","32":"flow-cell","33":"flow-cell","34":"flow-cell","35":"flow-cell","36":"flow-cell","37":"flow-cell","38":"flow-cell","39":"flow-cell","40":"flow-cell","41":"flow-cell","42":"flow-cell","43":"flow-cell","44":"flow-cell","45":"flow-cell","46":"flow-cell","47":"flow-cell","48":"flow-cell","49":"flow-cell","50":"flow-cell","51":"flow-cell","52":"flow-cell","53":"flow-cell","54":"flow-cell","55":"flow-cell","56":"flow-cell","57":"flow-cell","58":"flow-cell","59":"flow-cell","60":"flow-cell","67":"flow-cell","68":"flow-cell","70":"flow-cell","73":"flow-cell","75":"flow-cell","76":"flow-cell","77":"flow-cell","78":"flow-cell","83":"flow-cell","84":"flow-cell","85":"flow-cell","86":"flow-cell","87":"flow-cell","88":"flow-cell","89":"flow-cell","90":"flow-cell","91":"flow-cell","101":"flow-cell","102":"flow-cell","103":"flow-cell","104":"flow-cell","105":"flow-cell","106":"flow-cell","107":"flow-cell","108":"flow-cell","109":"flow-cell","110":"flow-cell","111":"flow-cell","112":"flow-cell","113":"flow-cell","114":"flow-cell","115":"flow-cell"};

const container = document.getElementById('viewer-container');
const canvas = document.getElementById('viewer-canvas');
const placeholder = document.getElementById('viewer-placeholder');
const partHud = document.getElementById('part-hud');
const partNameEl = document.getElementById('part-name');
const backBtn = document.getElementById('backBtn');
const specPanel = document.getElementById('viewer-spec-panel');
const specHint = specPanel?.querySelector('.viewer-spec-panel__hint');
const specModules = specPanel ? specPanel.querySelectorAll('.viewer-spec-panel__module') : [];

function showSpecPanel(key) {
  if (!specPanel) return;
  specModules.forEach((el) => {
    el.hidden = el.dataset.module !== key;
  });
  if (specHint) specHint.hidden = true;
  specPanel.classList.add('viewer-spec-panel--active');
}

function hideSpecPanel() {
  if (!specPanel) return;
  specModules.forEach((el) => { el.hidden = true; });
  if (specHint) specHint.hidden = false;
  specPanel.classList.remove('viewer-spec-panel--active');
}

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.65;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Scene — transparent canvas so CSS stage gradient shows through
const scene = new THREE.Scene();
scene.background = null;
renderer.setClearColor(0x000000, 0);
const env = new THREE.PMREMGenerator(renderer);
scene.environment = env.fromScene(new RoomEnvironment(), 0.1).texture;
setupViewerLights(scene);

// Camera
const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
camera.position.set(0, 0.5, 2);

// Controls — CAD-style: orbit a fixed pivot, no drifting pan
const controls = new OrbitControls(camera, canvas);
const orbitPivot = new THREE.Vector3();
let pivotLocked = true;

function setOrbitPivot(center) {
  orbitPivot.copy(center);
  controls.target.copy(orbitPivot);
}

controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minDistance = 0.005;
controls.maxDistance = 5000;
controls.zoomSpeed = 1.2;
controls.rotateSpeed = 0.85;
controls.screenSpacePanning = false;
controls.enablePan = false;
controls.minPolarAngle = 0.2;
controls.maxPolarAngle = Math.PI - 0.2;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.DOLLY
};
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY
};

controls.addEventListener('change', () => {
  if (!pivotLocked) return;
  if (controls.target.distanceTo(orbitPivot) < 1e-4) return;
  const offset = camera.position.clone().sub(controls.target);
  controls.target.copy(orbitPivot);
  camera.position.copy(orbitPivot).add(offset);
});

const pivotAxes = new THREE.AxesHelper(1);
pivotAxes.matrixAutoUpdate = false;
scene.add(pivotAxes);

function updatePivotAxes(size) {
  const s = Math.max(size * 0.22, 0.08);
  pivotAxes.scale.set(s, s, s);
  pivotAxes.position.copy(orbitPivot);
  pivotAxes.updateMatrix();
}

controls.addEventListener('start', () => {
  canvas.style.cursor = 'grabbing';
});
controls.addEventListener('end', () => {
  canvas.style.cursor = hoveredModule ? 'pointer' : 'grab';
});
canvas.style.cursor = 'grab';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let allMeshes = [];
let moduleGroups = { 'flow-cell': [], 'microgc': [], 'microreactor': [], 'ptv': [], 'other': [] };
let originalMaterials = new Map();
let hoveredModule = null;
let activeModule = null;
let mouseDown = new THREE.Vector2();
const DRAG_THRESHOLD = 4;

let initialCamPos = new THREE.Vector3();
let initialCamTarget = new THREE.Vector3();
let viewerModelSize = 1;
let floorGrid = null;

function disposeGrid(grid) {
  grid.geometry.dispose();
  const mats = Array.isArray(grid.material) ? grid.material : [grid.material];
  mats.forEach((m) => m.dispose());
}

function setViewerFloor(box) {
  if (floorGrid) {
    scene.remove(floorGrid);
    disposeGrid(floorGrid);
    floorGrid = null;
  }
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const span = Math.max(size.x, size.z) * 2.2;
  const divisions = Math.min(32, Math.max(16, Math.round(span * 4)));
  floorGrid = new THREE.GridHelper(span, divisions, 0xa8b0ba, 0xc8ced6);
  floorGrid.position.set(center.x, box.min.y - 0.002, center.z);
  const mats = Array.isArray(floorGrid.material) ? floorGrid.material : [floorGrid.material];
  mats.forEach((m) => {
    m.opacity = 0.55;
    m.transparent = true;
  });
  floorGrid.renderOrder = -1;
  scene.add(floorGrid);
}

// Animation
let camAnimation = null;

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

// Track mesh index using a counter (order of GLB nodes)
let meshIndexCounter = 0;

// Determine which module a mesh belongs to from the precomputed map
function assignModule(mesh, nodeIndex) {
  return PART_TO_MODULE[nodeIndex] || 'other';
}

// Load main model
const loader = new GLTFLoader();
loader.load(MODEL_URL, (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  mainModel = model;

  // Collect all meshes and assign to modules
  // Traverse in the same order as nodes were created
  let nodeIdx = 0;
  model.traverse((child) => {
    if (child.isMesh) {
      allMeshes.push(child);
      originalMaterials.set(child, child.material);
      child.material = child.material.clone();
      applyViewerMaterial(child.material);
      child.material.transparent = true;
      child.material.opacity = 1;
      const modKey = assignModule(child, nodeIdx);
      moduleGroups[modKey].push(child);
      child.userData.moduleKey = modKey;
      nodeIdx++;
    }
  });

  console.log('Module assignments:', Object.fromEntries(Object.entries(moduleGroups).map(([k,v]) => [k, v.length])));

  // Auto-fit camera
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const dist = maxDim * 1.8;
  camera.position.set(center.x + dist * 0.5, center.y + dist * 0.3, center.z + dist);
  viewerModelSize = maxDim;
  setOrbitPivot(center);
  controls.update();
  updatePivotAxes(viewerModelSize);
  setViewerFloor(box);

  initialCamPos.copy(camera.position);
  initialCamTarget.copy(orbitPivot);

  placeholder.style.display = 'none';
}, undefined, (err) => {
  placeholder.innerHTML = '<span style="color:var(--text-3)">Place your <code style="background:var(--surface-2);padding:2px 6px;border-radius:4px;">tinylab-model.glb</code> file in the images folder</span>';
});

// Track main model and any loaded module model
let mainModel = null;
let activeModuleModel = null;

// Find which module a mesh belongs to
function findMeshModule(mesh) {
  return mesh.userData.moduleKey && mesh.userData.moduleKey !== 'other' ? mesh.userData.moduleKey : null;
}

// Highlight all meshes in a module
function highlightModule(modKey, color, intensity) {
  if (!modKey || !moduleGroups[modKey]) return;
  moduleGroups[modKey].forEach((m) => {
    m.material.emissive = color.clone();
    m.material.emissiveIntensity = intensity;
  });
}

function clearHighlight(modKey) {
  if (!modKey || !moduleGroups[modKey]) return;
  moduleGroups[modKey].forEach((m) => {
    m.material.emissive = new THREE.Color(0x000000);
    m.material.emissiveIntensity = 0;
  });
}

// Pointer events
canvas.addEventListener('pointermove', (e) => {
  if (activeModule) return; // No hover when zoomed in
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(allMeshes, false);

  const hitMod = hits.length > 0 ? findMeshModule(hits[0].object) : null;

  if (hitMod !== hoveredModule) {
    if (hoveredModule) clearHighlight(hoveredModule);
    hoveredModule = hitMod;
    if (hoveredModule) {
      highlightModule(hoveredModule, HIGHLIGHT_COLOR, 0.25);
      partNameEl.textContent = MODULES[hoveredModule].name;
      partHud.style.display = 'block';
      canvas.style.cursor = 'pointer';
    } else {
      partHud.style.display = 'none';
      canvas.style.cursor = 'grab';
    }
  }
});

canvas.addEventListener('pointerdown', (e) => mouseDown.set(e.clientX, e.clientY));

canvas.addEventListener('pointerup', (e) => {
  const dx = e.clientX - mouseDown.x;
  const dy = e.clientY - mouseDown.y;
  if (Math.sqrt(dx*dx + dy*dy) > DRAG_THRESHOLD) return;
  if (activeModule) return;

  if (hoveredModule) {
    enterModule(hoveredModule);
  }
});

// Smooth camera animation
function animateCamera(toPos, toTarget, duration) {
  if (camAnimation) camAnimation.cancel = true;

  const fromPos = camera.position.clone();
  const fromTarget = orbitPivot.clone();
  const start = performance.now();
  const anim = { cancel: false };
  camAnimation = anim;
  pivotLocked = false;

  function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }

  function step() {
    if (anim.cancel) return;
    const elapsed = performance.now() - start;
    const t = Math.min(elapsed / duration, 1);
    const e = easeInOutCubic(t);
    camera.position.lerpVectors(fromPos, toPos, e);
    controls.target.lerpVectors(fromTarget, toTarget, e);
    pivotAxes.position.copy(controls.target);
    pivotAxes.updateMatrix();
    controls.update();
    if (t < 1) requestAnimationFrame(step);
    else {
      camAnimation = null;
      setOrbitPivot(toTarget);
      pivotLocked = true;
      updatePivotAxes(viewerModelSize);
    }
  }
  step();
}

// Animate opacity of non-module meshes
function fadeOthers(activeKey, toOpacity, duration) {
  const startTime = performance.now();
  const others = [];
  for (const [key, meshes] of Object.entries(moduleGroups)) {
    if (key !== activeKey) {
      meshes.forEach(m => {
        const startOp = m.material.opacity !== undefined ? m.material.opacity : 1;
        others.push({ mesh: m, startOp });
        m.material.transparent = true;
      });
    }
  }

  function step() {
    const elapsed = performance.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    others.forEach(({ mesh, startOp }) => {
      mesh.material.opacity = startOp + (toOpacity - startOp) * t;
      mesh.material.depthWrite = mesh.material.opacity > 0.5;
    });
    if (t < 1) requestAnimationFrame(step);
    else if (toOpacity === 1) {
      others.forEach(({ mesh }) => { mesh.material.transparent = false; });
    }
  }
  step();
}

function enterModule(key) {
  activeModule = key;
  partHud.style.display = 'none';
  backBtn.style.display = 'block';
  showSpecPanel(key);

  // Show module title overlay
  const titleEl = document.getElementById('moduleTitle');
  if (titleEl) {
    titleEl.textContent = MODULES[key].name;
    titleEl.style.display = 'block';
  }

  // Clear highlight on the module (so it shows in normal material)
  clearHighlight(key);

  // Compute bbox of module meshes for camera target
  const box = new THREE.Box3();
  moduleGroups[key].forEach(m => box.expandByObject(m));
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // Fade out the entire main model
  const fadeMain = (toOp, dur) => {
    const start = performance.now();
    const items = allMeshes.map(m => ({ mesh: m, startOp: m.material.opacity ?? 1 }));
    items.forEach(it => { it.mesh.material.transparent = true; });
    function step() {
      const t = Math.min((performance.now() - start) / dur, 1);
      items.forEach(it => {
        it.mesh.material.opacity = it.startOp + (toOp - it.startOp) * t;
        it.mesh.visible = it.mesh.material.opacity > 0.01;
      });
      if (t < 1) requestAnimationFrame(step);
    }
    step();
  };

  fadeMain(0, 500);

  // Load the module GLB
  const moduleLoader = new GLTFLoader();
  moduleLoader.load(MODULES[key].file, (gltf) => {
    activeModuleModel = gltf.scene;

    // Compute module center for exploded view calculation
    const mbox = new THREE.Box3().setFromObject(activeModuleModel);
    const mcenter = mbox.getCenter(new THREE.Vector3());
    const msize = mbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(msize.x, msize.y, msize.z);

    // Step 1: Collect all meshes and their world centers first
    const tempMeshes = [];
    activeModuleModel.traverse(c => {
      if (c.isMesh) {
        c.material = c.material.clone();
        applyViewerMaterial(c.material);
        c.material.transparent = true;
        c.material.opacity = 0;
        
        const meshBox = new THREE.Box3().setFromObject(c);
        const meshCenter = meshBox.getCenter(new THREE.Vector3());
        
        tempMeshes.push({ 
          mesh: c, 
          center: meshCenter, 
          startPos: c.position.clone() 
        });
      }
    });

    const meshData = [];

    if (key === 'flow-cell') {
      // ----------------------------------------------------
      // RADIAL EXPLOSION (Flow Cell only)
      // ----------------------------------------------------
      tempMeshes.forEach(item => {
        const dir = new THREE.Vector3().subVectors(item.center, mcenter);
        if (dir.length() > 0.001) {
          dir.normalize();
        } else {
          dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        }
        const offset = dir.multiplyScalar(maxDim * 0.6);
        meshData.push({ mesh: item.mesh, startPos: item.startPos, offset: offset });
      });

    } else {
      // ----------------------------------------------------
      // EVENLY SPACED FRONT-TO-BACK EXPLOSION (Sorted by Z-axis)
      // ----------------------------------------------------
      // Sort parts based on their original depth (Z coordinate)
      tempMeshes.sort((a, b) => a.center.z - b.center.z);
      
      // Determine the total spread distance based on the module's size
      const totalSpread = maxDim * 4.5; 
      const gap = totalSpread / Math.max(1, tempMeshes.length - 1);
      const midIndex = (tempMeshes.length - 1) / 2;

      tempMeshes.forEach((item, index) => {
        // Calculate exactly where this part should end up in the line
        const targetZ = mcenter.z + (index - midIndex) * gap;
        
        // The offset is the difference between its starting position and target position
        const offset = new THREE.Vector3(0, 0, targetZ - item.center.z);
        
        meshData.push({ mesh: item.mesh, startPos: item.startPos, offset: offset });
      });
    }

    scene.add(activeModuleModel);
    setViewerFloor(mbox);

    // Camera target — account for the longer stretched assembly
    viewerModelSize = maxDim;
    const dist = maxDim * 3.2;
    const newPos = new THREE.Vector3(mcenter.x + dist * 0.5, mcenter.y + dist * 0.3, mcenter.z + dist);
    animateCamera(newPos, mcenter, 1000);

    // Animate explode + fade in
    const startTime = performance.now();
    const duration = 900;
    function explodeStep() {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // Ease out

      meshData.forEach(d => {
        d.mesh.position.copy(d.startPos).addScaledVector(d.offset, eased);
        d.mesh.material.opacity = Math.min(t * 1.5, 1);
      });

      if (t < 1) {
        requestAnimationFrame(explodeStep);
      } else {
        const expandedBox = new THREE.Box3().setFromObject(activeModuleModel);
        setViewerFloor(expandedBox);
      }
    }
    explodeStep();
  });
}

window.exitModule = function() {
  if (!activeModule) return;

  // Fade out module
  if (activeModuleModel) {
    const start = performance.now();
    const meshes = [];
    activeModuleModel.traverse(c => { if (c.isMesh) meshes.push(c); });
    function step() {
      const t = Math.min((performance.now() - start) / 400, 1);
      meshes.forEach(m => { m.material.opacity = 1 - t; });
      if (t < 1) requestAnimationFrame(step);
      else {
        scene.remove(activeModuleModel);
        activeModuleModel = null;
      }
    }
    step();
  }

  // Fade in main model
  const startFadeMain = performance.now();
  allMeshes.forEach(m => { m.visible = true; });
  function fadeMainIn() {
    const t = Math.min((performance.now() - startFadeMain) / 500, 1);
    allMeshes.forEach(m => { m.material.opacity = t; });
    if (t < 1) requestAnimationFrame(fadeMainIn);
    else allMeshes.forEach(m => { m.material.transparent = false; });
  }
  setTimeout(fadeMainIn, 300);

  if (mainModel) {
    const box = new THREE.Box3().setFromObject(mainModel);
    setViewerFloor(box);
  }
  animateCamera(initialCamPos, initialCamTarget, 900);
  activeModule = null;
  backBtn.style.display = 'none';
  hideSpecPanel();
  const titleEl = document.getElementById('moduleTitle');
  if (titleEl) titleEl.style.display = 'none';
};

window.zoomIn = function() {
  const dir = new THREE.Vector3().subVectors(camera.position, orbitPivot).normalize();
  const dist = camera.position.distanceTo(orbitPivot);
  const newDist = Math.max(dist * 0.7, controls.minDistance);
  const newPos = orbitPivot.clone().add(dir.multiplyScalar(newDist));
  animateCamera(newPos, orbitPivot, 250);
};

window.zoomOut = function() {
  const dir = new THREE.Vector3().subVectors(camera.position, orbitPivot).normalize();
  const dist = camera.position.distanceTo(orbitPivot);
  const newDist = Math.min(dist * 1.4, controls.maxDistance);
  const newPos = orbitPivot.clone().add(dir.multiplyScalar(newDist));
  animateCamera(newPos, orbitPivot, 250);
};

// Render loop
function animate() {
  requestAnimationFrame(animate);
  if (pivotLocked) {
    pivotAxes.position.copy(orbitPivot);
    pivotAxes.updateMatrix();
  }
  controls.update();
  renderer.render(scene, camera);
}
resize();
animate();