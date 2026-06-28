// ─────────────────────────────────────────────────────────────────
// EDIT THIS FILE to personalise the entire website.
// Every section (Hero, Countdown, Invitation, Gallery, Music) reads
// from this single config so you never need to touch component code
// just to change names, dates or photos.
// ─────────────────────────────────────────────────────────────────

export const weddingConfig = {
  groom: "Dineth",
  bride: "Senuri",

  // Used in the script/serif "Dineth & Senuri" lockup
  coupleLockup: "Dineth & Senuri",

  // ISO date string used by the live countdown. Keep the timezone offset
  // for Sri Lanka (+05:30) so the countdown is accurate for local guests.
  weddingDateISO: "2026-12-20T17:00:00+05:30",

  weddingDateDisplay: "2026-12-20T17:00:00",
  weddingTimeDisplay: "5.00 in the evening",
  weddingDateDisplayInvitation: "2026-12-20",

  venueName: "Cinnamon Lakeside, Colombo",
  venueAddress:
    "115 Sir Chittampalam A Gardiner Mawatha, Colombo 02, Sri Lanka",

  // Paste a real Google Maps share link for your venue here.
  googleMapsUrl: "https://maps.google.com/?q=Cinnamon+Lakeside+Colombo",

  invitationMessage:
    "Together with our families, we joyfully invite you to witness the beginning of our forever. Your presence is the most precious gift we could ask for.",

  // Couple gallery images — drop your photos into /public/images/gallery/
  // and list the filenames here, in the order you want them to appear.
  galleryImages: [
    "/images/gallery/couple-1.jpg",
    "/images/gallery/couple-2.jpg",
    "/images/gallery/couple-3.jpg",
    "/images/gallery/couple-4.jpg",
    "/images/gallery/couple-5.jpg",
  ],

  heroPhoto: "/images/hero/hero-photo.jpg",

  invitationPhoto: "/images/hero/hero-photo.jpg",

  // Drop a romantic instrumental / acoustic track here.
  musicSrc: "/music/tylonsong1.mp3",

  prefixOptions: ["Mr.", "Mrs.", "Miss", "Dr.", "Rev."],
};

export type WeddingConfig = typeof weddingConfig;
