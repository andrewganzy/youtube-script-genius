
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WordPressPost } from "@/types/wordpress";
import { PostStatusBadge } from "./PostStatusBadge";
import { PostActions } from "./PostActions";
import { format } from "date-fns";

interface PostsTableProps {
  posts: WordPressPost[];
  onEditPost: (post: WordPressPost) => void;
  onDeletePost: (postId: string) => void;
}

export const PostsTable = ({ posts, onEditPost, onDeletePost }: PostsTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
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
                <PostStatusBadge status={post.status} scheduledDate={post.date} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(post.modified)}
              </TableCell>
              <TableCell>
                <PostActions 
                  post={post} 
                  onEdit={onEditPost} 
                  onDelete={onDeletePost} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
