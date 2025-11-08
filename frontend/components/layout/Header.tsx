/**
 * @FeatureID F-14
 * @Purpose Site header component with mobile responsive design
 * @Spec /docs/DesignSpec.md Section 6 (Navigation), Section 22 (Responsive Adaptations)
 * @Author Chat Bot Labs
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 h-14 md:h-16 bg-background-primary border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Sora Prompting Engine home">
            <Film className="h-6 w-6 md:h-6 md:w-6 text-gold-primary" aria-hidden="true" />
            <span className="hidden md:inline text-xl font-heading font-bold text-text-primary">
              Sora Prompting Engine
            </span>
            <span className="md:hidden text-xl font-heading font-bold text-text-primary">
              SPE
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="/build"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Build
            </Link>
            <Link
              href="/prompts"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              My Prompts
            </Link>
          </nav>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary rounded-base"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-background-primary/95 backdrop-blur-sm" />
          <nav
            className="absolute right-0 top-0 h-full w-64 bg-background-secondary border-l border-divider shadow-floating p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation menu"
          >
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Film className="h-6 w-6 text-gold-primary" />
                <span className="text-xl font-heading font-bold text-text-primary">
                  Sora Prompting Engine
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-base"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <Link
              href="/build"
              className="text-base font-medium text-text-primary hover:text-gold-primary transition-colors py-3 px-4 rounded-base hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Build
            </Link>
            <Link
              href="/prompts"
              className="text-base font-medium text-text-primary hover:text-gold-primary transition-colors py-3 px-4 rounded-base hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Prompts
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

