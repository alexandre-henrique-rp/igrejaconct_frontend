import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const SkeletonListItem: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("bg-white border border-[var(--line)] rounded-xl p-6 animate-pulse", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonTableRow: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("border-b border-[var(--line)] p-4 animate-pulse", className)}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 h-4 bg-gray-200 rounded"></div>
        <div className="col-span-3 h-4 bg-gray-200 rounded"></div>
        <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
        <div className="col-span-3 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export const SkeletonFormField: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("space-y-2 animate-pulse", className)}>
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
    </div>
  );
};

export const SkeletonButton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("h-10 px-4 bg-gray-200 rounded-lg animate-pulse", className)}></div>
  );
};

export const SkeletonChart: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("h-64 bg-gray-100 rounded-lg animate-pulse", className)}>
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    </div>
  );
};