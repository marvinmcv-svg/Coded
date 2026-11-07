// Mirrors the CSS tokens in app/globals.css so GSAP and CSS share one motion vocabulary.
export const dur = { 1: 0.24, 2: 0.4, 3: 0.6, 4: 0.9, 5: 1.2 } as const;

export const ease = {
  expoOut: "expo.out",
  power3InOut: "power3.inOut",
  coded: "coded", // registered via CustomEase-free cubic in components/motion/gsap.ts
} as const;

export const codedBezier = [0.65, 0, 0.15, 1] as const;
