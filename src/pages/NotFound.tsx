
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { FileQuestion, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <FileQuestion className="h-16 w-16 text-purple-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Link to="/">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
