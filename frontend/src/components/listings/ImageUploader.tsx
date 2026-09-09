import { useRef } from "react";
import { HiOutlinePhoto, HiOutlinePlus, HiXMark } from "react-icons/hi2";
import toast from "react-hot-toast";
import {
  MAX_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/features/listings/schemas/listingSchemas";

export interface ImageItem {
  id: string;
  previewUrl: string;
  /** Present for newly added images; absent for images that already existed (edit mode). */
  file?: File;
}

interface ImageUploaderProps {
  value: ImageItem[];
  onChange: (items: ImageItem[]) => void;
  error?: string;
}

export function ImageUploader({ value, onChange, error }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) return;

    const incoming = Array.from(fileList);
    const remainingSlots = MAX_IMAGES - value.length;

    if (remainingSlots <= 0) {
      toast.error(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const accepted: ImageItem[] = [];
    for (const file of incoming) {
      if (accepted.length >= remainingSlots) {
        toast.error(
          `Only ${MAX_IMAGES} images allowed — some files were skipped.`,
        );
        break;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(`"${file.name}" is larger than 5MB.`);
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        previewUrl: URL.createObjectURL(file),
        file,
      });
    }

    if (accepted.length > 0) {
      onChange([...value, ...accepted]);
    }

    // allow re-selecting the same file after removal
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove(id: string) {
    const target = value.find((item) => item.id === id);
    if (target?.file) URL.revokeObjectURL(target.previewUrl);
    onChange(value.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-app-text-muted">
          Images
        </label>
        <span className="text-xs text-app-text-muted/60">
          {value.length}/{MAX_IMAGES} · max 5MB each
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] bg-surface-2"
          >
            <img
              src={item.previewUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              aria-label="Remove image"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-void/70 text-white backdrop-blur-md ring-1 ring-white/[0.15] transition-transform hover:scale-110"
            >
              <HiXMark className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {value.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/[0.15] text-app-text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <HiOutlinePlus className="h-5 w-5" />
            <span className="text-[11px] font-medium">Add</span>
          </button>
        )}
      </div>

      {value.length === 0 && (
        <div className="flex items-center gap-2 text-[12px] text-app-text-muted/70">
          <HiOutlinePhoto className="h-4 w-4" />
          <span>Add at least one photo of the item.</span>
        </div>
      )}

      {error && <p className="text-xs font-medium text-danger">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
    </div>
  );
}
