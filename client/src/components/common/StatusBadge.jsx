function StatusBadge({ status, label }) {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  const styles = {
    borrowed: {
      wrapper: "border-cyan-200 bg-cyan-50 text-cyan-800",
      dot: "bg-cyan-600",
      text: "Borrowed",
    },

    active: {
      wrapper: "border-cyan-200 bg-cyan-50 text-cyan-800",
      dot: "bg-cyan-600",
      text: "Active",
    },

    returned: {
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
      dot: "bg-emerald-600",
      text: "Returned",
    },

    overdue: {
      wrapper: "border-red-200 bg-red-50 text-red-700",
      dot: "bg-red-600",
      text: "Overdue",
    },

    available: {
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
      dot: "bg-emerald-600",
      text: "Available",
    },

    unavailable: {
      wrapper: "border-slate-200 bg-slate-100 text-slate-600",
      dot: "bg-slate-500",
      text: "Unavailable",
    },

    pending: {
      wrapper: "border-amber-200 bg-amber-50 text-amber-800",
      dot: "bg-amber-500",
      text: "Pending",
    },

    active_user: {
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
      dot: "bg-emerald-600",
      text: "Active",
    },

    inactive: {
      wrapper: "border-slate-200 bg-slate-100 text-slate-600",
      dot: "bg-slate-500",
      text: "Inactive",
    },
  };

  const currentStyle = styles[normalizedStatus] || {
    wrapper: "border-slate-200 bg-slate-100 text-slate-600",
    dot: "bg-slate-500",
    text: label || status || "Unknown",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        border px-2.5 py-1
        text-xs font-semibold
        ${currentStyle.wrapper}
      `}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`}
        aria-hidden="true"
      />

      {label || currentStyle.text}
    </span>
  );
}

export default StatusBadge;