
interface RadialProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export const RadialProgress = ({
  percentage,
  size = 120,
  strokeWidth = 10,
}: RadialProgressProps) => {
  // Constrain percentage between 0-100
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  
  // Calculate various values needed for SVG
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;
  
  // Determine color based on score
  const getColor = () => {
    if (normalizedPercentage >= 80) return "#22c55e"; // green-500
    if (normalizedPercentage >= 60) return "#eab308"; // yellow-500
    if (normalizedPercentage >= 40) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb" // gray-200
          strokeWidth={strokeWidth}
          className="dark:opacity-20"
        />
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">{normalizedPercentage}%</span>
      </div>
    </div>
  );
};
