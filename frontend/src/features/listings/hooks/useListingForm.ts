import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { z } from "zod";
import {
  createListingSchema,
  updateListingSchema,
} from "@/features/listings/schemas/listingSchemas";
import {
  createListing,
  updateListing,
  type ListingFormPayload,
} from "@/features/my-listings/api/myListingsApi";
import type { ImageItem } from "@/components/listings/ImageUploader";
import type { EditableListingSource } from "@/types/listing";

interface UseListingFormOptions {
  mode: "create" | "edit";
  listing?: EditableListingSource;
  onSuccess: () => void;
}

type FormInput = z.input<typeof createListingSchema>;
type FormOutput = z.output<typeof createListingSchema>;

export function useListingForm({
  mode,
  listing,
  onSuccess,
}: UseListingFormOptions) {
  const schema =
    mode === "create"
      ? createListingSchema
      : (updateListingSchema as typeof createListingSchema);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: listing
      ? {
          title: listing.title,
          description: listing.description,
          price: Number(listing.price),
          condition: listing.condition,
          categoryName: listing.categoryName,
        }
      : {
          title: "",
          description: "",
          condition: undefined,
          categoryName: "",
        },
  });

  const [images, setImages] = useState<ImageItem[]>(() =>
    listing
      ? listing.images.map((url, i) => ({
          id: `existing-${i}`,
          previewUrl: url,
        }))
      : [],
  );
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = form.handleSubmit(async (values) => {
    if (images.length === 0) {
      setImagesError("At least one image is required.");
      return;
    }
    setImagesError(null);
    setIsSubmitting(true);

    const newFiles = images
      .filter((img) => img.file)
      .map((img) => img.file as File);
    const payload: ListingFormPayload = {
      title: values.title,
      description: values.description,
      price: values.price,
      condition: values.condition,
      categoryName: values.categoryName,
      images: newFiles,
    };

    try {
      if (mode === "create") {
        await createListing(payload);
        toast.success("Listing created.");
      } else if (listing) {
        const keepImageUrls = images
          .filter((img) => !img.file)
          .map((img) => img.previewUrl);
        await updateListing(listing.listing_id, payload, keepImageUrls);
        toast.success("Listing updated.");
      }
      onSuccess();
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, images, setImages, imagesError, onSubmit, isSubmitting };
}
