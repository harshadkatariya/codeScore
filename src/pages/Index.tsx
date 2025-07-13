
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to improve your code quality?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Get actionable insights on security, performance, and best practices.
              Start analyzing your code today.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-700">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Link to="/" className="flex items-center gap-2">
                  <span className="font-bold text-xl">CodeScore</span>
                </Link>
                <span className="text-sm text-gray-500">© 2025</span>
              </div>
              
              <div className="flex space-x-6">
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Terms
                </Link>
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Privacy
                </Link>
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
