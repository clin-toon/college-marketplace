import { useState } from "react";
import { HiOutlinePhoto } from "react-icons/hi2";
import { cn } from "@/lib/cn";

export function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="glass-surface relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        {activeImage ? (
          <img
            src={activeImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-app-text-muted/40">
            <HiOutlinePhoto className="h-14 w-14" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5">
          {images.map((src, index) => (
            <button
              key={src + index}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 transition-all duration-150",
                index === activeIndex
                  ? "ring-2 ring-cyan"
                  : "ring-white/[0.08] opacity-60 hover:opacity-100",
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
