"use client";

import { useState } from "react";

import { StateMessage } from "@/components/StateMessage";
import { addCandidateNote, deleteCandidateNote } from "@/services/candidates";
import type { CandidateNote } from "@/types/candidates";

interface NotesPanelProps {
  candidateId: string;
  initialNotes: CandidateNote[];
  initialError: string | null;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString();
}

export function NotesPanel({ candidateId, initialNotes, initialError }: NotesPanelProps) {
  const [notes, setNotes] = useState<CandidateNote[]>(initialNotes);
  const [noteDraft, setNoteDraft] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleAddNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noteDraft.trim()) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const newNote = await addCandidateNote(candidateId, { content: noteDraft.trim() });
      setNotes((current) => [newNote, ...current]);
      setNoteDraft("");
      setSuccessMessage("Note added successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteCandidateNote(candidateId, noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
      setSuccessMessage("Note deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note.");
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <header>
        <h2 className="text-lg font-semibold text-zinc-900">Candidate notes</h2>
      </header>

      <form onSubmit={handleAddNote} className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700">Add note</label>
        <textarea
          value={noteDraft}
          onChange={(event) => setNoteDraft(event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
          placeholder="Write a concise hiring note..."
        />
        <button
          type="submit"
          disabled={isSaving || !noteDraft.trim()}
          className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Add note"}
        </button>
      </form>

      {successMessage ? <StateMessage type="success" title={successMessage} /> : null}
      {error ? <StateMessage type="error" title="Notes request failed" description={error} /> : null}

      {notes.length === 0 ? (
        <StateMessage type="empty" title="No notes yet" description="Add the first note to track interview feedback." />
      ) : null}

      {notes.length > 0 ? (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-sm text-zinc-800">{note.content}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                <span>{formatDate(note.created_at)}</span>
                <button
                  type="button"
                  onClick={() => void handleDeleteNote(note.id)}
                  className="rounded-md border border-rose-300 px-2 py-1 font-semibold text-rose-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}