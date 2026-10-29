'use client'

import { useState, useEffect, useRef } from 'react'
import { createProjectAction, fetchExistingProjectTypesAction } from '@/app/(dashboard)/projects/actions'
import { X, Briefcase, Plus, Loader2, Calendar, DollarSign, User, Shield, ChevronDown, Check } from 'lucide-react'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  clientsList: { id: string; name: string }[]
  membersList: { id: string; name: string }[]
  templatesList?: { id: string; name: string; type?: string | null; default_amount?: number; description?: string | null }[]
  initialClientId?: string
  existingTypes?: string[]
}

export function NewProjectModal({
  isOpen,
  onClose,
  onSuccess,
  clientsList,
  membersList,
  templatesList = [],
  initialClientId,
  existingTypes = [],
}: NewProjectModalProps) {
  const [clientId, setClientId] = useState(initialClientId || clientsList[0]?.id || '')
  const [templateId, setTemplateId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)
  const [availableTypes, setAvailableTypes] = useState<string[]>(existingTypes)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const [briefSource, setBriefSource] = useState('WhatsApp')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [status, setStatus] = useState('Active')
  const [priority, setPriority] = useState('medium')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [deadline, setDeadline] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setType('')
      setIsTypeDropdownOpen(false)
      if (existingTypes.length > 0) {
        setAvailableTypes(existingTypes)
      } else {
        fetchExistingProjectTypesAction().then((types) => {
          if (types && types.length > 0) {
            setAvailableTypes(types)
          }
        })
      }
    }
  }, [isOpen, existingTypes])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleTemplateSelect = (selectedTmplId: string) => {
    setTemplateId(selectedTmplId)
    const tmpl = templatesList.find((t) => t.id === selectedTmplId)
    if (tmpl) {
      if (tmpl.type) setType(tmpl.type)
      if (tmpl.default_amount) setAmount(tmpl.default_amount.toString())
      if (tmpl.description && !description) setDescription(tmpl.description)
      if (!title) setTitle(tmpl.name + ' Project')
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('client_id', clientId)
    if (templateId) formData.append('template_id', templateId)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('type', type)
    formData.append('brief_source', briefSource)
    formData.append('amount', amount)
    formData.append('currency', currency)
    formData.append('status', status)
    formData.append('priority', priority)
    formData.append('start_date', startDate)
    formData.append('deadline', deadline)
    formData.append('assigned_to', assignedTo)
    formData.append('notes', notes)

    const res = await createProjectAction(formData)

    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      onClose()
      if (onSuccess) onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-overlay)] backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Create New Project</h2>
              <p className="text-xs text-muted-foreground">Add a client project record with budget & deadlines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
          {/* Template Selection Dropdown */}
          {templatesList.length > 0 && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1">
              <label className="block font-semibold text-indigo-300">
                Use Project Template (Optional)
              </label>
              <select
                value={templateId}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
              >
                <option value="">No Template (Custom Project)</option>
                {templatesList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.type || 'Combined'})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground">
                Selecting a template automatically populates tasks & default deliverables.
              </p>
            </div>
          )}

          {/* Client & Project Title Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Client <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
              >
                {clientsList.length === 0 ? (
                  <option value="">No clients found — add client first</option>
                ) : (
                  clientsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. UGC Video Ad Campaign / AI Agent"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground placeholder:text-placeholder focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-muted-foreground font-semibold mb-1">Description & Scope</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline project deliverables, requirements, and goal..."
              className="w-full rounded-xl border border-border bg-background p-3 text-foreground placeholder:text-placeholder focus:border-primary focus:outline-none"
            />
          </div>

          {/* Type & Brief Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div ref={typeDropdownRef} className="relative">
              <label className="block text-muted-foreground font-semibold mb-1">Project Type</label>
              <div className="relative">
                <input
                  type="text"
                  list="project-type-suggestions"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value)
                    setIsTypeDropdownOpen(true)
                  }}
                  onFocus={() => {
                    if (availableTypes.length > 0) setIsTypeDropdownOpen(true)
                  }}
                  placeholder={
                    availableTypes.length > 0
                      ? 'Select or enter project type...'
                      : 'Enter project type (e.g. AI, Web)...'
                  }
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground placeholder:text-placeholder focus:border-primary focus:outline-none pr-9"
                />
                {availableTypes.length > 0 && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isTypeDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}

                <datalist id="project-type-suggestions">
                  {availableTypes.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>

              {isTypeDropdownOpen && availableTypes.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-48 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-2xl backdrop-blur-md">
                  {availableTypes
                    .filter((t) => !type || t.toLowerCase().includes(type.toLowerCase()))
                    .map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setType(t)
                          setIsTypeDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                          type.toLowerCase() === t.toLowerCase()
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <span>{t}</span>
                        {type.toLowerCase() === t.toLowerCase() && (
                          <Check className="h-3.5 w-3.5 text-primary" />
                        )}
                      </button>
                    ))}
                  {type.trim() &&
                    !availableTypes.some(
                      (t) => t.toLowerCase() === type.trim().toLowerCase()
                    ) && (
                      <div className="px-3 py-1.5 text-[11px] text-muted-foreground border-t border-border/50 mt-1">
                        New type: <span className="font-semibold text-foreground">"{type}"</span>
                      </div>
                    )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Brief Source</label>
              <select
                value={briefSource}
                onChange={(e) => setBriefSource(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Slack">Slack</option>
                <option value="Upwork">Upwork</option>
                <option value="Discord">Discord</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Project Budget / Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground placeholder:text-placeholder focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none uppercase"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>

          {/* Status, Priority & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Assigned Team Member</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Unassigned</option>
                {membersList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Date & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-semibold mb-1">Target Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-muted-foreground font-semibold hover:bg-muted hover:text-foreground transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !clientId}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
