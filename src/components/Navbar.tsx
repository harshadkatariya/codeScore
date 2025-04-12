
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "";
    
    const name = user.user_metadata?.name || user.email || "";
    if (!name) return "U";
    
    if (name.includes(" ")) {
      const [firstName, lastName] = name.split(" ");
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-xl">CodeScore</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-purple-600">
            Home
          </Link>
          <Link to="/features" className="text-sm font-medium transition-colors hover:text-purple-600">
            Features
          </Link>
          <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-purple-600">
            Dashboard
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full h-10 w-10 p-0">
                  <Avatar>
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.user_metadata?.name || user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth?mode=signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-white dark:bg-gray-900 border-b animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="py-2 text-sm font-medium transition-colors hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="py-2 text-sm font-medium transition-colors hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/dashboard" 
              className="py-2 text-sm font-medium transition-colors hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <hr className="border-gray-200 dark:border-gray-700" />
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center py-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.user_metadata?.name || user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </Button>
              </div>
            ) : (
              <>
                <Link 
                  to="/auth?mode=signin"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link 
                  to="/auth?mode=signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
