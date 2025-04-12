
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { FileCode2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CodeUploaderProps {
  onUploadComplete: (fileName: string, fileContent: string) => void;
}

const CodeUploader = ({ onUploadComplete }: CodeUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check if the file appears to be a code file
    const validExtensions = [
      ".js", ".jsx", ".ts", ".tsx", ".py", ".rb", ".java", ".php", 
      ".c", ".cpp", ".cs", ".go", ".html", ".css", ".scss", ".json", 
      ".yaml", ".yml", ".xml", ".md", ".sh"
    ];
    
    const fileName = file.name.toLowerCase();
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidFile) {
      toast({
        title: "Invalid file type",
        description: "Please upload a code file with a supported extension",
        variant: "destructive",
      });
      return;
    }
    
    // Size check (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Simulate processing delay
      setTimeout(() => {
        setIsLoading(false);
        onUploadComplete(file.name, content);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded and is being analyzed`,
        });
      }, 1000);
    };
    
    reader.onerror = () => {
      setIsLoading(false);
      toast({
        title: "Error reading file",
        description: "There was an error reading your file",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
          : "border-gray-300 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10"
      } transition-colors duration-200 cursor-pointer`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".js,.jsx,.ts,.tsx,.py,.rb,.java,.php,.c,.cpp,.cs,.go,.html,.css,.scss,.json,.yaml,.yml,.xml,.md,.sh"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400">Processing your file...</p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              {isDragging ? (
                <FileCode2 className="h-10 w-10 text-purple-600" />
              ) : (
                <Upload className="h-10 w-10 text-purple-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {isDragging ? "Drop your code file here" : "Upload your code file"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                Supported formats: JS, TS, Python, Ruby, Java, PHP, C/C++, C#, Go, HTML, CSS, and more
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select File
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CodeUploader;
