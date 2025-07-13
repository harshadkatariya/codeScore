import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleGoBack}
      className="flex items-center gap-2 mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </Button>
  );
};

export default BackButton;