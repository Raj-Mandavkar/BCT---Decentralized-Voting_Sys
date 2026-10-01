// src/components/Toast.jsx
// ──────────────────────────────────────────────────────────────────────────────
// A lightweight, auto-dismissing toast notification component.
// Supports three variants: "success" | "error" | "info"
//
// Props:
//   toast  { message: string, type: "success"|"error"|"info" } | null
// ──────────────────────────────────────────────────────────────────────────────

const STYLES = {
  success: {
    bar:  "bg-green-500",
    icon: "✅",
    ring: "border-green-500/30 bg-green-500/10",
    text: "text-green-300",
  },
  error: {
    bar:  "bg-red-500",
    icon: "❌",
    ring: "border-red-500/30 bg-red-500/10",
    text: "text-red-300",
  },
  info: {
    bar:  "bg-brand-500",
    icon: "ℹ️",
    ring: "border-brand-500/30 bg-brand-500/10",
    text: "text-brand-300",
  },
};

export default function Toast({ toast }) {
  if (!toast) return null;

  const s = STYLES[toast.type] || STYLES.info;

  return (
    <div
      id="toast-notification"
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3
        rounded-xl border backdrop-blur-md shadow-card animate-slide-up
        max-w-sm w-full sm:w-auto ${s.ring}`}
    >
      {/* Colored left bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${s.bar}`} />

      <span className="text-lg ml-1 flex-shrink-0">{s.icon}</span>
      <p className={`text-sm font-medium leading-snug ${s.text} flex-1`}>
        {toast.message}
      </p>
    </div>
  );
}
