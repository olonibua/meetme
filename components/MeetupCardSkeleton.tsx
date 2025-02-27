import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from '../lib/theme';
import { cn } from "@/lib/utils";

export default function MeetupCardSkeleton() {
  const { theme } = useTheme();
  
  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow",
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    )}>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
} 