
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { Code } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  
  useEffect(() => {
    // Set page title based on mode
    document.title = mode === "signup" ? "Sign Up - CodeScore" : "Sign In - CodeScore";
  }, [mode]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <Code className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {mode === "signup" ? "Join CodeScore" : "Welcome Back"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {mode === "signup" 
            ? "Create an account to analyze your code quality" 
            : "Sign in to access your code analysis dashboard"}
        </p>
      </div>
      
      <AuthForm mode={mode} />
    </div>
  );
};

export default Auth;
