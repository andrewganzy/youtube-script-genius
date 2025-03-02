
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { WordPressAccount } from "@/types/wordpress";

interface PostsFilterBarProps {
  accounts: WordPressAccount[];
  selectedAccount: string;
  onAccountChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const PostsFilterBar = ({
  accounts,
  selectedAccount,
  onAccountChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  loading
}: PostsFilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="space-y-2 w-full md:w-1/2">
        <Label htmlFor="account-select">WordPress Account</Label>
        <Select value={selectedAccount} onValueChange={onAccountChange}>
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
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
        onClick={onRefresh} 
        disabled={loading || !selectedAccount}
        className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
      >
        <Filter className="mr-2 h-4 w-4" />
        Refresh Posts
      </Button>
    </div>
  );
};
