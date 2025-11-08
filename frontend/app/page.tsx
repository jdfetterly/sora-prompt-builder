/**
 * @FeatureID Foundation
 * @Purpose Landing page with hero section and features
 * @Spec /docs/DesignSpec.md Section 17 (Landing Page)
 * @Author Chat Bot Labs
 */

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Film, Sparkles, Download } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen" tabIndex={-1}>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-display font-heading font-bold text-text-primary">
            Build <span className="text-gold-primary">Cinematic</span> Prompts
          </h1>
          <p className="text-body-large text-text-secondary max-w-2xl mx-auto">
            Create high-quality prompts for OpenAI's Sora video model with our step-by-step builder.
            Master cinematic prompting through guided, educational workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/build">
              <Button variant="primary" size="lg">Start Building</Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">View Examples</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-4 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-heading font-bold text-center text-text-primary mb-12">
            Everything You Need to Create Amazing Prompts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background-primary border border-border-subtle rounded-md p-6 hover:border-border-default hover:shadow-elevated transition-all duration-200">
              <div className="w-12 h-12 bg-gold-muted rounded-base flex items-center justify-center mb-4" aria-hidden="true">
                <Film className="h-6 w-6 text-gold-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
                Step-by-Step Builder
              </h3>
              <p className="text-text-secondary">
                Guided workflow through 5 essential steps: Subject, Action/Setting, Style, Camera, and Visual Details.
              </p>
            </div>
            <div className="bg-background-primary border border-border-subtle rounded-md p-6 hover:border-border-default hover:shadow-elevated transition-all duration-200">
              <div className="w-12 h-12 bg-gold-muted rounded-base flex items-center justify-center mb-4" aria-hidden="true">
                <Sparkles className="h-6 w-6 text-gold-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
                Cinematic Expertise
              </h3>
              <p className="text-text-secondary">
                Learn best practices with contextual suggestions and educational tooltips throughout the process.
              </p>
            </div>
            <div className="bg-background-primary border border-border-subtle rounded-md p-6 hover:border-border-default hover:shadow-elevated transition-all duration-200">
              <div className="w-12 h-12 bg-gold-muted rounded-base flex items-center justify-center mb-4" aria-hidden="true">
                <Download className="h-6 w-6 text-gold-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
                Export & Share
              </h3>
              <p className="text-text-secondary">
                Export your prompts as plain text, markdown, or JSON. Copy to clipboard with one click.
              </p>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}

