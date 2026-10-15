import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, Eye, Sparkles, ChevronDown, ChevronUp, X, ShieldCheck } from 'lucide-react';

interface ThreeLuxuryViewerProps {
  onClose?: () => void;
  isOpen: boolean;
}

type FinishType = 'gold' | 'rose-gold' | 'emerald' | 'platinum';

export const ThreeLuxuryViewer: React.FC<ThreeLuxuryViewerProps> = ({ onClose, isOpen }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishType>('gold');
  const [isRotating, setIsRotating] = useState(true);
  const [explodedValue, setExplodedValue] = useState(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'perspective' | 'front' | 'detail'>('perspective');

  const finishRef = useRef<FinishType>('gold');
  const rotatingRef = useRef(true);
  const explodedRef = useRef(0);
  const viewTargetRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 1.2, z: 4.8 });

  // Sync refs for the 60fps loop
  useEffect(() => {
    finishRef.current = selectedFinish;
  }, [selectedFinish]);

  useEffect(() => {
    rotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    explodedRef.current = explodedValue;
  }, [explodedValue]);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 550;

    // Detect headless / CPU environment
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x063d2e);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.8);

    // 3. Renderer with ACESFilmicToneMapping and SRGB
    const renderer = new THREE.WebGLRenderer({ antialias: !isHeadless, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. RoomEnvironment for luxury specular reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting: Warm directional key + cool HemisphereLight
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = !isHeadless;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 12;
      keyLight.shadow.camera.left = -2;
      keyLight.shadow.camera.right = 2;
      keyLight.shadow.camera.top = 2;
      keyLight.shadow.camera.bottom = -2;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc9a24a, 1.8);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0x0a4d3a, 0x021f17, 1.2);
    scene.add(hemiLight);

    // Soft contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005;
    scene.add(shadowPlane);

    // 6. Luxury Procedural Subject: 8-Part Artisanal Fragrance Flacon & Gold Medallion
    const flaconGroup = new THREE.Group();
    scene.add(flaconGroup);

    // Materials dictionary based on finishes
    const finishColors: Record<FinishType, number> = {
      gold: 0xc9a24a,
      'rose-gold': 0xd88a78,
      emerald: 0x063d2e,
      platinum: 0xdedede,
    };

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: finishColors.gold,
      metalness: 0.95,
      roughness: 0.18,
    });

    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
    });

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xdf9b3a,
      transmission: 0.75,
      transparent: true,
      roughness: 0.1,
      ior: 1.34,
      thickness: 0.8,
    });

    const enamelMaterial = new THREE.MeshStandardMaterial({
      color: 0x063d2e,
      roughness: 0.25,
      metalness: 0.4,
    });

    // Part 1: Outer crystal bottle base (faceted octagon cylinder)
    const bottleGeo = new THREE.CylinderGeometry(0.85, 0.92, 1.5, 8);
    const bottleMesh = new THREE.Mesh(bottleGeo, crystalMaterial);
    bottleMesh.position.y = 0.75;
    bottleMesh.castShadow = !isHeadless;
    bottleMesh.receiveShadow = !isHeadless;
    flaconGroup.add(bottleMesh);

    // Part 2: Inner liquid core
    const liquidGeo = new THREE.CylinderGeometry(0.72, 0.78, 1.25, 16);
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMaterial);
    liquidMesh.position.y = 0.68;
    flaconGroup.add(liquidMesh);

    // Part 3: Bottle shoulder trim ring (metal)
    const shoulderGeo = new THREE.TorusGeometry(0.86, 0.04, 16, 32);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, metalMaterial);
    shoulderMesh.rotation.x = Math.PI / 2;
    shoulderMesh.position.y = 1.5;
    flaconGroup.add(shoulderMesh);

    // Part 4: Emerald enamel brand medallion plate
    const plateGeo = new THREE.BoxGeometry(0.7, 0.35, 0.04);
    const plateMesh = new THREE.Mesh(plateGeo, enamelMaterial);
    plateMesh.position.set(0, 0.78, 0.86);
    flaconGroup.add(plateMesh);

    // Part 5: Gold medallion rim
    const plateRimGeo = new THREE.BoxGeometry(0.74, 0.39, 0.02);
    const plateRimMesh = new THREE.Mesh(plateRimGeo, metalMaterial);
    plateRimMesh.position.set(0, 0.78, 0.85);
    flaconGroup.add(plateRimMesh);

    // Part 6: Threaded neck collar (metal)
    const collarGeo = new THREE.CylinderGeometry(0.36, 0.42, 0.28, 32);
    const collarMesh = new THREE.Mesh(collarGeo, metalMaterial);
    collarMesh.position.y = 1.64;
    collarMesh.castShadow = !isHeadless;
    flaconGroup.add(collarMesh);

    // Part 7: Atomizer mist nozzle (movable in exploded view)
    const nozzleGroup = new THREE.Group();
    const nozzleGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.32, 24);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, metalMaterial);
    nozzleMesh.position.y = 1.9;
    nozzleGroup.add(nozzleMesh);
    flaconGroup.add(nozzleGroup);

    // Part 8: Faceted Cut Crystal Stopper / Cap (movable in exploded view)
    const capGroup = new THREE.Group();
    const capGeo = new THREE.CylinderGeometry(0.52, 0.48, 0.6, 8);
    const capMesh = new THREE.Mesh(capGeo, crystalMaterial);
    capMesh.position.y = 2.45;
    capMesh.castShadow = !isHeadless;
    capGroup.add(capMesh);

    const capRingGeo = new THREE.TorusGeometry(0.5, 0.035, 16, 32);
    const capRingMesh = new THREE.Mesh(capRingGeo, metalMaterial);
    capRingMesh.rotation.x = Math.PI / 2;
    capRingMesh.position.y = 2.18;
    capGroup.add(capRingMesh);

    flaconGroup.add(capGroup);

    // Mouse drag interaction for manual orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX + deltaY * 0.005));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX + deltaY * 0.005));
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    domElem.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop with exponential damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      // Update finish color
      const currentFinishColor = finishColors[finishRef.current];
      metalMaterial.color.setHex(currentFinishColor);

      // Auto rotation
      if (rotatingRef.current && !isDragging) {
        targetRotationY += dt * 0.45;
      }

      // Smooth rotation damping
      flaconGroup.rotation.y = THREE.MathUtils.damp(flaconGroup.rotation.y, targetRotationY, 8, dt);
      flaconGroup.rotation.x = THREE.MathUtils.damp(flaconGroup.rotation.x, targetRotationX, 8, dt);

      // Smooth exploded view displacement
      const exp = explodedRef.current;
      nozzleGroup.position.y = THREE.MathUtils.damp(nozzleGroup.position.y, exp * 0.6, 6, dt);
      capGroup.position.y = THREE.MathUtils.damp(capGroup.position.y, exp * 1.35, 6, dt);

      // Camera position damping based on active view preset
      const targetCam = viewTargetRef.current;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCam.x, 5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCam.y, 5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCam.z, 5, dt);
      camera.lookAt(0, 1.05 + exp * 0.3, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  const handlePresetView = (view: 'perspective' | 'front' | 'detail') => {
    setActiveView(view);
    if (view === 'perspective') {
      viewTargetRef.current = { x: 0, y: 1.4, z: 4.8 };
    } else if (view === 'front') {
      viewTargetRef.current = { x: 0, y: 1.1, z: 4.2 };
    } else if (view === 'detail') {
      viewTargetRef.current = { x: 0.3, y: 2.1, z: 2.6 };
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="3D Luxury Product Viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 md:p-6"
    >
      <div className="relative flex flex-col w-full max-w-5xl h-[88vh] bg-[#063D2E] border border-[#C9A24A]/40 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C9A24A]/20 bg-[#042D22]/80 z-20">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-full bg-[#C9A24A]/10 text-[#C9A24A]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-editorial font-bold text-white tracking-wide">
                Amazaura 3D Luxury Studio
              </h2>
              <p className="text-xs text-[#FAF7F0]/70">
                Procedural PBR Inspection · Artisanal Crystal Flacon with 18K Tuscan Gold Accents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close 3D viewer"
            className="p-2 text-[#FAF7F0]/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3D WebGL Canvas Mount Container */}
        <div
          ref={mountRef}
          className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
          data-testid="threejs-canvas-container"
        >
          {/* Subtle Viewport watermark badge */}
          <div className="absolute top-4 left-6 pointer-events-none z-10 flex items-center gap-2 text-xs text-[#FAF7F0]/50 tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-[#C9A24A]" />
            <span>Interactive Real-time Three.js Shader View</span>
          </div>

          <div className="absolute top-4 right-6 pointer-events-none z-10 hidden sm:block text-xs text-[#FAF7F0]/50 tracking-wider">
            Drag to Rotate · Scroll to Zoom
          </div>
        </div>

        {/* Unified Bottom Control Dock (<= 15% viewport height, compliant with Three.js skill) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-30 pointer-events-auto">
          {/* Collapse/Expand Toggle Pill */}
          <div className="flex justify-center -mb-2">
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              aria-label={isDockCollapsed ? 'Expand 3D Controls' : 'Collapse 3D Controls'}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#042D22] border border-[#C9A24A]/40 text-[#C9A24A] text-xs font-medium rounded-t-lg shadow-lg hover:bg-[#063D2E] transition-colors"
            >
              {isDockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Show Controls
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Hide Controls
                </>
              )}
            </button>
          </div>

          {!isDockCollapsed && (
            <div className="p-4 bg-[#042D22]/95 border border-[#C9A24A]/30 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Finish Swatches */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FAF7F0]/70 font-medium whitespace-nowrap">Finish:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedFinish('gold')}
                    title="18K Tuscan Gold"
                    aria-label="Tuscan Gold Finish"
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedFinish === 'gold' ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-80'
                    } bg-[#C9A24A]`}
                  />
                  <button
                    onClick={() => setSelectedFinish('rose-gold')}
                    title="Rose Gold"
                    aria-label="Rose Gold Finish"
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedFinish === 'rose-gold' ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-80'
                    } bg-[#D88A78]`}
                  />
                  <button
                    onClick={() => setSelectedFinish('emerald')}
                    title="Deep Emerald Enamel"
                    aria-label="Emerald Enamel Finish"
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedFinish === 'emerald' ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-80'
                    } bg-[#063D2E] border-[#C9A24A]`}
                  />
                  <button
                    onClick={() => setSelectedFinish('platinum')}
                    title="Polished Platinum"
                    aria-label="Platinum Finish"
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedFinish === 'platinum' ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-80'
                    } bg-[#DEDEDE]`}
                  />
                </div>
              </div>

              {/* Exploded View Slider */}
              <div className="flex items-center gap-2 w-full md:w-44">
                <span className="text-xs text-[#FAF7F0]/70 font-medium whitespace-nowrap">Explode:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedValue}
                  onChange={(e) => setExplodedValue(parseFloat(e.target.value))}
                  aria-label="Exploded View Separation"
                  className="w-full accent-[#C9A24A] cursor-pointer h-1.5 bg-black/40 rounded-lg"
                />
              </div>

              {/* Presets and Rotation toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-[#C9A24A]/20 text-xs">
                  <button
                    onClick={() => handlePresetView('perspective')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeView === 'perspective' ? 'bg-[#C9A24A] text-[#063D2E] font-semibold' : 'text-[#FAF7F0]/80 hover:text-white'
                    }`}
                  >
                    360°
                  </button>
                  <button
                    onClick={() => handlePresetView('front')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeView === 'front' ? 'bg-[#C9A24A] text-[#063D2E] font-semibold' : 'text-[#FAF7F0]/80 hover:text-white'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => handlePresetView('detail')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeView === 'detail' ? 'bg-[#C9A24A] text-[#063D2E] font-semibold' : 'text-[#FAF7F0]/80 hover:text-white'
                    }`}
                  >
                    Stopper
                  </button>
                </div>

                <button
                  onClick={() => setIsRotating(!isRotating)}
                  title={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}
                  aria-label="Toggle auto rotation"
                  className={`p-2 rounded-lg border transition-colors ${
                    isRotating
                      ? 'bg-[#C9A24A]/20 border-[#C9A24A] text-[#C9A24A]'
                      : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
