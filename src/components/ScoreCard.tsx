
import { RadialProgress } from "./RadialProgress";

interface ScoreCardProps {
  score: number;
  maxScore: number;
  title: string;
  description?: string;
  className?: string;
}

const ScoreCard = ({
  score,
  maxScore,
  title,
  description,
  className = "",
}: ScoreCardProps) => {
  // No need to calculate percentage here, it should already be a percentage (0-100)
  const percentage = score;

  // Get color based on score percentage
  const getColor = () => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-5 shadow border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{title}</h3>
        <div className={`text-lg font-bold ${getColor()}`}>
          {score}/{maxScore}
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{description}</p>
      )}
      
      <div className="flex justify-center py-2">
        <RadialProgress 
          percentage={percentage} 
          size={100}
          strokeWidth={10}
        />
      </div>
    </div>
  );
};

export default ScoreCard;
