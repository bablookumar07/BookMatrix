import { ArrowUpRight } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  trend,
  className = "",
}) {
  return (
    <div
      className={`
        border border-slate-200 bg-white p-5
        transition-shadow duration-200
        hover:shadow-sm
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-[#102022]">
            {value}
          </p>
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-cyan-100 bg-cyan-50 text-cyan-800">
            <Icon size={19} strokeWidth={1.8} />
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          {trend && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <ArrowUpRight size={13} />
              {trend}
            </span>
          )}

          {description && (
            <span className="text-xs text-slate-500">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;