import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { loadTextureAsync, Renderer } from 'expo-three';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';

global.THREE = global.THREE || THREE;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Bayer 8x8 encoded as a float lookup to avoid array indexing issues on mobile
const fragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uPixelSize;
  uniform float uStrength;
  varying vec2 vUv;

  float bayer2(vec2 p) {
    float b0 = mod(floor(p.x), 2.0);
    float b1 = mod(floor(p.y), 2.0);
    return mod(b0 + 2.0 * b1, 4.0) / 4.0;
  }

  float bayer4(vec2 p) {
    return 0.25 * bayer2(0.5 * p) + bayer2(p);
  }

  float bayer8(vec2 p) {
    return (0.25 * bayer4(0.5 * p) + bayer2(p)) / 3.0;
  }

  void main() {
    vec2 pc = vUv * uResolution;
    float block = max(uPixelSize, 1.0);
    vec2 snapped = (floor(pc / block) * block + block * 0.5) / uResolution;

    vec4 color = texture2D(uTexture, snapped);
    float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));

    vec2 ditherPos = floor(pc / block);
    float threshold = bayer8(ditherPos);

    float dithered = step(threshold, luma);
    vec3 ditheredColor = color.rgb * dithered;
    vec3 finalColor = mix(color.rgb, ditheredColor, uStrength);

    gl_FragColor = vec4(finalColor, color.a);
  }
`;

const imageAsset = require('@/assets/images/red_disk_trans_3.png');

export default function AnimationDisplayPlaceholder() {
  const rendered = useRef(false);

  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    if (rendered.current) return;
    rendered.current = true;

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: new THREE.Texture() },
        uResolution: { value: new THREE.Vector2(gl.drawingBufferWidth, gl.drawingBufferHeight) },
        uPixelSize: { value: 10.0 },
        uStrength: { value: 0.5 },
      },
      transparent: true,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // Load texture, fit to viewport preserving aspect ratio, then render
    loadTextureAsync({ asset: imageAsset }).then((texture: THREE.Texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      material.uniforms.uTexture.value = texture;
      material.needsUpdate = true;

      const imgW = texture.image.width;
      const imgH = texture.image.height;
      const viewAspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      const imgAspect = imgW / imgH;

      let scaleX = 1;
      let scaleY = 1;
      if (imgAspect > viewAspect) {
        scaleY = viewAspect / imgAspect;
      } else {
        scaleX = imgAspect / viewAspect;
      }
      quad.scale.set(scaleX, scaleY, 1);

      renderer.render(scene, camera);
      gl.endFrameEXP();
    });
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
