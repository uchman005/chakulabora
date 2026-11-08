import type { IconType } from "react-icons";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { shareLinks } from "@/lib/share";

const LINK =
  "inline-flex min-h-11 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100";

/** Plain share links: no third-party scripts or trackers load until someone clicks one. */
export default function ShareButtons({ title, blob }: { title: string; blob: string }) {
  const links = shareLinks(title, blob);
  const targets: { name: string; href: string; icon: IconType; iconClass: string }[] = [
    { name: "WhatsApp", href: links.whatsapp, icon: FaWhatsapp, iconClass: "text-[#128C7E]" },
    { name: "Facebook", href: links.facebook, icon: FaFacebook, iconClass: "text-[#1877F2]" },
    { name: "X", href: links.x, icon: FaXTwitter, iconClass: "text-black" },
  ];

  return (
    <section aria-labelledby="share-heading" className="m-4 flex flex-wrap items-center justify-center gap-3 px-3">
      <h2 id="share-heading" className="m-0 text-base font-semibold text-gray-900">
        Share this post
      </h2>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
        {targets.map(({ name, href, icon: Icon, iconClass }) => (
          <li key={name}>
            <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
              <Icon className={`text-xl ${iconClass}`} aria-hidden />
              <span>
                <span className="sr-only">Share on </span>
                {name}
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
