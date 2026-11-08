"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { TemplateId } from "@/lib/schemas/invitation.schema";
import { Sparkles, Eye, EyeOff } from "lucide-react";

interface FloatingRing3DProps {
  theme?: TemplateId;
}

export default function FloatingRing3D({ theme = "boda-botanica" }: FloatingRing3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag interaction refs
  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const previousPointerY = useRef(0);
  const dragVelocityX = useRef(0);
  const dragVelocityY = useRef(0);
  const dragRotationX = useRef(0);
  const dragRotationY = useRef(0);

  // Scroll tracking ref
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const targetRotationY = useRef(0);

  const isClasica = theme === "boda-clasica";
  const isBotanica = theme === "boda-botanica";
  const isBoho = theme === "boda-boho";

  // Calculate scroll progress for falling effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;

      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setScrollProgress(progress);

      const delta = scrollY - lastScrollY.current;
      scrollVelocity.current = delta * 0.003;
      targetRotationY.current += delta * 0.004;
      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = 160;
    const height = 160;

    // ─── SCENE & CAMERA ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    // ─── RENDERER ───
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch (err) {
      console.warn("WebGL not supported for 3D ring:", err);
      return;
    }

    // ─── STUDIO LIGHTING FOR DIAMOND & JEWELRY ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(
      isClasica ? 0xfffae6 : isBoho ? 0xfff0e6 : 0xf8fff0,
      3.2
    );
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Cool Diamond Specular Fill Light
    const fillLight = new THREE.DirectionalLight(0xddeeff, 2.2);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // Sparkling Top Rim Light
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.5);
    rimLight.position.set(0, 5, -2);
    scene.add(rimLight);

    // Camera Glint Point Light (creates diamond fire/sparkle)
    const glintLight = new THREE.PointLight(
      isClasica ? 0xffe899 : 0xffffff,
      2.5,
      8
    );
    glintLight.position.set(0, 1, 3.5);
    scene.add(glintLight);

    // ─── MODEL PIVOT & LOADING ───
    const pivot = new THREE.Group();
    scene.add(pivot);

    let ringModel: THREE.Group | null = null;
    const loader = new GLTFLoader();

    loader.load(
      "/models/diamond_ring.glb",
      (gltf) => {
        ringModel = gltf.scene;

        // Auto-center and normalize size
        const box = new THREE.Box3().setFromObject(ringModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        ringModel.position.x = -center.x;
        ringModel.position.y = -center.y;
        ringModel.position.z = -center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const targetScale = 2.1 / maxDim;
          pivot.scale.set(targetScale, targetScale, targetScale);
        }

        // Tweak materials for optimal sparkle & shine
        ringModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const materials = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];
              materials.forEach((mat) => {
                if ("roughness" in mat) {
                  (mat as THREE.MeshStandardMaterial).roughness = Math.min(
                    (mat as THREE.MeshStandardMaterial).roughness,
                    0.25
                  );
                }
                if ("metalness" in mat) {
                  (mat as THREE.MeshStandardMaterial).metalness = Math.max(
                    (mat as THREE.MeshStandardMaterial).metalness,
                    0.85
                  );
                }
                mat.needsUpdate = true;
              });
            }
          }
        });

        pivot.add(ringModel);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error("Error loading diamond ring 3D model:", err);
        setIsLoading(false);
      }
    );

    // ─── ANIMATION LOOP ───
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Decay drag velocities smoothly
      dragVelocityX.current *= 0.92;
      dragVelocityY.current *= 0.92;
      dragRotationY.current += dragVelocityX.current;
      dragRotationX.current += dragVelocityY.current;

      // Decay scroll velocity smoothly
      scrollVelocity.current *= 0.88;

      // Base idle tumbling rotation
      const idleSpinY = elapsedTime * 0.45;
      const idleBobY = Math.sin(elapsedTime * 1.6) * 0.12;
      const idleTiltX = Math.sin(elapsedTime * 0.8) * 0.15 + 0.25;
      const idleTiltZ = Math.cos(elapsedTime * 0.7) * 0.12;

      // Combine idle motion + scroll tumbling + interactive drag
      pivot.position.y = idleBobY;
      pivot.rotation.y = idleSpinY + targetRotationY.current + dragRotationY.current;
      pivot.rotation.x = idleTiltX + dragRotationX.current;
      pivot.rotation.z = idleTiltZ;

      // Subtle light oscillation for shimmering reflections
      glintLight.position.x = Math.sin(elapsedTime * 2.0) * 1.5;
      glintLight.position.y = Math.cos(elapsedTime * 1.5) * 1.2 + 1;

      renderer.render(scene, camera);
    };

    animate();

    // ─── CLEANUP ───
    return () => {
      cancelAnimationFrame(animationFrameId);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [isClasica, isBoho]);

  // ─── POINTER / TOUCH INTERACTION (DRAG TO SPIN) ───
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    previousPointerX.current = e.clientX;
    previousPointerY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousPointerX.current;
    const deltaY = e.clientY - previousPointerY.current;

    dragVelocityX.current = deltaX * 0.01;
    dragVelocityY.current = deltaY * 0.01;

    previousPointerX.current = e.clientX;
    previousPointerY.current = e.clientY;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  // Vertical falling position calculated across viewport (12vh near top down to 80vh near bottom)
  const verticalTop = 12 + scrollProgress * 68;

  // Theme badges & glow colors
  const glowShadow = isClasica
    ? "drop-shadow-[0_0_20px_rgba(212,175,55,0.45)]"
    : isBotanica
    ? "drop-shadow-[0_0_18px_rgba(85,107,47,0.35)]"
    : "drop-shadow-[0_0_18px_rgba(200,109,81,0.35)]";

  const badgeBg = isClasica
    ? "bg-black/80 text-[#D4AF37] border-[#D4AF37]/40 shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
    : isBotanica
    ? "bg-white/90 text-[#4A5D23] border-[#556B2F]/30 shadow-lg"
    : "bg-white/90 text-[#8C3D26] border-[#C86D51]/30 shadow-lg";

  return (
    <aside
      ref={containerRef}
      aria-label="Anillo de bodas interactivo 3D"
      className="fixed z-40 right-2 sm:right-6 md:right-8 select-none transition-all duration-300 ease-out"
      style={{
        top: `${verticalTop}vh`,
        transform: "translateY(-50%)",
      }}
    >
      {/* ─── EXPANDED 3D RING VIEW ─── */}
      {isVisible ? (
        <div className="relative flex flex-col items-center group">
          {/* Subtle Ambient Halo behind Ring */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 rounded-full blur-2xl opacity-40 pointer-events-none ${
              isClasica
                ? "bg-amber-400/30"
                : isBotanica
                ? "bg-emerald-300/30"
                : "bg-orange-300/30"
            }`}
          />

          {/* Interactive 3D Canvas */}
          <div className={`relative w-28 h-28 sm:w-36 sm:h-36 cursor-grab active:cursor-grabbing ${glowShadow}`}>
            <canvas
              ref={canvasRef}
              width={160}
              height={160}
              className="w-full h-full block"
              style={{ touchAction: "pan-y" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              title="Arrastrá para girar el anillo de bodas en 3D"
            />

            {/* Sparkle Glint Accent Icon */}
            <div
              aria-hidden="true"
              className="absolute top-2 right-2 pointer-events-none animate-pulse text-amber-300 drop-shadow"
            >
              <Sparkles size={16} />
            </div>

            {/* Loading Spinner Placeholder */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              </div>
            )}
          </div>

          {/* Mini Interactive Tooltip & Minimize Button */}
          <div className="flex items-center gap-1.5 -mt-2">
            <span
              className={`text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border backdrop-blur-md opacity-85 transition-opacity group-hover:opacity-100 ${badgeBg}`}
            >
              💍 Girame en 3D
            </span>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="w-5 h-5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center text-[10px] transition-all cursor-pointer shadow-sm"
              title="Ocultar anillo 3D"
              aria-label="Ocultar anillo 3D"
            >
              <EyeOff size={11} />
            </button>
          </div>
        </div>
      ) : (
        /* ─── MINIMIZED PILL (Allows user to reopen) ─── */
        <button
          type="button"
          onClick={() => setIsVisible(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${badgeBg}`}
          title="Ver anillo 3D"
          aria-label="Ver anillo 3D"
        >
          <span className="text-base animate-bounce">💍</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Ver Anillo</span>
          <Eye size={12} className="opacity-70" />
        </button>
      )}
    </aside>
  );
}
