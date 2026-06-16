import nodemailer from "nodemailer";
import { formatPrice, formatDate } from "@/lib/utils";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const emailBase = `
  body { font-family: 'Georgia', serif; background: #141412; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #2A2118 0%, #3D342E 100%); padding: 40px; text-align: center; }
  .header h1 { color: #141412; font-size: 32px; letter-spacing: 4px; margin: 0; font-style: italic; font-weight: 700; }
  .header p { color: #CC7A68; font-size: 10px; letter-spacing: 6px; text-transform: uppercase; margin: 6px 0 0; }
  .body { padding: 40px; }
  .title { font-size: 24px; color: #2A2118; margin-bottom: 8px; font-style: italic; font-family: Georgia, serif; }
  .subtitle { color: #7D7168; font-size: 14px; margin-bottom: 32px; }
  .info-box { background: #141412; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #EDE4DB; }
  .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EDE4DB; }
  .info-row:last-child { border-bottom: none; }
  .label { color: #7D7168; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .value { color: #2A2118; font-size: 14px; font-weight: 600; }
  .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
  .grand-total { font-size: 18px; font-weight: bold; color: #2A2118; border-top: 2px solid #2A2118; padding-top: 12px; margin-top: 8px; }
  .btn { display: inline-block; background: #2A2118; color: #141412; padding: 14px 32px; text-decoration: none; border-radius: 100px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-top: 24px; }
  .footer { background: #141412; padding: 32px 40px; text-align: center; }
  .footer p { color: #7D7168; font-size: 12px; margin: 4px 0; }
  .accent { color: #CC7A68; }
`;

export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string,
) {
  const html = `<!DOCTYPE html><html><head><style>${emailBase}</style></head><body>
  <div class="container">
    <div class="header"><h1>Tylon</h1><p>Luxury Clothing</p></div>
    <div class="body">
      <h2 class="title">Verify Your Email</h2>
      <p class="subtitle">Welcome to Tylon, ${name || "there"}! Please verify your email to complete registration.</p>
      <div class="info-box" style="text-align:center;">
        <p style="color:#7D7168;font-size:12px;text-transform:uppercase;letter-spacing:3px;margin-bottom:16px;">Your Verification Code</p>
        <p style="font-size:52px;font-weight:bold;color:#2A2118;letter-spacing:16px;margin:0;font-family:monospace;">${code}</p>
        <p style="color:#7D7168;font-size:12px;margin-top:16px;">Expires in 15 minutes</p>
      </div>
      <p style="color:#7D7168;font-size:14px;">If you didn't create a Tylon account, please ignore this email.</p>
    </div>
    <div class="footer">
      <p><strong class="accent">Tylon LUXURY CLOTHING</strong></p>
      <p>No. 42, Galle Road, Colombo 03, Sri Lanka</p>
      <p>hello@Tylonluxury.lk | +94 11 234 5678</p>
    </div>
  </div></body></html>`;

  await transporter.sendMail({
    from: `"Tylon Clothing" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `${code} — Verify your Tylon account`,
    html,
  });
}

export async function sendOrderConfirmationEmail(order: any) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
    <div style="display:flex;gap:16px;padding:12px 0;border-bottom:1px solid #EDE4DB;">
      <div style="flex:1;">
        <p style="font-weight:600;color:#2A2118;margin:0 0 4px;">${item.product?.name}</p>
        <p style="color:#7D7168;font-size:12px;margin:0;">${item.colorName || ""} · Size ${item.size} · Qty ${item.quantity}</p>
      </div>
      <div style="font-weight:600;color:#2A2118;">${formatPrice(item.product?.price * item.quantity)}</div>
    </div>`,
    )
    .join("");

  const shippingFee = order.shipping_fee || 250;

  const html = `<!DOCTYPE html><html><head><style>${emailBase}</style></head><body>
  <div class="container">
    <div class="header"><h1>Tylon</h1><p>Luxury Clothing</p></div>
    <div class="body">
      <h2 class="title">Order Confirmed ✓</h2>
      <p class="subtitle">Thank you, ${order.customer_name}! Your order has been placed successfully.</p>
      <div class="info-box">
        <div class="info-row"><span class="label">Order Number</span><span class="value">${order.order_number}</span></div>
        <div class="info-row"><span class="label">Date</span><span class="value">${formatDate(order.created_at)}</span></div>
        <div class="info-row"><span class="label">Payment</span><span class="value">${order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</span></div>
      </div>
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#7D7168;margin-bottom:12px;">Items</h3>
      ${itemsHtml}
      <div style="margin-top:20px;">
        <div class="total-row"><span style="color:#7D7168;">Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
        <div class="total-row"><span style="color:#7D7168;">Shipping</span><span>${formatPrice(shippingFee)}</span></div>
        <div class="total-row grand-total"><span>Total</span><span>${formatPrice(order.total)}</span></div>
      </div>
      <div class="info-box" style="margin-top:20px;">
        <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#7D7168;margin-bottom:8px;">Delivery Address</h3>
        <p style="margin:0;color:#2A2118;line-height:1.8;">${order.shipping_address.full_name}<br/>${order.shipping_address.address_line1}<br/>${order.shipping_address.city}, ${order.shipping_address.district}<br/>${order.shipping_address.phone}</p>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}" class="btn">Track Your Order</a>
      </div>
    </div>
    <div class="footer">
      <p><strong class="accent">Tylon LUXURY CLOTHING</strong></p>
      <p>No. 42, Galle Road, Colombo 03, Sri Lanka</p>
      <p>hello@Tylonluxury.lk | +94 11 234 5678</p>
    </div>
  </div></body></html>`;

  await transporter.sendMail({
    from: `"Tylon Clothing" <${process.env.EMAIL_FROM}>`,
    to: order.customer_email,
    subject: `Order Confirmed — ${order.order_number}`,
    html,
  });
}

export async function sendOrderStatusUpdateEmail(order: any) {
  const msgs: Record<string, { title: string; message: string }> = {
    confirmed: {
      title: "Order Confirmed ✓",
      message: "Your order has been confirmed and is being prepared.",
    },
    processing: {
      title: "Order Being Processed 📦",
      message: "Your order is being packed and prepared for dispatch.",
    },
    shipped: {
      title: "Order Shipped 🚚",
      message: `Your order is on its way!${order.tracking_number ? ` Tracking: ${order.tracking_number}` : ""}`,
    },
    delivered: {
      title: "Order Delivered ✨",
      message:
        "Your order has been delivered. We hope you love your Tylon pieces!",
    },
    cancelled: {
      title: "Order Cancelled",
      message:
        "Your order has been cancelled. Refund will be processed in 5-7 business days if applicable.",
    },
  };

  const info = msgs[order.order_status];
  if (!info) return;

  const html = `<!DOCTYPE html><html><head><style>${emailBase}</style></head><body>
  <div class="container">
    <div class="header"><h1>Tylon</h1><p>Luxury Clothing</p></div>
    <div class="body">
      <h2 class="title">${info.title}</h2>
      <p class="subtitle">${info.message}</p>
      <div class="info-box">
        <div class="info-row"><span class="label">Order Number</span><span class="value">${order.order_number}</span></div>
        <div class="info-row"><span class="label">Total</span><span class="value">${formatPrice(order.total)}</span></div>
        ${order.tracking_number ? `<div class="info-row"><span class="label">Tracking</span><span class="value">${order.tracking_number}</span></div>` : ""}
      </div>
      <div style="text-align:center;"><a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}" class="btn">View Order</a></div>
    </div>
    <div class="footer">
      <p><strong class="accent">Tylon LUXURY CLOTHING</strong></p>
      <p>hello@Tylonluxury.lk | +94 11 234 5678</p>
    </div>
  </div></body></html>`;

  await transporter.sendMail({
    from: `"Tylon Clothing" <${process.env.EMAIL_FROM}>`,
    to: order.customer_email,
    subject: `${info.title} — ${order.order_number}`,
    html,
  });
}
