/**
 * @FeatureID Foundation
 * @Purpose Error boundary component for handling runtime errors
 * @Spec /docs/DesignSpec.md Section 20 (Error & Empty State Patterns)
 * @Author Chat Bot Labs
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-background-primary">
      <Card variant="spacious" className="max-w-md w-full text-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center" aria-hidden="true">
            <AlertTriangle className="h-8 w-8 text-error" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              Something went wrong
            </h1>
            <p className="text-text-secondary">
              We encountered an unexpected error. Don't worry, your work is saved locally.
            </p>
            {process.env.NODE_ENV === "development" && error.message && (
              <div className="mt-4 p-4 bg-background-primary border border-border-subtle rounded-base text-left">
                <p className="text-xs font-mono text-text-tertiary mb-2">Error details:</p>
                <p className="text-sm text-error font-mono break-all">{error.message}</p>
                {error.digest && (
                  <p className="text-xs text-text-tertiary mt-2">Digest: {error.digest}</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="primary"
              onClick={reset}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="secondary" className="w-full">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Go home
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-text-tertiary">
            If this problem persists, please refresh the page or clear your browser cache.
          </p>
        </div>
      </Card>
    </div>
  );
}

