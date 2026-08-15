"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/ui/gold-button";
import {
  Menu,
  X,
  ChevronDown,
} from "@/components/icons";

// Shared editorial nav-link treatment — small caps with a gold underline
// that draws in from the left on hover/focus
const navLinkClasses =
  "relative whitespace-nowrap font-subheading text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-warm-gray transition-colors duration-300 hover:text-yhvh-gold-dark focus:text-yhvh-gold-dark outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold rounded-sm " +
  "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-yhvh-gold after:to-yhvh-gold/30 after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100";

// ---- Desktop dropdown ----

function DesktopDropdown({ link }: { link: NavLink }) {
  return (
    <div className="relative group">
      <button
        className={cn(navLinkClasses, "flex items-center gap-1.5 py-2")}
        aria-haspopup="true"
        aria-expanded="false"
      >
        {link.label}
        <ChevronDown className="size-3 transition-transform duration-300 group-hover:rotate-180 text-yhvh-gold" aria-hidden="true" />
      </button>
      <div
        className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50"
        role="menu"
        aria-label={`${link.label} submenu`}
      >
        {/* Parchment plate dropdown with gilded top edge */}
        <div className="parchment-plate min-w-[230px] overflow-hidden rounded-xl p-2 shadow-[0_16px_40px_-12px_rgba(139,105,20,0.25)]">
          <div className="gold-accent-bar mb-1.5" />
          {link.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              className="gate-row block rounded-md px-4 py-2.5 font-subheading text-[0.8rem] font-medium uppercase tracking-[0.12em] text-warm-gray hover:text-yhvh-gold-dark focus:text-yhvh-gold-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Desktop nav ----

function DesktopNav() {
  return (
    <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
      {NAV_LINKS.map((link) => {
        if (link.label === "Give") return null;
        if (link.children) {
          return <DesktopDropdown key={link.href} link={link} />;
        }
        return (
          <Link key={link.href} href={link.href} className={navLinkClasses}>
            {link.label}
          </Link>
        );
      })}
      <Link href="/give" aria-label="Give to the congregation">
        <GoldButton size="sm">Give</GoldButton>
      </Link>
    </nav>
  );
}

// ---- Mobile accordion item ----

function MobileAccordionItem({
  link,
  onClose,
}: {
  link: NavLink;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!link.children) {
    return (
      <Link
        href={link.href}
        onClick={onClose}
        className="gate-row block border-b border-yhvh-gold/15 px-5 py-3.5 font-subheading text-sm font-semibold uppercase tracking-[0.15em] text-warm-gray hover:text-yhvh-gold-dark focus:text-yhvh-gold-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yhvh-gold"
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-yhvh-gold/15">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-3.5 font-subheading text-sm font-semibold uppercase tracking-[0.15em] text-warm-gray hover:text-yhvh-gold-dark focus:text-yhvh-gold-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yhvh-gold"
      >
        {link.label}
        <ChevronDown
          className={cn(
            "size-4 text-yhvh-gold transition-transform duration-300",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div role="group" aria-label={`${link.label} links`} className="pb-2">
          {link.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="block border-l border-yhvh-gold/30 py-2.5 pl-8 pr-5 ml-5 font-body text-sm text-warm-gray/80 hover:text-yhvh-gold-dark focus:text-yhvh-gold-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yhvh-gold"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Mobile nav ----

function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden transition-all duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-warm-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Parchment panel */}
      <div
        className={cn(
          "parchment-plate scribe-lines absolute right-0 top-0 h-full w-[300px] max-w-[85vw] rounded-none border-y-0 border-r-0 border-l border-yhvh-gold/25 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-yhvh-gold/20 p-5">
          <div>
            <span
              dir="rtl"
              lang="he"
              className="gold-leaf-text block text-2xl font-bold"
              style={{ fontFamily: "var(--font-hebrew)" }}
            >
              שלום
            </span>
            <span className="font-subheading text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-yhvh-gold-dark">
              Peace — Welcome
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-warm-gray hover:text-yhvh-gold-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold rounded-sm"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="overflow-y-auto max-h-[calc(100vh-90px)]" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <MobileAccordionItem
              key={link.href}
              link={link}
              onClose={onClose}
            />
          ))}
          <div className="p-5">
            <Link href="/give" onClick={onClose} aria-label="Give to the congregation">
              <GoldButton className="w-full">Give</GoldButton>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

// ---- Header (main export) ----

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-yhvh-gold focus:px-4 focus:py-2 focus:text-white focus:font-medium"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-warm-white/95 backdrop-blur-md transition-shadow duration-300",
          scrolled
            ? "shadow-[0_2px_20px_rgba(139,105,20,0.10)] border-b border-yhvh-gold/20"
            : "border-b border-yhvh-gold/10"
        )}
        role="banner"
      >
        {/* Gilded page edge — thin gold hairline across the very top */}
        <div
          aria-hidden
          className="h-[3px] w-full bg-gradient-to-r from-transparent via-yhvh-gold to-transparent"
        />

        <div className="mx-auto flex h-24 md:h-28 lg:h-32 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Name */}
          <Link href="/" className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold rounded-sm" aria-label="Congregation of YHVH - Home">
            <Image
              src="/images/logo2.png"
              alt="Congregation of YHVH"
              width={300}
              height={112}
              className="h-[4.5rem] md:h-20 lg:h-24 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <DesktopNav />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-warm-gray hover:text-yhvh-gold-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold rounded-sm"
            aria-label="Open navigation menu"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
