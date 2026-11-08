import Image from "next/image";

interface PageBackgroundProps {
  src: string;
  /** Adds a translucent white wash so text stays readable. */
  overlay?: boolean;
  priority?: boolean;
}

/**
 * Decorative, viewport-fixed background image. Replaces CSS `bg-fixed` backgrounds:
 * next/image serves a responsive, modern-format file and it stays cheap on mobile.
 */
export default function PageBackground({ src, overlay, priority }: PageBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Image src={src} alt="" fill sizes="100vw" quality={70} priority={priority} className="object-cover" />
      {overlay && <div className="absolute inset-0 bg-white/70" />}
    </div>
  );
}
