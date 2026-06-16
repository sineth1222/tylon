"use client";

import { useState, useTransition } from "react";
import { Trash2, Eye, EyeOff } from "lucide-react";
import {
  deleteProduct,
  archiveProduct,
  unarchiveProduct,
} from "@/lib/actions/products";
import toast from "react-hot-toast";

export default function AdminProductActions({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  // ── Hard delete ──────────────────────────────────────────────
  const handleDelete = () => {
    if (!confirm("Permanently delete this product? This cannot be undone."))
      return;
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Product permanently deleted");
      }
    });
  };

  // ── Toggle archive / unarchive ───────────────────────────────
  const handleToggleActive = () => {
    startTransition(async () => {
      const result = isActive
        ? await archiveProduct(productId)
        : await unarchiveProduct(productId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isActive ? "Product hidden from store" : "Product is now active",
        );
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Eye / EyeOff — toggle active status */}
      <button
        onClick={handleToggleActive}
        disabled={isPending}
        title={isActive ? "Archive (hide from store)" : "Restore to active"}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30
          bg-cream-200 hover:bg-cream-300 text-charcoal-600"
      >
        {isActive ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>

      {/* Trash — permanent delete */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Permanently delete product"
        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors disabled:opacity-30"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
