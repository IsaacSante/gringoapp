import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';

// Required for expo-three to work properly
global.THREE = global.THREE || THREE;

// --- GLSL NOISE ---
const simplex3D = `
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

function createDiscGeometry(outerRadius: number, innerRadius: number, thickness: number): THREE.BufferGeometry {
  const segments = 96;
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const halfThick = thickness / 2;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Top face: outer then inner
    positions.push(cos * outerRadius, sin * outerRadius, halfThick);
    normals.push(0, 0, 1);
    positions.push(cos * innerRadius, sin * innerRadius, halfThick);
    normals.push(0, 0, 1);

    // Bottom face: outer then inner
    positions.push(cos * outerRadius, sin * outerRadius, -halfThick);
    normals.push(0, 0, -1);
    positions.push(cos * innerRadius, sin * innerRadius, -halfThick);
    normals.push(0, 0, -1);

    // Outer edge: top then bottom
    positions.push(cos * outerRadius, sin * outerRadius, halfThick);
    normals.push(cos, sin, 0);
    positions.push(cos * outerRadius, sin * outerRadius, -halfThick);
    normals.push(cos, sin, 0);

    // Inner edge: top then bottom
    positions.push(cos * innerRadius, sin * innerRadius, halfThick);
    normals.push(-cos, -sin, 0);
    positions.push(cos * innerRadius, sin * innerRadius, -halfThick);
    normals.push(-cos, -sin, 0);
  }

  const vertsPerSegment = 8;
  for (let i = 0; i < segments; i++) {
    const a = i * vertsPerSegment;
    const b = (i + 1) * vertsPerSegment;

    // Top face
    indices.push(a, b, a + 1);
    indices.push(a + 1, b, b + 1);
    // Bottom face
    indices.push(a + 2, a + 3, b + 2);
    indices.push(a + 3, b + 3, b + 2);
    // Outer edge
    indices.push(a + 4, b + 4, a + 5);
    indices.push(a + 5, b + 4, b + 5);
    // Inner edge
    indices.push(a + 6, a + 7, b + 6);
    indices.push(a + 7, b + 7, b + 6);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  return geometry;
}

export default function AnimationDisplay() {
  const rafRef = useRef<number | null>(null);

  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();

    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 0, 6);

    // Lighting
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight2.position.set(-10, -10, 10);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Liquid metal material (matching reference)
    const dummyTex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    dummyTex.needsUpdate = true;

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xeeeeee,
      metalness: 0.25,
      roughness: 0.0,
      clearcoat: 0.9,
      clearcoatRoughness: 0.0,
      iridescence: 0.907,
      iridescenceIOR: 1.0,
      iridescenceThicknessRange: [759, 800],
      iridescenceThicknessMap: dummyTex,
    });

    const uTime = { value: 0 };
    const uScale = { value: 0.15 };
    const uDistortion = { value: 0.5 };

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime;
      shader.uniforms.uScale = uScale;
      shader.uniforms.uDistortion = uDistortion;

      shader.vertexShader = `
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        varying vec3 vOriginalNormal;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `
        #include <worldpos_vertex>
        vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vLocalPos = position;
        vOriginalNormal = normal;
        `
      );

      shader.fragmentShader = `
        uniform float uTime;
        uniform float uScale;
        uniform float uDistortion;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        varying vec3 vOriginalNormal;
        float vFluidNoise;
        ${simplex3D}
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_begin>',
        `
        #include <normal_fragment_begin>

        vec3 p = vLocalPos * uScale;
        p.y -= uTime * 0.05;

        vec3 warp;
        warp.x = snoise(p + vec3(0.0, 0.0, uTime * 0.1));
        warp.y = snoise(p + vec3(114.5, 22.1, uTime * 0.1));
        warp.z = snoise(p + vec3(233.2, 51.5, uTime * 0.1));
        vec3 warpedP = p + warp * 1.5;

        float eps = 0.03;
        float n0 = snoise(warpedP);
        float nx = snoise(warpedP + vec3(eps, 0.0, 0.0));
        float ny = snoise(warpedP + vec3(0.0, eps, 0.0));
        float nz = snoise(warpedP + vec3(0.0, 0.0, eps));

        vFluidNoise = n0;

        vec3 noiseNormal = normalize(vec3(nx - n0, ny - n0, nz - n0));
        vec3 viewNoiseNormal = normalize((viewMatrix * vec4(noiseNormal, 0.0)).xyz);

        float isFlatFace = smoothstep(0.1, 0.9, abs(vOriginalNormal.z));

        normal = normalize(normal + viewNoiseNormal * uDistortion * isFlatFace);
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        /texture2D\(\s*iridescenceThicknessMap\s*,\s*vIridescenceThicknessMapUv\s*\)/g,
        'vec4(vFluidNoise * 0.5 + 0.5)'
      );
    };

    // CD disc
    const discGeometry = createDiscGeometry(1.8, 0.35, 0.12);
    const disc = new THREE.Mesh(discGeometry, material);
    disc.rotation.x = Math.PI * 0.15;
    scene.add(disc);

    let startTime = Date.now();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const elapsed = (Date.now() - startTime) / 1000;
      uTime.value = elapsed;
      disc.rotation.z = elapsed * 0.5;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 28,
  },
  gl: {
    flex: 1,
  },
});
