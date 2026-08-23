import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { Button, buttonVariants } from "./primitives";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", to: "/" },
  {
    label: "Who We Are",
    to: "/about",
    children: [
      { label: "Our Story", to: "/about" },
      { label: "Our History", to: "/about/history" },
    ],
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !transparent;

  const handleDropdownEnter = () => {
    clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 150);
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
            item.children ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  to={item.to}
                  activeOptions={{ exact: false }}
                  activeProps={{ className: "opacity-100 underline decoration-gold decoration-2 underline-offset-8" }}
                  className={cn(
                    "flex items-center gap-1 font-display text-sm font-semibold transition-opacity hover:opacity-70",
                    solid ? "text-foreground" : "text-primary-foreground",
                  )}
                >
                  {item.label}
                  <ChevronDown className={cn("size-3 transition-transform", dropdownOpen && "rotate-180")} aria-hidden="true" />
                </Link>
                {dropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 min-w-[180px] border border-border bg-background py-2 shadow-elegant">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        activeOptions={{ exact: child.to === "/about" }}
                        activeProps={{ className: "bg-accent text-primary" }}
                        className="block px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "opacity-100 underline decoration-gold decoration-2 underline-offset-8" }}
                className={cn(
                  "font-display text-sm font-semibold transition-opacity hover:opacity-70",
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
            className={cn(buttonVariants({ variant: solid ? "outline" : "onDark" }))}
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
              item.children ? (
                <div key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-base font-semibold text-foreground"
                  >
                    {item.label}
                  </Link>
                  <div className="mt-2 flex flex-col gap-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
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
              className={cn(buttonVariants({ variant: "outline" }))}
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
