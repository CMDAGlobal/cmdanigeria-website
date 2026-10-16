/**
 * Single source of truth for the secretariat's public contact details.
 * Both the site footer and the /contact page read from here so a phone
 * number or address never drifts between the two.
 */
export const CONTACT = {
  nationalOffice: "National Office — Wholeness House, Gwagwalada, FCT",
  liaisonOffice: "F104, Hospital Chapel, National Hospital Abuja",
  globalOffice: "1928 Woodlawn Drive, Woodlawn, Maryland 21207, USA",
  phone: "+234 (809) 153 3339",
  phoneGlobal: "+1 (443) 527 4199",
  email: "info@cmdanigeria.org",
  openHours: "8:00am – 5:00pm (Mon–Fri)",
} as const;
