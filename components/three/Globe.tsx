"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, View } from "@react-three/drei";
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Line, LineBasicMaterial, QuadraticBezierCurve3, type Group } from "three";
import dots from "./globe-dots.json";
import { faceRotation, R, toVec } from "./geo";

export type Stop = { key: string; lat: number; lng: number };

const LAVENDER = new Color("#c5bbfd");
const MAGENTA = new Color("#ce36df");
const INK2 = new Color("#1a1e27");
const SEGMENTS = 96;

const dotVert = /* glsl */ `
  uniform float uSize;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = normalize(normalMatrix * position).z;
    gl_PointSize = uSize * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const dotFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vFacing;
  void main() {
    if (length(gl_PointCoord - 0.5) > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(-0.1, 0.6, vFacing) * 0.85);
  }`;

function Land({ size }: { size: number }) {
  const geometry = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < dots.length; i += 2) pos.push(...toVec(dots[i]!, dots[i + 1]!, R * 1.002).toArray());
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <points geometry={geometry}>
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{ uSize: { value: size }, uColor: { value: LAVENDER } }}
        vertexShader={dotVert}
        fragmentShader={dotFrag}
      />
    </points>
  );
}

/** Arc lifted off the surface (LATAM → destination); drawn progressively when its stop becomes active. */
function Arc({ from, to, shown }: { from: Stop; to: Stop; shown: boolean }) {
  const progress = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  const line = useMemo(() => {
    const a = toVec(from.lat, from.lng);
    const b = toVec(to.lat, to.lng);
    const lift = 1 + a.distanceTo(b) * 0.45;
    const curve = new QuadraticBezierCurve3(a, a.clone().add(b).normalize().multiplyScalar(lift), b);
    const geometry = new BufferGeometry().setFromPoints(curve.getPoints(SEGMENTS));
    geometry.setDrawRange(0, 0);
    return new Line(geometry, new LineBasicMaterial({ color: MAGENTA, transparent: true, opacity: 0.9, blending: AdditiveBlending }));
  }, [from, to]);

  useFrame((_, dt) => {
    const target = shown ? 1 : 0;
    progress.current += (target - progress.current) * Math.min(1, dt * 3);
    if (Math.abs(target - progress.current) > 0.002) invalidate();
    else progress.current = target;
    line.geometry.setDrawRange(0, Math.round(progress.current * (SEGMENTS + 1)));
  });

  return <primitive object={line} />;
}

function Marker({ stop, active }: { stop: Stop; active: boolean }) {
  const p = useMemo(() => toVec(stop.lat, stop.lng, R * 1.01), [stop]);
  return (
    <mesh position={p} scale={active ? 1.8 : 1}>
      <sphereGeometry args={[0.018, 16, 16]} />
      <meshBasicMaterial color={active ? MAGENTA : LAVENDER} />
    </mesh>
  );
}

function Scene({ stops, active }: { stops: Stop[]; active: number }) {
  const group = useRef<Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const height = useThree((s) => s.size.height);
  const [origin, ...destinations] = stops as [Stop, ...Stop[]];
  const target = faceRotation(stops[active]!.lat, stops[active]!.lng);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const k = Math.min(1, dt * 2.5);
    // shortest way round on y
    let dy = target[1] - g.rotation.y;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    const dx = target[0] - g.rotation.x;
    g.rotation.y += dy * k;
    g.rotation.x += dx * k;
    if (Math.abs(dy) + Math.abs(dx) > 0.0005) invalidate();
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 3.7]} fov={40} />
      <group ref={group} rotation={[faceRotation(origin.lat, origin.lng)[0], faceRotation(origin.lat, origin.lng)[1], 0]}>
        <mesh>
          <sphereGeometry args={[R * 0.995, 64, 64]} />
          <meshBasicMaterial color={INK2} />
        </mesh>
        <Land size={height * 0.012} />
        {stops.map((s, i) => <Marker key={s.key} stop={s} active={i === active} />)}
        {destinations.map((d, i) => <Arc key={d.key} from={origin} to={d} shown={i + 1 <= active} />)}
      </group>
    </>
  );
}

/** DOM side: a drei <View> that the persistent canvas (CanvasRoot) renders into. */
export default function GlobeView({ stops, active, className }: { stops: Stop[]; active: number; className?: string }) {
  return (
    <View className={className}>
      <Scene stops={stops} active={active} />
    </View>
  );
}
