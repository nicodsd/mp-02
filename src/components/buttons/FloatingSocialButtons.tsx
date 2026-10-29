"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaShareAlt, FaChevronDown } from "react-icons/fa";

interface FloatingSocialButtonsProps {
  user: any;
  className?: string;
  isDropdown?: boolean;
}

export default function FloatingSocialButtons({
  user,
  className = "",
  isDropdown = false,
}: FloatingSocialButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const instagram = user.instagram ? user.instagram.trim().replace(/^@/, "") : "";
  const facebook = user.facebook ? user.facebook.trim().replace(/^@/, "") : "";
  const tiktok = user.tiktok ? user.tiktok.trim().replace(/^@/, "") : "";

  const socialLinks = [
    {
      id: "instagram",
      href: instagram ? `https://www.instagram.com/${instagram}` : null,
      icon: <FaInstagram size={18} />,
      bg: "bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90",
      ariaLabel: "Instagram",
      label: "Instagram",
    },
    {
      id: "facebook",
      href: facebook ? `https://www.facebook.com/${facebook}` : null,
      icon: <FaFacebookF size={17} />,
      bg: "bg-[#1877F2] text-white hover:opacity-90",
      ariaLabel: "Facebook",
      label: "Facebook",
    },
    {
      id: "tiktok",
      href: tiktok ? `https://www.tiktok.com/@${tiktok}` : null,
      icon: <FaTiktok size={17} />,
      bg: "bg-black text-white hover:opacity-90",
      ariaLabel: "TikTok",
      label: "TikTok",
    },
  ].filter((s) => Boolean(s.href));

  if (socialLinks.length === 0) return null;

  // Si se solicita modo dropdown (ideal para navbars estrechos u horizontales)
  if (isDropdown) {
    return (
      <div ref={containerRef} className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <span>Redes</span>
          <FaChevronDown
            size={10}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 bg-neutral-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-1 flex flex-col gap-1 min-w-35 animate-in fade-in zoom-in-95 duration-150">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all text-xs font-medium cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${social.bg}`}
                >
                  {social.icon}
                </div>
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Renderizado por defecto en fila
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.id}
          href={social.href!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.ariaLabel}
          className={`w-9 h-9 rounded-full shadow-md shadow-black/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-white/70 ${social.bg}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
