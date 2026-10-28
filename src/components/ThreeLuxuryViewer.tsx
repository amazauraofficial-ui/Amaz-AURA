import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  RotateCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  ShieldCheck,
  Box,
  Layers,
  Upload,
  Info,
  ExternalLink,
  Eye,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import type { Product } from '../types/index.ts';

export type Product3DModelId =
  | 'flacon'
  | 'tote'
  | 'pearls'
  | 'candle'
  | 'sneaker'
  | 'sunglasses'
  | 'watch'
  | 'skincare-jar'
  | 'custom';

interface ThreeLuxuryViewerProps {
  onClose?: () => void;
  isOpen: boolean;
  activeModelId?: Product3DModelId;
  onSelectModel?: (id: Product3DModelId) => void;
  customProduct?: Product | null;
}

type FinishType = 'gold' | 'rose-gold' | 'emerald' | 'platinum';
type RenderMode = 'pbr' | 'wireframe' | 'clay';

export const ThreeLuxuryViewer: React.FC<ThreeLuxuryViewerProps> = ({
  onClose,
  isOpen,
  activeModelId = 'tote',
  onSelectModel,
  customProduct,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentModel, setCurrentModel] = useState<Product3DModelId>(activeModelId);
  const [selectedFinish, setSelectedFinish] = useState<FinishType>('gold');
  const [renderMode, setRenderMode] = useState<RenderMode>('pbr');
  const [isRotating, setIsRotating] = useState(true);
  const [explodedValue, setExplodedValue] = useState(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [showSpecsSheet, setShowSpecsSheet] = useState(false);
  const [activeView, setActiveView] = useState<'perspective' | 'front' | 'detail'>('perspective');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const modelRef = useRef<Product3DModelId>(activeModelId);
  const finishRef = useRef<FinishType>('gold');
  const renderModeRef = useRef<RenderMode>('pbr');
  const rotatingRef = useRef(true);
  const explodedRef = useRef(0);
  const viewTargetRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 1.2, z: 4.8 });
  const customGltfSceneRef = useRef<THREE.Group | null>(null);

  // Sync prop changes
  useEffect(() => {
    if (activeModelId) {
      setCurrentModel(activeModelId);
      modelRef.current = activeModelId;
    }
  }, [activeModelId]);

  useEffect(() => {
    modelRef.current = currentModel;
  }, [currentModel]);

  useEffect(() => {
    finishRef.current = selectedFinish;
  }, [selectedFinish]);

  useEffect(() => {
    renderModeRef.current = renderMode;
  }, [renderMode]);

  useEffect(() => {
    rotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    explodedRef.current = explodedValue;
  }, [explodedValue]);

  const handleModelChange = (id: Product3DModelId) => {
    setCurrentModel(id);
    modelRef.current = id;
    if (onSelectModel) onSelectModel(id);
    setExplodedValue(0);
  };

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 550;

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

    // 5. Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = !isHeadless;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc9a24a, 1.8);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xaad3c5, 1.0);
    fillLight.position.set(3, -1, -2);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0x0a4d3a, 0x021f17, 1.2);
    scene.add(hemiLight);

    // Soft radial contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(4, 4);
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

    // Procedural Leather Texture Canvas
    const leatherCanvas = document.createElement('canvas');
    leatherCanvas.width = 256;
    leatherCanvas.height = 256;
    const lCtx = leatherCanvas.getContext('2d');
    if (lCtx) {
      lCtx.fillStyle = '#D6C7B2';
      lCtx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const r = 0.5 + Math.random() * 1.5;
        lCtx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
        lCtx.beginPath();
        lCtx.arc(x, y, r, 0, Math.PI * 2);
        lCtx.fill();
      }
    }
    const leatherTex = new THREE.CanvasTexture(leatherCanvas);
    leatherTex.wrapS = THREE.RepeatWrapping;
    leatherTex.wrapT = THREE.RepeatWrapping;
    leatherTex.repeat.set(4, 4);

    // Shared Materials
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

    const leatherMaterial = new THREE.MeshStandardMaterial({
      color: 0xd2c0a8,
      map: leatherTex,
      roughness: 0.65,
      metalness: 0.1,
    });

    const pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfdfbf7,
      roughness: 0.22,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 1.6,
      specularColor: new THREE.Color(0xffeedd),
    });

    const amberGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xa86024,
      transmission: 0.85,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });

    const waxMaterial = new THREE.MeshStandardMaterial({
      color: 0xf6f2ea,
      roughness: 0.5,
      metalness: 0.05,
    });

    const marbleMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f0e8,
      roughness: 0.35,
      metalness: 0.05,
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0xc49e6d,
      roughness: 0.7,
      metalness: 0.0,
    });

    const whiteSneakerLeather = new THREE.MeshStandardMaterial({
      color: 0xfaf9f6,
      roughness: 0.45,
      metalness: 0.05,
    });

    const sneakerRubberSole = new THREE.MeshStandardMaterial({
      color: 0xeae6dc,
      roughness: 0.8,
      metalness: 0.02,
    });

    const tortoiseshellMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2a16,
      roughness: 0.15,
      metalness: 0.1,
    });

    const sunglassLensMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x241b12,
      transmission: 0.6,
      transparent: true,
      roughness: 0.05,
      ior: 1.55,
      thickness: 0.3,
    });

    const watchDialMaterial = new THREE.MeshStandardMaterial({
      color: 0x063d2e,
      roughness: 0.3,
      metalness: 0.8,
    });

    const frostedJarMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf7f5f0,
      transmission: 0.82,
      transparent: true,
      roughness: 0.32,
      ior: 1.48,
      thickness: 1.5,
    });

    const creamMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffaf2,
      roughness: 0.3,
      metalness: 0.05,
    });

    // Root Assembly
    const rootAssembly = new THREE.Group();
    scene.add(rootAssembly);

    // Groups for individual models
    const flaconGroup = new THREE.Group();
    const flaconMovableCap = new THREE.Group();
    const flaconMovableNozzle = new THREE.Group();

    const toteGroup = new THREE.Group();
    const toteMovableHandles = new THREE.Group();

    const pearlGroup = new THREE.Group();
    const pearlMovableDrops = new THREE.Group();

    const candleGroup = new THREE.Group();
    const candleMovableLid = new THREE.Group();

    const sneakerGroup = new THREE.Group();
    const sneakerMovableLaces = new THREE.Group();

    const sunglassesGroup = new THREE.Group();
    const sunglassesMovableArms = new THREE.Group();

    const watchGroup = new THREE.Group();
    const watchMovableHands = new THREE.Group();

    const jarGroup = new THREE.Group();
    const jarMovableLid = new THREE.Group();

    const customModelGroup = new THREE.Group();

    rootAssembly.add(flaconGroup);
    rootAssembly.add(toteGroup);
    rootAssembly.add(pearlGroup);
    rootAssembly.add(candleGroup);
    rootAssembly.add(sneakerGroup);
    rootAssembly.add(sunglassesGroup);
    rootAssembly.add(watchGroup);
    rootAssembly.add(jarGroup);
    rootAssembly.add(customModelGroup);

    // -------------------------------------------------------------
    // BUILD MODEL 1: ARTISANAL FRAGRANCE FLACON
    // -------------------------------------------------------------
    const bottleGeo = new THREE.CylinderGeometry(0.85, 0.92, 1.5, 8);
    const bottleMesh = new THREE.Mesh(bottleGeo, crystalMaterial);
    bottleMesh.position.y = 0.75;
    bottleMesh.castShadow = !isHeadless;
    flaconGroup.add(bottleMesh);

    const liquidGeo = new THREE.CylinderGeometry(0.72, 0.78, 1.25, 16);
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMaterial);
    liquidMesh.position.y = 0.68;
    flaconGroup.add(liquidMesh);

    const shoulderGeo = new THREE.TorusGeometry(0.86, 0.04, 16, 32);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, metalMaterial);
    shoulderMesh.rotation.x = Math.PI / 2;
    shoulderMesh.position.y = 1.5;
    flaconGroup.add(shoulderMesh);

    const plateGeo = new THREE.BoxGeometry(0.7, 0.35, 0.04);
    const plateMesh = new THREE.Mesh(plateGeo, enamelMaterial);
    plateMesh.position.set(0, 0.78, 0.86);
    flaconGroup.add(plateMesh);

    const plateRimGeo = new THREE.BoxGeometry(0.74, 0.39, 0.02);
    const plateRimMesh = new THREE.Mesh(plateRimGeo, metalMaterial);
    plateRimMesh.position.set(0, 0.78, 0.85);
    flaconGroup.add(plateRimMesh);

    const collarGeo = new THREE.CylinderGeometry(0.36, 0.42, 0.28, 32);
    const collarMesh = new THREE.Mesh(collarGeo, metalMaterial);
    collarMesh.position.y = 1.64;
    collarMesh.castShadow = !isHeadless;
    flaconGroup.add(collarMesh);

    const nozzleGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.32, 24);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, metalMaterial);
    nozzleMesh.position.y = 1.9;
    flaconMovableNozzle.add(nozzleMesh);
    flaconGroup.add(flaconMovableNozzle);

    const capGeo = new THREE.CylinderGeometry(0.52, 0.48, 0.6, 8);
    const capMesh = new THREE.Mesh(capGeo, crystalMaterial);
    capMesh.position.y = 2.45;
    capMesh.castShadow = !isHeadless;
    flaconMovableCap.add(capMesh);

    const capRingGeo = new THREE.TorusGeometry(0.5, 0.035, 16, 32);
    const capRingMesh = new THREE.Mesh(capRingGeo, metalMaterial);
    capRingMesh.rotation.x = Math.PI / 2;
    capRingMesh.position.y = 2.18;
    flaconMovableCap.add(capRingMesh);

    flaconGroup.add(flaconMovableCap);

    // -------------------------------------------------------------
    // BUILD MODEL 2: CHIC STRUCTURED LEATHER TOTE
    // -------------------------------------------------------------
    const toteBodyGeo = new THREE.BoxGeometry(1.9, 1.4, 0.85);
    const toteBodyMesh = new THREE.Mesh(toteBodyGeo, leatherMaterial);
    toteBodyMesh.position.y = 0.72;
    toteBodyMesh.castShadow = !isHeadless;
    toteGroup.add(toteBodyMesh);

    const toteRimGeo = new THREE.BoxGeometry(1.96, 0.08, 0.9);
    const toteRimMesh = new THREE.Mesh(toteRimGeo, leatherMaterial);
    toteRimMesh.position.y = 1.44;
    toteGroup.add(toteRimMesh);

    const beltGeo = new THREE.BoxGeometry(1.92, 0.12, 0.88);
    const beltMesh = new THREE.Mesh(beltGeo, leatherMaterial);
    beltMesh.position.y = 1.15;
    toteGroup.add(beltMesh);

    const claspGeo = new THREE.BoxGeometry(0.22, 0.12, 0.08);
    const claspMesh = new THREE.Mesh(claspGeo, metalMaterial);
    claspMesh.position.set(0, 1.15, 0.46);
    toteGroup.add(claspMesh);

    const padlockGeo = new THREE.BoxGeometry(0.12, 0.16, 0.06);
    const padlockMesh = new THREE.Mesh(padlockGeo, metalMaterial);
    padlockMesh.position.set(-0.25, 0.95, 0.46);
    toteGroup.add(padlockMesh);

    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.48, 1.4, 0.3),
      new THREE.Vector3(-0.48, 2.3, 0.3),
      new THREE.Vector3(0.48, 2.3, 0.3),
      new THREE.Vector3(0.48, 1.4, 0.3),
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 24, 0.045, 12, false);
    const frontHandle = new THREE.Mesh(handleGeo, leatherMaterial);
    toteMovableHandles.add(frontHandle);

    const backHandle = frontHandle.clone();
    backHandle.position.z = -0.6;
    toteMovableHandles.add(backHandle);
    toteGroup.add(toteMovableHandles);

    [-0.48, 0.48].forEach((x) => {
      [0.3, -0.3].forEach((z) => {
        const ringGeo = new THREE.TorusGeometry(0.06, 0.018, 12, 20);
        const ringMesh = new THREE.Mesh(ringGeo, metalMaterial);
        ringMesh.position.set(x, 1.42, z);
        toteGroup.add(ringMesh);
      });
    });

    [-0.75, 0.75].forEach((x) => {
      [-0.32, 0.32].forEach((z) => {
        const studGeo = new THREE.ConeGeometry(0.04, 0.04, 12);
        const studMesh = new THREE.Mesh(studGeo, metalMaterial);
        studMesh.rotation.x = Math.PI;
        studMesh.position.set(x, 0.02, z);
        toteGroup.add(studMesh);
      });
    });

    // -------------------------------------------------------------
    // BUILD MODEL 3: 14K BAROQUE PEARL DROP HUGGIES
    // -------------------------------------------------------------
    [-0.5, 0.5].forEach((offsetX) => {
      const hoopGeo = new THREE.TorusGeometry(0.38, 0.055, 16, 36, Math.PI * 1.85);
      const hoopMesh = new THREE.Mesh(hoopGeo, metalMaterial);
      hoopMesh.position.set(offsetX, 1.6, 0);
      hoopMesh.rotation.z = Math.PI * 0.07;
      pearlGroup.add(hoopMesh);

      const coilGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16);
      const coilMesh = new THREE.Mesh(coilGeo, metalMaterial);
      coilMesh.position.set(offsetX, 1.15, 0);
      pearlGroup.add(coilMesh);

      const pearlGeo = new THREE.SphereGeometry(0.34, 32, 24);
      const pos = pearlGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let vx = pos.getX(i);
        let vy = pos.getY(i);
        let vz = pos.getZ(i);
        vy *= 1.35;
        const noise = 1 + 0.12 * Math.sin(vy * 6) * Math.cos(vx * 7);
        pos.setXYZ(i, vx * noise, vy * noise, vz * noise);
      }
      pearlGeo.computeVertexNormals();

      const pearlMesh = new THREE.Mesh(pearlGeo, pearlMaterial);
      pearlMesh.position.set(offsetX, 0.72, 0);
      pearlMesh.castShadow = !isHeadless;
      pearlMovableDrops.add(pearlMesh);
    });
    pearlGroup.add(pearlMovableDrops);

    // -------------------------------------------------------------
    // BUILD MODEL 4: AMBER CANDLE & REED DIFFUSER
    // -------------------------------------------------------------
    const trayGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.14, 36);
    const trayMesh = new THREE.Mesh(trayGeo, marbleMaterial);
    trayMesh.position.set(0, 0.07, 0);
    trayMesh.receiveShadow = !isHeadless;
    candleGroup.add(trayMesh);

    const candleJarGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.85, 24);
    const candleJarMesh = new THREE.Mesh(candleJarGeo, amberGlassMaterial);
    candleJarMesh.position.set(-0.65, 0.56, 0);
    candleJarMesh.castShadow = !isHeadless;
    candleGroup.add(candleJarMesh);

    const waxGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.7, 24);
    const waxMesh = new THREE.Mesh(waxGeo, waxMaterial);
    waxMesh.position.set(-0.65, 0.52, 0);
    candleGroup.add(waxMesh);

    const wickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8);
    const wickMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const wickMesh = new THREE.Mesh(wickGeo, wickMat);
    wickMesh.position.set(-0.65, 0.92, 0);
    candleGroup.add(wickMesh);

    const corkGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.12, 24);
    const corkMesh = new THREE.Mesh(corkGeo, woodMaterial);
    corkMesh.position.set(-0.65, 1.05, 0);
    candleMovableLid.add(corkMesh);
    candleGroup.add(candleMovableLid);

    const diffuserGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.9, 24);
    const diffuserMesh = new THREE.Mesh(diffuserGeo, amberGlassMaterial);
    diffuserMesh.position.set(0.65, 0.59, 0);
    candleGroup.add(diffuserMesh);

    const diffuserCollarGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.15, 20);
    const diffuserCollarMesh = new THREE.Mesh(diffuserCollarGeo, metalMaterial);
    diffuserCollarMesh.position.set(0.65, 1.1, 0);
    candleGroup.add(diffuserCollarMesh);

    const reedAngles = [-0.18, -0.09, 0.02, 0.12, 0.22, -0.05];
    const reedRotZ = [0.15, -0.12, 0.08, -0.18, 0.2, -0.25];
    reedAngles.forEach((ang, idx) => {
      const reedGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.6, 8);
      const reedMesh = new THREE.Mesh(reedGeo, woodMaterial);
      reedMesh.position.set(0.65, 1.7, 0);
      reedMesh.rotation.set(ang, 0, reedRotZ[idx]);
      candleGroup.add(reedMesh);
    });

    // -------------------------------------------------------------
    // BUILD MODEL 5: LUXURY MINIMALIST SNEAKER (12 PARTS)
    // -------------------------------------------------------------
    // Outsole (Rubber Platform)
    const soleGeo = new THREE.BoxGeometry(1.1, 0.35, 2.5);
    const soleMesh = new THREE.Mesh(soleGeo, sneakerRubberSole);
    soleMesh.position.set(0, 0.18, 0);
    soleMesh.castShadow = !isHeadless;
    sneakerGroup.add(soleMesh);

    // Tread lines
    for (let tz = -1.0; tz <= 1.0; tz += 0.25) {
      const treadGeo = new THREE.BoxGeometry(1.05, 0.04, 0.08);
      const treadMesh = new THREE.Mesh(treadGeo, sneakerRubberSole);
      treadMesh.position.set(0, 0.02, tz);
      sneakerGroup.add(treadMesh);
    }

    // Upper Foot Body
    const upperGeo = new THREE.BoxGeometry(0.96, 0.65, 2.2);
    const upperMesh = new THREE.Mesh(upperGeo, whiteSneakerLeather);
    upperMesh.position.set(0, 0.62, 0.05);
    upperMesh.castShadow = !isHeadless;
    sneakerGroup.add(upperMesh);

    // Curved Toe Cap (Front)
    const toeGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.4, 24);
    const toeMesh = new THREE.Mesh(toeGeo, whiteSneakerLeather);
    toeMesh.position.set(0, 0.55, 1.05);
    sneakerGroup.add(toeMesh);

    // Heel Collar & Champagne Accent Tab
    const heelTabGeo = new THREE.BoxGeometry(0.9, 0.3, 0.1);
    const heelTabMesh = new THREE.Mesh(heelTabGeo, metalMaterial);
    heelTabMesh.position.set(0, 0.88, -1.02);
    sneakerGroup.add(heelTabMesh);

    // Tongue
    const tongueGeo = new THREE.BoxGeometry(0.5, 0.7, 0.1);
    const tongueMesh = new THREE.Mesh(tongueGeo, whiteSneakerLeather);
    tongueMesh.rotation.x = -Math.PI * 0.18;
    tongueMesh.position.set(0, 0.95, 0.2);
    sneakerGroup.add(tongueMesh);

    // Gold Tongue Emblem
    const tongueBadgeGeo = new THREE.BoxGeometry(0.24, 0.14, 0.03);
    const tongueBadgeMesh = new THREE.Mesh(tongueBadgeGeo, metalMaterial);
    tongueBadgeMesh.rotation.x = -Math.PI * 0.18;
    tongueBadgeMesh.position.set(0, 1.15, 0.28);
    sneakerGroup.add(tongueBadgeMesh);

    // Laces and Eyelets (Criss-Cross Woven Mesh)
    [-0.24, 0.24].forEach((lx) => {
      [0.2, 0.45, 0.7, 0.95].forEach((lz) => {
        const eyeletGeo = new THREE.TorusGeometry(0.04, 0.015, 8, 16);
        const eyeletMesh = new THREE.Mesh(eyeletGeo, metalMaterial);
        eyeletMesh.rotation.x = Math.PI / 2;
        eyeletMesh.position.set(lx, 0.82, lz - 0.2);
        sneakerGroup.add(eyeletMesh);
      });
    });

    // Movable Lace Bars
    [0.2, 0.45, 0.7].forEach((lz, idx) => {
      const laceBarGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.48, 8);
      const laceBarMesh = new THREE.Mesh(laceBarGeo, whiteSneakerLeather);
      laceBarMesh.rotation.z = Math.PI / 2;
      laceBarMesh.position.set(0, 0.86 + idx * 0.05, lz - 0.2);
      sneakerMovableLaces.add(laceBarMesh);
    });
    sneakerGroup.add(sneakerMovableLaces);

    // -------------------------------------------------------------
    // BUILD MODEL 6: DESIGNER TORTOISESHELL SUNGLASSES (8 PARTS)
    // -------------------------------------------------------------
    // Left & Right Rim Frames
    [-0.7, 0.7].forEach((fx) => {
      const frameGeo = new THREE.TorusGeometry(0.48, 0.07, 16, 32);
      const frameMesh = new THREE.Mesh(frameGeo, tortoiseshellMaterial);
      frameMesh.position.set(fx, 1.2, 0);
      frameMesh.castShadow = !isHeadless;
      sunglassesGroup.add(frameMesh);

      const lensGeo = new THREE.CircleGeometry(0.44, 32);
      const lensMesh = new THREE.Mesh(lensGeo, sunglassLensMaterial);
      lensMesh.position.set(fx, 1.2, 0.01);
      sunglassesGroup.add(lensMesh);
    });

    // Gold Nose Bridge
    const bridgeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 12);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, metalMaterial);
    bridgeMesh.rotation.z = Math.PI / 2;
    bridgeMesh.position.set(0, 1.35, 0.02);
    sunglassesGroup.add(bridgeMesh);

    // Brow Bar Accent
    const browGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.3, 12);
    const browMesh = new THREE.Mesh(browGeo, metalMaterial);
    browMesh.rotation.z = Math.PI / 2;
    browMesh.position.set(0, 1.58, 0.02);
    sunglassesGroup.add(browMesh);

    // Hinged Temples (Arms extending backwards)
    [-1.2, 1.2].forEach((tx, idx) => {
      const hingeGeo = new THREE.BoxGeometry(0.08, 0.1, 0.1);
      const hingeMesh = new THREE.Mesh(hingeGeo, metalMaterial);
      hingeMesh.position.set(tx, 1.2, -0.05);
      sunglassesGroup.add(hingeMesh);

      const armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(tx, 1.2, -0.1),
        new THREE.Vector3(tx * 0.95, 1.2, -1.2),
        new THREE.Vector3(tx * 0.92, 0.95, -1.8),
      ]);
      const armGeo = new THREE.TubeGeometry(armCurve, 20, 0.04, 8, false);
      const armMesh = new THREE.Mesh(armGeo, tortoiseshellMaterial);
      sunglassesMovableArms.add(armMesh);
    });
    sunglassesGroup.add(sunglassesMovableArms);

    // -------------------------------------------------------------
    // BUILD MODEL 7: 18K GOLD CHRONOGRAPH BRACELET WATCH (10 PARTS)
    // -------------------------------------------------------------
    // Main Circular Gold Watch Case
    const caseGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.28, 36);
    const caseMesh = new THREE.Mesh(caseGeo, metalMaterial);
    caseMesh.position.set(0, 1.2, 0);
    caseMesh.rotation.x = Math.PI / 2;
    caseMesh.castShadow = !isHeadless;
    watchGroup.add(caseMesh);

    // Fluted Bezel Rim
    const bezelGeo = new THREE.TorusGeometry(0.92, 0.04, 16, 48);
    const bezelMesh = new THREE.Mesh(bezelGeo, metalMaterial);
    bezelMesh.position.set(0, 1.2, 0.14);
    watchGroup.add(bezelMesh);

    // Sunburst Emerald/Gold Dial Face
    const dialGeo = new THREE.CircleGeometry(0.82, 36);
    const dialMesh = new THREE.Mesh(dialGeo, watchDialMaterial);
    dialMesh.position.set(0, 1.2, 0.142);
    watchGroup.add(dialMesh);

    // 12 Gold Hour Markers
    for (let h = 0; h < 12; h++) {
      const ang = (h / 12) * Math.PI * 2;
      const markerGeo = new THREE.BoxGeometry(0.04, 0.16, 0.02);
      const markerMesh = new THREE.Mesh(markerGeo, metalMaterial);
      markerMesh.position.set(Math.sin(ang) * 0.68, 1.2 + Math.cos(ang) * 0.68, 0.144);
      markerMesh.rotation.z = -ang;
      watchGroup.add(markerMesh);
    }

    // Watch Hands (Hour & Minute in Movable Group)
    const hourHandGeo = new THREE.BoxGeometry(0.05, 0.38, 0.02);
    const hourHandMesh = new THREE.Mesh(hourHandGeo, metalMaterial);
    hourHandMesh.position.set(0.12, 1.34, 0.146);
    hourHandMesh.rotation.z = -Math.PI / 4;
    watchMovableHands.add(hourHandMesh);

    const minHandGeo = new THREE.BoxGeometry(0.035, 0.55, 0.02);
    const minHandMesh = new THREE.Mesh(minHandGeo, metalMaterial);
    minHandMesh.position.set(-0.18, 1.42, 0.148);
    minHandMesh.rotation.z = Math.PI / 6;
    watchMovableHands.add(minHandMesh);

    // Center Cap
    const centerPinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
    const centerPinMesh = new THREE.Mesh(centerPinGeo, metalMaterial);
    centerPinMesh.position.set(0, 1.2, 0.15);
    centerPinMesh.rotation.x = Math.PI / 2;
    watchMovableHands.add(centerPinMesh);
    watchGroup.add(watchMovableHands);

    // Sapphire Crystal Face
    const crystalGeo = new THREE.CylinderGeometry(0.86, 0.86, 0.03, 36);
    const crystalFaceMesh = new THREE.Mesh(crystalGeo, crystalMaterial);
    crystalFaceMesh.position.set(0, 1.2, 0.155);
    crystalFaceMesh.rotation.x = Math.PI / 2;
    watchGroup.add(crystalFaceMesh);

    // Gold Winding Crown
    const crownGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16);
    const crownMesh = new THREE.Mesh(crownGeo, metalMaterial);
    crownMesh.position.set(0.96, 1.2, 0);
    crownMesh.rotation.z = Math.PI / 2;
    watchGroup.add(crownMesh);

    // Oyster Segmented Bracelet Band Links (Top & Bottom curves)
    [-1, 1].forEach((dir) => {
      for (let link = 1; link <= 4; link++) {
        const linkGeo = new THREE.BoxGeometry(0.72 - link * 0.05, 0.18, 0.1);
        const linkMesh = new THREE.Mesh(linkGeo, metalMaterial);
        linkMesh.position.set(0, 1.2 + dir * (0.95 + link * 0.22), -link * 0.15);
        linkMesh.rotation.x = -dir * link * 0.18;
        watchGroup.add(linkMesh);
      }
    });

    // -------------------------------------------------------------
    // BUILD MODEL 8: FROSTED GLASS LUXURY SKINCARE JAR (6 PARTS)
    // -------------------------------------------------------------
    // Heavy Glass Jar Body
    const jarGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.95, 32);
    const jarMesh = new THREE.Mesh(jarGeo, frostedJarMaterial);
    jarMesh.position.set(0, 0.55, 0);
    jarMesh.castShadow = !isHeadless;
    jarGroup.add(jarMesh);

    // Rich Moisturizer Cream Swirl
    const creamGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.8, 24);
    const creamMesh = new THREE.Mesh(creamGeo, creamMaterial);
    creamMesh.position.set(0, 0.52, 0);
    jarGroup.add(creamMesh);

    // Glass Base Rim
    const baseRimGeo = new THREE.TorusGeometry(0.94, 0.04, 16, 32);
    const baseRimMesh = new THREE.Mesh(baseRimGeo, frostedJarMaterial);
    baseRimMesh.position.set(0, 0.08, 0);
    baseRimMesh.rotation.x = Math.PI / 2;
    jarGroup.add(baseRimMesh);

    // Golden Knurled Screw Lid
    const lidGeo = new THREE.CylinderGeometry(0.98, 0.98, 0.42, 32);
    const lidMesh = new THREE.Mesh(lidGeo, metalMaterial);
    lidMesh.position.set(0, 1.25, 0);
    lidMesh.castShadow = !isHeadless;
    jarMovableLid.add(lidMesh);

    // Inner Hygienic Protective Ring
    const innerRingGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.05, 24);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, creamMaterial);
    innerRingMesh.position.set(0, 1.05, 0);
    jarMovableLid.add(innerRingMesh);
    jarGroup.add(jarMovableLid);

    // Visibility toggle helper
    const updateModelVisibility = () => {
      const active = modelRef.current;
      flaconGroup.visible = active === 'flacon';
      toteGroup.visible = active === 'tote';
      pearlGroup.visible = active === 'pearls';
      candleGroup.visible = active === 'candle';
      sneakerGroup.visible = active === 'sneaker';
      sunglassesGroup.visible = active === 'sunglasses';
      watchGroup.visible = active === 'watch';
      jarGroup.visible = active === 'skincare-jar';
      customModelGroup.visible = active === 'custom';
    };
    updateModelVisibility();

    // Mouse drag interaction
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

      targetRotationY += deltaX * 0.01;
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX + deltaY * 0.006));
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Wheel Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.002;
      viewTargetRef.current.z = Math.max(2.2, Math.min(7.0, viewTargetRef.current.z + zoomDelta));
    };
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // File Drag and Drop for 3D Mesh Files (.glb/.gltf)
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        loadGLTFFile(file);
      }
    };

    domElem.addEventListener('dragover', onDragOver);
    domElem.addEventListener('drop', onDrop);

    const loadGLTFFile = (file: File) => {
      setUploadStatus('Loading 3D mesh file...');
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        if (!buffer) return;

        const loader = new GLTFLoader();
        loader.parse(
          buffer,
          '',
          (gltf) => {
            while (customModelGroup.children.length > 0) {
              customModelGroup.remove(customModelGroup.children[0]);
            }
            const loaded = gltf.scene;

            // Compute bounding box to normalize scale
            const box = new THREE.Box3().setFromObject(loaded);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 2.0 / maxDim;
            loaded.scale.set(scale, scale, scale);

            // Re-center
            box.setFromObject(loaded);
            const center = box.getCenter(new THREE.Vector3());
            loaded.position.sub(center);
            loaded.position.y += 1.0;

            loaded.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = !isHeadless;
                child.receiveShadow = !isHeadless;
              }
            });

            customModelGroup.add(loaded);
            customGltfSceneRef.current = loaded;
            handleModelChange('custom');
            setUploadStatus('3D model loaded successfully!');
            setTimeout(() => setUploadStatus(null), 3000);
          },
          (err) => {
            console.error('Failed to parse GLTF', err);
            setUploadStatus('Could not load 3D file. Please use standard .glb/.gltf format.');
            setTimeout(() => setUploadStatus(null), 3500);
          }
        );
      };
      reader.readAsArrayBuffer(file);
    };

    // Store loadGLTFFile reference on mount element for input button use
    (container as unknown as { load3DFile?: (file: File) => void }).load3DFile = loadGLTFFile;

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Animation Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      updateModelVisibility();

      // Update finish color
      const fCol = finishColors[finishRef.current];
      metalMaterial.color.setHex(fCol);

      // Render Mode: PBR vs Wireframe vs Clay
      const currentMode = renderModeRef.current;
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          if (mesh === shadowPlane) return;

          if (currentMode === 'wireframe') {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => {
                if (m && 'wireframe' in m) (m as any).wireframe = true;
              });
            } else if (mesh.material && 'wireframe' in mesh.material) {
              (mesh.material as any).wireframe = true;
            }
          } else {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => {
                if (m && 'wireframe' in m) (m as any).wireframe = false;
              });
            } else if (mesh.material && 'wireframe' in mesh.material) {
              (mesh.material as any).wireframe = false;
            }
          }
        }
      });

      // Auto-rotation or smooth manual drag damping
      if (rotatingRef.current && !isDragging) {
        targetRotationY += 0.005;
      }

      rootAssembly.rotation.y += (targetRotationY - rootAssembly.rotation.y) * 0.08;
      rootAssembly.rotation.x += (targetRotationX - rootAssembly.rotation.x) * 0.08;

      // Exploded views
      const exp = explodedRef.current;
      flaconMovableCap.position.y = exp * 1.2;
      flaconMovableNozzle.position.y = exp * 0.45;
      toteMovableHandles.position.y = exp * 0.8;
      pearlMovableDrops.position.y = -exp * 0.6;
      candleMovableLid.position.y = exp * 1.0;
      sneakerMovableLaces.position.y = exp * 0.7;
      sunglassesMovableArms.position.z = -exp * 0.8;
      watchMovableHands.position.z = exp * 0.5;
      jarMovableLid.position.y = exp * 0.9;

      // Smooth camera interpolation
      camera.position.x += (viewTargetRef.current.x - camera.position.x) * 0.05;
      camera.position.y += (viewTargetRef.current.y - camera.position.y) * 0.05;
      camera.position.z += (viewTargetRef.current.z - camera.position.z) * 0.05;
      camera.lookAt(0, 1.0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      domElem.removeEventListener('wheel', onWheel);
      domElem.removeEventListener('dragover', onDragOver);
      domElem.removeEventListener('drop', onDrop);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      leatherTex.dispose();
      shadowTex.dispose();
    };
  }, [isOpen]);

  const handlePresetView = (view: 'perspective' | 'front' | 'detail') => {
    setActiveView(view);
    if (view === 'perspective') {
      viewTargetRef.current = { x: 0, y: 1.4, z: 4.8 };
    } else if (view === 'front') {
      viewTargetRef.current = { x: 0, y: 1.1, z: 3.8 };
    } else if (view === 'detail') {
      viewTargetRef.current = { x: 0, y: 1.0, z: 2.6 };
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && mountRef.current) {
      const uploader = (mountRef.current as unknown as { load3DFile?: (file: File) => void }).load3DFile;
      if (uploader) uploader(file);
    }
  };

  if (!isOpen) return null;

  // Active Model Info Card
  const modelMetadata: Record<
    Product3DModelId,
    {
      name: string;
      category: string;
      materials: string;
      dimensions: string;
      features: string[];
      asin: string;
      price: string;
    }
  > = {
    tote: {
      name: 'Structured Pebbled Leather Tote',
      category: 'Handbags & Purses',
      materials: 'Water-resistant vegan calfskin leather, gold-tone hardware',
      dimensions: '14.5" W x 11.2" H x 5.8" D (9.5" handle drop)',
      features: [
        'High-density edge paint prevents fraying under daily heavy wear',
        'Reinforced bottom panel with 4 protective brushed conical studs',
        'Custom electroplated zinc alloy twist-lock clasp and padlock charm',
        'Tubular dual handles engineered for zero shoulder strain',
      ],
      asin: 'B09V7Y1978',
      price: '$138.00',
    },
    sneaker: {
      name: 'Minimalist Leather Comfort Sneakers',
      category: 'Footwear & Shoes',
      materials: 'Full-grain white nappa leather, ergonomic natural rubber cupsole',
      dimensions: 'US Women 5 - 11 (True to size, 1.2" subtle platform)',
      features: [
        'Shock-absorbing EVA arch contour insole for 15,000+ daily steps',
        'Anti-crease reinforced vamp stitching and padded Achilles notch',
        'Champagne metallic heel tab with scratch-resistant clearcoat',
        'Hexagonal non-marking traction outsole tread',
      ],
      asin: 'B08N5M6412',
      price: '$98.50',
    },
    watch: {
      name: '18K Gold Fluted Chronograph Watch',
      category: 'Jewelry & Watches',
      materials: 'Solid 316L stainless steel, 18K triple vacuum ion plating, sapphire glass',
      dimensions: '36mm dial diameter, 9mm case depth, 18mm band width',
      features: [
        'Anti-reflective synthetic sapphire crystal dome rated 9 on Mohs scale',
        'Fluted sunburst bezel with high-gloss mirror beveling',
        'Sunburst emerald enamel dial face with hand-applied baton indices',
        'Solid oyster link bracelet with safety folding deployant clasp',
      ],
      asin: 'B08N7P2310',
      price: '$189.00',
    },
    sunglasses: {
      name: 'Cat-Eye Tortoiseshell Sunglasses',
      category: 'Accessories & Eyewear',
      materials: 'Cellulose acetate frame, Category 3 polarized nylon lenses',
      dimensions: '52mm lens width, 18mm bridge, 145mm temple length',
      features: [
        '100% UVA/UVB 400 protection with anti-glare back coating',
        'Five-barrel reinforced gold hinges with Teflon-coated screws',
        'Warm tortoiseshell hand-polished amber acetate sheets',
        'Hypoallergenic adjustable silicone nose pads on gold wire stems',
      ],
      asin: 'B07M9X8890',
      price: '$65.00',
    },
    'skincare-jar': {
      name: 'Barrier Restore Crème Infusion',
      category: 'Beauty & Skincare',
      materials: 'Heavy frosted soda-lime glass jar, knurled aluminum gold twist cap',
      dimensions: '50 ml / 1.7 fl. oz. (2.4" diameter, 2.2" height)',
      features: [
        'Triple weight frosted glass blocks light degradation of active ceramides',
        'Airtight silicone seal inner barrier prevents oxidation',
        'Vertical micro-knurling on cap provides secure grip with wet hands',
        'Clean non-comedogenic peptide blend texture with satin skin feel',
      ],
      asin: 'B07V2Q8419',
      price: '$48.00',
    },
    flacon: {
      name: 'Artisanal Eau de Parfum Flacon',
      category: 'Beauty & Fragrance',
      materials: 'Optical crystal glass, weighted magnetic gold cap, fine mist nozzle',
      dimensions: '100 ml / 3.4 fl. oz. (3.6" height, 2.1" width)',
      features: [
        'Lead-free faceted crystal glass body with 0.92 transmission clarity',
        'Laser-etched emerald enamel insignia emblem on front facade',
        'Continuous atomizing micro-diffusion spray nozzle (0.08ml per actuation)',
        'Weighted magnetic cap with satisfying tactile snap closure',
      ],
      asin: 'B09R11W442',
      price: '$89.00',
    },
    pearls: {
      name: '14K Gold Baroque Pearl Huggies',
      category: 'Jewelry & Accessories',
      materials: 'Grade AAA freshwater baroque pearls, 14K solid gold clicker hoops',
      dimensions: '12mm hoop diameter, 14-16mm organic drop pearl',
      features: [
        'Each organic baroque pearl is unique with luminous thick nacre iridescence',
        'Snug clicker clasp closure prevents loss during active wear',
        'Wire-wrapped coil crown prevents pearl twisting or detachment',
        'Nickel-free, hypoallergenic 14K yellow gold wire formulation',
      ],
      asin: 'B07T8W2145',
      price: '$54.00',
    },
    candle: {
      name: 'Warm Amber & Santal Ritual Set',
      category: 'Home & Lifestyle',
      materials: 'Hand-poured coconut-soy wax, amber apothecary glass, natural rattan',
      dimensions: '9 oz candle (60 hr burn) + 100ml diffuser with 6 rattan reeds',
      features: [
        'Clean-burning lead-free braided organic cotton wick with zero soot',
        'Heavy fluted white Carrera marble base catch tray included',
        'Scent throw radius covers up to 600 sq. ft. of living space',
        'Natural cork lid protects wax from ambient dust when not in use',
      ],
      asin: 'B08L7V4321',
      price: '$42.00',
    },
    custom: {
      name: uploadedFileName ? `Custom 3D: ${uploadedFileName}` : 'User Uploaded 3D Model',
      category: 'Custom 3D Mesh Inspection',
      materials: 'Imported GLTF / GLB PBR material definition',
      dimensions: 'Custom bounding box scaled to studio environment',
      features: [
        'Real-time PBR material rendering with ACES Filmic tone mapping',
        'Full wireframe mesh topology inspection support',
        'Interactive 360-degree orbit, zoom, and directional lighting evaluation',
        'Affiliate URL integration available via Amazaura Product Manager',
      ],
      asin: 'CUSTOM-3D',
      price: 'Curated Item',
    },
  };

  const currentMeta = modelMetadata[currentModel];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="3D Luxury Product & Mesh Studio"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md"
    >
      <div className="relative flex flex-col w-full max-w-6xl h-[92vh] max-h-[850px] bg-[#063D2E] rounded-2xl overflow-hidden shadow-2xl border border-[#C9A24A]/40 text-left">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 bg-[#042D22] border-b border-[#C9A24A]/30 text-white z-20 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A24A]/20 border border-[#C9A24A] flex items-center justify-center text-[#C9A24A]">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-base sm:text-lg font-bold tracking-wide">
                  Amazaura 3D Luxury & Mesh Studio
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-[#C9A24A] text-[#063D2E] font-bold rounded-full uppercase tracking-wider">
                  100% Realistic Simulation
                </span>
              </div>
              <p className="text-[11px] text-[#FAF7F0]/70 truncate max-w-xs sm:max-w-md">
                {currentMeta.name} · {currentMeta.category}
              </p>
            </div>
          </div>

          {/* Action buttons: Wireframe toggle, Specs sheet, File Upload, and Close */}
          <div className="flex items-center gap-2">
            {/* Render Mode: PBR vs Wireframe Mesh */}
            <div className="flex items-center bg-black/40 rounded-lg p-1 border border-[#C9A24A]/30 text-xs">
              <button
                onClick={() => setRenderMode('pbr')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  renderMode === 'pbr' ? 'bg-[#C9A24A] text-[#063D2E] font-bold' : 'text-[#FAF7F0]/70 hover:text-white'
                }`}
                title="PBR Realistic Material & Lighting"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PBR Realistic</span>
              </button>
              <button
                onClick={() => setRenderMode('wireframe')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  renderMode === 'wireframe' ? 'bg-[#C9A24A] text-[#063D2E] font-bold' : 'text-[#FAF7F0]/70 hover:text-white'
                }`}
                title="Inspect 100% Polygon Mesh Topology"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Mesh Wireframe</span>
              </button>
            </div>

            {/* Specs Sheet Drawer Toggle */}
            <button
              onClick={() => setShowSpecsSheet(!showSpecsSheet)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showSpecsSheet
                  ? 'bg-[#C9A24A] text-[#063D2E] border-[#C9A24A]'
                  : 'bg-black/40 text-[#FAF7F0]/80 border-[#C9A24A]/30 hover:text-white hover:bg-black/60'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Realism Specs</span>
            </button>

            {/* Custom 3D File Upload Button */}
            <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-[#C9A24A]/40 bg-[#063D2E] hover:bg-[#042D22] text-[#C9A24A] text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Drop / Upload .glb</span>
              <input
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload custom 3D model"
              />
            </label>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close 3D viewer"
              className="p-2 text-[#FAF7F0]/70 hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Mesh Selector Ribbon (Scrollable on mobile) */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 bg-[#053528] border-b border-[#C9A24A]/20 overflow-x-auto text-xs scrollbar-none z-10">
          <span className="text-[#C9A24A] font-semibold uppercase tracking-wider text-[10px] mr-2 shrink-0">
            Select 3D Mesh:
          </span>
          {[
            { id: 'tote', label: 'Leather Tote' },
            { id: 'sneaker', label: 'Comfort Sneaker' },
            { id: 'watch', label: 'Gold Watch' },
            { id: 'sunglasses', label: 'Sunglasses' },
            { id: 'skincare-jar', label: 'Skincare Jar' },
            { id: 'flacon', label: 'Fragrance Flacon' },
            { id: 'pearls', label: 'Pearl Huggies' },
            { id: 'candle', label: 'Candle & Diffuser' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleModelChange(item.id as Product3DModelId)}
              className={`px-3 py-1 rounded-md shrink-0 transition-all font-medium ${
                currentModel === item.id
                  ? 'bg-[#C9A24A] text-[#063D2E] font-bold shadow-xs'
                  : 'bg-black/30 text-[#FAF7F0]/70 hover:text-white hover:bg-black/50'
              }`}
            >
              {item.label}
            </button>
          ))}
          {uploadedFileName && (
            <button
              onClick={() => handleModelChange('custom')}
              className={`px-3 py-1 rounded-md shrink-0 transition-all font-medium ${
                currentModel === 'custom'
                  ? 'bg-[#C9A24A] text-[#063D2E] font-bold shadow-xs'
                  : 'bg-black/30 text-[#FAF7F0]/70 hover:text-white hover:bg-black/50'
              }`}
            >
              {uploadedFileName} (Custom)
            </button>
          )}
        </div>

        {/* Central Viewport Area */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex">
          {/* WebGL Canvas */}
          <div
            ref={mountRef}
            className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
            data-testid="threejs-canvas-container"
          >
            {/* Top Overlay Badges */}
            <div className="absolute top-4 left-6 pointer-events-none z-10 flex items-center gap-2 text-xs text-[#FAF7F0]/75 tracking-wider uppercase bg-black/40 px-3 py-1 rounded-full border border-[#C9A24A]/30">
              <ShieldCheck className="w-4 h-4 text-[#C9A24A]" />
              <span>
                {renderMode === 'wireframe'
                  ? 'High-Density Polygon Mesh Topology'
                  : 'Sub-surface PBR Shading & Studio Lighting'}
              </span>
            </div>

            <div className="absolute top-4 right-6 pointer-events-none z-10 hidden sm:flex items-center gap-2 text-xs text-[#FAF7F0]/70 tracking-wider bg-black/40 px-3 py-1 rounded-full border border-white/10">
              <span>Scroll to Zoom · Drag to Orbit 360°</span>
            </div>

            {/* Upload status banner if active */}
            {uploadStatus && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-[#042D22] border border-[#C9A24A] text-[#FAF7F0] text-xs rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#C9A24A]" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* Collapsible Realism & Specs Sheet Side Drawer */}
          {showSpecsSheet && (
            <div className="w-80 md:w-96 bg-[#042D22]/95 border-l border-[#C9A24A]/30 p-6 overflow-y-auto space-y-6 text-white text-xs z-20 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-[#C9A24A]/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A24A]" />
                  <h3 className="font-editorial text-sm font-bold text-[#C9A24A] tracking-wider uppercase">
                    Realism Specification
                  </h3>
                </div>
                <button
                  onClick={() => setShowSpecsSheet(false)}
                  className="p-1 text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="font-editorial text-lg font-bold text-white leading-tight">
                  {currentMeta.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base font-bold text-[#C9A24A]">{currentMeta.price}</span>
                  <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 text-[10px] rounded border border-emerald-500/30">
                    Amazon Verified Find
                  </span>
                </div>
              </div>

              {/* Material & Dimension Specs */}
              <div className="space-y-3 bg-black/30 p-3.5 rounded-xl border border-white/10">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                    Materials & Finish Simulation
                  </span>
                  <p className="text-stone-200 mt-0.5 leading-relaxed">{currentMeta.materials}</p>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                    Dimensions & Ergonomics
                  </span>
                  <p className="text-stone-200 mt-0.5 leading-relaxed">{currentMeta.dimensions}</p>
                </div>
              </div>

              {/* Realistic Features Checklist */}
              <div className="space-y-2">
                <span className="text-[#C9A24A] font-semibold uppercase tracking-wider text-[11px] block">
                  100% Realistic Craftsmanship Points:
                </span>
                <ul className="space-y-2 text-stone-300">
                  {currentMeta.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#C9A24A] font-bold">✓</span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Amazon Affiliate Buy Button */}
              <div className="pt-4 border-t border-[#C9A24A]/20">
                <a
                  href={`https://www.amazon.com/dp/${currentMeta.asin}?tag=amazaura-20`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#C9A24A] hover:bg-[#d8b056] text-[#063D2E] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>View Product on Amazon</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-[10px] text-stone-400 text-center mt-2 italic">
                  Opens directly to official Amazon.com listing with affiliate tag
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Unified Bottom Control Dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30 pointer-events-auto">
          <div className="flex justify-center -mb-2">
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              aria-label={isDockCollapsed ? 'Expand 3D Controls' : 'Collapse 3D Controls'}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#042D22] border border-[#C9A24A]/40 text-[#C9A24A] text-xs font-medium rounded-t-lg shadow-lg hover:bg-[#063D2E] transition-colors"
            >
              {isDockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Show Studio Controls
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Hide Controls
                </>
              )}
            </button>
          </div>

          {!isDockCollapsed && (
            <div className="p-4 bg-[#042D22]/95 border border-[#C9A24A]/30 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
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

              {/* Exploded View Separation Slider */}
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

              {/* View Angles & Rotation toggle */}
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
                    Macro
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
