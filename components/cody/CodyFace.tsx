/** Cody's face: a glossy brand-gradient orb with blinking eyes and an orbiting ring (CSS only, see globals.css .cody-*). */
export function CodyFace({ size = 56, ring = true }: { size?: number; ring?: boolean }) {
  return (
    <span aria-hidden className="cody-face relative inline-block shrink-0" style={{ width: size, height: size }}>
      {ring && <span className="cody-ring absolute -inset-[3px] rounded-full" />}
      <span className="absolute inset-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_25%,#e9e3ff_0%,#c5bbfd_14%,#7600e7_48%,#3b0a8f_78%,#12061f_100%)] shadow-[inset_0_-6px_14px_rgb(58_159_214/.45),0_10px_30px_-8px_rgb(118_0_231/.9)]">
        <span className="absolute inset-x-[18%] top-[8%] h-[30%] rounded-full bg-white/35 blur-[3px]" />
        <span className="absolute top-[44%] left-1/2 flex -translate-x-1/2 gap-[18%]" style={{ width: "46%" }}>
          <span className="cody-eye block aspect-[1/1.6] w-[26%] rounded-full bg-white shadow-[0_0_8px_#c5bbfd]" />
          <span className="cody-eye block aspect-[1/1.6] w-[26%] rounded-full bg-white shadow-[0_0_8px_#c5bbfd]" />
        </span>
      </span>
    </span>
  );
}
