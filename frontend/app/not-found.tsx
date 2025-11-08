/**
 * @FeatureID Foundation
 * @Purpose Custom 404 page for unmatched routes
 * @Spec /docs/DesignSpec.md Section 20 (Error & Empty State Patterns)
 * @Author Chat Bot Labs
 */

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Film, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen flex items-center justify-center px-4 py-20 bg-background-primary" tabIndex={-1}>
        <Card variant="spacious" className="max-w-md w-full text-center">
          <div className="flex flex-col items-center space-y-6">
            {/* 404 Icon */}
            <div className="w-16 h-16 bg-gold-muted rounded-full flex items-center justify-center" aria-hidden="true">
              <Film className="h-8 w-8 text-gold-primary" />
            </div>

            {/* 404 Message */}
            <div className="space-y-2">
              <h1 className="text-4xl font-heading font-bold text-text-primary">
                404
              </h1>
              <h2 className="text-xl font-heading font-semibold text-text-primary">
                Page not found
              </h2>
              <p className="text-text-secondary">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link href="/" className="flex-1">
                <Button variant="primary" className="w-full">
                  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                  Go home
                </Button>
              </Link>
              <Link href="/build" className="flex-1">
                <Button variant="secondary" className="w-full">
                  <Film className="mr-2 h-4 w-4" aria-hidden="true" />
                  Start building
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t border-border-subtle w-full">
              <p className="text-sm text-text-tertiary mb-3">Quick links:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/build" className="text-gold-primary hover:text-gold-light transition-colors">
                  Builder
                </Link>
                <Link href="/prompts" className="text-gold-primary hover:text-gold-light transition-colors">
                  My Prompts
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}

