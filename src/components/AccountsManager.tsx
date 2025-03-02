
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash, UserCircle2 } from "lucide-react";
import { WordPressAccount } from "@/types/wordpress";

const STORAGE_KEY = "wordpress_accounts";

const AccountsManager = ({ accounts, setAccounts }) => {
  const [form, setForm] = useState<Omit<WordPressAccount, "id">>({
    siteUrl: "",
    username: "",
    password: "",
    seoKeywords: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load accounts from localStorage on component mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem(STORAGE_KEY);
    if (savedAccounts && savedAccounts !== "undefined" && savedAccounts !== "null") {
      try {
        const parsedAccounts = JSON.parse(savedAccounts);
        setAccounts(parsedAccounts);
      } catch (error) {
        console.error("Failed to parse accounts from localStorage:", error);
      }
    }
  }, [setAccounts]);

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    if (accounts) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }
  }, [accounts]);

  const resetForm = () => {
    setForm({
      siteUrl: "",
      username: "",
      password: "",
      seoKeywords: ""
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const addAccount = () => {
    if (!form.siteUrl || !form.username || !form.password) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (editingId) {
      const updatedAccounts = accounts.map(account => 
        account.id === editingId ? { ...form, id: editingId } : account
      );
      setAccounts(updatedAccounts);
      toast({
        title: "Success",
        description: "Account updated successfully",
      });
    } else {
      const newAccount = {
        ...form,
        id: Date.now().toString()
      };
      setAccounts([...accounts, newAccount]);
      toast({
        title: "Success",
        description: "Account added successfully",
      });
    }
    
    resetForm();
  };

  const editAccount = (account) => {
    setForm({
      siteUrl: account.siteUrl,
      username: account.username,
      password: account.password,
      seoKeywords: account.seoKeywords || ""
    });
    setEditingId(account.id);
  };

  const deleteAccount = (id) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast({
      title: "Success",
      description: "Account deleted successfully",
    });
    
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <UserCircle2 className="h-5 w-5 text-purple-600" />
            {editingId ? "Edit" : "Add"} WordPress Account
          </CardTitle>
          <CardDescription>
            Manage your WordPress site connections and SEO keywords
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-url">Site URL <span className="text-red-500">*</span></Label>
              <Input
                id="site-url"
                name="siteUrl"
                value={form.siteUrl}
                onChange={handleInputChange}
                placeholder="https://yoursite.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                placeholder="Your WordPress username"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Your WordPress password"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="seo-keywords">SEO Keywords</Label>
              <Textarea
                id="seo-keywords"
                name="seoKeywords"
                value={form.seoKeywords}
                onChange={handleInputChange}
                placeholder="Enter keywords separated by commas"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-slate-50 border-t rounded-b-lg">
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button onClick={addAccount} className="bg-purple-600 hover:bg-purple-700">
            {editingId ? "Update" : "Add"} Account
          </Button>
        </CardFooter>
      </Card>

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
                          onClick={() => editAccount(account)}
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
    </div>
  );
};

export default AccountsManager;
