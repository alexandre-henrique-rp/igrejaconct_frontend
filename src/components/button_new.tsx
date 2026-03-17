import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface ButtonNewProps {
  nav: string;
  label: string;
}

export function ButtonNew({ nav, label }: ButtonNewProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate({ to: nav })}
      className="flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 text-white hover:text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-sm font-bold"
    >
      <Plus className="w-4 h-4 text-white" />
      {label}
    </button>
  );
}
