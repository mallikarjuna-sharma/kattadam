import Image from "next/image";
import { KD360_LOGO_SRC, KD360_NAME } from "@/lib/kd360-contact";

const SIZES = {
  xs: { kd: "text-xs", img: 18 },
  sm: { kd: "text-sm", img: 26 },
  md: { kd: "text-base", img: 34 },
  lg: { kd: "text-2xl", img: 46 },
  xl: { kd: "text-3xl md:text-4xl", img: 58 },
} as const;

type Props = {
  className?: string;
  size?: keyof typeof SIZES;
  /** Light text on dark backgrounds */
  variant?: "default" | "light";
};

export default function KD360Logo({ className = "", size = "md", variant = "default" }: Props) {
  const s = SIZES[size];
  const kdColor = variant === "light" ? "text-white" : "text-inherit";

  return (
    <span
      className={`inline-flex items-center gap-0.5 leading-none ${className}`}
      role="img"
      aria-label={KD360_NAME}
    >
      <span className={`font-display font-bold ${kdColor} ${s.kd}`}>KD</span>
      <Image
        src={KD360_LOGO_SRC}
        alt=""
        width={s.img}
        height={s.img}
        className={`object-contain ${variant === "light" ? "brightness-0 invert" : ""}`}
        aria-hidden
      />
    </span>
  );
}
