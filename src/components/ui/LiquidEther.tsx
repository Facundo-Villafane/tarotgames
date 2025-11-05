import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LiquidEtherProps {
  colors?: number[][];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
}

export const LiquidEther: React.FC<LiquidEtherProps> = ({
  colors = [
    [0.55, 0.36, 0.96], // Violet
    [0.62, 0.25, 0.88], // Purple
    [0.96, 0.25, 0.88], // Fuchsia
  ],
  speed = 0.15,
  amplitude = 0.3,
  frequencyX = 2,
  frequencyY = 2,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

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

        // Mouse interaction
        float mouseDist = length(st - u_mouse);
        float mouseEffect = smoothstep(0.5, 0.0, mouseDist) * 0.3;

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

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_colors: { value: colors.map(c => new THREE.Vector3(c[0], c[1], c[2])) },
      u_speed: { value: speed },
      u_amplitude: { value: amplitude },
      u_frequencyX: { value: frequencyX },
      u_frequencyY: { value: frequencyY },
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
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: 1.0 - (event.clientY - rect.top) / rect.height,
      };
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
      uniforms.u_mouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.05
      );
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
  }, [colors, speed, amplitude, frequencyX, frequencyY, interactive]);

  return <div ref={containerRef} className="w-full h-full" />;
};
