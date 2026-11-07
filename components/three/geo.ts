import { Vector3 } from "three";

export const R = 1;

/** lat/lng (degrees) → point on a sphere of radius r. lng 0 faces -x… see Globe for the matching rotation. */
export function toVec(lat: number, lng: number, r = R) {
  const la = (lat * Math.PI) / 180;
  const ln = (lng * Math.PI) / 180;
  return new Vector3(r * Math.cos(la) * Math.cos(ln), r * Math.sin(la), -r * Math.cos(la) * Math.sin(ln));
}

/** Group rotation [x, y] that brings lat/lng to face a camera on +z (tilt softened). */
export function faceRotation(lat: number, lng: number): [number, number] {
  return [((lat * Math.PI) / 180) * 0.6, -((lng + 90) * Math.PI) / 180];
}
