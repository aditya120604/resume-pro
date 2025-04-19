
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CircleCheck, 
  CircleAlert, 
  Badge, 
  ListChecks,
  BarChart3,
  Lightbulb 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export type ResumeAnalysis = {
  score: number;
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  sectionScores: {
    format: number;
    content: number;
    keywords: number;
    impact: number;
  };
  suggestions: string[];
  strengths: string[];
}

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  // Calculate total of all section scores
  const totalSectionScore = 
    analysis.sectionScores.format + 
    analysis.sectionScores.content + 
    analysis.sectionScores.keywords + 
    analysis.sectionScores.impact;
  
  // Normalize section scores to ensure they add up to 100%
  const chartData = [
    { 
      name: 'Format', 
      value: Math.round((analysis.sectionScores.format / totalSectionScore) * 100) 
    },
    { 
      name: 'Content', 
      value: Math.round((analysis.sectionScores.content / totalSectionScore) * 100) 
    },
    { 
      name: 'Keywords', 
      value: Math.round((analysis.sectionScores.keywords / totalSectionScore) * 100) 
    },
    { 
      name: 'Impact', 
      value: Math.round((analysis.sectionScores.impact / totalSectionScore) * 100) 
    },
  ];
  
  // Ensure the values add up exactly to 100 (rounding might cause off-by-one errors)
  const sum = chartData.reduce((acc, item) => acc + item.value, 0);
  if (sum !== 100) {
    // Add or subtract the difference from the largest value to make the total exactly 100
    const diff = 100 - sum;
    let largestIdx = 0;
    let largestVal = chartData[0].value;
    
    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].value > largestVal) {
        largestVal = chartData[i].value;
        largestIdx = i;
      }
    }
    
    chartData[largestIdx].value += diff;
  }

  const COLORS = ['#9b87f5', '#6E59A5', '#D6BCFA', '#7E69AB'];

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Resume ATS Score</CardTitle>
          <CardDescription>
            How well your resume performs with Applicant Tracking Systems
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <circle
                className={`${
                  analysis.score >= 70 ? "text-green-500" : analysis.score >= 40 ? "text-amber-500" : "text-red-500"
                } stroke-current`}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${analysis.score * 2.51} 251`}
                strokeDashoffset="0"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">
                {analysis.score}
              </span>
              <span className="text-sm">out of 100</span>
            </div>
          </div>

          <div className="w-full mt-4">
            {analysis.score >= 70 ? (
              <div className="flex items-center rounded-lg bg-green-50 p-3">
                <CircleCheck className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-green-700">
                  Your resume is well-optimized for ATS systems!
                </p>
              </div>
            ) : analysis.score >= 40 ? (
              <div className="flex items-center rounded-lg bg-amber-50 p-3">
                <CircleAlert className="h-5 w-5 text-amber-500 mr-2" />
                <p className="text-sm text-amber-700">
                  Your resume needs some improvements to pass ATS systems.
                </p>
              </div>
            ) : (
              <div className="flex items-center rounded-lg bg-red-50 p-3">
                <CircleAlert className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">
                  Your resume needs significant improvements to pass ATS systems.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Keywords Matched */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-5 w-5 text-resume-primary" />
              <span>Keywords Analysis</span>
            </CardTitle>
            <CardDescription>
              Matching industry-relevant keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Keywords matched</span>
                  <span className="text-sm text-muted-foreground">
                    {analysis.keywordMatches.matched.length}/{analysis.keywordMatches.matched.length + analysis.keywordMatches.missing.length}
                  </span>
                </div>
                <Progress 
                  value={(analysis.keywordMatches.matched.length / 
                    (analysis.keywordMatches.matched.length + analysis.keywordMatches.missing.length)) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Matched Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatches.matched.map((keyword, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              {analysis.keywordMatches.missing.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordMatches.missing.map((keyword, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-resume-primary" />
              <span>Section Scores</span>
            </CardTitle>
            <CardDescription>
              How each part of your resume performs
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, null]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CircleCheck className="h-5 w-5 text-resume-primary" />
              <span>Resume Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CircleCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-resume-primary" />
              <span>Improvement Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
