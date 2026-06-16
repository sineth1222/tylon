"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2, CreditCard, Banknote, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/actions/orders";
import { formatPrice, SRI_LANKA_DISTRICTS } from "@/lib/utils";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Footer from "@/components/layout/Footer";

const PayHereButton = dynamic(
  () => import("@/components/checkout/PayHereButton"),
  { ssr: false },
);

const SHIPPING_FEE = parseInt(process.env.NEXT_PUBLIC_SHIPPING_FEE || "250");

interface CheckoutClientProps {
  user: any;
}

interface FormValues {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  district: string;
  postal_code: string;
  notes: string;
}

export default function CheckoutClient({ user }: CheckoutClientProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [loading, setLoading] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    id: string;
    formValues: FormValues;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const total = subtotal + SHIPPING_FEE;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-10">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-6">
            <Lock size={24} className="text-tylon-muted" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-tylon-primary mb-3">
            Sign In Required
          </h2>
          <p className="text-tylon-muted mb-8">
            Please sign in to your TYLON account to proceed with checkout.
          </p>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-auth-modal", {
                  detail: { redirectTo: "/checkout" },
                }),
              )
            }
            className="bg-army text-tylon-primary px-8 py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-colors"
          >
            Sign In to Checkout
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-10">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-tylon-primary mb-3">
            Your cart is empty
          </h2>
          <button
            onClick={() => router.push("/collections")}
            className="mt-4 bg-stone-700 text-cream-100 px-8 py-4 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase"
          >
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  // Collect form values (used for both COD submit and PayHere pre-step)
  const getFormValues = (): FormValues | null => {
    const form = formRef.current;
    if (!form) return null;
    const fd = new FormData(form);
    return {
      customer_name: fd.get("customer_name") as string,
      customer_email: fd.get("customer_email") as string,
      customer_phone: fd.get("customer_phone") as string,
      address_line1: fd.get("address_line1") as string,
      address_line2: (fd.get("address_line2") as string) || "",
      city: fd.get("city") as string,
      district: fd.get("district") as string,
      postal_code: (fd.get("postal_code") as string) || "",
      notes: (fd.get("notes") as string) || "",
    };
  };

  // Validate required fields
  const validateForm = (): boolean => {
    const v = getFormValues();
    if (!v) return false;
    if (!v.customer_name.trim() || v.customer_name.trim().length < 2) {
      toast.error("Enter your full name");
      return false;
    }
    if (!v.customer_email.includes("@")) {
      toast.error("Enter a valid email");
      return false;
    }
    if (!v.customer_phone.trim() || v.customer_phone.trim().length < 9) {
      toast.error("Enter a valid phone number");
      return false;
    }
    if (!v.address_line1.trim() || v.address_line1.trim().length < 5) {
      toast.error("Enter your delivery address");
      return false;
    }
    if (!v.city.trim()) {
      toast.error("Enter your city");
      return false;
    }
    if (!v.district) {
      toast.error("Select your district");
      return false;
    }
    return true;
  };

  // COD: create order immediately
  const handleCODSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("payment_method", "cod");
    const result = await createOrder(items, user.id, formData);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else if (result.success && result.orderId) {
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${result.orderId}?success=true`);
    }
  };

  // Online: create order first (status=pending, payment=pending), THEN open PayHere
  const handleOnlineClick = async () => {
    if (!validateForm()) return;
    const values = getFormValues()!;
    setLoading(true);

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.set(k, v));
    fd.set("payment_method", "online");

    const result = await createOrder(items, user.id, fd);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    // Store pending order — PayHereButton will open the popup
    setPendingOrder({ id: result.orderId!, formValues: values });
  };

  const handlePayHereSuccess = () => {
    clearCart();
    router.push(`/orders/${pendingOrder!.id}?success=true`);
  };

  const handlePayHereDismiss = () => {
    // Order exists in DB with pending status — user can retry
    setPendingOrder(null);
    toast("Payment was not completed. You can try again.", { icon: "ℹ️" });
  };

  return (
    <>
      <main className="min-h-screen pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl font-semibold text-tylon-primary mb-10">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* ── Form ── */}
            <form
              ref={formRef}
              onSubmit={handleCODSubmit}
              className="lg:col-span-3 space-y-6"
            >
              {/* Contact */}
              <div className="bg-tylon-card border border-tylon-border p-6">
                <h2 className="font-mono text-[9px] tracking-[0.3em] uppercase text-army mb-5">
                  Contact
                </h2>
                <div className="space-y-4">
                  <input
                    name="customer_name"
                    type="text"
                    defaultValue={user.full_name || ""}
                    placeholder="Full Name"
                    required
                    className="input-tylon"
                  />
                  <input
                    name="customer_email"
                    type="email"
                    defaultValue={user.email}
                    placeholder="Email"
                    required
                    className="input-tylon"
                  />
                  <input
                    name="customer_phone"
                    type="tel"
                    placeholder="Phone (e.g. 0771234567)"
                    required
                    className="input-tylon"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="bg-tylon-card border border-tylon-border p-6">
                <h2 className="font-mono text-[9px] tracking-[0.3em] uppercase text-army mb-5">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <input
                    name="address_line1"
                    type="text"
                    placeholder="Address Line 1"
                    required
                    className="input-tylon"
                  />
                  <input
                    name="address_line2"
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    className="input-tylon"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="city"
                      type="text"
                      placeholder="City"
                      required
                      className="input-tylon"
                    />
                    <div className="relative">
                      <select
                        name="district"
                        required
                        className="input-tylon appearance-none pr-10"
                      >
                        <option value="">Select District</option>
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tylon-muted pointer-events-none"
                      />
                    </div>
                  </div>
                  <input
                    name="postal_code"
                    type="text"
                    placeholder="Postal Code (Optional)"
                    className="input-tylon"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-tylon-card border border-tylon-border p-6">
                <h2 className="font-mono text-[9px] tracking-[0.3em] uppercase text-army mb-5">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {(
                    [
                      {
                        value: "cod",
                        label: "Cash on Delivery",
                        sub: "Pay when your order arrives at your door",
                        Icon: Banknote,
                        disabled: false,
                      },
                      /*{
                        value: "online",
                        label: "Online Payment",
                        sub: "Visa, Mastercard, AMEX, eZ Cash & more via PayHere",
                        Icon: CreditCard,
                        disabled: true,
                      },*/
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => setPaymentMethod(opt.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === opt.value
                          ? "border-army bg-army/5"
                          : "border-tylon-border hover:border-tylon-muted"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${paymentMethod === opt.value ? "border-army" : "border-cream-300"}`}
                      >
                        {paymentMethod === opt.value && (
                          <div className="w-2.5 h-2.5 bg-army" />
                        )}
                      </div>
                      <opt.Icon
                        size={20}
                        className="text-tylon-muted shrink-0"
                      />
                      <div>
                        <p className="font-mono text-sm font-bold text-tylon-primary tracking-wide">
                          {opt.label}
                        </p>
                        <p className="font-mono text-[11px] text-tylon-muted">
                          {opt.sub}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* PayHere accepted cards logos */}
                {paymentMethod === "online" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-700 mb-2 font-medium">
                      Accepted payment methods:
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {["VISA", "MC", "AMEX", "eZ Cash", "mCash", "FriMi"].map(
                        (card) => (
                          <span
                            key={card}
                            className="px-2.5 py-1 bg-tylon-card border border-blue-200 rounded-lg text-[10px] font-bold text-blue-800"
                          >
                            {card}
                          </span>
                        ),
                      )}
                    </div>
                    <p className="text-[11px] text-blue-600 mt-2">
                      Secured by PayHere · 256-bit SSL encryption
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-tylon-card border border-tylon-border p-6">
                <h2 className="font-mono text-[9px] tracking-[0.3em] uppercase text-army mb-4">
                  Order Notes (Optional)
                </h2>
                <textarea
                  name="notes"
                  placeholder="Special instructions for your order..."
                  rows={3}
                  className="input-tylon resize-none"
                />
              </div>

              {/* Submit buttons */}
              {paymentMethod === "cod" ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-army text-tylon-primary py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-colors disabled:opacity-50 flex items-center justify-center gap-3 md:mb-20"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Banknote size={15} />
                  )}
                  {loading
                    ? "Placing Order…"
                    : `Place Order (COD) · ${formatPrice(total)}`}
                </button>
              ) : pendingOrder ? (
                /* PayHere popup button — shown after order is pre-created */
                <PayHereButton
                  orderId={pendingOrder.id}
                  amount={total}
                  customerName={pendingOrder.formValues.customer_name}
                  customerEmail={pendingOrder.formValues.customer_email}
                  customerPhone={pendingOrder.formValues.customer_phone}
                  address={pendingOrder.formValues.address_line1}
                  city={pendingOrder.formValues.city}
                  onSuccess={handlePayHereSuccess}
                  onDismiss={handlePayHereDismiss}
                />
              ) : (
                <button
                  type="button"
                  onClick={handleOnlineClick}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-sm font-semibold tracking-[0.15em] uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CreditCard size={15} />
                  )}
                  {loading
                    ? "Preparing Payment…"
                    : `Pay Online · ${formatPrice(total)}`}
                </button>
              )}
            </form>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <div className="bg-tylon-card border border-tylon-border p-6">
                  <h2 className="font-mono text-[9px] tracking-[0.3em] uppercase text-army mb-5">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-stone-700 text-cream-100 rounded-full text-[10px] font-bold flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-700 leading-tight line-clamp-2">
                            {item.product.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div
                              className="w-3 h-3 rounded-full border border-cream-300 shrink-0"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span className="font-mono text-[11px] text-tylon-muted">
                              {item.colorName}
                            </span>
                            <span className="text-stone-300 text-[10px]">
                              ·
                            </span>
                            <span className="font-mono text-[11px] text-tylon-muted">
                              Size {item.size}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-tylon-primary mt-1">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-cream-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-tylon-muted">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-tylon-muted">Shipping</span>
                      <span className="font-medium">
                        {formatPrice(SHIPPING_FEE)}
                      </span>
                    </div>
                    <div className="border-t border-cream-200 pt-2 flex justify-between font-bold text-base">
                      <span className="text-tylon-primary">Total</span>
                      <span className="text-tylon-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-tylon-muted">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Lock size={11} />
                    SSL Secured
                  </div>
                  <span className="text-stone-200">·</span>
                  <div className="text-xs">PayHere Certified</div>
                  <span className="text-stone-200">·</span>
                  <div className="text-xs">256-bit Encryption</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
