
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Image, Upload, RefreshCw, Search } from "lucide-react";
import { WordPressMedia, WordPressAccount } from "@/types/wordpress";

const STORAGE_KEY = "wordpress_media";

// Mock image data
const mockImages = [
  {
    id: "1",
    title: "Sample Image 1",
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    alt: "A turned on gray laptop computer",
    date: "2023-05-15T10:30:00Z",
    type: "image/jpeg",
    accountId: "1"
  },
  {
    id: "2",
    title: "Sample Image 2",
    url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    alt: "Colorful software code on a monitor",
    date: "2023-06-20T14:45:00Z",
    type: "image/jpeg",
    accountId: "1"
  },
  {
    id: "3",
    title: "Sample Image 3",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    alt: "MacBook with code on screen",
    date: "2023-07-10T09:15:00Z",
    type: "image/jpeg",
    accountId: "2"
  },
  {
    id: "4",
    title: "Sample Image 4",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    alt: "Woman using laptop",
    date: "2023-08-05T16:20:00Z",
    type: "image/jpeg",
    accountId: "2"
  }
];

interface MediaManagerProps {
  accounts: WordPressAccount[];
  selectedAccount: string;
  onSelectImage?: (image: WordPressMedia) => void;
  selectionMode?: boolean;
}

const MediaManager = ({ 
  accounts, 
  selectedAccount, 
  onSelectImage, 
  selectionMode = false 
}: MediaManagerProps) => {
  const [media, setMedia] = useState<WordPressMedia[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountFilter, setAccountFilter] = useState<string>(selectedAccount);
  const { toast } = useToast();

  // Load media from localStorage on component mount
  useEffect(() => {
    const savedMedia = localStorage.getItem(STORAGE_KEY);
    if (savedMedia && savedMedia !== "undefined" && savedMedia !== "null") {
      try {
        const parsedMedia = JSON.parse(savedMedia);
        setMedia(parsedMedia);
      } catch (error) {
        console.error("Failed to parse media from localStorage:", error);
        // Use mock data if parsing fails
        setMedia(mockImages);
      }
    } else {
      // Use mock data if no saved media
      setMedia(mockImages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockImages));
    }
  }, []);

  // Filter media based on selected account
  const filteredMedia = media.filter(item => 
    (!accountFilter || item.accountId === accountFilter) && 
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (item.alt && item.alt.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const refreshMedia = () => {
    setIsLoading(true);
    // In a real app, this would fetch media from the WordPress API
    setTimeout(() => {
      toast({
        title: "Media Refreshed",
        description: `Found ${filteredMedia.length} media items`,
      });
      setIsLoading(false);
    }, 1000);
  };

  const uploadMedia = () => {
    // This would be replaced with actual file upload functionality
    toast({
      title: "Upload Media",
      description: "This feature would open a file dialog in a real implementation",
    });
  };

  const handleImageSelect = (image: WordPressMedia) => {
    if (onSelectImage) {
      onSelectImage(image);
      if (selectionMode) {
        toast({
          title: "Image Selected",
          description: `Selected ${image.title} as featured image`,
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="w-full md:w-auto">
          <Label htmlFor="account-select">WordPress Account</Label>
          <Select value={accountFilter} onValueChange={(value) => setAccountFilter(value)}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  {account.siteUrl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            onClick={refreshMedia} 
            variant="outline" 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={uploadMedia} 
            className="w-full md:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search media..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredMedia.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <Image className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No media found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {accountFilter ? "Try selecting a different account or uploading new media" : "Try uploading some media"}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[500px] rounded-md border">
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map(image => (
                <Card 
                  key={image.id} 
                  className={`overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${selectionMode ? 'hover:ring-2 hover:ring-primary' : ''}`}
                  onClick={() => handleImageSelect(image)}
                >
                  <div className="aspect-square overflow-hidden bg-secondary/20">
                    <img 
                      src={image.url} 
                      alt={image.alt || image.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium truncate">{image.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(image.date).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MediaManager;
