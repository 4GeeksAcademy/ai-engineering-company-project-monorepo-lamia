import { StateMessage } from "@/components/StateMessage";

export default function Loading() {
  return (
    <div className="min-h-screen bg-app-pattern">
      <main className="mx-auto flex w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <StateMessage type="loading" title="Loading TrackFlow data..." />
        </div>
      </main>
    </div>
  );
}
