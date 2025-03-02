
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";

interface PostStatusBadgeProps {
  status: string;
  scheduledDate?: string;
}

export const PostStatusBadge = ({ status, scheduledDate }: PostStatusBadgeProps) => {
  const variants: Record<string, string> = {
    publish: "bg-green-500 hover:bg-green-600",
    draft: "bg-yellow-500 hover:bg-yellow-600",
    future: "bg-blue-500 hover:bg-blue-600",
    private: "bg-purple-500 hover:bg-purple-600",
    pending: "bg-orange-500 hover:bg-orange-600"
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <>
      <Badge className={variants[status] || "bg-gray-500"}>
        {status === "future" ? "Scheduled" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
      {status === "future" && scheduledDate && (
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <CalendarClock className="h-3 w-3 mr-1" />
          {formatDate(scheduledDate)}
        </div>
      )}
    </>
  );
};
