import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CodeUploader from "@/components/CodeUploader";
import ScoreCard from "@/components/ScoreCard";
import ScoreBreakdown, { ScoreCategory } from "@/components/ScoreBreakdown";
import { FileCode2, History, Settings, LogOut, FileUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

interface ScoreHistory {
  id: string;
  score: number;
  created_at: string;
  file_name: string | null;
  tech_stack: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Mock score data
  const [scoreCategories, setScoreCategories] = useState<ScoreCategory[]>([
    { name: "Readability & Formatting", score: 18, maxScore: 20, description: "Code style consistency, naming conventions, and overall readability." },
    { name: "Security Practices", score: 19, maxScore: 20, description: "Vulnerabilities, insecure API usage, and security risks." },
    { name: "Performance & Efficiency", score: 12, maxScore: 15, description: "Algorithmic efficiency, resource usage, and optimization opportunities." },
    { name: "Testability & Coverage", score: 13, maxScore: 15, description: "Test support and current test coverage." },
    { name: "Modularity & Reusability", score: 8, maxScore: 10, description: "Code organization, component design, and reusability patterns." },
    { name: "Best Practices", score: 9, maxScore: 10, description: "Adherence to industry standards and technologies." },
    { name: "Complexity & Maintainability", score: 8, maxScore: 10, description: "Cognitive complexity and long-term maintainability." }
  ]);

  // Calculate total score
  const totalScore = scoreCategories.reduce((sum, category) => sum + category.score, 0);
  const maxTotalScore = scoreCategories.reduce((sum, category) => sum + category.maxScore, 0);

  const fetchScoreHistory = async () => {
    if (!user) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('ats_score_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setScoreHistory(data || []);
    } catch (error) {
      console.error('Error fetching score history:', error);
      toast({
        title: "Error fetching history",
        description: "Could not load your score history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchScoreHistory();
  }, [user]);

  const saveScoreToDatabase = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('ats_score_history')
        .insert({
          user_id: user.id,
          score: totalScore,
          file_name: fileName,
          tech_stack: "JavaScript/React" // This would be dynamically determined in a real app
        });

      if (error) throw error;
      
      await fetchScoreHistory(); // Refresh the history
    } catch (error) {
      console.error('Error saving score:', error);
      toast({
        title: "Error saving score",
        description: "Could not save your analysis results",
        variant: "destructive",
      });
    }
  };

  const handleUploadComplete = (name: string, content: string) => {
    setFileName(name);
    setFileContent(content);
    setIsAnalyzed(false);
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      
      // Save score to database after analysis is complete
      saveScoreToDatabase();
    }, 2000);
  };

  const handleAnalyzeAnother = () => {
    setFileName(null);
    setFileContent(null);
    setIsAnalyzed(false);
    setIsAnalyzing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.name || user.email || "User";
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
              Logged in as:
            </span>
            <span className="font-medium">{getUserDisplayName()}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="analyze" className="flex items-center space-x-2">
            <FileCode2 className="h-4 w-4" />
            <span>Analyze Code</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyze" className="mt-0">
          {!isAnalyzed && !isAnalyzing ? (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Analyze Your Code</CardTitle>
                  <CardDescription>
                    Upload your code file to get a comprehensive quality assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeUploader onUploadComplete={handleUploadComplete} />
                </CardContent>
              </Card>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-16">
              <Spinner size="lg" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Analyzing your code...</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We're scanning {fileName} for quality, security, and performance issues
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-3">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Analysis Results for {fileName}</CardTitle>
                      <CardDescription>
                        Here's how your code scored across our quality metrics
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={handleAnalyzeAnother}
                      className="flex items-center gap-2"
                    >
                      <FileUp className="h-4 w-4" />
                      <span>Analyze Another File</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-1">
                        <ScoreCard
                          score={totalScore}
                          maxScore={maxTotalScore}
                          title="Overall Score"
                          description="Combined score across all categories"
                          className="h-full"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <ScoreBreakdown categories={scoreCategories} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Potential vulnerabilities and security issues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-md text-green-700 dark:text-green-400">
                      <p className="text-sm font-medium">No critical security issues found</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Best Practices</CardTitle>
                    <CardDescription>
                      Code style and standard guidelines
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                      <li>Consider using more descriptive variable names</li>
                      <li>Missing documentation in some functions</li>
                      <li>Inconsistent spacing in function declarations</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                    <CardDescription>
                      Runtime efficiency and optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-md text-yellow-700 dark:text-yellow-400">
                      <p className="text-sm font-medium">Potential N+1 query pattern detected</p>
                      <p className="text-xs mt-2">Line 42: Consider optimizing the nested loop</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>
                Previous code analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : scoreHistory.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No analysis history found. Upload your first code file to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">File Name</th>
                        <th className="py-3 px-4 text-left">Tech Stack</th>
                        <th className="py-3 px-4 text-left">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoreHistory.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900/50">
                          <td className="py-3 px-4">
                            {new Date(record.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">{record.file_name || 'Unnamed File'}</td>
                          <td className="py-3 px-4">{record.tech_stack || 'Unknown'}</td>
                          <td className="py-3 px-4 font-medium">{record.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
              <CardDescription>
                Configure your code analysis preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <p>Settings configuration will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
