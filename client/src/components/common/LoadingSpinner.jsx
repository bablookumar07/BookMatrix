import { Loader2 } from "lucide-react";

function LoadingSpinner({
  size = "md",
  text = "Loading...",
  fullPage = false,
}) {
  const sizes = {
    sm: 16,
    md: 22,
    lg: 30,
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        size={sizes[size]}
        className="animate-spin text-cyan-800"
        strokeWidth={2}
      />

      {text && (
        <p className="text-sm font-medium text-slate-500">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export default LoadingSpinner;