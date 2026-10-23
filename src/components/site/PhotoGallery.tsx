import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

export interface GalleryPhoto {
  src: string;
  alt: string;
}

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  const current = index !== null ? photos[index] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <Reveal key={photo.src} delay={Math.min(i, 8) * 40}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View photo ${i + 1} of ${photos.length}`}
              className="group relative block w-full overflow-hidden border border-border"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-primary-deep/0 transition-colors group-hover:bg-primary-deep/30">
                <Expand
                  className="size-5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo viewer"
            className="absolute top-4 right-4 flex size-10 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            className="absolute left-4 flex size-10 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-4 flex size-10 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <figure
            className="flex max-h-full flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[78vh] w-auto max-w-full object-contain"
            />
            <figcaption className="text-xs tracking-wide text-white/70">
              {index !== null ? `${index + 1} / ${photos.length}` : ""}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
