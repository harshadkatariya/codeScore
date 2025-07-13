// Enhanced code analysis using TF-IDF and semantic similarity
export interface AnalysisResult {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    maxScore: number;
    description: string;
  }[];
  keywordsMatched: string[];
  functionalityScore: number;
  similarityScore: number;
  recommendations: string[];
}

// Sample job description keywords and requirements
const JOB_REQUIREMENTS = {
  keywords: [
    'react', 'typescript', 'javascript', 'node.js', 'express', 'api', 'database',
    'sql', 'mongodb', 'redis', 'authentication', 'security', 'testing', 'jest',
    'cypress', 'git', 'docker', 'aws', 'azure', 'microservices', 'restful',
    'graphql', 'optimization', 'performance', 'scalability', 'clean code',
    'solid principles', 'design patterns', 'async', 'promise', 'error handling'
  ],
  functions: [
    'useState', 'useEffect', 'useContext', 'useReducer', 'setTimeout', 'setInterval',
    'fetch', 'axios', 'addEventListener', 'querySelector', 'getElementById',
    'map', 'filter', 'reduce', 'forEach', 'find', 'some', 'every'
  ],
  patterns: [
    'component', 'hook', 'service', 'controller', 'middleware', 'validator',
    'repository', 'factory', 'observer', 'singleton', 'module', 'class'
  ]
};

export class EnhancedCodeAnalyzer {
  private calculateTFIDF(code: string, keywords: string[]): number {
    const codeWords = code.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    const uniqueWords = [...new Set(codeWords)];
    
    let score = 0;
    const matchedKeywords: string[] = [];
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const tf = codeWords.filter(word => word.includes(keywordLower)).length / codeWords.length;
      
      if (tf > 0) {
        // Simple IDF approximation (in real scenario, use corpus-based IDF)
        const idf = Math.log(1000 / (1 + keyword.length));
        score += tf * idf;
        matchedKeywords.push(keyword);
      }
    });
    
    return Math.min(score * 100, 100); // Normalize to 0-100
  }

  private analyzeFunctionality(code: string): number {
    const { functions } = JOB_REQUIREMENTS;
    let functionalityScore = 0;
    const foundFunctions: string[] = [];
    
    functions.forEach(func => {
      if (code.includes(func)) {
        functionalityScore += 1;
        foundFunctions.push(func);
      }
    });
    
    // Normalize to 0-100 based on total possible functions
    return Math.min((functionalityScore / functions.length) * 100, 100);
  }

  private calculateSemanticSimilarity(code: string): number {
    // Simple semantic similarity based on code structure and patterns
    const { patterns } = JOB_REQUIREMENTS;
    let similarityScore = 0;
    
    // Check for modern JavaScript/TypeScript patterns
    const modernPatterns = [
      /const\s+\w+\s*=\s*\(.*\)\s*=>/g, // Arrow functions
      /async\s+function|async\s+\w+/g, // Async functions
      /\.then\(|\.catch\(/g, // Promise chains
      /try\s*{[\s\S]*catch/g, // Error handling
      /import\s+.*from/g, // ES6 imports
      /export\s+(default\s+)?/g, // ES6 exports
      /interface\s+\w+/g, // TypeScript interfaces
      /type\s+\w+\s*=/g, // TypeScript types
    ];

    modernPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        similarityScore += matches.length * 5; // 5 points per modern pattern
      }
    });

    // Check for architectural patterns
    patterns.forEach(pattern => {
      if (code.toLowerCase().includes(pattern)) {
        similarityScore += 3;
      }
    });

    return Math.min(similarityScore, 100);
  }

  private calculateCategoryScores(code: string, keywordScore: number, functionalityScore: number, similarityScore: number): any[] {
    // Calculate individual category scores based on code analysis
    const codeLength = code.length;
    const lines = code.split('\n').length;
    const avgLineLength = codeLength / lines;
    
    return [
      {
        name: "Readability & Formatting",
        score: Math.min(20, Math.round((avgLineLength < 120 ? 20 : 15) + (code.includes('//') ? 2 : 0))),
        maxScore: 20,
        description: "Code style consistency, naming conventions, and overall readability."
      },
      {
        name: "Security Practices",
        score: Math.min(20, Math.round(15 + (code.includes('sanitize') || code.includes('validate') ? 5 : 0))),
        maxScore: 20,
        description: "Vulnerabilities, insecure API usage, and security risks."
      },
      {
        name: "Performance & Efficiency",
        score: Math.min(15, Math.round((similarityScore / 100) * 15)),
        maxScore: 15,
        description: "Algorithmic efficiency, resource usage, and optimization opportunities."
      },
      {
        name: "Testability & Coverage",
        score: Math.min(15, Math.round((code.includes('test') || code.includes('spec') ? 15 : 8))),
        maxScore: 15,
        description: "Test support and current test coverage."
      },
      {
        name: "Modularity & Reusability",
        score: Math.min(10, Math.round((functionalityScore / 100) * 10)),
        maxScore: 10,
        description: "Code organization, component design, and reusability patterns."
      },
      {
        name: "Best Practices",
        score: Math.min(10, Math.round((keywordScore / 100) * 10)),
        maxScore: 10,
        description: "Adherence to industry standards and technologies."
      },
      {
        name: "Complexity & Maintainability",
        score: Math.min(10, Math.round(10 - (lines > 500 ? 3 : 0))),
        maxScore: 10,
        description: "Cognitive complexity and long-term maintainability."
      }
    ];
  }

  public analyzeCode(code: string, fileName: string): AnalysisResult {
    // Perform comprehensive analysis
    const keywordScore = this.calculateTFIDF(code, JOB_REQUIREMENTS.keywords);
    const functionalityScore = this.analyzeFunctionality(code);
    const similarityScore = this.calculateSemanticSimilarity(code);
    
    const categories = this.calculateCategoryScores(code, keywordScore, functionalityScore, similarityScore);
    
    // Calculate overall score
    const totalPoints = categories.reduce((sum, cat) => sum + cat.score, 0);
    const maxPoints = categories.reduce((sum, cat) => sum + cat.maxScore, 0);
    const overallScore = Math.round((totalPoints / maxPoints) * 100);
    
    // Get matched keywords
    const codeWords = code.toLowerCase().split(/\W+/);
    const keywordsMatched = JOB_REQUIREMENTS.keywords.filter(keyword =>
      codeWords.some(word => word.includes(keyword.toLowerCase()))
    );
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(code, overallScore);
    
    return {
      overallScore,
      categories,
      keywordsMatched,
      functionalityScore: Math.round(functionalityScore),
      similarityScore: Math.round(similarityScore),
      recommendations
    };
  }

  private generateRecommendations(code: string, score: number): string[] {
    const recommendations: string[] = [];
    
    if (score < 50) {
      recommendations.push("Consider refactoring code to improve overall structure");
      recommendations.push("Add more comprehensive error handling");
    }
    
    if (!code.includes('//') && !code.includes('/*')) {
      recommendations.push("Add comments to explain complex logic");
    }
    
    if (!code.includes('test') && !code.includes('spec')) {
      recommendations.push("Implement unit tests for better code coverage");
    }
    
    if (code.split('\n').some(line => line.length > 120)) {
      recommendations.push("Break down long lines for better readability");
    }
    
    if (!code.includes('async') && !code.includes('Promise')) {
      recommendations.push("Consider using async/await for better async handling");
    }
    
    return recommendations;
  }
}