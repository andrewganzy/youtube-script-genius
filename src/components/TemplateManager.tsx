
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash, Save, Copy, FileText } from "lucide-react";
import { WordPressTemplate, WordPressAccount } from "@/types/wordpress";

const STORAGE_KEY = "wordpress_templates";

interface TemplateManagerProps {
  content: string;
  publishSettings: any;
  selectedAccount: string;
  accounts: WordPressAccount[];
  onApplyTemplate: (content: string, title: string) => void;
}

const TemplateManager = ({ 
  content, 
  publishSettings, 
  selectedAccount, 
  accounts,
  onApplyTemplate 
}: TemplateManagerProps) => {
  const [templates, setTemplates] = useState<WordPressTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    title: "",
    description: ""
  });
  const { toast } = useToast();

  // Load templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem(STORAGE_KEY);
    if (savedTemplates && savedTemplates !== "undefined" && savedTemplates !== "null") {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        setTemplates(parsedTemplates);
      } catch (error) {
        console.error("Failed to parse templates from localStorage:", error);
      }
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    }
  }, [templates]);

  const saveAsTemplate = () => {
    if (!templateForm.title) {
      toast({
        title: "Error",
        description: "Please enter a template title",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAccount) {
      toast({
        title: "Error",
        description: "Please select a WordPress account",
        variant: "destructive",
      });
      return;
    }

    if (!content) {
      toast({
        title: "Error",
        description: "No content to save as template",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: WordPressTemplate = {
      id: Date.now().toString(),
      title: templateForm.title,
      description: templateForm.description,
      content: content,
      accountId: selectedAccount,
      createdAt: new Date().toISOString()
    };

    setTemplates([...templates, newTemplate]);
    setTemplateForm({ title: "", description: "" });
    setShowForm(false);

    toast({
      title: "Success",
      description: "Template saved successfully",
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Success",
      description: "Template deleted successfully",
    });
  };

  const applyTemplate = (template: WordPressTemplate) => {
    onApplyTemplate(template.content, template.title);
    toast({
      title: "Success",
      description: "Template applied successfully",
    });
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.siteUrl : "Unknown Account";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Templates</h2>
        {!showForm ? (
          <Button 
            onClick={() => setShowForm(true)}
            variant="outline"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Current as Template
          </Button>
        ) : (
          <Button 
            onClick={() => setShowForm(false)}
            variant="outline"
          >
            Cancel
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Save as Template</CardTitle>
            <CardDescription>
              Save your current content as a reusable template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-title">Template Title <span className="text-red-500">*</span></Label>
                <Input
                  id="template-title"
                  value={templateForm.title}
                  onChange={(e) => setTemplateForm({...templateForm, title: e.target.value})}
                  placeholder="Enter a title for your template"
                />
              </div>
              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                  placeholder="Enter a description (optional)"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={saveAsTemplate}>
              Save Template
            </Button>
          </CardFooter>
        </Card>
      )}

      {templates.length > 0 ? (
        <ScrollArea className="h-[300px] rounded-md border">
          <div className="p-4 space-y-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-start">
                    <span>{template.title}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => applyTemplate(template)}
                        title="Apply Template"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteTemplate(template.id)}
                        title="Delete Template"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <span className="block">Account: {getAccountName(template.accountId)}</span>
                    <span className="block">Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                  </CardDescription>
                </CardHeader>
                {template.description && (
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No templates yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Save your content as templates to reuse them later
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
