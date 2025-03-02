
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Media from "./pages/Media";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { WordPressAccount } from "@/types/wordpress";

function App() {
  const [accounts, setAccounts] = useState<WordPressAccount[]>([]);

  // Load accounts from localStorage on component mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem("wordpress_accounts");
    if (savedAccounts && savedAccounts !== "undefined" && savedAccounts !== "null") {
      try {
        setAccounts(JSON.parse(savedAccounts));
      } catch (error) {
        console.error("Failed to parse accounts from localStorage:", error);
        setAccounts([]);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/media" element={<Media accounts={accounts} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
