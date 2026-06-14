"use client";

import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { SITE } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <Link
      href={SITE.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
      aria-label="WhatsApp"
    >
      <Image
        src={assets.icons.whatsapp}
        alt=""
        width={32}
        height={32}
        className="size-8 brightness-0 invert"
      />
    </Link>
  );
}
