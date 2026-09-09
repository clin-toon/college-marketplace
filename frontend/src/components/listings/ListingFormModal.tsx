import { Modal } from "@/components/ui/Modal";
import { AppTextField } from "@/components/ui/AppTextField";
import { AppSelectField } from "@/components/ui/AppSelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { ImageUploader } from "@/components/listings/ImageUploader";
import { useListingForm } from "@/features/listings/hooks/useListingForm";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { CONDITION_VALUES } from "@/features/listings/schemas/listingSchemas";
import { formatCondition } from "@/lib/format";
import type { EditableListingSource } from "@/types/listing";

interface ListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  listing?: EditableListingSource;
  onSuccess: () => void;
}

export function ListingFormModal({
  isOpen,
  onClose,
  mode,
  listing,
  onSuccess,
}: ListingFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create a listing" : "Edit listing"}
      subtitle={
        mode === "create"
          ? "Fill in the details below to list an item for sale."
          : "Update the details of your listing."
      }
      maxWidthClassName="max-w-2xl"
    >
      {/* Mounted only while open, so the form/image state resets fresh each time it opens. */}
      {isOpen && (
        <ListingFormFields
          mode={mode}
          listing={listing}
          onClose={onClose}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

function ListingFormFields({
  mode,
  listing,
  onClose,
  onSuccess,
}: {
  mode: "create" | "edit";
  listing?: EditableListingSource;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { form, images, setImages, imagesError, onSubmit, isSubmitting } =
    useListingForm({
      mode,
      listing,
      onSuccess,
    });
  const { categories, isLoading: categoriesLoading } = useCategories();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <AppTextField
        label="Title"
        placeholder="e.g. Discrete Mathematics Textbook"
        error={errors.title?.message}
        {...register("title")}
      />

      <TextAreaField
        label="Description"
        placeholder="Describe the item's condition, usage, and anything a buyer should know…"
        rows={4}
        hint={`${form.watch("description")?.length ?? 0}/2000`}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-2 gap-4">
        <AppTextField
          label="Price (Rs.)"
          type="number"
          step="0.01"
          placeholder="e.g. 500"
          error={errors.price?.message}
          {...register("price")}
        />

        <AppSelectField
          label="Condition"
          placeholder="Select condition"
          error={errors.condition?.message}
          {...register("condition")}
        >
          {CONDITION_VALUES.map((value) => (
            <option
              key={value}
              value={value}
              className="bg-surface-2 text-app-text"
            >
              {formatCondition(value)}
            </option>
          ))}
        </AppSelectField>
      </div>

      <AppSelectField
        label="Category"
        placeholder={
          categoriesLoading ? "Loading categories…" : "Select category"
        }
        disabled={categoriesLoading}
        error={errors.categoryName?.message}
        {...register("categoryName")}
      >
        {categories.map((category) => (
          <option
            key={category.categoryId}
            value={category.name}
            className="bg-surface-2 text-app-text"
          >
            {category.name}
          </option>
        ))}
      </AppSelectField>

      <ImageUploader
        value={images}
        onChange={setImages}
        error={imagesError ?? undefined}
      />

      <div className="mt-2 flex justify-end gap-3 border-t border-white/[0.06] pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[13.5px] font-medium text-app-text-muted transition-colors hover:bg-white/[0.05] hover:text-app-text"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-5 py-2.5 font-display text-[13.5px] font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-all duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          <span>
            {isSubmitting
              ? mode === "create"
                ? "Creating…"
                : "Saving…"
              : mode === "create"
                ? "Create listing"
                : "Save changes"}
          </span>
        </button>
      </div>
    </form>
  );
}
