import { Inbox } from "lucide-react";

function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to display at the moment.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500">
        <Icon size={22} strokeWidth={1.8} />
      </div>

      <h3 className="text-base font-bold text-[#102022]">
        {title}
      </h3>

      <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;