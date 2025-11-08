/**
 * @FeatureID F-1, F-2
 * @Purpose Builder page for creating prompts
 * @Spec /docs/PRD.md F-1, F-2
 * @Author Chat Bot Labs
 */

"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { StepNav } from "@/components/builder/StepNav";
import { StepControls } from "@/components/builder/StepControls";
import { PromptOutput } from "@/components/builder/PromptOutput";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SubjectStep } from "@/components/builder/steps/SubjectStep";
import { ActionSettingStep } from "@/components/builder/steps/ActionSettingStep";
import { StyleStep } from "@/components/builder/steps/StyleStep";
import { CameraStep } from "@/components/builder/steps/CameraStep";
import { VisualDetailsStep } from "@/components/builder/steps/VisualDetailsStep";
import { saveDraft, getLastDraft, getDraft } from "@/lib/storage";
import { validateField } from "@/lib/validation";
import type { Prompt } from "@/lib/types";
import { PromptStatus } from "@/lib/types";

// Lazy load only the ExportModal (larger component, not always visible)
const ExportModal = lazy(() => import("@/components/builder/ExportModal"));

export default function BuildPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [prompt, setPrompt] = useState<Partial<Prompt>>({
    subject: "",
    actionSetting: "",
    cinematicStyle: "",
    cameraShot: "",
    visualDetails: "",
    status: PromptStatus.DRAFT,
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Load draft on mount
  useEffect(() => {
    // Check if we should load a specific prompt (from prompts page)
    if (typeof window !== "undefined") {
      const promptId = sessionStorage.getItem("loadPromptId");
      if (promptId) {
        const prompt = getDraft(promptId);
        if (prompt) {
          setPrompt(prompt);
          const completed: number[] = [];
          if (prompt.subject) completed.push(1);
          if (prompt.actionSetting) completed.push(2);
          if (prompt.cinematicStyle) completed.push(3);
          if (prompt.cameraShot) completed.push(4);
          if (prompt.visualDetails) completed.push(5);
          setCompletedSteps(completed);
          if (completed.length > 0) {
            setCurrentStep(Math.min(completed.length + 1, 5));
          }
          sessionStorage.removeItem("loadPromptId");
          setDraftLoaded(true);
          return;
        }
      }
    }

    // Otherwise check for last draft
    const lastDraft = getLastDraft();
    if (lastDraft && !draftLoaded) {
      setShowDraftModal(true);
    }
  }, [draftLoaded]);

  const handleLoadDraft = () => {
    const lastDraft = getLastDraft();
    if (lastDraft) {
      setPrompt(lastDraft);
      // Determine completed steps
      const completed: number[] = [];
      if (lastDraft.subject) completed.push(1);
      if (lastDraft.actionSetting) completed.push(2);
      if (lastDraft.cinematicStyle) completed.push(3);
      if (lastDraft.cameraShot) completed.push(4);
      if (lastDraft.visualDetails) completed.push(5);
      setCompletedSteps(completed);
      if (completed.length > 0) {
        setCurrentStep(Math.min(completed.length + 1, 5));
      }
    }
    setShowDraftModal(false);
    setDraftLoaded(true);
  };

  const handleStartFresh = () => {
    setShowDraftModal(false);
    setDraftLoaded(true);
  };

  // Auto-save on change
  useEffect(() => {
    if (prompt.subject || prompt.actionSetting || prompt.cinematicStyle || prompt.cameraShot || prompt.visualDetails) {
      // saveDraft is debounced and returns void, but it will update localStorage
      // The ID is already set in the prompt object if it exists
      saveDraft(prompt);
    }
  }, [prompt]);

  const handleFieldChange = useCallback((field: keyof Prompt, value: string) => {
    setPrompt((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Update completed steps
      const stepMap: Record<string, number> = {
        subject: 1,
        actionSetting: 2,
        cinematicStyle: 3,
        cameraShot: 4,
        visualDetails: 5,
      };
      
      const step = stepMap[field];
      if (step && value.trim()) {
        setCompletedSteps((prev) => {
          if (!prev.includes(step)) {
            return [...prev, step].sort();
          }
          return prev;
        });
      } else if (step && !value.trim()) {
        setCompletedSteps((prev) => prev.filter((s) => s !== step));
      }
      
      return updated;
    });
  }, []);

  const getFieldValidation = useCallback((field: keyof Prompt): { level: "error" | "warning" | "success"; message: string } | null => {
    const value = prompt[field] as string || "";
    const validation = validateField(field, value);
    if (!validation) return null;
    return {
      level: validation.level,
      message: validation.message,
    };
  }, [prompt]);

  const canContinue = useCallback((): boolean => {
    if (currentStep === 1) {
      return !!(prompt.subject && prompt.subject.trim().length > 0);
    }
    return true;
  }, [currentStep, prompt.subject]);

  const handleNext = useCallback(() => {
    const canProceed = canContinue();
    if (canProceed && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 5 && canProceed) {
      // Show export modal on completion
      setShowExportModal(true);
    }
  }, [currentStep, canContinue]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleStepClick = useCallback((step: number) => {
    // Only allow clicking on completed steps or current step
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [completedSteps, currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Arrow keys for step navigation
      if (e.key === "ArrowLeft" && currentStep > 1) {
        e.preventDefault();
        handleBack();
      } else if (e.key === "ArrowRight" && currentStep < 5 && canContinue()) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, handleBack, handleNext, canContinue]);

  const handleSaveDraft = useCallback(() => {
    // Generate ID if needed before saving
    if (!prompt.id) {
      const newId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setPrompt((prev) => ({ ...prev, id: newId }));
      saveDraft({ ...prompt, id: newId });
    } else {
      saveDraft(prompt);
    }
  }, [prompt]);

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <SubjectStep
            value={prompt.subject || ""}
            onChange={(value) => handleFieldChange("subject", value)}
            validation={getFieldValidation("subject")}
          />
        );
      case 2:
        return (
          <ActionSettingStep
            value={prompt.actionSetting || ""}
            onChange={(value) => handleFieldChange("actionSetting", value)}
            validation={getFieldValidation("actionSetting")}
          />
        );
      case 3:
        return (
          <StyleStep
            value={prompt.cinematicStyle || ""}
            onChange={(value) => handleFieldChange("cinematicStyle", value)}
            validation={getFieldValidation("cinematicStyle")}
          />
        );
      case 4:
        return (
          <CameraStep
            value={prompt.cameraShot || ""}
            onChange={(value) => handleFieldChange("cameraShot", value)}
            validation={getFieldValidation("cameraShot")}
          />
        );
      case 5:
        return (
          <VisualDetailsStep
            value={prompt.visualDetails || ""}
            onChange={(value) => handleFieldChange("visualDetails", value)}
            validation={getFieldValidation("visualDetails")}
          />
        );
      default:
        return null;
    }
  }, [currentStep, prompt, getFieldValidation, handleFieldChange]);

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Draft Recovery Modal */}
      <Modal
        isOpen={showDraftModal}
        onClose={handleStartFresh}
        title="Continue where you left off?"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            We found a draft from your last session. Would you like to continue working on it?
          </p>
          <div className="flex gap-4">
            <Button variant="primary" onClick={handleLoadDraft} className="flex-1">
              Continue Draft
            </Button>
            <Button variant="secondary" onClick={handleStartFresh} className="flex-1">
              Start Fresh
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      {showExportModal && prompt.id && (
        <Suspense fallback={null}>
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            prompt={{
              id: prompt.id || "",
              subject: prompt.subject || "",
              actionSetting: prompt.actionSetting || "",
              cinematicStyle: prompt.cinematicStyle || "",
              cameraShot: prompt.cameraShot || "",
              visualDetails: prompt.visualDetails || "",
              createdAt: prompt.createdAt || Date.now(),
              lastModified: prompt.lastModified || Date.now(),
              status: prompt.status || PromptStatus.DRAFT,
            }}
          />
        </Suspense>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <StepNav
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        {/* Main Content */}
        <main id="main-content" className="flex-1 md:ml-16 lg:ml-60 min-h-screen" tabIndex={-1}>
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              Step {currentStep} of 5
            </div>
            {renderStep()}

            <StepControls
              currentStep={currentStep}
              totalSteps={5}
              canContinue={canContinue()}
              onBack={handleBack}
              onNext={handleNext}
              onSaveDraft={handleSaveDraft}
              isLastStep={currentStep === 5}
            />
          </div>
        </main>

        {/* Output Preview */}
        <aside className="w-full md:w-80 md:p-6 hidden xl:block">
          <PromptOutput prompt={prompt} />
        </aside>
      </div>
    </div>
  );
}
