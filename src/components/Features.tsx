
import { CheckCircle, Book, Lock, Zap, Puzzle, Award, BarChart3 } from "lucide-react";

const Features = () => {
  const featuresList = [
    {
      icon: <Book className="h-8 w-8 text-purple-600" />,
      title: "Readability & Formatting",
      description: "Evaluate code style consistency, naming conventions, and overall readability.",
      points: "20"
    },
    {
      icon: <Lock className="h-8 w-8 text-purple-600" />,
      title: "Security Practices",
      description: "Identify potential vulnerabilities, insecure API usage, and security risks.",
      points: "20"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Performance & Efficiency",
      description: "Analyze algorithmic efficiency, resource usage, and optimization opportunities.",
      points: "15"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-purple-600" />,
      title: "Testability & Coverage",
      description: "Measure how well the code supports testing and current test coverage.",
      points: "15"
    },
    {
      icon: <Puzzle className="h-8 w-8 text-purple-600" />,
      title: "Modularity & Reusability",
      description: "Evaluate code organization, component design, and reusability patterns.",
      points: "10"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Best Practices & Stack Usage",
      description: "Check adherence to industry standards and appropriate use of technologies.",
      points: "10"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Complexity & Maintainability",
      description: "Measure cognitive complexity and assess long-term maintainability.",
      points: "10"
    }
  ];

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Comprehensive Code Assessment
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            CodeScore evaluates your code across 7 critical dimensions for a complete picture of your codebase health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <div className="text-sm text-purple-600 font-semibold">
                    {feature.points} points
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
