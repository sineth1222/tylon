"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  XCircle,
} from "lucide-react";
import { Order } from "@/types";
import {
  formatPrice,
  formatDate,
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];
const STATUS_ORDER = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export default function OrderTrackingClient({
  order,
  isSuccess,
}: {
  order: Order;
  isSuccess?: boolean;
}) {
  useEffect(() => {
    if (isSuccess)
      toast.success("Order placed! Check your email for confirmation.");
  }, [isSuccess]);

  const currentStep = STATUS_ORDER.indexOf(order.order_status);
  const isCancelled = order.order_status === "cancelled";
  const progressPct =
    currentStep <= 0 ? 0 : (currentStep / (STATUS_STEPS.length - 1)) * 88;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success banner */}
      {isSuccess && (
        <div className="bg-tylon-card border border-tylon-border rounded-none p-5 mb-8 flex items-center gap-4">
          <CheckCircle2 className="text-army-light shrink-0" size={24} />
          <div>
            <p className="font-semibold text-tylon-primary">
              Order Placed Successfully!
            </p>
            <p className="text-sm text-tylon-muted">
              Confirmation sent to <strong>{order.customer_email}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-xs text-tylon-muted tracking-widest uppercase mb-1">
            Order
          </p>
          <h1 className="font-display text-3xl font-semibold text-tylon-primary/60">
            {order.order_number}
          </h1>
          <p className="text-sm text-tylon-muted mt-1">
            {formatDate(order.created_at)}
          </p>
        </div>
        <div
          className={cn(
            "px-4 py-2  text-xs font-bold tracking-wide uppercase",
            getOrderStatusColor(order.order_status),
          )}
        >
          {getOrderStatusLabel(order.order_status)}
        </div>
      </div>

      {/* Progress tracker */}
      {!isCancelled ? (
        <div className="bg-tylon-card border border-tylon-border p-6 md:p-8 mb-6">
          <div className="relative flex items-start justify-between">
            {/* Track line background */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-tylon-border" />
            {/* Track line progress */}
            <div
              className="absolute top-5 left-5 h-0.5 bg-army transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />

            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center gap-2 z-10"
                >
                  <div
                    className={cn(
                      "w-10 h-10  flex items-center justify-center border-2 bg-tylon-card transition-all",
                      done ? "border-army bg-army" : "border-tylon-border",
                      active ? "ring-2 ring-army/30" : "",
                    )}
                  >
                    <Icon
                      size={16}
                      className={
                        done ? "text-tylon-primary" : "text-tylon-border"
                      }
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium tracking-wide text-center hidden sm:block",
                      done ? "text-tylon-primary" : "text-tylon-border",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {order.tracking_number && (
            <div className="mt-6 pt-5 border-t border-tylon-border">
              <p className="font-mono text-[9px] text-army uppercase tracking-[0.3em] mb-1">
                Tracking Number
              </p>
              <p className="font-semibold text-tylon-primary font-mono">
                {order.tracking_number}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-tylon-card border border-tylon-border rounded-none p-6 mb-6 flex items-center gap-4">
          <XCircle className="text-danger shrink-0" size={24} />
          <div>
            <p className="font-semibold text-tylon-primary">Order Cancelled</p>
            <p className="text-sm text-tylon-muted">
              If you paid online, a refund will be processed within 5–7 business
              days.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-tylon-card border border-tylon-border p-6">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-tylon-muted mb-5">
            Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-3">
                <div
                  className="relative w-14 h-18 rounded-none overflow-hidden bg-tylon-secondary shrink-0"
                  style={{ height: "72px" }}
                >
                  {(item.image || item.product?.images?.[0]) && (
                    <Image
                      src={item.image || item.product.images[0]}
                      alt={item.product?.name || ""}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-tylon-primary leading-tight">
                    {item.product?.name}
                  </p>
                  {/* colorName — supports both old (color.name) and new (colorName) format */}
                  <div className="flex items-center gap-1.5 mt-1">
                    {(item.colorHex || item.color?.hex) && (
                      <div
                        className="w-3 h-3  border border-tylon-border shrink-0"
                        style={{
                          backgroundColor: item.colorHex || item.color?.hex,
                        }}
                      />
                    )}
                    <span className="text-xs text-tylon-muted">
                      {item.colorName || item.color?.name || "—"}
                    </span>
                    <span className="text-tylon-border text-[10px]">·</span>
                    <span className="text-xs text-tylon-muted">
                      Size {item.size}
                    </span>
                    <span className="text-tylon-border text-[10px]">·</span>
                    <span className="text-xs text-tylon-muted">
                      Qty {item.quantity}
                    </span>
                  </div>
                  <p className="font-semibold text-sm mt-1">
                    {formatPrice(item.product?.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-tylon-border mt-5 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-tylon-muted">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tylon-muted">Shipping</span>
              <span>{formatPrice(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-tylon-border pt-2">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery + Payment */}
        <div className="space-y-4">
          <div className="bg-tylon-card border border-tylon-border p-5">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-tylon-muted mb-4">
              Delivery Address
            </h2>
            <address className="not-italic text-sm text-tylon-muted leading-relaxed">
              <strong className="text-tylon-primary">
                {order.shipping_address.full_name}
              </strong>
              <br />
              {order.shipping_address.address_line1}
              <br />
              {order.shipping_address.address_line2 && (
                <>
                  {order.shipping_address.address_line2}
                  <br />
                </>
              )}
              {order.shipping_address.city}, {order.shipping_address.district}
              <br />
              {order.shipping_address.phone}
            </address>
          </div>

          <div className="bg-tylon-card border border-tylon-border p-5">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-tylon-muted mb-4">
              Payment
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-tylon-muted">Method</span>
                <span className="font-medium">
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-tylon-muted">Status</span>
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 ",
                    order.payment_status === "paid"
                      ? "bg-black text-white"
                      : order.payment_status === "failed"
                        ? "bg-black text-red-700"
                        : "text-gold border border-gold/20",
                  )}
                >
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status history */}
      {order.status_history && order.status_history.length > 0 && (
        <div className="bg-tylon-card border border-tylon-border p-6 mt-6">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-tylon-muted mb-5">
            Status History
          </h2>
          <div className="space-y-4">
            {[...order.status_history].reverse().map((h: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-2.5 h-2.5  mt-1.5 shrink-0",
                    getOrderStatusColor(h.status).split(" ")[0],
                  )}
                />
                <div>
                  <p className="text-sm font-semibold capitalize text-tylon-primary">
                    {h.status}
                  </p>
                  <p className="text-xs text-tylon-muted">{h.note}</p>
                  <p className="text-[11px] text-tylon-muted/60 mt-0.5">
                    {new Date(h.timestamp).toLocaleString("en-LK")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/collections"
          className="text-sm text-tylon-muted hover:text-tylon-primary underline underline-offset-4"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
