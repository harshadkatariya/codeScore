
import { Progress } from "@/components/ui/progress";

export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

interface ScoreBreakdownProps {
  categories: ScoreCategory[];
}

const ScoreBreakdown = ({ categories }: ScoreBreakdownProps) => {
  // Get color based on score percentage
  const getColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Score Breakdown</h2>
      
      {categories.map((category, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">{category.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {category.description}
              </p>
            </div>
            <span className="text-sm font-medium">
              {category.score}/{category.maxScore}
            </span>
          </div>
          
          <div className="h-2 relative w-full rounded-full overflow-hidden">
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700 absolute"></div>
            <div 
              className={`h-full absolute ${getColor(category.score, category.maxScore)}`}
              style={{ width: `${(category.score / category.maxScore) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBreakdown;
