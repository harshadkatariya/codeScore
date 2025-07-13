
import { FileCode2, ChevronRight, Shield, Zap, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10" />
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 animate-fade-in">
            <span>✨ Intelligent Code Analysis</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl animate-slide-up">
            <span className="gradient-text">Smart Code Quality</span> Analysis for Modern Developers
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl animate-slide-up">
            Upload your code and get comprehensive insights, security checks, and quality scores — like a health check for your codebase.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started for Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-3xl animate-slide-up">
            <div className="flex flex-col items-center p-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Security Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Catch security vulnerabilities before they become issues
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Performance Checks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Identify bottlenecks and optimize your code
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                <Layout className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Structure Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Evaluate code organization and maintainability
              </p>
            </div>
          </div>
          
          {/* Code illustration */}
          <div className="glass-card p-4 md:p-6 w-full max-w-3xl overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <FileCode2 className="h-5 w-5 text-gray-500" />
            </div>
            <pre className="text-left text-sm md:text-base overflow-x-auto">
              <code className="language-typescript text-gray-800 dark:text-gray-300">
{`// Example code quality assessment
function analyzeCode(code) {
  const results = {
    readability: getReadabilityScore(code),    // 18/20
    security: checkSecurityIssues(code),       // 19/20
    performance: measurePerformance(code),     // 12/15
    testability: evaluateTestability(code),    // 13/15
    modularity: assessModularity(code),        // 8/10
    bestPractices: checkBestPractices(code),   // 9/10
    complexity: calculateComplexity(code)      // 8/10
  };
  
  return calculateOverallScore(results);       // 87/100
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
