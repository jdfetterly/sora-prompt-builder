/**
 * @FeatureID F-10
 * @Purpose Prompts list page
 * @Spec /docs/PRD.md F-10
 * @Author Chat Bot Labs
 */

"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { getAllDrafts, deleteDraft } from "@/lib/storage";
import { assemblePrompt } from "@/lib/promptFormatter";
import { Film, Edit, Copy, Trash2, Download } from "lucide-react";
import type { Prompt } from "@/lib/types";
import { PromptStatus } from "@/lib/types";

const ExportModal = lazy(() => import("@/components/builder/ExportModal"));

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for better UX (only if fast)
    const timer = setTimeout(() => {
      loadPrompts();
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const loadPrompts = () => {
    const allPrompts = getAllDrafts();
    setPrompts(allPrompts);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteDraft(deleteTarget);
      loadPrompts();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const handleDuplicate = (prompt: Prompt) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      lastModified: Date.now(),
      status: PromptStatus.DRAFT,
    };
    // Save the duplicate
    const { saveDraft } = require("@/lib/storage");
    saveDraft(newPrompt);
    loadPrompts();
  };

  const handleExport = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowExportModal(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPreview = (prompt: Prompt) => {
    const assembled = assemblePrompt(prompt);
    return assembled.length > 60 ? assembled.substring(0, 60) + "..." : assembled;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton variant="text" width={200} height={32} />
              <Skeleton variant="text" width={150} height={20} />
            </div>
            <Skeleton variant="rectangular" width={150} height={40} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton variant="rectangular" width={60} height={24} />
                  <Skeleton variant="text" width={100} height={16} />
                </div>
                <Skeleton variant="text" width="100%" height={16} />
                <Skeleton variant="text" width="90%" height={16} />
                <Skeleton variant="text" width="80%" height={16} />
                <div className="flex gap-2 pt-4 border-t border-divider">
                  <Skeleton variant="rectangular" width="100%" height={36} />
                  <Skeleton variant="circular" width={36} height={36} />
                  <Skeleton variant="circular" width={36} height={36} />
                  <Skeleton variant="circular" width={36} height={36} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="min-h-screen bg-background-primary">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <div className="text-center">
            <Film className="h-16 w-16 text-text-tertiary mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-4">
              No prompts yet
            </h1>
            <p className="text-text-secondary mb-8">
              Create your first cinematic prompt
            </p>
            <Link href="/build">
              <Button variant="primary" size="lg">
                Create First Prompt
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              My Prompts
            </h1>
            <p className="text-text-secondary">
              {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}
            </p>
          </div>
          <Link href="/build">
            <Button variant="primary">Create New Prompt</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Card key={prompt.id} hover className="flex flex-col">
              <div className="flex-1 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant={prompt.status === PromptStatus.COMPLETE ? "complete" : "draft"}
                  >
                    {prompt.status}
                  </Badge>
                  <span className="text-xs text-text-tertiary">
                    {formatDate(prompt.lastModified)}
                  </span>
                </div>
                <p className="text-sm text-text-primary line-clamp-3 mb-4">
                  {getPreview(prompt)}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-divider">
                <Link
                  href="/build"
                  className="flex-1"
                  onClick={(e) => {
                    // Store prompt ID in sessionStorage to load it in builder
                    sessionStorage.setItem("loadPromptId", prompt.id);
                  }}
                >
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDuplicate(prompt)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport(prompt)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(prompt.id)}
                  className="text-error hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        title="Delete Prompt?"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Are you sure you want to delete this prompt? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmDelete}
              className="flex-1 bg-error hover:bg-error/90"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      {selectedPrompt && (
        <Suspense fallback={null}>
          <ExportModal
            isOpen={showExportModal}
            onClose={() => {
              setShowExportModal(false);
              setSelectedPrompt(null);
            }}
            prompt={selectedPrompt}
          />
        </Suspense>
      )}
    </div>
  );
}

