"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Heart,
  X,
  Save,
  Loader2,
  ImageIcon,
} from "lucide-react";
import {
  adminCreateSpeech,
  adminUpdateSpeech,
  adminDeleteSpeech,
  adminToggleSpeechActive,
} from "@/lib/actions/speeches";
import type { Speech } from "@/lib/actions/speeches";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SpeechImageUploader from "@/components/admin/SpeechImageUploader";

type Mode = "list" | "create" | "edit";

export default function AdminSpeechesClient({
  speeches: initial,
}: {
  speeches: Speech[];
}) {
  const [speeches, setSpeeches] = useState(initial);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<Speech | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    body: "",
    image_url: "",
    is_active: "true",
  });

  const openCreate = () => {
    setForm({
      title: "",
      excerpt: "",
      body: "",
      image_url: "",
      is_active: "true",
    });
    setEditing(null);
    setMode("create");
  };

  const openEdit = (s: Speech) => {
    setForm({
      title: s.title,
      excerpt: s.excerpt,
      body: s.body,
      image_url: s.image_url ?? "",
      is_active: s.is_active ? "true" : "false",
    });
    setEditing(s);
    setMode("edit");
  };

  const handleSave = async () => {
    if (!form.title || !form.excerpt || !form.body) {
      toast.error("FILL ALL REQUIRED FIELDS");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    const result =
      mode === "edit" && editing
        ? await adminUpdateSpeech(editing.id, fd)
        : await adminCreateSpeech(fd);

    setLoading(false);
    if (result?.error) {
      toast.error(result.error.toUpperCase());
    } else {
      toast.success(mode === "edit" ? "SPEECH UPDATED" : "SPEECH CREATED");
      setMode("list");
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const result = await adminDeleteSpeech(id);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error.toUpperCase());
    } else {
      toast.success("DELETED");
      setDeleteId(null);
      router.refresh();
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    await adminToggleSpeechActive(id, !current);
    router.refresh();
  };

  // ── FORM VIEW ──────────────────────────────────────────────────────────────
  if (mode === "create" || mode === "edit") {
    return (
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-army uppercase mb-1">
              — {mode === "edit" ? "EDIT" : "NEW"} SPEECH
            </p>
            <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-tylon-primary uppercase">
              {mode === "edit" ? editing?.title : "CREATE SPEECH"}
            </h2>
          </div>
          <button
            onClick={() => setMode("list")}
            className="flex items-center gap-2 border border-tylon-border px-4 py-2 font-mono text-[10px] tracking-widest text-tylon-muted hover:border-army hover:text-tylon-primary transition-all"
          >
            <X size={12} /> CANCEL
          </button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block font-mono text-[9px] tracking-[0.3em] text-army uppercase mb-2">
              TITLE *
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. THE IRON WILL"
              className="input-tylon"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-mono text-[9px] tracking-[0.3em] text-army uppercase mb-2">
              EXCERPT *{" "}
              <span className="text-tylon-muted normal-case">
                (shown in card)
              </span>
            </label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Short powerful opening line..."
              className="input-tylon resize-none"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block font-mono text-[9px] tracking-[0.3em] text-army uppercase mb-2">
              FULL SPEECH *{" "}
              <span className="text-tylon-muted normal-case">
                (shown in detail view)
              </span>
            </label>
            <textarea
              rows={8}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write the full motivational speech..."
              className="input-tylon resize-none"
            />
          </div>

          {/* Image URL /}
          <div>
            <label className="block font-mono text-[9px] tracking-[0.3em] text-army uppercase mb-2">
              IMAGE URL{" "}
              <span className="text-tylon-muted normal-case">
                (ImageKit URL)
              </span>
            </label>
            <input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://ik.imagekit.io/your-id/..."
              className="input-tylon"
            />
            {form.image_url && (
              <div className="mt-3 relative w-full h-40 border border-tylon-border overflow-hidden">
                <Image
                  src={form.image_url}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>*/}

          <SpeechImageUploader
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
          />

          {/* Active toggle */}
          <div className="flex items-center gap-4">
            <label className="font-mono text-[9px] tracking-[0.3em] text-army uppercase">
              STATUS
            </label>
            {["true", "false"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setForm({ ...form, is_active: v })}
                className={`px-4 py-2 font-mono text-[10px] tracking-widest border transition-all ${
                  form.is_active === v
                    ? "bg-army border-army text-tylon-primary"
                    : "border-tylon-border text-tylon-muted hover:border-army"
                }`}
              >
                {v === "true" ? "ACTIVE" : "DRAFT"}
              </button>
            ))}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-army text-tylon-primary px-8 py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {mode === "edit" ? "SAVE CHANGES" : "PUBLISH SPEECH"}
          </button>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] text-army uppercase mb-1">
            — CONTENT
          </p>
          <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-tylon-primary uppercase">
            MOTIVATIONAL SPEECHES
          </h2>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-army text-tylon-primary px-5 py-3 font-mono text-[10px] tracking-widest hover:bg-army-light transition-colors"
        >
          <Plus size={14} /> NEW SPEECH
        </button>
      </div>

      {speeches.length === 0 ? (
        <div className="text-center py-20 border border-tylon-border bg-tylon-card">
          <p className="font-display text-2xl text-tylon-muted uppercase tracking-[0.1em] mb-4">
            NO SPEECHES YET
          </p>
          <button
            onClick={openCreate}
            className="font-mono text-[10px] tracking-widest text-army hover:text-army-light transition-colors"
          >
            + CREATE FIRST SPEECH
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {speeches.map((s) => (
            <div
              key={s.id}
              className={`bg-tylon-card border p-5 flex gap-5 items-start transition-all ${
                s.is_active
                  ? "border-tylon-border"
                  : "border-tylon-border/40 opacity-60"
              }`}
            >
              {/* Image thumbnail */}
              <div className="shrink-0 w-16 h-16 bg-tylon-secondary border border-tylon-border overflow-hidden flex items-center justify-center">
                {s.image_url ? (
                  <Image
                    src={s.image_url}
                    alt={s.title}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <ImageIcon size={20} className="text-tylon-muted" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[0.08em] text-tylon-primary uppercase">
                      {s.title}
                    </h3>
                    <p className="font-body text-sm text-tylon-muted mt-1 line-clamp-1">
                      {s.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Heart size={12} className="text-danger" />
                    <span className="font-mono text-[11px] text-tylon-muted">
                      {s.like_count ?? 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`font-mono text-[9px] tracking-widest px-2 py-1 ${
                      s.is_active
                        ? "bg-army/20 text-army-light border border-army/30"
                        : "bg-tylon-secondary text-tylon-muted border border-tylon-border"
                    }`}
                  >
                    {s.is_active ? "ACTIVE" : "DRAFT"}
                  </span>

                  <button
                    onClick={() => openEdit(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-tylon-border font-mono text-[9px] tracking-widest text-tylon-muted hover:border-army hover:text-tylon-primary transition-all"
                  >
                    <Pencil size={10} /> EDIT
                  </button>

                  <button
                    onClick={() => handleToggle(s.id, s.is_active)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-tylon-border font-mono text-[9px] tracking-widest text-tylon-muted hover:border-army hover:text-tylon-primary transition-all"
                  >
                    {s.is_active ? <EyeOff size={10} /> : <Eye size={10} />}
                    {s.is_active ? "HIDE" : "SHOW"}
                  </button>

                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-tylon-border font-mono text-[9px] tracking-widest text-tylon-muted hover:border-danger hover:text-danger transition-all"
                  >
                    <Trash2 size={10} /> DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setDeleteId(null)}
        >
          <div className="absolute inset-0 bg-tylon-bg/85 backdrop-blur-sm" />
          <div
            className="relative z-10 bg-tylon-secondary border border-tylon-border p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold tracking-[0.1em] text-tylon-primary uppercase mb-2">
              DELETE SPEECH?
            </h3>
            <p className="font-body text-sm text-tylon-muted mb-6">
              This will permanently delete the speech and all its likes. This
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-danger text-tylon-primary py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                DELETE
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-tylon-border text-tylon-muted py-3 font-mono text-[10px] tracking-widest hover:border-army hover:text-tylon-primary transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
