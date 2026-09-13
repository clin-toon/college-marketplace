import { useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineExclamationTriangle,
  HiOutlineTag,
} from "react-icons/hi2";
import { StatePanel } from "@/components/ui/StatePanel";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";
import { useAdminCategories } from "@/features/admin/categories/hooks/useAdminCategories";
import { useDeleteCategory } from "@/features/admin/categories/hooks/useDeleteCategory";
import { formatDate } from "@/lib/format";
import type { AdminCategory } from "@/types/category";

export default function Categories() {
  const { categories, isLoading, error, retry } = useAdminCategories();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
    null,
  );
  const [deletingCategory, setDeletingCategory] =
    useState<AdminCategory | null>(null);

  const { isDeleting, remove } = useDeleteCategory(() => {
    setDeletingCategory(null);
    retry();
  });

  return (
    <div className="mx-auto max-w-5xl px-8 py-10 lg:px-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className=" text-[11px] font-semibold uppercase tracking-widest ">
            Manage
          </span>
          <h1 className="text-2xl font-semibold tracking-tight ">Categories</h1>
          <p className="text-[14px] text-slate-700">
            {categories.length > 0
              ? `${categories.length} categories listings can be filed under.`
              : "Create categories listings can be filed under."}
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-4 py-2.5 cursor-pointer text-[13.5px] font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-all duration-150 hover:-translate-y-0.5"
        >
          <HiOutlinePlus className="h-4 w-4" />
          <span>New category</span>
        </button>
      </div>

      {isLoading && (
        <div className="glass-surface flex flex-col gap-1 rounded-2xl p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl px-4 py-3.5"
            >
              <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-3 flex-1 animate-pulse rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <StatePanel
          icon={<HiOutlineExclamationTriangle className="h-5 w-5" />}
          title="Couldn't load categories"
          description={error}
          action={
            <button
              onClick={retry}
              className="mt-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-5 py-2 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-transform hover:-translate-y-0.5"
            >
              Try again
            </button>
          }
        />
      )}

      {!isLoading && !error && categories.length === 0 && (
        <StatePanel
          icon={<HiOutlineTag className="h-5 w-5" />}
          title="No categories yet"
          description="Create your first category for listings to be filed under."
          action={
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-5 py-2 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-transform hover:-translate-y-0.5"
            >
              Create a category
            </button>
          }
        />
      )}

      {!isLoading && !error && categories.length > 0 && (
        <div className="glass-surface overflow-hidden rounded-2xl">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wid bg-slate-100">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Listings</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.categoryId}
                  className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4 font-bold">{category.name}</td>
                  <td className="max-w-xs truncate px-5 py-4 ">
                    {category.description || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 font-bold text-[12px]  ring-1 ring-white/[0.06]">
                      {category.listingCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-app-text-muted">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingCategory(category)}
                        aria-label="Edit category"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-app-text-muted transition-colors hover:bg-white/[0.06] hover:text-app-text"
                      >
                        <HiOutlinePencilSquare className="h-4 w-4 text-blue-400 cursor-pointer  " />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(category)}
                        aria-label="Delete category"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-app-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <HiOutlineTrash className="h-4 w-4 text-red-600 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CategoryFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        mode="create"
        onSuccess={retry}
      />

      <CategoryFormModal
        isOpen={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        mode="edit"
        category={editingCategory ?? undefined}
        onSuccess={retry}
      />

      <ConfirmDialog
        isOpen={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() =>
          deletingCategory && remove(deletingCategory.categoryId)
        }
        title="Delete this category?"
        description={
          deletingCategory && deletingCategory.listingCount > 0
            ? `"${deletingCategory.name}" has ${deletingCategory.listingCount} listing(s) filed under it. Deleting it may affect those listings.`
            : `"${deletingCategory?.name}" will be permanently removed. This can't be undone.`
        }
        confirmLabel="Delete"
        isConfirming={isDeleting}
        danger
      />
    </div>
  );
}
