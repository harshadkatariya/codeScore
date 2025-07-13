
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import BackButton from "@/components/BackButton";
import { Code } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (user && !loading) {
      navigate("/dashboard");
    }
    
    // Set page title based on mode
    document.title = mode === "signup" ? "Sign Up - CodeScore" : "Sign In - CodeScore";
  }, [mode, user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
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
