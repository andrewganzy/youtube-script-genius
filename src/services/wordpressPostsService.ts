
import { WordPressPost } from "@/types/wordpress";

export const fetchWordPressPosts = async (accountId: string, statusFilter: string): Promise<WordPressPost[]> => {
  // Mock data for demonstration - this would be an API call to WordPress
  return new Promise((resolve) => {
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
      
      resolve(filteredPosts);
    }, 1000);
  });
};
