import { Link } from "@tanstack/react-router";

import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { Button } from "./primitives";

const columns = [
  {
    title: "Organisation",
    links: [
      { label: "Who We Are", to: "/about" },
      { label: "Our History", to: "/about/history" },
      { label: "Students' Arm", to: "/students-arm" },
      { label: "Doctors' Arm", to: "/doctors-arm" },
      { label: "What We Do", to: "/what-we-do" },
      { label: "Our Impact", to: "/impact" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Ministries",
    links: [
      { label: "IfEHL", to: "/ministries/ifehl" },
      { label: "Institute of Medical Missions", to: "/ministries/imm" },
      { label: "Wholeness Missions Outreach", to: "/ministries/wholeness-missions" },
      { label: "Starting Strong", to: "/ministries/starting-strong" },
      { label: "EXCEL", to: "/ministries/excel" },
      { label: "Lady Doctors & Students", to: "/ministries/the-lady-doctor" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Membership", to: "/membership" },
      { label: "Donate", to: "/give" },
      { label: "Events", to: "/events" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Publications", to: "/publications" },
      { label: "Events & Conferences", to: "/events" },
      { label: "Impact Stories", to: "/impact" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-primary-deep text-primary-foreground">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logos/footer-logo.png"
                alt="CMDA Nigeria logo"
                width={30}
                height={48}
                loading="lazy"
                className="h-12 w-auto object-contain"
              />
              <span className="font-display text-lg font-extrabold text-white">CMDA Nigeria</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-75">
              The Christian Medical and Dental Association of Nigeria — equipping healthcare
              professionals for whole-person care since 1972.
            </p>
            <ul className="mt-6 space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {CONTACT.nationalOffice}
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {CONTACT.globalOffice}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {CONTACT.phone}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {CONTACT.phoneGlobal} (Global)
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {CONTACT.email}
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow opacity-60">{col.title}</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="opacity-80 transition-all hover:opacity-100 hover:text-cmda-green-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-primary-foreground/15 pt-10 lg:grid-cols-[1.2fr_2fr] lg:items-center">
          <div>
            <h3 className="font-display text-lg font-bold">Stay informed</h3>
            <p className="mt-1 text-sm opacity-70">
              Mission updates, events and resources, monthly.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="you@hospital.org"
              className="h-11 flex-1 border border-primary-foreground/25 bg-primary-foreground/10 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            />
            <Button variant="gold" type="submit" className="bg-cmda-green hover:bg-cmda-green-deep">
              Subscribe
            </Button>
          </form>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CMDA Nigeria. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Financial Accountability</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
