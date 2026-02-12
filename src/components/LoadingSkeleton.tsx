/**
 * Loading Skeleton Components
 * Used for better UX while data is loading
 */

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-muted/50 rounded ${className}`}
      aria-hidden="true"
    />
  );
};

export const TaskCardSkeleton = () => {
  return (
    <div className="rounded-2xl glass p-5 shadow-card border-l-4 border-l-transparent">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          {/* Title skeleton */}
          <Skeleton className="h-5 w-3/4" />
          
          {/* Description skeleton */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          
          {/* Priority and date badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        
        {/* Checkbox skeleton */}
        <Skeleton className="h-5 w-5 rounded" />
      </div>
    </div>
  );
};

export const StatsBarSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl glass p-4 shadow-card"
        >
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>
  );
};

export const ProgressTrackerSkeleton = () => {
  return (
    <div className="rounded-xl glass p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
};

export const TaskListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
};
