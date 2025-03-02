
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink, Trash } from "lucide-react";
import { WordPressPost } from "@/types/wordpress";

interface PostActionsProps {
  post: WordPressPost;
  onEdit: (post: WordPressPost) => void;
  onDelete: (postId: string) => void;
}

export const PostActions = ({ post, onEdit, onDelete }: PostActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onEdit(post)}
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
        onClick={() => onDelete(post.id)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
      </Button>
    </div>
  );
};
