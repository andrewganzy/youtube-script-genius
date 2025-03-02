
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Edit, ExternalLink, Filter, Trash, FileText } from "lucide-react";
import { WordPressPost, WordPressAccount } from "@/types/wordpress";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface ExistingPostsProps {
  accounts: WordPressAccount[];
  onEditPost: (post: WordPressPost) => void;
}

const ExistingPosts = ({ accounts, onEditPost }: ExistingPostsProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts]);

  useEffect(() => {
    if (selectedAccount) {
      fetchPosts();
    }
  }, [selectedAccount, statusFilter]);

  const fetchPosts = async () => {
    // This would be replaced with an actual API call
    setLoading(true);
    
    try {
      // Mock data for demonstration - this would be an API call to WordPress
      setTimeout(() => {
        const mockPosts: WordPressPost[] = [
          {
            id: "1",
            title: "Hello World",
            content: "<p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p>",
            status: "publish",
            date: new Date().toISOString(),
            modified: new Date().toISOString(),
            link: "https://example.com/hello-world"
          },
          {
            id: "2",
            title: "Draft Post Example",
            content: "<p>This is a draft post that hasn't been published yet.</p>",
            status: "draft",
            date: new Date().toISOString(),
            modified: new Date().toISOString()
          },
          {
            id: "3",
            title: "Scheduled Post",
            content: "<p>This post is scheduled to be published in the future.</p>",
            status: "future",
            date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
            modified: new Date().toISOString()
          },
          {
            id: "4",
            title: "Private Post",
            content: "<p>This post is private and only visible to admins and editors.</p>",
            status: "private",
            date: new Date().toISOString(),
            modified: new Date().toISOString()
          }
        ];
        
        const filteredPosts = statusFilter === "all" 
          ? mockPosts 
          : mockPosts.filter(post => post.status === statusFilter);
        
        setPosts(filteredPosts);
        setLoading(false);
        
        toast({
          title: "Posts fetched",
          description: `Successfully fetched ${filteredPosts.length} posts from the selected WordPress site.`,
        });
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = (postId: string) => {
    // This would be replaced with an actual API call
    toast({
      title: "Delete post",
      description: "This would delete the post with ID: " + postId,
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      publish: "bg-green-500 hover:bg-green-600",
      draft: "bg-yellow-500 hover:bg-yellow-600",
      future: "bg-blue-500 hover:bg-blue-600",
      private: "bg-purple-500 hover:bg-purple-600",
      pending: "bg-orange-500 hover:bg-orange-600"
    };
    
    return (
      <Badge className={variants[status] || "bg-gray-500"}>
        {status === "future" ? "Scheduled" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="w-full shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          WordPress Posts
        </CardTitle>
        <CardDescription>
          View and manage existing posts from your WordPress site
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 w-full md:w-1/2">
              <Label htmlFor="account-select">WordPress Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger id="account-select">
                  <SelectValue placeholder="Select WordPress site" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.siteUrl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full md:w-1/2">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status Types</SelectItem>
                  <SelectItem value="publish">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="future">Scheduled</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => fetchPosts()} 
              disabled={loading || !selectedAccount}
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
            >
              <Filter className="mr-2 h-4 w-4" />
              Refresh Posts
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="border rounded-md mt-4">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        {getStatusBadge(post.status)}
                        {post.status === "future" && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <CalendarClock className="h-3 w-3 mr-1" />
                            {formatDate(post.date)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(post.modified)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onEditPost(post)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                          </Button>
                          {post.link && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.open(post.link, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">View</span>
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-md p-8 text-center mt-4">
              <p className="text-muted-foreground">No posts found. Select a WordPress account and try again.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExistingPosts;
