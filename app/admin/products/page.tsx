import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { getAllProductsAdmin } from "@/lib/actions/products";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import AdminProductActions from "./AdminProductActions";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-semibold text-stone-800">
            Products
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {products.length} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-stone-700 text-cream-100 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-600 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-cream-50 border border-cream-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-cream-200">
            <tr>
              {[
                "Product",
                "Category",
                "Gender",
                "Price",
                "Stock",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-4 px-4 text-[10px] font-semibold tracking-[0.15em] text-stone-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-cream-100 hover:bg-cream-100 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-stone-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-stone-400">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-stone-600 capitalize">
                  {product.category}
                </td>
                <td className="py-3 px-4 text-sm text-stone-600 capitalize">
                  {product.gender}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-sm">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && (
                    <span className="text-xs text-stone-300 line-through block">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      product.stock_count <= 5
                        ? "text-red-500"
                        : "text-stone-700",
                    )}
                  >
                    {product.stock_count}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold",
                        product.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {product.is_active ? "Active" : "Hidden"}
                    </span>
                    {product.is_new && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                        NEW
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="w-8 h-8 rounded-lg bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-600 transition-colors"
                    >
                      <Pencil size={13} />
                    </Link>
                    {/*<Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="w-8 h-8 rounded-lg bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-stone-600 transition-colors"
                    >
                      <Eye size={13} />
                    </Link>*/}
                    <AdminProductActions
                      productId={product.id}
                      isActive={product.is_active}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
