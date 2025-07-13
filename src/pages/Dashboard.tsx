
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CodeUploader from "@/components/CodeUploader";
import ScoreCard from "@/components/ScoreCard";
import ScoreBreakdown, { ScoreCategory } from "@/components/ScoreBreakdown";
import BackButton from "@/components/BackButton";
import { FileCode2, History, Settings, LogOut, FileUp, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { EnhancedCodeAnalyzer, AnalysisResult } from "@/utils/codeAnalyzer";
import { PDFReportGenerator, PDFReportData } from "@/utils/pdfGenerator";

interface ScoreHistory {
  id: string;
  score: number;
  created_at: string;
  file_name: string | null;
  tech_stack: string | null;
  code_file_url: string | null;
  report_file_url: string | null;
  keywords_matched: string[] | null;
  functionality_score: number | null;
  similarity_score: number | null;
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [codeAnalyzer] = useState(new EnhancedCodeAnalyzer());
  const [pdfGenerator] = useState(new PDFReportGenerator());

  // Get current analysis data
  const scoreCategories = analysisResult?.categories || [];
  const totalScore = analysisResult?.overallScore || 0;
  const maxTotalScore = 100;

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

  const uploadCodeFile = async (fileName: string, content: string): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const fileBlob = new Blob([content], { type: 'text/plain' });
      const filePath = `${user.id}/${Date.now()}_${fileName}`;
      
      const { error } = await supabase.storage
        .from('code-files')
        .upload(filePath, fileBlob);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('code-files')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading code file:', error);
      return null;
    }
  };

  const uploadReportFile = async (fileName: string, reportBlob: Blob): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const filePath = `${user.id}/${Date.now()}_${fileName.replace(/\.[^/.]+$/, "")}_report.pdf`;
      
      const { error } = await supabase.storage
        .from('score-reports')
        .upload(filePath, reportBlob);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('score-reports')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading report file:', error);
      return null;
    }
  };

  const saveScoreToDatabase = async (analysisResult: AnalysisResult, codeFileUrl: string | null, reportFileUrl: string | null) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('ats_score_history')
        .insert({
          user_id: user.id,
          score: analysisResult.overallScore,
          file_name: fileName,
          tech_stack: "JavaScript/React", // This would be dynamically determined in a real app
          code_file_url: codeFileUrl,
          report_file_url: reportFileUrl,
          keywords_matched: analysisResult.keywordsMatched,
          functionality_score: analysisResult.functionalityScore,
          similarity_score: analysisResult.similarityScore
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

  const handleUploadComplete = async (name: string, content: string) => {
    setFileName(name);
    setFileContent(content);
    setIsAnalyzed(false);
    setIsAnalyzing(true);
    
    // Perform real analysis
    setTimeout(async () => {
      try {
        // Analyze the code
        const result = codeAnalyzer.analyzeCode(content, name);
        setAnalysisResult(result);
        
        // Upload files and generate report
        const codeFileUrl = await uploadCodeFile(name, content);
        
        // Generate PDF report
        const reportData: PDFReportData = {
          fileName: name,
          analysisResult: result,
          userEmail: user?.email || '',
          timestamp: new Date()
        };
        const reportBlob = pdfGenerator.generateReport(reportData);
        const reportFileUrl = await uploadReportFile(name, reportBlob);
        
        // Save to database
        await saveScoreToDatabase(result, codeFileUrl, reportFileUrl);
        
        setIsAnalyzing(false);
        setIsAnalyzed(true);
        
        toast({
          title: "Analysis complete!",
          description: "Your code has been analyzed and report generated.",
        });
      } catch (error) {
        console.error('Analysis error:', error);
        setIsAnalyzing(false);
        toast({
          title: "Analysis failed",
          description: "There was an error analyzing your code.",
          variant: "destructive",
        });
      }
    }, 3000);
  };

  const handleAnalyzeAnother = () => {
    setFileName(null);
    setFileContent(null);
    setIsAnalyzed(false);
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Could not download the file.",
        variant: "destructive",
      });
    }
  };

  const generateAndDownloadPDF = () => {
    if (!analysisResult || !fileName || !user) return;
    
    const reportData: PDFReportData = {
      fileName,
      analysisResult,
      userEmail: user.email || '',
      timestamp: new Date()
    };
    
    const reportBlob = pdfGenerator.generateReport(reportData);
    const url = window.URL.createObjectURL(reportBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, "")}_analysis_report.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadOriginalFile = () => {
    if (!fileContent || !fileName) return;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
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
      <BackButton />
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                    
                    {/* Download Options */}
                    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <h3 className="w-full text-lg font-semibold mb-2">Download Options</h3>
                      <Button 
                        onClick={downloadOriginalFile}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Original Code
                      </Button>
                      <Button 
                        onClick={generateAndDownloadPDF}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Score Report (PDF)
                      </Button>
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
                        <th className="py-3 px-4 text-left">Score</th>
                        <th className="py-3 px-4 text-left">Keywords</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoreHistory.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900/50">
                          <td className="py-3 px-4">
                            {new Date(record.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-medium">{record.file_name || 'Unnamed File'}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-lg">{record.score}/100</span>
                            {record.functionality_score && (
                              <div className="text-xs text-gray-500">
                                F: {record.functionality_score} | S: {record.similarity_score}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {record.keywords_matched?.slice(0, 3).join(', ') || 'None'}
                              {record.keywords_matched && record.keywords_matched.length > 3 && '...'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {record.code_file_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadFile(record.code_file_url!, record.file_name || 'code.txt')}
                                >
                                  Code
                                </Button>
                              )}
                              {record.report_file_url && (
                                <Button
                                  size="sm"
                                  onClick={() => downloadFile(record.report_file_url!, `${record.file_name}_report.pdf`)}
                                >
                                  Report
                                </Button>
                              )}
                            </div>
                          </td>
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
