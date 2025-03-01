
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gallery, FolderImage } from "lucide-react";
import MediaManager from "@/components/MediaManager";
import { WordPressAccount } from "@/types/wordpress";

interface MediaPageProps {
  accounts: WordPressAccount[];
}

const Media = ({ accounts = [] }: MediaPageProps) => {
  const [selectedAccount, setSelectedAccount] = useState("");

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center space-y-4 w-full">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="rounded-full bg-purple-600 p-3 text-white">
              <FolderImage size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">WordPress Media Library</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Manage your WordPress media files and use them in your content
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gallery className="text-purple-600" size={24} />
              Media Library
            </CardTitle>
            <CardDescription>
              Browse, search, and manage your WordPress media files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="all">All Media</TabsTrigger>
                <TabsTrigger value="unattached">Unattached</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <MediaManager 
                  accounts={accounts} 
                  selectedAccount={selectedAccount}
                />
              </TabsContent>
              
              <TabsContent value="unattached" className="mt-6">
                <MediaManager 
                  accounts={accounts} 
                  selectedAccount={selectedAccount}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Media;
