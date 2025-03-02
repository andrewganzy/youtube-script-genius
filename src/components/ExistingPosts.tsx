
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { WordPressPost, WordPressAccount } from "@/types/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { PostsFilterBar } from "./posts/PostsFilterBar";
import { PostsTable } from "./posts/PostsTable";
import { fetchWordPressPosts } from "@/services/wordpressPostsService";

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
    setLoading(true);
    
    try {
      const fetchedPosts = await fetchWordPressPosts(selectedAccount, statusFilter);
      setPosts(fetchedPosts);
      setLoading(false);
      
      toast({
        title: "Posts fetched",
        description: `Successfully fetched ${fetchedPosts.length} posts from the selected WordPress site.`,
      });
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
          <PostsFilterBar
            accounts={accounts}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onRefresh={fetchPosts}
            loading={loading}
          />
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <PostsTable
              posts={posts}
              onEditPost={onEditPost}
              onDeletePost={handleDeletePost}
            />
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
