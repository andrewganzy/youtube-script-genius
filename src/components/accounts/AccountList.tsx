
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, UserCircle2 } from "lucide-react";
import { WordPressAccount } from "@/types/wordpress";
import { useToast } from "@/components/ui/use-toast";

interface AccountListProps {
  accounts: WordPressAccount[];
  setAccounts: (accounts: WordPressAccount[]) => void;
  onEdit: (account: WordPressAccount) => void;
}

const AccountList = ({ accounts, setAccounts, onEdit }: AccountListProps) => {
  const { toast } = useToast();

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast({
      title: "Success",
      description: "Account deleted successfully",
    });
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-purple-600" />
          WordPress Accounts
        </CardTitle>
        <CardDescription>
          Your saved WordPress accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No accounts yet. Add your first WordPress account above.
          </div>
        ) : (
          <ScrollArea className="h-[300px] rounded-md border">
            <div className="p-4 space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="rounded-lg border bg-card p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{account.siteUrl}</h3>
                      <p className="text-sm text-muted-foreground">Username: {account.username}</p>
                      {account.seoKeywords && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">SEO Keywords:</p>
                          <p className="text-sm text-muted-foreground">{account.seoKeywords}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(account)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteAccount(account.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountList;
