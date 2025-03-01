
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Youtube, Play, MessageSquare, Calendar, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Editor from "@/components/Editor";
import { extractVideoId, buildEmbedUrl } from "@/lib/youtube";
import AccountsManager from "@/components/AccountsManager";
import PublishSettings from "@/components/PublishSettings";
import ExistingPosts from "@/components/ExistingPosts";
import { PublishSettings as PublishSettingsType, WordPressPost } from "@/types/wordpress";

const contentTypes = [
  "sales copy",
  "blog post",
  "code mode",
  "actionable guide",
  "facebook post",
  "raw transcript"
];

const Index = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("blog post");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [seoEnabled, setSeoEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [accounts, setAccounts] = useState([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [publishSettings, setPublishSettings] = useState<PublishSettingsType>({
    title: "",
    status: "draft",
  });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  const fetchTranscript = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    const extractedVideoId = extractVideoId(url);
    if (!extractedVideoId) {
      toast({
        title: "Error",
        description: "Invalid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setVideoId(extractedVideoId);
    setLoading(true);
    try {
      // Mock API call for demo purposes
      // In a real app, you would call your backend API
      setTimeout(() => {
        const mockTranscript = "This is a mock transcript for the video with ID: " + extractedVideoId + 
          ". In a real application, this would be fetched from the YouTube API or using a transcript extraction library. " +
          "The transcript would contain all the spoken words from the video, which could then be processed by AI to generate different types of content.";
        
        setTranscript(mockTranscript);
        setContent(mockTranscript);
        setPublishSettings({
          ...publishSettings,
          title: `Content from YouTube video ${extractedVideoId}`
        });
        setLoading(false);
        
        toast({
          title: "Success",
          description: "Transcript fetched successfully",
        });
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch transcript",
        variant: "destructive",
      });
    }
  };

  const refactorContent = async () => {
    if (!transcript) {
      toast({
        title: "Error",
        description: "Please fetch a transcript first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Mock AI processing
      setTimeout(() => {
        const account = accounts.find(a => a.id === selectedAccount);
        const seoKeywords = seoEnabled && account ? account.seoKeywords : '';
        
        let generatedContent = "This is an AI-generated " + contentType + " based on the transcript.";
        
        if (seoKeywords) {
          generatedContent += " It has been optimized for the following SEO keywords: " + seoKeywords + ".";
        }
        
        generatedContent += "\n\n";
        
        switch(contentType) {
          case "blog post":
            generatedContent += "# The Ultimate Guide\n\nWelcome to this comprehensive blog post created from a YouTube video. This content would normally be generated by an AI like Gemini, providing a well-structured blog post with headings, paragraphs, and relevant information extracted from the transcript.\n\n## Key Points\n\n1. First important point from the video\n2. Second important point from the video\n3. Third important point from the video\n\n## Conclusion\n\nThis is where the blog post would summarize the main points and provide a call to action.";
            break;
          case "sales copy":
            generatedContent += "ATTENTION: Discover the Secret That's Transforming Lives!\n\nAre you ready to take your skills to the next level? This powerful solution has already helped thousands of people achieve remarkable results.\n\n✓ Benefit 1\n✓ Benefit 2\n✓ Benefit 3\n\nDon't wait! Take action now and transform your life today!";
            break;
          case "code mode":
            generatedContent += "```javascript\n// Here's how you could implement this in code\nfunction processData(data) {\n  const results = data.map(item => {\n    return {\n      id: item.id,\n      value: item.value * 2,\n      processed: true\n    };\n  });\n  \n  return results;\n}\n\n// Example usage\nconst output = processData(inputData);\nconsole.log(output);\n```";
            break;
          case "actionable guide":
            generatedContent += "# Step-by-Step Guide\n\n## What You'll Need\n- Item 1\n- Item 2\n- Item 3\n\n## Steps\n\n### 1. First Step\nDetailed instructions for the first step...\n\n### 2. Second Step\nDetailed instructions for the second step...\n\n### 3. Third Step\nDetailed instructions for the third step...\n\n## Tips for Success\n- Important tip 1\n- Important tip 2\n- Important tip 3";
            break;
          case "facebook post":
            generatedContent += "✨ Just watched the most AMAZING video on YouTube! 📺\n\nHere are 3 incredible takeaways that will change how you think about this topic:\n\n1️⃣ First takeaway\n2️⃣ Second takeaway\n3️⃣ Third takeaway\n\nWho else has tried this? Share your experience in the comments! 👇\n\n#hashtag1 #hashtag2 #hashtag3";
            break;
          case "raw transcript":
            generatedContent = transcript;
            break;
        }
        
        setContent(generatedContent);
        setLoading(false);
        
        toast({
          title: "Success",
          description: `Content has been refactored as ${contentType}`,
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive",
      });
    }
  };

  const sendToWordPress = async () => {
    if (!content) {
      toast({
        title: "Error",
        description: "No content to send",
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

    if (!publishSettings.title) {
      toast({
        title: "Error",
        description: "Please enter a post title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Mock AI conversion to Gutenberg blocks
      console.log("Converting to Gutenberg blocks...");
      // In a real app, this would send the content to an AI model to convert to Gutenberg blocks
      const blockContent = `<!-- wp:paragraph -->
<p>${content.replace(/\n/g, "</p>\n<!-- wp:paragraph -->\n<p>")}</p>
<!-- /wp:paragraph -->`;

      // Step 2: Mock WordPress API call
      console.log("Sending to WordPress...");
      console.log("Post settings:", publishSettings);
      
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Success",
          description: editingPostId 
            ? "Post updated successfully" 
            : `Post ${publishSettings.status === "future" ? "scheduled" : "sent to WordPress"} successfully`,
        });
        
        // Reset after successful publish
        if (!editingPostId) {
          setContent("");
          setPublishSettings({
            title: "",
            status: "draft"
          });
          setEditingPostId(null);
        }
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to send to WordPress",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post: WordPressPost) => {
    setActiveTab("editor");
    setContent(post.content);
    if (editorRef.current) {
      editorRef.current.setContent(post.content);
    }
    setPublishSettings({
      title: post.title,
      status: post.status,
      scheduledDate: post.status === "future" ? post.date : undefined
    });
    setEditingPostId(post.id);
    
    toast({
      title: "Post loaded",
      description: `Editing post: ${post.title}`,
    });
  };

  const cancelEditing = () => {
    setContent("");
    setPublishSettings({
      title: "",
      status: "draft"
    });
    setEditingPostId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center space-y-4 w-full">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="rounded-full bg-red-600 p-3 text-white">
              <Youtube size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Content Forge by CCwithAI</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform YouTube transcripts into various content types using AI and publish directly to WordPress
          </p>
        </div>

        {videoId && (
          <div className="w-full max-w-2xl aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe 
              width="100%" 
              height="100%" 
              src={buildEmbedUrl(videoId)}
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        )}

        <Tabs 
          defaultValue="editor" 
          className="w-full" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="editor">Content Editor</TabsTrigger>
            <TabsTrigger value="existing">Existing Posts</TabsTrigger>
            <TabsTrigger value="accounts">WordPress Accounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="w-full mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="text-red-600" size={24} />
                  YouTube Transcript
                </CardTitle>
                <CardDescription>
                  Enter a YouTube URL to fetch the transcript
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      onClick={fetchTranscript} 
                      disabled={loading}
                      className="whitespace-nowrap bg-red-600 hover:bg-red-700"
                    >
                      {loading ? "Fetching..." : "Fetch Transcript"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-4">
                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="content-type">Content Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a content type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contentTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-4 col-span-1">
                      <Label htmlFor="seo-toggle" className="flex-shrink-0">Enable SEO</Label>
                      <Switch
                        id="seo-toggle"
                        checked={seoEnabled}
                        onCheckedChange={setSeoEnabled}
                      />
                    </div>
                    
                    <Button 
                      onClick={refactorContent} 
                      disabled={loading || !transcript}
                      className="col-span-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? "Processing..." : "Refactor Content"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="text-purple-600" size={24} />
                    Content Editor
                  </CardTitle>
                  <CardDescription>
                    Edit your content before sending to WordPress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Editor 
                    content={content} 
                    onChange={setContent} 
                    ref={editorRef}
                  />
                  
                  <div className="mt-6">
                    <PublishSettings
                      initialSettings={publishSettings}
                      onSettingsChange={setPublishSettings}
                      postId={editingPostId || undefined}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="space-y-2 w-full sm:w-auto">
                    <Label htmlFor="account-select">WordPress Account</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select account" />
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
                  <div className="flex gap-3 w-full sm:w-auto">
                    {editingPostId && (
                      <Button 
                        onClick={cancelEditing} 
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Cancel Editing
                      </Button>
                    )}
                    <Button 
                      onClick={sendToWordPress} 
                      disabled={loading || !content || !selectedAccount || !publishSettings.title}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "Sending..." : editingPostId ? "Update Post" : 
                        publishSettings.status === "future" ? "Schedule Post" : "Send to WordPress"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="existing" className="w-full mt-6">
            <ExistingPosts 
              accounts={accounts}
              onEditPost={handleEditPost}
            />
          </TabsContent>
          
          <TabsContent value="accounts" className="w-full mt-6">
            <AccountsManager 
              accounts={accounts} 
              setAccounts={setAccounts} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
