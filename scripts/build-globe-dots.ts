/**
 * Precomputes the land dots for the home globe (components/three/Globe.tsx) so the client ships a small
 * JSON array instead of map data + geometry code. Re-run: pnpm tsx scripts/build-globe-dots.ts
 * Source: Natural Earth 110m land via world-atlas (public domain).
 */
import { writeFileSync } from "node:fs";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land from "world-atlas/land-110m.json" with { type: "json" };

const N = 16000; // fibonacci points over the whole sphere; ~30 % fall on land
const topo = land as unknown as Topology<{ land: GeometryCollection }>;
const shape = feature(topo, topo.objects.land);

const out: number[] = [];
const golden = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lng = ((((i * golden * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // skip Antarctica: reads as noise at this density
  if (geoContains(shape, [lng, lat])) out.push(Math.round(lat * 10) / 10, Math.round(lng * 10) / 10);
}
writeFileSync("components/three/globe-dots.json", JSON.stringify(out));
console.log(`${out.length / 2} land dots`);
