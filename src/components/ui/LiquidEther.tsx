import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LiquidEtherProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

// Utility to convert hex color to RGB array [0-1]
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0.5, 0.5, 0.5];
};

export const LiquidEther: React.FC<LiquidEtherProps> = ({
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  mouseForce = 20,
  cursorSize = 100,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 3000,
  autoRampDuration = 0.6,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const autoDemoTimeRef = useRef(0);
  const lastInteractionRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Vertex Shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment Shader
    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec3 u_colors[3];
      uniform float u_speed;
      uniform float u_amplitude;
      uniform float u_frequencyX;
      uniform float u_frequencyY;
      uniform float u_mouseForce;
      uniform float u_cursorSize;
      varying vec2 vUv;

      // Noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        vec2 st = gl_FragCoord.xy / u_resolution.xy;

        // Create flowing effect
        float noise1 = snoise(vec2(st.x * u_frequencyX + u_time * u_speed, st.y * u_frequencyY - u_time * u_speed * 0.5));
        float noise2 = snoise(vec2(st.x * u_frequencyX * 1.5 - u_time * u_speed * 0.8, st.y * u_frequencyY * 1.5 + u_time * u_speed * 0.3));
        float noise3 = snoise(vec2(st.x * u_frequencyX * 0.8 + u_time * u_speed * 0.6, st.y * u_frequencyY * 0.8 - u_time * u_speed * 0.4));

        // Mouse interaction with custom force and cursor size
        float mouseDist = length(st - u_mouse);
        float mouseEffect = smoothstep(u_cursorSize, 0.0, mouseDist) * u_mouseForce;

        // Combine noise layers
        float combinedNoise = (noise1 + noise2 * 0.5 + noise3 * 0.3) * u_amplitude + mouseEffect;

        // Create color blend
        float blend1 = smoothstep(-0.5, 0.5, combinedNoise);
        float blend2 = smoothstep(-0.3, 0.7, combinedNoise + 0.2);

        vec3 color = mix(u_colors[0], u_colors[1], blend1);
        color = mix(color, u_colors[2], blend2);

        // Add subtle glow
        float glow = 1.0 - length(st - vec2(0.5)) * 0.5;
        color += glow * 0.1;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Convert hex colors to RGB
    const rgbColors = colors.map(hexToRgb);

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_colors: { value: rgbColors.map(c => new THREE.Vector3(c[0], c[1], c[2])) },
      u_speed: { value: autoSpeed },
      u_amplitude: { value: autoIntensity * 0.2 },
      u_frequencyX: { value: 2 },
      u_frequencyY: { value: 2 },
      u_mouseForce: { value: mouseForce / 100 },
      u_cursorSize: { value: cursorSize / 1000 },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: 1.0 - (event.clientY - rect.top) / rect.height,
      };
      lastInteractionRef.current = Date.now();
    };

    // Resize handler
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width, height);
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      uniforms.u_time.value += 0.01;

      // Auto demo mode
      if (autoDemo && Date.now() - lastInteractionRef.current > autoResumeDelay) {
        autoDemoTimeRef.current += 0.01 * autoSpeed;
        const autoDemoX = 0.5 + Math.sin(autoDemoTimeRef.current) * 0.3;
        const autoDemoY = 0.5 + Math.cos(autoDemoTimeRef.current * 0.7) * 0.3;

        uniforms.u_mouse.value.lerp(
          new THREE.Vector2(autoDemoX, autoDemoY),
          takeoverDuration * 0.1
        );
      } else {
        uniforms.u_mouse.value.lerp(
          new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
          0.05
        );
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [colors, mouseForce, cursorSize, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration]);

  return <div ref={containerRef} className="w-full h-full" />;
};
