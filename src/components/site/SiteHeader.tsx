import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown, ArrowRight, Users, BookOpen, Globe2, History, Award } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { Button, buttonVariants } from "./primitives";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", to: "/" },
  {
    label: "Who We Are",
    to: "/about",
    mega: {
      intro: "CMDA Nigeria — a fellowship of Christian healthcare professionals since 1972.",
      columns: [
        {
          heading: "About Us",
          items: [
            { label: "Our Story", to: "/about", icon: BookOpen, desc: "Who we are and what drives us" },
            { label: "Our History", to: "/about/history", icon: History, desc: "Five decades of faith and service" },
            { label: "Leadership", to: "/about#leadership-development", icon: Award, desc: "Forming servant-leaders" },
          ],
        },
        {
          heading: "Our Arms",
          items: [
            { label: "Students' Arm", to: "/students-arm", icon: Users, desc: "9,700+ student members" },
            { label: "Doctors' Arm", to: "/doctors-arm", icon: Users, desc: "1,200+ doctors & dentists" },
            { label: "Global Network", to: "/global-network", icon: Globe2, desc: "75+ members across 20 countries" },
          ],
        },
      ],
      featured: {
        title: "CMDA Nigeria",
        desc: "Founded in 1972, we are a network of Christian medical and dental practitioners registered with the Medical and Dental Council of Nigeria.",
        to: "/about",
        cta: "Read Our Story",
      },
    },
  },
  { label: "What We Do", to: "/what-we-do" },
  { label: "Ministries", to: "/ministries" },
  { label: "Impact", to: "/impact" },
  { label: "Publications", to: "/publications" },
  { label: "Events", to: "/events" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !transparent;

  const handleMegaEnter = () => {
    clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center" aria-label="CMDA Nigeria home">
          <img
            src="/LOGO.png"
            alt="CMDA Nigeria logo"
            width={140}
            height={40}
            className="h-14 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Main">
          {nav.map((item) =>
            item.mega ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                <Link
                  to={item.to}
                  activeOptions={{ exact: false }}
                  activeProps={{ className: "opacity-100 underline decoration-cmda-green decoration-2 underline-offset-8" }}
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70",
                    solid ? "text-foreground" : "text-primary-foreground",
                  )}
                >
                  {item.label}
                  <ChevronDown className={cn("size-3 transition-transform", megaOpen && "rotate-180")} aria-hidden="true" />
                </Link>

                {megaOpen && (
                  <div className="absolute left-1/2 top-full z-50 mt-3 w-[720px] -translate-x-1/2 border border-border bg-background shadow-elegant">
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-0">
                      {/* Columns */}
                      {item.mega.columns.map((col) => (
                        <div key={col.heading} className="p-6">
                          <p className="eyebrow text-cmda-green mb-4">{col.heading}</p>
                          <div className="space-y-1">
                            {col.items.map((child) => (
                              <Link
                                key={child.to}
                                to={child.to}
                                activeOptions={{ exact: child.to === "/about" }}
                                activeProps={{ className: "bg-accent text-primary" }}
                                className="group flex items-start gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-accent"
                                onClick={() => setMegaOpen(false)}
                              >
                                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-border text-cmda-green transition-colors group-hover:border-cmda-green group-hover:bg-cmda-green group-hover:text-white">
                                  <child.icon className="size-4" aria-hidden="true" />
                                </span>
                                <div className="min-w-0">
                                  <span className="block text-sm font-semibold text-foreground">{child.label}</span>
                                  <span className="mt-0.5 block text-xs text-muted-foreground">{child.desc}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Featured */}
                      <div className="w-[200px] border-l border-border bg-muted p-6">
                        <p className="eyebrow text-cmda-green mb-3">{item.mega.featured.title}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {item.mega.featured.desc}
                        </p>
                        <Link
                          to={item.mega.featured.to}
                          className={cn(
                            buttonVariants({ variant: "primary", size: "sm" }),
                            "mt-5 w-full bg-cmda-green hover:bg-cmda-green-deep",
                          )}
                          onClick={() => setMegaOpen(false)}
                        >
                          {item.mega.featured.cta}
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "opacity-100 underline decoration-cmda-green decoration-2 underline-offset-8" }}
                className={cn(
                  "text-xs font-semibold transition-opacity hover:opacity-70",
                  solid ? "text-foreground" : "text-primary-foreground",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            to="/membership"
            className={cn(buttonVariants({ variant: solid ? "outline" : "onDark" }), "border-cmda-green text-cmda-green hover:bg-cmda-green hover:text-white")}
          >
            Become a Member
          </Link>
          <Link to="/give" className={cn(buttonVariants({ variant: "gold" }))}>
            Donate
          </Link>
        </div>

        <Button
          variant={solid ? "ghost" : "onDark"}
          size="sm"
          className="xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-6 xl:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {nav.map((item) =>
              item.mega ? (
                <div key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold text-foreground"
                  >
                    {item.label}
                  </Link>
                  <div className="mt-2 flex flex-col gap-2 pl-4">
                    {item.mega.columns.map((col) =>
                      col.items.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpen(false)}
                          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="font-display text-base font-semibold text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/membership"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "outline" }), "border-cmda-green text-cmda-green hover:bg-cmda-green hover:text-white")}
            >
              Become a Member
            </Link>
            <Link
              to="/give"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "gold" }))}
            >
              Donate Today
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
