import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="
        inline-flex
        items-center
        gap-2
        px-1
        py-1
        text-sm
        font-medium
        text-slate-500
        transition-all
        duration-200
        hover:-translate-x-0.5
        hover:text-cyan-800
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-600/30
        rounded
      "
    >
      <ArrowLeft size={17} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

export default BackButton;