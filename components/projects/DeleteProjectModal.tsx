'use client'

import React from 'react'
import { Trash2, AlertTriangle, X, Loader2, Briefcase, Building2 } from 'lucide-react'

export interface DeleteProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  projectTitle: string
  clientName?: string | null
  isLoading?: boolean
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  clientName,
  isLoading = false,
}: DeleteProjectModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-overlay)] backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Danger Icon */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <Trash2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Delete Project</h3>
            <p className="text-xs text-muted-foreground">
              This action is permanent and cannot be undone
            </p>
          </div>
        </div>

        {/* Confirmation & Target Project Info Card */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2.5">
          <p className="text-xs text-muted-foreground">
            Are you sure you want to delete this project?
          </p>

          <div className="flex items-center gap-2 text-sm font-bold text-foreground bg-background/80 border border-border/60 rounded-lg px-3 py-2 break-all">
            <Briefcase className="h-4 w-4 text-primary shrink-0" />
            <span className="line-clamp-2">{projectTitle}</span>
          </div>

          {clientName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
              <Building2 className="h-3.5 w-3.5" />
              <span>Client:</span>
              <span className="font-semibold text-foreground">{clientName}</span>
            </div>
          )}

          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-[11px] text-destructive flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>All tasks, deliverables, and activity logs associated with this project will be permanently removed.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold shadow-lg shadow-destructive/20 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
