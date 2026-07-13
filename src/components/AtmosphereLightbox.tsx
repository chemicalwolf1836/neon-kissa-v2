"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface AtmosphereLightboxProps {
  photos: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}

export function AtmosphereLightbox({
  photos,
  index,
  onClose,
  onNavigate,
  closeLabel,
  prevLabel,
  nextLabel,
}: AtmosphereLightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowLeft") { onNavigate((index - 1 + photos.length) % photos.length); return; }
      if (e.key === "ArrowRight") { onNavigate((index + 1) % photos.length); return; }
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, photos.length, onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 nk-lightbox-fade"
      style={{ background: "rgba(6,4,5,.92)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div ref={dialogRef} onClick={e => e.stopPropagation()} className="relative w-full h-full flex items-center justify-center">
        <Image
          src={photos[index]}
          alt=""
          width={1600}
          height={1067}
          sizes="100vw"
          priority
          className="w-auto h-auto max-w-full max-h-full rounded-[12px] object-contain nk-lightbox-pop"
          style={{ boxShadow: "0 20px 70px rgba(0,0,0,.6), 0 0 40px color-mix(in srgb,var(--accent) 14%,transparent)" }}
        />

        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-0 right-0 md:top-2 md:right-2 w-[44px] h-[44px] rounded-full border-none cursor-pointer flex items-center justify-center text-white text-[20px] transition-all"
          style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)" }}
        >
          ✕
        </button>

        {photos.length > 1 && (
          <>
            <button
              onClick={() => onNavigate((index - 1 + photos.length) % photos.length)}
              aria-label={prevLabel}
              className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full border-none cursor-pointer flex items-center justify-center text-white text-[20px] transition-all"
              style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)" }}
            >
              ←
            </button>
            <button
              onClick={() => onNavigate((index + 1) % photos.length)}
              aria-label={nextLabel}
              className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full border-none cursor-pointer flex items-center justify-center text-white text-[20px] transition-all"
              style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)" }}
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
