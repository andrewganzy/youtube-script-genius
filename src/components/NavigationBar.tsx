
import { Home, FileImage } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-purple-600">WordPress Publisher</Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                  isActive("/")
                    ? "bg-purple-100 text-purple-700"
                    : "text-muted-foreground hover:bg-gray-100"
                }`}
              >
                <Home size={18} />
                <span>Editor</span>
              </Link>
              <Link
                to="/media"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                  isActive("/media")
                    ? "bg-purple-100 text-purple-700"
                    : "text-muted-foreground hover:bg-gray-100"
                }`}
              >
                <FileImage size={18} />
                <span>Media Library</span>
              </Link>
            </nav>
          </div>
          
          {/* Mobile menu */}
          <div className="flex md:hidden">
            <div className="flex space-x-2">
              <Link
                to="/"
                className={`p-2 rounded-md ${
                  isActive("/") ? "bg-purple-100 text-purple-700" : "text-muted-foreground"
                }`}
              >
                <Home size={20} />
              </Link>
              <Link
                to="/media"
                className={`p-2 rounded-md ${
                  isActive("/media") ? "bg-purple-100 text-purple-700" : "text-muted-foreground"
                }`}
              >
                <FileImage size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
