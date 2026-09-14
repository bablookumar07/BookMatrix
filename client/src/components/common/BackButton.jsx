import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-cyan-700"
    >
      <ArrowLeft size={17} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

export default BackButton;