"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { codedBezier } from "@/lib/motion/tokens";

// Single registration point. Import this module only via dynamic import (useLazyGSAP / SmoothScroll)
// so GSAP stays out of every route's initial JS.
gsap.registerPlugin(ScrollTrigger, CustomEase);
const [x1, y1, x2, y2] = codedBezier;
CustomEase.create("coded", `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);

export { gsap, ScrollTrigger };
