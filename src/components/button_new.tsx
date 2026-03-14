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
      className="flex items-center gap-2 px-6 py-3.5 bg-(--lagoon) text-white rounded-xl hover:bg-(--lagoon-deep) shadow-lg shadow-(--lagoon)/20 hover:shadow-xl hover:scale-[1.02] transition-all text-sm font-bold"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}
