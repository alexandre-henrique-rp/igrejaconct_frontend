import { FC } from 'react';

interface CardProps {
  title: string;
  icon: string;
}

export const ChartsCard: FC<CardProps> = ({ title, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--line)] p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="h-6 w-6 text-[var(--lagoon)]">{icon}</span>}
        <span className="text-[var(--sea-ink)] font-medium">{title}</span>
      </div>
      <div className="h-8 rounded-full bg-[var(--line)]"></div>
    </div>
  );
};