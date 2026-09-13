import { Modal } from "@/components/ui/Modal";
import { AppTextField } from "@/components/ui/AppTextField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { useCategoryForm } from "@/features/admin/categories/hooks/useCategoryForm";
import type { AdminCategory } from "@/types/category";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  category?: AdminCategory;
  onSuccess: () => void;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  mode,
  category,
  onSuccess,
}: CategoryFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "New category" : "Edit category"}
      subtitle={
        mode === "create"
          ? "Add a new category listings can be filed under."
          : "Update this category's name or description."
      }
      maxWidthClassName="max-w-lg"
    >
      {isOpen && (
        <CategoryFormFields
          mode={mode}
          category={category}
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

function CategoryFormFields({
  mode,
  category,
  onClose,
  onSuccess,
}: {
  mode: "create" | "edit";
  category?: AdminCategory;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { form, onSubmit, isSubmitting } = useCategoryForm({
    mode,
    category,
    onSuccess,
  });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <AppTextField
        label="Name"
        placeholder="e.g. Electronics"
        error={errors.name?.message}
        {...register("name")}
      />

      <TextAreaField
        label="Description"
        placeholder="What kind of items belong in this category? (optional)"
        rows={3}
        error={errors.description?.message}
        {...register("description")}
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
                ? "Create category"
                : "Save changes"}
          </span>
        </button>
      </div>
    </form>
  );
}
