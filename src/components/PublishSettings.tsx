
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PublishSettings as PublishSettingsType, WordPressPostStatus } from "@/types/wordpress";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface PublishSettingsProps {
  initialSettings?: Partial<PublishSettingsType>;
  onSettingsChange: (settings: PublishSettingsType) => void;
  postId?: string; // If editing an existing post
}

const PublishSettings = ({ initialSettings, onSettingsChange, postId }: PublishSettingsProps) => {
  const [settings, setSettings] = useState<PublishSettingsType>({
    title: initialSettings?.title || "",
    status: initialSettings?.status || "draft",
    scheduledDate: initialSettings?.scheduledDate,
    categoryIds: initialSettings?.categoryIds || [],
    tagIds: initialSettings?.tagIds || []
  });

  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = (field: keyof PublishSettingsType, value: any) => {
    const newSettings = { ...settings, [field]: value };
    
    // If status is set to "future", ensure there's a scheduled date
    if (field === "status" && value === "future" && !settings.scheduledDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0);
      newSettings.scheduledDate = tomorrow.toISOString();
    }

    // If status is changed from "future" to something else, clear the scheduled date
    if (field === "status" && value !== "future" && settings.status === "future") {
      newSettings.scheduledDate = undefined;
    }
    
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Set time to noon on the selected day
      date.setHours(12, 0, 0, 0);
      handleChange("scheduledDate", date.toISOString());
      setShowCalendar(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-background rounded-lg border">
      <h3 className="text-lg font-medium">Publishing Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="post-title">Post Title</Label>
        <Input
          id="post-title"
          value={settings.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter post title"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="post-status">Status</Label>
          <Select 
            value={settings.status} 
            onValueChange={(value: WordPressPostStatus) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="publish">Published</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="future">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {settings.status === "future" && (
          <div className="space-y-2">
            <Label>Schedule Date</Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {settings.scheduledDate 
                    ? format(new Date(settings.scheduledDate), "PPP") 
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={settings.scheduledDate ? new Date(settings.scheduledDate) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishSettings;
