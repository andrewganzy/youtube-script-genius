
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { UserCircle2 } from "lucide-react";
import { WordPressAccount } from "@/types/wordpress";

interface AccountFormProps {
  accounts: WordPressAccount[];
  setAccounts: (accounts: WordPressAccount[]) => void;
}

const AccountForm = ({ accounts, setAccounts }: AccountFormProps) => {
  const [form, setForm] = useState<Omit<WordPressAccount, "id">>({
    siteUrl: "",
    username: "",
    password: "",
    seoKeywords: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

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

  return (
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
  );
};

export default AccountForm;
