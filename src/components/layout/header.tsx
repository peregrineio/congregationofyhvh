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

// ---- Desktop dropdown ----

function DesktopDropdown({ link }: { link: NavLink }) {
  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1 font-subheading text-sm font-medium text-warm-gray hover:text-yhvh-gold transition-colors py-2"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {link.label}
        <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
      </button>
      <div
        className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50"
        role="menu"
        aria-label={`${link.label} submenu`}
      >
        <div className="min-w-[200px] rounded-lg border border-warm-border bg-white p-2 shadow-lg shadow-black/5">
          {link.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              className="block rounded-md px-3 py-2 text-sm font-subheading text-warm-gray hover:text-yhvh-gold hover:bg-warm-sand focus:text-yhvh-gold focus:bg-warm-sand transition-colors outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold"
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
    <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
      {NAV_LINKS.map((link) => {
        if (link.label === "Give") return null;
        if (link.children) {
          return <DesktopDropdown key={link.href} link={link} />;
        }
        return (
          <Link
            key={link.href}
            href={link.href}
            className="font-subheading text-sm font-medium text-warm-gray hover:text-yhvh-gold focus:text-yhvh-gold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold rounded-sm"
          >
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
        className="block py-3 px-4 font-subheading text-base text-warm-gray hover:text-yhvh-gold focus:text-yhvh-gold transition-colors border-b border-warm-border/60 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yhvh-gold"
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-warm-border/60">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 px-4 font-subheading text-base text-warm-gray hover:text-yhvh-gold focus:text-yhvh-gold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yhvh-gold"
      >
        {link.label}
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
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
              className="block py-2 pl-8 pr-4 text-sm text-light-gray hover:text-yhvh-gold focus:text-yhvh-gold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yhvh-gold"
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
        "fixed inset-0 z-40 lg:hidden transition-all duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-warm-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-[300px] max-w-[85vw] bg-warm-white border-l border-warm-border transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-warm-border">
          <span className="font-heading text-lg text-yhvh-gold">Menu</span>
          <button
            onClick={onClose}
            className="p-1 text-warm-gray hover:text-yhvh-gold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold rounded-sm"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="overflow-y-auto max-h-[calc(100vh-70px)]" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <MobileAccordionItem
              key={link.href}
              link={link}
              onClose={onClose}
            />
          ))}
          <div className="p-4">
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
            ? "shadow-[0_1px_8px_rgba(26,24,20,0.06)] border-b border-warm-border"
            : "border-b border-transparent"
        )}
        role="banner"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Name */}
          <Link href="/" className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold rounded-sm" aria-label="Congregation of YHVH - Home">
            <Image
              src="/images/logo.png"
              alt="Congregation of YHVH"
              width={180}
              height={50}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <DesktopNav />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-warm-gray hover:text-yhvh-gold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold rounded-sm"
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
