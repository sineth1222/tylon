"use client";

import Link from "next/link";
import { useState } from "react";
import { User, ShoppingBag, LogOut, Package } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import {
  formatPrice,
  formatDate,
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  user: any;
  orders: any[];
}

export default function ProfileClient({ user, orders }: ProfileClientProps) {
  const [tab, setTab] = useState<"orders" | "profile">("orders");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-5 mb-10 border-b border-tylon-border pb-10">
        <div className="w-14 h-14 bg-army flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-tylon-primary tracking-widest">
            {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-[0.4em] text-army uppercase mb-1">
            — OPERATIVE
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.05em] text-tylon-primary uppercase">
            {user.full_name || "MY ACCOUNT"}
          </h1>
          <p className="font-mono text-[11px] text-tylon-muted mt-0.5 tracking-wide">
            {user.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="ml-auto flex items-center gap-2 border border-tylon-border px-4 py-2 font-mono text-[10px] tracking-widest text-tylon-muted hover:border-danger hover:text-danger transition-all"
        >
          <LogOut size={13} />
          SIGN OUT
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border border-tylon-border w-fit mb-8">
        {[
          { key: "orders", label: "MY ORDERS", icon: ShoppingBag },
          { key: "profile", label: "PROFILE", icon: User },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 font-mono text-[10px] tracking-[0.2em] transition-all",
              tab === t.key
                ? "bg-army text-tylon-primary"
                : "text-tylon-muted hover:text-tylon-primary hover:bg-tylon-card",
            )}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-tylon-card border border-tylon-border">
              <Package size={28} className="text-tylon-muted mx-auto mb-4" />
              <p className="font-display text-xl text-tylon-muted uppercase tracking-[0.1em]">
                NO ORDERS YET
              </p>
              <Link
                href="/collections"
                className="inline-block mt-4 font-mono text-[10px] tracking-widest text-army hover:text-army-light transition-colors"
              >
                ENTER THE COLLECTION →
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-tylon-card border border-tylon-border p-5 hover:border-army transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-tylon-primary tracking-widest">
                      {order.order_number}
                    </p>
                    <p className="font-mono text-[10px] text-tylon-muted mt-0.5 tracking-wide">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 font-mono text-[9px] font-bold tracking-widest",
                      getOrderStatusColor(order.order_status),
                    )}
                  >
                    {getOrderStatusLabel(order.order_status)?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-tylon-muted tracking-widest">
                    {order.items?.length || 0} PIECE
                    {(order.items?.length || 0) !== 1 ? "S" : ""}
                  </span>
                  <span className="font-display text-lg font-bold text-tylon-primary tracking-wider">
                    {formatPrice(order?.total)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Profile */}
      {tab === "profile" && (
        <div className="bg-tylon-card border border-tylon-border p-6 space-y-5">
          {[
            { label: "FULL NAME", value: user.full_name },
            { label: "EMAIL", value: user.email },
            /*{
              label: "ACCOUNT TYPE",
              value: user.role?.toUpperCase() || "OPERATIVE",
            },*/
          ].map(({ label, value }) => (
            <div
              key={label}
              className="border-b border-tylon-border pb-5 last:border-b-0 last:pb-0"
            >
              <p className="font-mono text-[9px] tracking-[0.3em] text-army uppercase mb-1">
                {label}
              </p>
              <p className="font-body text-tylon-primary">{value || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
