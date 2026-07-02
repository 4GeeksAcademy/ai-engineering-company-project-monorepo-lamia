interface StateMessageProps {
  type: "loading" | "error" | "success" | "empty";
  title: string;
  description?: string;
}

const typeStyles: Record<StateMessageProps["type"], string> = {
  loading: "bg-blue-50 text-blue-900 border-blue-200",
  error: "bg-rose-50 text-rose-900 border-rose-200",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  empty: "bg-zinc-50 text-zinc-700 border-zinc-200",
};

export function StateMessage({ type, title, description }: StateMessageProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${typeStyles[type]}`} role={type === "error" ? "alert" : "status"}>
      <p className="text-sm font-semibold">{title}</p>
      {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
    </div>
  );
}