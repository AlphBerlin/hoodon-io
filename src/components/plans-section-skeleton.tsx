import { Skeleton } from "@/components/ui/skeleton"

export function PlansSectionSkeleton() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>

          <Skeleton className="h-12 w-full max-w-md mx-auto rounded-full" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
        </div>
      </div>
    </div>
  )
}

