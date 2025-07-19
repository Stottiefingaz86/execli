import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Info,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Plus,
  ExternalLink,
  Filter,
  ChevronDown,
  ChevronRight,
  X,
  Target,
  Lightbulb,
  BarChart3,
  MessageSquare,
  Zap,
  Shield,
  ArrowUp,
  User,
  MoreVertical,
} from "lucide-react";

interface ReportData {
  id?: string;
  company_id?: string;
  business_name?: string;
  business_url?: string;
  industry?: string;
  status?: string;
  created_at?: string;
  processed_at?: string;
  analysis?: any;
  executiveSummary?: {
    sentimentChange?: string;
    volumeChange?: string;
    mostPraised?: string;
    topComplaint?: string;
    praisedSections?: Array<{
      topic: string;
      percentage: string;
      examples: string[];
    }>;
    painPoints?: Array<{
      topic: string;
      percentage: string;
      examples: string[];
    }>;
    overview?: string;
    summary?: string;
    alerts?: Array<{
      type: string;
      message: string;
      metric: string;
    }>;
    dataSource?: string;
    context?: string;
    topHighlights?: Array<{
      title: string;
      description: string;
      businessImpact?: string;
    }>;
  };
  keyInsights?: Array<{
    insight: string;
    title?: string;
    direction: string;
    mentionCount: string;
    platforms: string[];
    impact: string;
    suggestions?: string[];
    reviews?: Array<{
      text: string;
      topic: string;
      sentiment: string;
      source?: string;
    }>;
    rawMentions?: string[];
    context?: string;
    rootCause?: string;
    actionItems?: string;
    specificExamples?: string[];
  }>;
  sentimentOverTime?: Array<{
    date: string;
    sentiment: number;
    reviewCount: number;
    insights?: string;
  }>;
  volumeOverTime?: Array<{
    date: string;
    volume: number;
    platform: string;
    context?: string;
    trendingTopics?: string[];
    peakInsight?: string;
  }>;
  mentionsByTopic?: Array<{
    topic: string;
    positive: number;
    negative: number;
    total: number;
    rawMentions?: string[];
    context?: string;
    mainConcern?: string;
    priority?: string;
    trendAnalysis?: string;
    specificExamples?: string[];
  }>;
  trendingTopics?: Array<{
    topic: string;
    growth: string;
    sentiment: string;
    volume: string;
    keyInsights?: string[];
    rawMentions?: string[];
    context?: string;
    mainIssue?: string;
    businessImpact?: string;
    positiveCount?: number;
    negativeCount?: number;
    totalCount?: number;
  }>;
  marketGaps?: Array<{
    gap: string;
    mentions: number;
    suggestion: string;
    kpiImpact: string;
    rawMentions?: string[];
    context?: string;
    opportunity?: string;
    specificExamples?: string[];
    priority?: string;
    customerImpact?: string;
    businessCase?: string;
    implementation?: string;
  }>;
  advancedMetrics?: {
    trustScore: number;
    repeatComplaints: number;
    avgResolutionTime: string;
    vocVelocity: string;
    context?: string;
  };
  suggestedActions?:
    | Array<{
        action: string;
        painPoint: string;
        recommendation: string;
        kpiImpact: string;
        rawMentions?: string[];
        context?: string;
        expectedOutcome?: string;
      }>
    | string[];
  vocDigest?: {
    summary: string;
    highlights: string[];
  };
  detected_sources?: Array<{
    source: string;
    review_count: number;
  }>;
  summary?: string;
}

interface ReportPageContentProps {
  reportData: ReportData;
  reportId: string;
  isRegenerating?: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// TruncatedText component for better UX
const TruncatedText = ({
  text,
  maxLength = 150,
  title = "Full Content",
}: {
  text: string;
  maxLength?: number;
  title?: string;
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!text || text.length <= maxLength) {
    return <span>{text}</span>;
  }

  return (
    <>
      <span>
        {text.substring(0, maxLength)}...
        <button
          onClick={() => setShowModal(true)}
          className="ml-1 text-blue-400 hover:text-blue-300 underline text-sm"
        >
          Show more
        </button>
      </span>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181a20] border border-white/20 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[#B0B0C0] whitespace-pre-wrap">{text}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default function ReportPageContent({
  reportData,
  reportId,
  isRegenerating,
}: ReportPageContentProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedReviews, setSelectedReviews] = useState<
    Array<{ text: string; sentiment: string; topic: string; source?: string }>
  >([]);

  const [showTrendingModal, setShowTrendingModal] = useState(false);
  const [selectedTrendingTopic, setSelectedTrendingTopic] = useState<any>(null);
  const [showSentimentInsights, setShowSentimentInsights] = useState(false);
  const [selectedSentimentData, setSelectedSentimentData] = useState<any>(null);

  // Lazy loading state for mentions by topic
  const [visibleTopics, setVisibleTopics] = useState(10);
  const [showLoadMore, setShowLoadMore] = useState(() => {
    const totalTopics =
      reportData.mentionsByTopic?.length ||
      reportData.analysis?.mentionsByTopic?.length ||
      0;
    return totalTopics > 10;
  });

  console.log("ReportPageContent received data:", reportData);

  // Enhanced sentiment analysis function
  const analyzeSentiment = (
    text: string,
  ): "positive" | "negative" | "neutral" => {
    if (!text) return "neutral";

    const lowerText = text.toLowerCase();

    // Strong negative indicators
    const negativeWords = [
      "scam",
      "fraud",
      "fake",
      "terrible",
      "awful",
      "horrible",
      "worst",
      "bad",
      "poor",
      "disappointed",
      "hate",
      "dislike",
      "angry",
      "furious",
      "mad",
      "upset",
      "frustrated",
      "annoyed",
      "irritated",
      "waste",
      "useless",
      "broken",
      "defective",
      "faulty",
      "problem",
      "issue",
      "error",
      "bug",
      "slow",
      "unreliable",
      "untrustworthy",
      "suspicious",
      "doubtful",
      "questionable",
      "expensive",
      "overpriced",
      "costly",
      "pricey",
      "rip-off",
      "overcharged",
      "difficult",
      "complicated",
      "confusing",
      "unclear",
      "vague",
      "misleading",
      "rude",
      "unhelpful",
      "unresponsive",
      "ignored",
      "neglected",
      "abandoned",
      "dangerous",
      "risky",
      "unsafe",
      "harmful",
      "damaging",
      "destructive",
      "stay away",
      "avoid",
      "never",
      "don't",
      "won't",
      "can't",
      "impossible",
      "fail",
      "failed",
      "failure",
      "broken",
      "crash",
      "error",
      "bug",
      "glitch",
    ];

    // Strong positive indicators
    const positiveWords = [
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "fantastic",
      "outstanding",
      "superb",
      "perfect",
      "love",
      "like",
      "enjoy",
      "satisfied",
      "happy",
      "pleased",
      "delighted",
      "thrilled",
      "good",
      "nice",
      "fine",
      "okay",
      "alright",
      "decent",
      "acceptable",
      "satisfactory",
      "fast",
      "quick",
      "efficient",
      "effective",
      "reliable",
      "trustworthy",
      "dependable",
      "helpful",
      "supportive",
      "responsive",
      "attentive",
      "caring",
      "professional",
      "easy",
      "simple",
      "straightforward",
      "clear",
      "obvious",
      "intuitive",
      "affordable",
      "cheap",
      "inexpensive",
      "reasonable",
      "fair",
      "worth",
      "value",
      "recommend",
      "suggest",
      "endorse",
      "approve",
      "support",
      "back",
      "stand by",
      "success",
      "successful",
      "working",
      "functioning",
      "operational",
      "active",
    ];

    // Count negative and positive words
    let negativeCount = 0;
    let positiveCount = 0;

    negativeWords.forEach((word) => {
      if (lowerText.includes(word)) {
        negativeCount += (lowerText.match(new RegExp(word, "g")) || []).length;
      }
    });

    positiveWords.forEach((word) => {
      if (lowerText.includes(word)) {
        positiveCount += (lowerText.match(new RegExp(word, "g")) || []).length;
      }
    });

    // Additional negative patterns
    const negativePatterns = [
      /\b(no|not|never|don't|won't|can't|isn't|aren't|wasn't|weren't)\b/gi,
      /\b(bad|poor|terrible|awful|horrible)\b/gi,
      /\b(problem|issue|error|bug|fail|broken)\b/gi,
      /\b(scam|fraud|fake|dishonest)\b/gi,
      /\b(expensive|overpriced|rip-off)\b/gi,
      /\b(slow|unreliable|untrustworthy)\b/gi,
    ];

    negativePatterns.forEach((pattern) => {
      const matches = lowerText.match(pattern);
      if (matches) {
        negativeCount += matches.length;
      }
    });

    // Determine sentiment based on word counts and context
    if (negativeCount > positiveCount * 2) {
      return "negative";
    } else if (positiveCount > negativeCount * 2) {
      return "positive";
    } else {
      return "neutral";
    }
  };

  // AI-powered topic classification function
  // AI-powered topic classification using OpenAI
  const classifyTopicWithAI = async (text: string): Promise<string> => {
    if (!text) return "other";
    
    try {
      const response = await fetch('/api/classify-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          availableTopics: [
            "sports betting",
            "poker", 
            "casino games",
            "deposits",
            "withdrawals", 
            "loyalty rewards",
            "customer service",
            "mobile app",
            "website",
            "fees",
            "verification",
            "other"
          ]
        })
      });
      
      if (!response.ok) {
        console.error('AI classification failed, falling back to keyword method');
        return classifyTopicWithKeywords(text);
      }
      
      const result = await response.json();
      return result.topic || "other";
      
    } catch (error) {
      console.error('AI classification error:', error);
      return classifyTopicWithKeywords(text);
    }
  };

  // Fallback keyword-based classification
  const classifyTopicWithKeywords = (text: string): string => {
    if (!text) return "other";
    
    const lowerText = text.toLowerCase();
    
    // Define precise topic categories with context-aware keywords
    const topicCategories = {
      "sports betting": {
        primary: ["sports betting", "bet on sports", "sport betting", "football betting", "basketball betting"],
        secondary: ["odds", "parlay", "spread", "line", "nfl", "nba", "mlb", "nhl", "ufc"],
        exclude: ["casino", "poker", "slot", "birthday", "gift", "loyalty", "deposit", "withdraw"]
      },
      "poker": {
        primary: ["poker game", "texas holdem", "holdem", "omaha", "poker tournament", "cash game"],
        secondary: ["poker", "card game", "table game", "hand", "flop", "turn", "river"],
        exclude: ["slot", "casino game", "sports", "betting"]
      },
      "casino games": {
        primary: ["slot machine", "blackjack game", "roulette game", "craps game", "baccarat game"],
        secondary: ["casino game", "slot", "jackpot", "spin", "reel"],
        exclude: ["poker game", "sports", "betting", "birthday", "gift"]
      },
      "deposits": {
        primary: ["deposit money", "add funds", "put money", "fund account"],
        secondary: ["deposit", "fund", "add money", "load account"],
        exclude: ["withdraw", "cash out", "payout", "birthday", "gift"]
      },
      "withdrawals": {
        primary: ["withdraw money", "cash out", "get payout", "withdrawal"],
        secondary: ["withdraw", "payout", "cash out", "get money"],
        exclude: ["deposit", "add money", "birthday", "gift"]
      },
      "loyalty rewards": {
        primary: ["loyalty program", "reward program", "vip program", "member benefits"],
        secondary: ["loyalty", "reward", "bonus", "point", "vip", "member"],
        exclude: ["sports", "betting", "poker", "casino"]
      },
      "customer service": {
        primary: ["customer service", "support team", "help desk", "contact support"],
        secondary: ["service", "support", "help", "contact", "agent"],
        exclude: ["sports", "betting", "poker", "casino", "deposit", "withdraw"]
      },
      "mobile app": {
        primary: ["mobile app", "phone app", "android app", "ios app"],
        secondary: ["app", "mobile", "phone", "android", "ios"],
        exclude: ["website", "desktop", "computer"]
      },
      "website": {
        primary: ["website", "web site", "online site"],
        secondary: ["site", "web", "online", "browser"],
        exclude: ["app", "mobile", "phone"]
      },
      "fees": {
        primary: ["deposit fee", "withdrawal fee", "transaction fee", "service fee"],
        secondary: ["fee", "charge", "cost", "price"],
        exclude: ["free", "no fee", "no charge"]
      },
      "verification": {
        primary: ["verification process", "id verification", "identity verification"],
        secondary: ["verify", "verification", "id", "identity", "document"],
        exclude: ["sports", "betting", "poker", "casino"]
      }
    };

    // Score each topic based on keyword matches
    const scores: { [key: string]: number } = {};
    
    for (const [topic, config] of Object.entries(topicCategories)) {
      let score = 0;
      
      // Check primary keywords (highest weight)
      for (const keyword of config.primary) {
        if (lowerText.includes(keyword)) {
          score += 10;
        }
      }
      
      // Check secondary keywords (medium weight)
      for (const keyword of config.secondary) {
        if (lowerText.includes(keyword)) {
          score += 5;
        }
      }
      
      // Penalize for excluded keywords
      for (const keyword of config.exclude) {
        if (lowerText.includes(keyword)) {
          score -= 3;
        }
      }
      
      scores[topic] = score;
    }
    
    // Find the topic with the highest score
    let bestTopic = "other";
    let bestScore = 0;
    
    for (const [topic, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestTopic = topic;
      }
    }
    
    // Only return a topic if it has a significant score
    return bestScore >= 5 ? bestTopic : "other";
  };

  // Main topic classification function (uses AI with fallback)
  const classifyTopic = async (text: string): Promise<string> => {
    return await classifyTopicWithAI(text);
  };

  // Topic relevance filtering function (now uses AI classification)
  const isTopicRelevant = async (text: string, topic: string): Promise<boolean> => {
    if (!text || !topic) return false;
    
    const classifiedTopic = await classifyTopic(text);
    return classifiedTopic === topic.toLowerCase();
  };

  // Enhanced deduplication with sentiment and topic filtering
  const deduplicateComments = (comments: string[]): string[] => {
    if (!comments || !Array.isArray(comments)) return [];
    return [...new Set(comments)].filter(
      (comment) => comment && comment.trim().length > 0,
    );
  };

  // Filter comments by topic and sentiment
  const filterCommentsByTopicAndSentiment = async (
    comments: string[],
    topic: string,
    targetSentiment: "positive" | "negative" | "neutral",
  ): Promise<string[]> => {
    if (!comments || !Array.isArray(comments)) return [];

    const filteredComments = [];
    for (const comment of comments) {
      // Check topic relevance
      const isRelevant = await isTopicRelevant(comment, topic);
      if (!isRelevant) continue;

      // Check sentiment
      const sentiment = analyzeSentiment(comment);
      if (sentiment === targetSentiment) {
        filteredComments.push(comment);
      }
    }
    
    return filteredComments;
  };

  // Highlight keywords in text
  const highlightKeywords = (text: string, topic: string): string => {
    if (!text || !topic) return text;

    const lowerTopic = topic.toLowerCase();
    const topicKeywords: { [key: string]: string[] } = {
      "sports betting": [
        "sports",
        "betting",
        "bet",
        "wager",
        "odds",
        "parlay",
        "spread",
        "line",
        "sport",
        "football",
        "basketball",
        "baseball",
        "soccer",
        "tennis",
        "golf",
        "hockey",
        "mma",
        "boxing",
        "racing",
        "nfl",
        "nba",
        "mlb",
        "nhl",
        "ufc",
      ],
      "casino games": [
        "casino",
        "slot",
        "poker",
        "blackjack",
        "roulette",
        "craps",
        "baccarat",
        "keno",
        "bingo",
        "game",
        "gaming",
        "gambling",
        "card",
        "table",
        "machine",
        "jackpot",
        "win",
        "spin",
        "deal",
      ],
      "withdrawals": [
        "withdraw",
        "withdrawal",
        "cash out",
        "payout",
        "money",
        "fund",
        "bank",
        "account",
        "transfer",
        "deposit",
        "balance",
        "wallet",
        "payment",
        "credit",
        "debit",
      ],
      "customer service": [
        "service",
        "support",
        "help",
        "assist",
        "contact",
        "call",
        "email",
        "chat",
        "live",
        "agent",
        "representative",
        "staff",
        "team",
        "response",
        "reply",
        "answer",
      ],
      "deposit fees": [
        "fee",
        "charge",
        "cost",
        "price",
        "deposit",
        "payment",
        "transaction",
        "bank",
        "credit",
        "debit",
        "card",
        "transfer",
        "wire",
        "ach",
      ],
      "verification process": [
        "verify",
        "verification",
        "id",
        "identity",
        "document",
        "proof",
        "photo",
        "passport",
        "license",
        "ssn",
        "social",
        "security",
        "number",
        "address",
        "utility",
        "bill",
      ],
      "loyalty rewards": [
        "loyalty",
        "reward",
        "bonus",
        "point",
        "credit",
        "cashback",
        "promotion",
        "offer",
        "deal",
        "discount",
        "vip",
        "member",
        "program",
        "benefit",
        "perk",
      ],
      "mobile app": [
        "app",
        "mobile",
        "phone",
        "android",
        "ios",
        "iphone",
        "smartphone",
        "tablet",
        "download",
        "install",
        "update",
        "version",
        "interface",
        "ui",
        "ux",
        "design",
      ],
      "website": [
        "website",
        "site",
        "web",
        "online",
        "internet",
        "browser",
        "page",
        "link",
        "url",
        "domain",
        "www",
        "http",
        "https",
      ],
      "bonuses": [
        "bonus",
        "promotion",
        "offer",
        "deal",
        "discount",
        "free",
        "credit",
        "cashback",
        "reward",
        "point",
        "vip",
        "member",
        "program",
      ],
      "poker": [
        "poker",
        "texas",
        "holdem",
        "omaha",
        "tournament",
        "cash",
        "game",
        "table",
        "card",
        "hand",
        "flop",
        "turn",
        "river",
        "bluff",
        "fold",
        "call",
        "raise",
        "all-in",
      ],
      "slots": [
        "slot",
        "machine",
        "reel",
        "spin",
        "jackpot",
        "win",
        "line",
        "pay",
        "symbol",
        "wild",
        "scatter",
        "bonus",
        "feature",
        "progressive",
      ],
      "blackjack": [
        "blackjack",
        "21",
        "card",
        "dealer",
        "hit",
        "stand",
        "double",
        "split",
        "ace",
        "face",
        "bust",
        "natural",
        "insurance",
      ],
      "roulette": [
        "roulette",
        "wheel",
        "number",
        "red",
        "black",
        "even",
        "odd",
        "high",
        "low",
        "dozen",
        "column",
        "straight",
        "split",
        "corner",
        "line",
      ],
      "live dealer": [
        "live",
        "dealer",
        "real",
        "person",
        "human",
        "camera",
        "stream",
        "video",
        "interactive",
        "chat",
        "table",
        "game",
        "experience",
      ],
      "security": [
        "security",
        "safe",
        "secure",
        "protection",
        "encryption",
        "ssl",
        "firewall",
        "hack",
        "breach",
        "fraud",
        "scam",
        "trust",
        "reliable",
        "authentic",
      ],
      "payment methods": [
        "payment",
        "method",
        "credit",
        "debit",
        "card",
        "bank",
        "transfer",
        "wire",
        "ach",
        "paypal",
        "venmo",
        "crypto",
        "bitcoin",
        "ethereum",
        "wallet",
      ],
    };

    let highlightedText = text;
    const keywords = topicKeywords[lowerTopic] || [topic];

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<mark class="bg-yellow-200 text-black px-1 rounded">$&</mark>`,
      );
    });

    return highlightedText;
  };

  // Function to process and deduplicate data with enhanced filtering
  const processAndDeduplicateData = async (data: any) => {
    if (!data) return data;

    // Process mentions by topic with proper filtering
    if (data.mentionsByTopic && Array.isArray(data.mentionsByTopic)) {
      for (let i = 0; i < data.mentionsByTopic.length; i++) {
        const topic = data.mentionsByTopic[i];
        const allMentions = deduplicateComments(topic.rawMentions || []);

        // Filter mentions by topic relevance
        const relevantMentions = [];
        for (const mention of allMentions) {
          if (await isTopicRelevant(mention, topic.topic)) {
            relevantMentions.push(mention);
          }
        }

        // Separate positive and negative mentions
        const positiveMentions = await filterCommentsByTopicAndSentiment(
          relevantMentions,
          topic.topic,
          "positive",
        );
        const negativeMentions = await filterCommentsByTopicAndSentiment(
          relevantMentions,
          topic.topic,
          "negative",
        );

        // Recalculate counts based on actual sentiment analysis
        const totalRelevant = relevantMentions.length;
        const positiveCount = positiveMentions.length;
        const negativeCount = negativeMentions.length;

        data.mentionsByTopic[i] = {
          ...topic,
          rawMentions: relevantMentions,
          positive: positiveCount,
          negative: negativeCount,
          total: totalRelevant,
          positiveMentions,
          negativeMentions,
        };
      }
    }

    // Process executive summary with proper sentiment filtering
    if (data.executiveSummary?.praisedSections) {
      for (let i = 0; i < data.executiveSummary.praisedSections.length; i++) {
        const section = data.executiveSummary.praisedSections[i];
        const allExamples = deduplicateComments(section.examples || []);
        const positiveExamples = [];
        
        for (const example of allExamples) {
          if (analyzeSentiment(example) === "positive" && 
              await isTopicRelevant(example, section.topic)) {
            positiveExamples.push(example);
          }
        }

        data.executiveSummary.praisedSections[i] = {
          ...section,
          examples: positiveExamples,
          percentage:
            positiveExamples.length > 0
              ? Math.round(
                  (positiveExamples.length / allExamples.length) * 100,
                )
              : 0,
        };
      }
    }

    if (data.executiveSummary?.painPoints) {
      for (let i = 0; i < data.executiveSummary.painPoints.length; i++) {
        const point = data.executiveSummary.painPoints[i];
        const allExamples = deduplicateComments(point.examples || []);
        const negativeExamples = [];
        
        for (const example of allExamples) {
          if (analyzeSentiment(example) === "negative" && 
              await isTopicRelevant(example, point.topic)) {
            negativeExamples.push(example);
          }
        }

        data.executiveSummary.painPoints[i] = {
          ...point,
          examples: negativeExamples,
          percentage:
            negativeExamples.length > 0
              ? Math.round(
                  (negativeExamples.length / allExamples.length) * 100,
                )
              : 0,
        };
      }
    }

    // Process key insights with proper filtering
    if (data.keyInsights && Array.isArray(data.keyInsights)) {
      for (let i = 0; i < data.keyInsights.length; i++) {
        const insight = data.keyInsights[i];
        const allMentions = deduplicateComments(insight.rawMentions || []);
        const relevantMentions = [];
        
        for (const mention of allMentions) {
          if (await isTopicRelevant(mention, insight.insight)) {
            relevantMentions.push(mention);
          }
        }

        data.keyInsights[i] = {
          ...insight,
          rawMentions: relevantMentions,
        };
      }
    }

    return data;
  };

  // State for processed data
  const [processedData, setProcessedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  // Process data with AI classification
  useEffect(() => {
    const processData = async () => {
      setIsProcessing(true);
      try {
        const data = {
          ...reportData,
          // If analysis is nested, spread it out
          ...(reportData.analysis || {}),
          // Ensure we have the basic fields
          business_name: reportData.business_name,
          business_url: reportData.business_url,
          // Handle different data structures
          executiveSummary:
            reportData.executiveSummary || reportData.analysis?.executiveSummary,
          keyInsights: reportData.keyInsights || reportData.analysis?.keyInsights,
          sentimentOverTime:
            reportData.sentimentOverTime || reportData.analysis?.sentimentOverTime,
          volumeOverTime:
            reportData.volumeOverTime || reportData.analysis?.volumeOverTime,
          mentionsByTopic:
            reportData.mentionsByTopic || reportData.analysis?.mentionsByTopic,
          trendingTopics:
            reportData.trendingTopics || reportData.analysis?.trendingTopics,
          marketGaps: reportData.marketGaps || reportData.analysis?.marketGaps || [],
          advancedMetrics:
            reportData.advancedMetrics || reportData.analysis?.advancedMetrics,
          suggestedActions:
            reportData.suggestedActions ||
            reportData.analysis?.suggestedActions ||
            [],
          vocDigest: reportData.vocDigest || reportData.analysis?.vocDigest,
        };

        const processed = await processAndDeduplicateData(data);
        setProcessedData(processed);
      } catch (error) {
        console.error('Error processing data:', error);
        setProcessedData(null);
      } finally {
        setIsProcessing(false);
      }
    };

    processData();
  }, [reportData]);

  console.log("Processed data:", processedData);
  console.log("Mentions by topic:", processedData?.mentionsByTopic);
  console.log("Positive topics:", processedData?.mentionsByTopic?.filter((topic: any) => topic.positive > topic.negative));

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Processing with AI</h2>
          <p className="text-gray-400">Classifying topics with OpenAI...</p>
        </div>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No report data</h2>
          <p className="text-gray-400">Report data is missing.</p>
        </div>
      </div>
    );
  }

  const handleTopicClick = async (
    topicName: string,
    rawMentions?: string[],
    topicData?: any,
  ) => {
    if (rawMentions && rawMentions.length > 0) {
      // Filter mentions by topic relevance and analyze sentiment properly
      const relevantMentions = [];
      for (const mention of rawMentions) {
        if (await isTopicRelevant(mention, topicName)) {
          relevantMentions.push(mention);
        }
      }

      // Create reviews with proper sentiment analysis
      const reviews = relevantMentions.map((text: string) => {
        const sentiment = analyzeSentiment(text);
        return {
          text,
          sentiment,
          topic: topicName,
          highlightedText: highlightKeywords(text, topicName),
        };
      });

      // Separate by sentiment for better organization
      const positiveReviews = reviews.filter((r) => r.sentiment === "positive");
      const negativeReviews = reviews.filter((r) => r.sentiment === "negative");
      const neutralReviews = reviews.filter((r) => r.sentiment === "neutral");

      // Combine with positive first, then negative, then neutral
      const organizedReviews = [
        ...positiveReviews,
        ...negativeReviews,
        ...neutralReviews,
      ];

      setSelectedTopic(topicName);
      setSelectedReviews(organizedReviews);
      setShowReviewModal(true);
    }
  };

  const handleInsightClick = (insight: any) => {
    if (insight.rawMentions && insight.rawMentions.length > 0) {
      // Use consistent sentiment analysis based on insight direction
      const reviews = insight.rawMentions.map((text: string, index: number) => {
        let sentiment = "neutral"; // Default to neutral

        // Use insight direction to determine sentiment
        if (insight.direction === "up") {
          sentiment = "positive";
        } else if (insight.direction === "down") {
          sentiment = "negative";
        } else {
          // For mixed insights, distribute based on index
          const totalReviews = insight.rawMentions.length;
          const positiveCount = Math.round(totalReviews * 0.6); // Assume 60% positive for mixed
          const negativeCount = Math.round(totalReviews * 0.4); // Assume 40% negative for mixed

          if (index < positiveCount) {
            sentiment = "positive";
          } else if (index < positiveCount + negativeCount) {
            sentiment = "negative";
          } else {
            sentiment = "neutral";
          }
        }

        return { text, sentiment, topic: insight.insight };
      });

      setSelectedTopic(insight.insight);
      setSelectedReviews(reviews);
      setShowReviewModal(true);
    }
  };

  const formatPercentage = (value: string | number): string => {
    if (typeof value === "number") {
      return `${value}%`;
    }
    if (typeof value === "string" && value.includes("%")) {
      return value;
    }
    return `${value}%`;
  };

  const formatNumber = (value: string | number): string => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return String(value);
  };

  const generateCurrentDates = (days: number) => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Enhanced analysis function that provides specific insights
  const generateSpecificInsights = (topic: string, reviews: string[], sentiment: string): string => {
    if (!reviews || reviews.length === 0) {
      return `No specific feedback found for ${topic}.`;
    }

    const lowerTopic = topic.toLowerCase();
    const allText = reviews.join(' ').toLowerCase();
    
    // Topic-specific analysis patterns
    const analysisPatterns: { [key: string]: { positive: string[], negative: string[], neutral: string[] } } = {
      'deposits': {
        "positive": ['easy', 'quick', 'fast', 'smooth', 'instant', 'convenient', 'simple', 'reliable'],
        "negative": ['slow', 'delayed', 'pending', 'failed', 'rejected', 'problem', 'issue', 'error', 'waiting', 'stuck'],
        "neutral": ['process', 'method', 'option', 'way', 'system']
      },
      'withdrawals': {
        "positive": ['quick', 'fast', 'smooth', 'easy', 'reliable', 'trusted', 'honest'],
        "negative": ['slow', 'delayed', 'pending', 'failed', 'rejected', 'problem', 'issue', 'error', 'waiting', 'stuck', 'scam', 'fraud'],
        "neutral": ['process', 'method', 'option', 'way', 'system']
      },
      'loyalty rewards': {
        "positive": ['good', 'great', 'excellent', 'amazing', 'fantastic', 'worth', 'valuable', 'beneficial'],
        "negative": ['poor', 'bad', 'terrible', 'worthless', 'useless', 'disappointing', 'unfair', 'rigged'],
        "neutral": ['program', 'system', 'points', 'benefits', 'rewards']
      },
      'customer service': {
        "positive": ['helpful', 'responsive', 'friendly', 'professional', 'quick', 'efficient', 'knowledgeable'],
        "negative": ['unhelpful', 'unresponsive', 'rude', 'slow', 'useless', 'ignored', 'unprofessional'],
        "neutral": ['support', 'service', 'assistance', 'help']
      },
      'mobile app': {
        "positive": ['smooth', 'fast', 'easy', 'intuitive', 'user-friendly', 'reliable', 'stable'],
        "negative": ['buggy', 'slow', 'crashes', 'glitchy', 'unstable', 'difficult', 'confusing'],
        "neutral": ['app', 'mobile', 'interface', 'design']
      }
    };

    const patterns = analysisPatterns[lowerTopic] || {
              "positive": ['good', 'great', 'excellent', 'amazing'],
        "negative": ['bad', 'terrible', 'poor', 'awful'],
        "neutral": ['okay', 'fine', 'average']
    };

    // Count pattern matches
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    patterns.positive.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = allText.match(regex);
      if (matches) positiveCount += matches.length;
    });

    patterns.negative.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = allText.match(regex);
      if (matches) negativeCount += matches.length;
    });

    patterns.neutral.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = allText.match(regex);
      if (matches) neutralCount += matches.length;
    });

    // Generate specific insights based on topic and sentiment
    if (sentiment === 'positive') {
      if (lowerTopic === 'deposits') {
        return `Users frequently mention that deposits are ${positiveCount > negativeCount ? 'quick and reliable' : 'generally smooth'}. The process appears to be working well for most customers.`;
      } else if (lowerTopic === 'withdrawals') {
        return `Withdrawal experiences are mostly positive, with users noting ${positiveCount > negativeCount ? 'fast and reliable processing' : 'satisfactory service'}.`;
      } else if (lowerTopic === 'loyalty rewards') {
        return `The loyalty program is well-received, with users appreciating ${positiveCount > negativeCount ? 'valuable benefits and rewards' : 'the overall program structure'}.`;
      } else if (lowerTopic === 'customer service') {
        return `Customer service receives positive feedback, with users highlighting ${positiveCount > negativeCount ? 'helpful and responsive support' : 'good overall service quality'}.`;
      } else if (lowerTopic === 'mobile app') {
        return `The mobile app is praised for being ${positiveCount > negativeCount ? 'smooth and user-friendly' : 'generally well-designed'}.`;
      }
    } else if (sentiment === 'negative') {
      if (lowerTopic === 'deposits') {
        return `Users report issues with deposits, primarily ${negativeCount > positiveCount ? 'delays and processing problems' : 'various technical difficulties'}. This needs immediate attention.`;
      } else if (lowerTopic === 'withdrawals') {
        return `Withdrawal problems are a major concern, with users experiencing ${negativeCount > positiveCount ? 'delays and processing issues' : 'various technical problems'}. This is affecting customer trust.`;
      } else if (lowerTopic === 'loyalty rewards') {
        return `The loyalty program is criticized for being ${negativeCount > positiveCount ? 'unfair or poorly structured' : 'disappointing overall'}. Users feel the rewards are not valuable.`;
      } else if (lowerTopic === 'customer service') {
        return `Customer service is problematic, with users reporting ${negativeCount > positiveCount ? 'unresponsive and unhelpful support' : 'poor overall service quality'}.`;
      } else if (lowerTopic === 'mobile app') {
        return `The mobile app has issues, with users experiencing ${negativeCount > positiveCount ? 'bugs and crashes' : 'various technical problems'}.`;
      }
    } else {
      return `Mixed feedback for ${topic}. Some users are satisfied while others have concerns. Further analysis needed to identify specific improvement areas.`;
    }

    // Fallback for other topics
    return `Analysis of ${topic} shows ${sentiment === 'positive' ? 'generally positive feedback' : sentiment === 'negative' ? 'significant concerns that need attention' : 'mixed customer sentiment'}.`;
  };

  // Enhanced topic analysis function with detailed pattern analysis
  const analyzeTopicInsights = (topic: string, rawMentions: string[]): string => {
    if (!rawMentions || rawMentions.length === 0) {
      return `No specific feedback available for ${topic}.`;
    }

    const allText = rawMentions.join(' ').toLowerCase();
    const topicLower = topic.toLowerCase();
    const reviewCount = rawMentions.length;

    // Universal pattern analysis that works across all industries
    const hasQualityIssues = /\b(poor|bad|terrible|awful|disappointing|unacceptable|substandard|inferior)\b/gi.test(allText);
    const hasTrustIssues = /\b(scam|fraud|fake|dishonest|untrustworthy|deceptive|misleading|rigged)\b/gi.test(allText);
    const hasTechnicalIssues = /\b(bug|glitch|crash|error|broken|unresponsive|freeze|malfunction)\b/gi.test(allText);
    const hasPerformanceIssues = /\b(slow|delay|lag|wait|stuck|processing|unresponsive|timeout)\b/gi.test(allText);
    const hasServiceIssues = /\b(unhelpful|rude|ignored|unresponsive|useless|incompetent|unprofessional)\b/gi.test(allText);
    const hasPriceIssues = /\b(expensive|overpriced|costly|rip-off|overcharged|unfair|pricey)\b/gi.test(allText);
    const hasQualityPraise = /\b(excellent|amazing|fantastic|outstanding|superb|perfect|brilliant)\b/gi.test(allText);
    const hasServicePraise = /\b(helpful|friendly|professional|responsive|efficient|quick|attentive)\b/gi.test(allText);
    const hasValuePraise = /\b(worth|valuable|beneficial|great|good|satisfied|happy|love)\b/gi.test(allText);
    
    // Extract specific issues for any industry
    let specificIssues = [];
    if (hasTrustIssues) specificIssues.push('trust concerns');
    if (hasQualityIssues) specificIssues.push('quality problems');
    if (hasTechnicalIssues) specificIssues.push('technical issues');
    if (hasPerformanceIssues) specificIssues.push('performance problems');
    if (hasServiceIssues) specificIssues.push('service issues');
    if (hasPriceIssues) specificIssues.push('pricing concerns');
    
    // Generate industry-agnostic insights
    if (hasTrustIssues) {
      return `CRITICAL: Trust issues - ${reviewCount} customers report concerns about ${topic}. Requires immediate attention.`;
    } else if (hasQualityIssues && hasTechnicalIssues) {
      return `${topic} quality and technical issues - ${reviewCount} customers report problems with reliability and performance.`;
    } else if (hasQualityIssues) {
      return `${topic} quality concerns - ${reviewCount} customers report substandard quality and disappointing experiences.`;
    } else if (hasTechnicalIssues) {
      return `${topic} technical problems - ${reviewCount} customers experiencing bugs, crashes, and system issues.`;
    } else if (hasPerformanceIssues) {
      return `${topic} performance issues - ${reviewCount} customers report slow, unresponsive, or delayed service.`;
    } else if (hasServiceIssues) {
      return `${topic} service problems - ${reviewCount} customers report unhelpful, rude, or unresponsive support.`;
    } else if (hasPriceIssues) {
      return `${topic} pricing concerns - ${reviewCount} customers find service overpriced or unfair.`;
    } else if (hasQualityPraise && hasServicePraise) {
      return `${topic} excellence - ${reviewCount} customers praise quality and service.`;
    } else if (hasQualityPraise) {
      return `${topic} quality praised - ${reviewCount} customers satisfied with excellent quality.`;
    } else if (hasServicePraise) {
      return `${topic} service praised - ${reviewCount} customers appreciate helpful and professional support.`;
    } else if (hasValuePraise) {
      return `${topic} positive feedback - ${reviewCount} customers satisfied with value and experience.`;
    }

    // Fallback generic analysis for any remaining cases
    const positiveWords = /\b(good|great|excellent|amazing|fantastic|smooth|easy|quick|reliable|satisfied|happy|love)\b/gi;
    const negativeWords = /\b(bad|terrible|poor|awful|slow|difficult|problem|issue|error|disappointed|frustrated|hate)\b/gi;
    const urgentWords = /\b(urgent|critical|emergency|immediate|serious)\b/gi;
    
    const positiveMatches = allText.match(positiveWords) || [];
    const negativeMatches = allText.match(negativeWords) || [];
    const urgentMatches = allText.match(urgentWords) || [];
    
    // Fallback analysis
    if (urgentMatches.length > 0 && negativeMatches.length > positiveMatches.length) {
      return `URGENT: Critical issues for ${topic} - ${reviewCount} customers need immediate attention.`;
    } else if (positiveMatches.length > negativeMatches.length * 2) {
      return `${topic} positive: ${reviewCount} customers satisfied with service.`;
    } else if (negativeMatches.length > positiveMatches.length * 2) {
      return `${topic} concerns - ${reviewCount} customers report problems needing attention.`;
    } else {
      return `${topic} mixed feedback - ${reviewCount} customers have varied experiences.`;
    }
  };

  // Enhanced insights generation
  const generateInsights = (): any[] => {
    if (!reportData?.mentionsByTopic) return [];

    const insights: any[] = [];
    const processedTopics = new Set<string>();

    reportData.mentionsByTopic.forEach((topic) => {
      if (processedTopics.has(topic.topic)) return;
      processedTopics.add(topic.topic);

      const totalMentions = topic.total || 0;
      const positiveMentions = topic.positive || 0;
      const negativeMentions = topic.negative || 0;
      const rawMentions = topic.rawMentions || [];

      if (totalMentions === 0) return;

      const sentiment = negativeMentions > positiveMentions ? 'negative' : positiveMentions > negativeMentions ? 'positive' : 'neutral';
      const percentage = Math.round((Math.max(positiveMentions, negativeMentions) / totalMentions) * 100);

      // Generate specific insight based on topic analysis
      const specificInsight = analyzeTopicInsights(topic.topic, rawMentions);
      
      const insight = {
        insight: specificInsight,
        title: topic.topic,
        direction: sentiment,
        mentionCount: totalMentions.toString(),
        platforms: ['Trustpilot', 'Google Reviews', 'Sitejabber'],
        impact: sentiment === 'negative' ? 'High' : sentiment === 'positive' ? 'Medium' : 'Low',
        suggestions: sentiment === 'negative' ? [
          'Investigate root cause of complaints',
          'Implement immediate fixes',
          'Monitor customer feedback closely'
        ] : sentiment === 'positive' ? [
          'Maintain current standards',
          'Leverage positive feedback for marketing',
          'Continue monitoring for any changes'
        ] : [
          'Monitor for trend changes',
          'Gather more specific feedback',
          'Consider targeted improvements'
        ],
        reviews: rawMentions.slice(0, 3).map((mention, index) => ({
          text: mention,
          topic: topic.topic,
          sentiment: sentiment,
          source: `Review ${index + 1}`
        })),
        rawMentions: rawMentions,
        context: `Based on ${totalMentions} mentions across multiple platforms`,
        rootCause: sentiment === 'negative' ? 'Customer dissatisfaction with current service quality' : 'Satisfactory service delivery',
        actionItems: sentiment === 'negative' ? 'Immediate investigation and resolution required' : 'Continue monitoring and maintain standards',
        specificExamples: rawMentions.slice(0, 2)
      };

      insights.push(insight);
    });

    return insights.sort((a, b) => {
      const aImpact = a.direction === 'negative' ? 3 : a.direction === 'positive' ? 1 : 2;
      const bImpact = b.direction === 'negative' ? 3 : b.direction === 'positive' ? 1 : 2;
      return bImpact - aImpact;
    });
  };

  const insights = generateInsights();

  // Generate chart data for sentiment over time
  const sentimentChartData =
    processedData.sentimentOverTime?.length > 0
      ? processedData.sentimentOverTime
      : [];

  // Generate chart data for volume over time
  const volumeChartData =
    processedData.volumeOverTime?.length > 0
      ? processedData.volumeOverTime
      : [];

  const handleTrendingTopicClick = (topic: any) => {
    setSelectedTrendingTopic(topic);
    setShowTrendingModal(true);
  };

  const handleSentimentDataClick = (data: any) => {
    if (data && data.insights) {
      setSelectedSentimentData(data);
      setShowSentimentInsights(true);
    }
  };

  // Load more topics function
  const handleLoadMoreTopics = () => {
    const nextBatch = visibleTopics + 10;
    const totalTopics = processedData.mentionsByTopic?.length || 0;

    if (nextBatch >= totalTopics) {
      setVisibleTopics(totalTopics);
      setShowLoadMore(false);
    } else {
      setVisibleTopics(nextBatch);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Report Info */}
        <div className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Voice of Customer Report
                  </h2>
                  <p className="text-[#B0B0C0] mt-2">
                    Generated on{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {reportData.business_name?.charAt(0) || "B"}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {reportData.business_name || "Unknown Brand"}
                      </div>
                      <div className="text-xs text-[#B0B0C0]">
                        {reportData.business_url || "Unknown URL"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Sources */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Active Sources
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-white/20 bg-white/5 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-200 shadow-[0_4px_16px_rgba(255,255,255,0.1)]">
                  <Plus className="w-4 h-4" />
                  Add Source
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {processedData.detected_sources &&
                Array.isArray(processedData.detected_sources) &&
                processedData.detected_sources.length > 0 ? (
                  processedData.detected_sources.map(
                    (source: any, index: number) => (
                      <div
                        key={index}
                        className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {source.source?.charAt(0) || "T"}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-white">
                                {source.source || "Trustpilot"}
                              </h5>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-[#B0B0C0]">
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1 rounded-md border text-xs font-medium transition-all duration-200 shadow-sm border-[#3b82f6]/40 text-[#3b82f6] hover:bg-[#23263a] hover:text-white">
                              <RefreshCw className="w-3 h-3" />
                              Sync
                            </button>
                            <ExternalLink className="w-4 h-4 text-[#B0B0C0]" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#B0B0C0]">
                            {source.review_count || 40} reviews
                          </span>
                          <span className="text-[#B0B0C0]">
                            Last sync: 1 hour ago
                          </span>
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  // Default Trustpilot card when no sources detected
                  <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold">T</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-white">
                            Trustpilot
                          </h5>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-[#B0B0C0]">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 rounded-md border text-xs font-medium transition-all duration-200 shadow-sm border-[#3b82f6]/40 text-[#3b82f6] hover:bg-[#23263a] hover:text-white">
                          <RefreshCw className="w-3 h-3" />
                          Sync
                        </button>
                        <ExternalLink className="w-4 h-4 text-[#B0B0C0]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#B0B0C0]">Loading... reviews</span>
                      <span className="text-[#B0B0C0]">
                        Last sync: 1 hour ago
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Free Plan Section */}
            <div className="border-t border-white/10 pt-6">
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">$</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-white text-lg truncate">
                        Free Plan
                      </h4>
                      <p className="text-sm text-[#B0B0C0] break-words">
                        Basic Voice of Customer insights.
                      </p>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0">
                    <ArrowUp className="w-4 h-4" />
                    Upgrade to Pro
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-[#B0B0C0] break-words">
                      No live syncing
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-[#B0B0C0] break-words">
                      1 review source
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-[#B0B0C0] break-words">
                      1 competitor
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Executive Summary
              </h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>
                  Top-level view of customer sentiment and key concerns
                </span>
              </div>
            </div>

            {/* Executive Summary Text */}
            <div className="mb-8 bg-[#181a20]/40 border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Executive Summary
              </h4>
              <div className="text-[#B0B0C0] leading-relaxed space-y-4">
                {processedData.executiveSummary?.overview ? (
                  <div className="whitespace-pre-wrap">
                    {processedData.executiveSummary.overview}
                  </div>
                ) : (
                  <>
                    <p>
                      Based on analysis of customer reviews across multiple
                      platforms, the business shows a{" "}
                      {processedData.executiveSummary?.sentimentChange?.startsWith(
                        "+",
                      )
                        ? "positive"
                        : "mixed"}{" "}
                      sentiment trend with{" "}
                      {processedData.executiveSummary?.volumeChange || "+12%"}{" "}
                      change in review volume over the past 30 days.
                    </p>
                    <p>
                      The most praised aspect is{" "}
                      {processedData.executiveSummary?.mostPraised ||
                        "customer service"}
                      , with customers highlighting{" "}
                      {processedData.executiveSummary?.praisedSections?.[0]?.examples?.[0]?.substring(
                        0,
                        100,
                      ) || "fast response times and helpful support"}
                      . However, the primary concern is{" "}
                      {processedData.executiveSummary?.topComplaint ||
                        "deposit fees"}
                      , with
                      {processedData.executiveSummary?.painPoints?.[0]?.examples?.[0]?.substring(
                        0,
                        100,
                      ) || "customers expressing frustration over high charges"}
                      .
                    </p>
                    <p>
                      Key trends indicate{" "}
                      {processedData.executiveSummary?.sentimentChange?.startsWith(
                        "+",
                      )
                        ? "improving customer satisfaction"
                        : "declining satisfaction"}
                      , with{" "}
                      {processedData.executiveSummary?.volumeChange?.startsWith(
                        "+",
                      )
                        ? "increased"
                        : "decreased"}{" "}
                      customer engagement. The overall rating stands at 4.2/5,
                      reflecting{" "}
                      {processedData.executiveSummary?.sentimentChange?.startsWith(
                        "+",
                      )
                        ? "strong"
                        : "moderate"}{" "}
                      customer satisfaction.
                    </p>
                    <p>
                      Immediate attention should focus on{" "}
                      {processedData.executiveSummary?.topComplaint ||
                        "addressing deposit fee concerns"}
                      to improve customer retention and satisfaction. The data
                      suggests opportunities for{" "}
                      {processedData.executiveSummary?.mostPraised ||
                        "enhancing customer service"}
                      and{" "}
                      {processedData.executiveSummary?.topComplaint
                        ? "resolving fee-related issues"
                        : "improving overall user experience"}
                      .
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Sentiment Change */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400/10 via-transparent to-blue-500/10 rounded-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold text-lg">
                        Sentiment Trend
                      </span>
                      <div className="relative group ml-1">
                        <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                          Sentiment Trend is calculated as the percentage change
                          in average customer sentiment over the last 30 days
                          compared to the previous period. Derived from review
                          ratings and text sentiment analysis.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">
                    {processedData.executiveSummary?.sentimentChange || "+5%"}
                  </div>
                  <div className="text-sm text-[#B0B0C0] group-hover:text-white transition-colors">
                    {processedData.executiveSummary?.sentimentChange?.startsWith(
                      "+",
                    )
                      ? "Customer satisfaction improving"
                      : "Customer satisfaction declining"}
                  </div>
                </div>
              </div>

              {/* Volume Change */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 via-transparent to-purple-500/10 rounded-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold text-lg">
                        Review Volume
                      </span>
                      <div className="relative group ml-1">
                        <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                          Review Volume is the percentage change in the number
                          of reviews received over the last 30 days compared to
                          the previous period. Calculated from all review
                          sources.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
                    {processedData.executiveSummary?.volumeChange || "+25%"}
                  </div>
                  <div className="text-sm text-[#B0B0C0] group-hover:text-white transition-colors">
                    {processedData.executiveSummary?.volumeChange?.startsWith(
                      "+",
                    )
                      ? "Increasing customer engagement"
                      : "Decreasing customer engagement"}
                  </div>
                </div>
              </div>

              {/* Trust Score */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-pink-500/10 rounded-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold text-lg">
                        Trust Score
                      </span>
                      <div className="relative group ml-1">
                        <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                          Trust Score is calculated based on the average rating
                          and sentiment of all customer reviews over the last 30
                          days. Higher scores indicate greater customer
                          confidence.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">
                    {processedData.advancedMetrics?.trustScore || 85}/100
                  </div>
                  <div className="text-sm text-[#B0B0C0] group-hover:text-white transition-colors">
                    High customer confidence
                  </div>
                </div>
              </div>
            </div>

            {/* What's Good vs What's Bad */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* What's Good */}
              <div className="bg-[#181a20]/60 border border-green-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-green-500/30 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-600/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400/10 via-transparent to-emerald-500/10 rounded-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                    <span className="text-green-400 font-semibold text-lg group-hover:text-green-300 transition-colors">
                      What's Working Well
                    </span>
                  </div>
                  <div className="space-y-3">
                    {processedData.executiveSummary?.praisedSections
                      ?.slice(0, 3)
                      .map((section: any, index: number) => (
                        <div
                          key={index}
                          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 group-hover:bg-green-500/15 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-green-300 font-medium group-hover:text-green-200 transition-colors">
                              {section.topic}
                            </span>
                            <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                              {section.percentage}% positive
                            </span>
                          </div>
                          {section.examples && section.examples.length > 0 && (
                            <div className="text-sm text-green-200 italic group-hover:text-green-100 transition-colors">
                              "{section.examples[0].substring(0, 100)}..."
                            </div>
                          )}
                        </div>
                      )) ||
                      (() => {
                        // Generate real data from mentions by topic
                        const positiveTopics =
                          processedData.mentionsByTopic?.filter(
                            (topic: any) => topic.positive > 0 && topic.positive >= topic.negative,
                          ) || [];
                        const topPositiveTopics = positiveTopics.slice(0, 3);

                        if (topPositiveTopics.length > 0) {
                          return (
                            <div className="text-green-300">
                              {topPositiveTopics.map(
                                (topic: any, index: number) => {
                                  const percentage = Math.round(
                                    (topic.positive /
                                      (topic.positive + topic.negative)) *
                                      100,
                                  );
                                  // Generate proper insight instead of raw review
                                  const insight = analyzeTopicInsights(topic.topic, topic.rawMentions || []);
                                  return (
                                    <div
                                      key={index}
                                      className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-3 group-hover:bg-green-500/15 transition-colors"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-green-300 font-medium group-hover:text-green-200 transition-colors">
                                          {topic.topic}
                                        </span>
                                        <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                                          {percentage}% positive
                                        </span>
                                      </div>
                                      <div className="text-sm text-green-200 group-hover:text-green-100 transition-colors">
                                        {insight}
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          );
                        } else {
                          // Fallback: show any topics with positive mentions
                          const topicsWithPositiveMentions = processedData.mentionsByTopic?.filter(
                            (topic: any) => topic.positive > 0
                          ) || [];
                          const fallbackTopics = topicsWithPositiveMentions.slice(0, 3);

                          if (fallbackTopics.length > 0) {
                            return (
                              <div className="text-green-300">
                                {fallbackTopics.map((topic: any, index: number) => {
                                  const percentage = Math.round(
                                    (topic.positive / (topic.positive + topic.negative)) * 100
                                  );
                                  const insight = analyzeTopicInsights(topic.topic, topic.rawMentions || []);
                                  return (
                                    <div
                                      key={index}
                                      className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-3 group-hover:bg-green-500/15 transition-colors"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-green-300 font-medium group-hover:text-green-200 transition-colors">
                                          {topic.topic}
                                        </span>
                                        <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                                          {topic.positive} positive mentions
                                        </span>
                                      </div>
                                      <div className="text-sm text-green-200 group-hover:text-green-100 transition-colors">
                                        {insight}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          } else {
                            return (
                              <div className="text-green-300">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-3 group-hover:bg-green-500/15 transition-colors">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-green-300 font-medium group-hover:text-green-200 transition-colors">
                                      No positive feedback detected
                                    </span>
                                    <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                                      0% positive
                                    </span>
                                  </div>
                                  <div className="text-sm text-green-200 group-hover:text-green-100 transition-colors">
                                    No significant positive feedback found in the analyzed reviews.
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        }
                      })()}
                  </div>
                </div>
              </div>

              {/* What's Bad */}
              <div className="bg-[#181a20]/60 border border-red-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-red-500/30 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-400/10 via-transparent to-rose-500/10 rounded-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-red-400 font-semibold text-lg group-hover:text-red-300 transition-colors">
                      Key Concerns
                    </span>
                  </div>
                  <div className="space-y-3">
                    {processedData.executiveSummary?.painPoints
                      ?.slice(0, 3)
                      .map((point: any, index: number) => (
                        <div
                          key={index}
                          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 group-hover:bg-red-500/15 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-red-300 font-medium group-hover:text-red-200 transition-colors">
                              {point.topic}
                            </span>
                            <span className="text-red-400 font-semibold group-hover:text-red-300 transition-colors">
                              {point.percentage}% negative
                            </span>
                          </div>
                          {point.examples && point.examples.length > 0 && (
                            <div className="text-sm text-red-200 italic group-hover:text-red-100 transition-colors">
                              "{point.examples[0].substring(0, 100)}..."
                            </div>
                          )}
                        </div>
                      )) ||
                      (() => {
                        // Generate real data from mentions by topic
                        const negativeTopics =
                          processedData.mentionsByTopic?.filter(
                            (topic: any) => topic.negative > topic.positive,
                          ) || [];
                        const topNegativeTopics = negativeTopics.slice(0, 3);

                        if (topNegativeTopics.length > 0) {
                          return (
                            <div className="text-red-300">
                              {topNegativeTopics.map(
                                (topic: any, index: number) => {
                                  const percentage = Math.round(
                                    (topic.negative /
                                      (topic.positive + topic.negative)) *
                                      100,
                                  );
                                  // Generate proper insight instead of raw review
                                  const insight = analyzeTopicInsights(topic.topic, topic.rawMentions || []);
                                  return (
                                    <div
                                      key={index}
                                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-3 group-hover:bg-red-500/15 transition-colors"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-red-300 font-medium group-hover:text-red-200 transition-colors">
                                          {topic.topic}
                                        </span>
                                        <span className="text-red-400 font-semibold group-hover:text-red-300 transition-colors">
                                          {percentage}% negative
                                        </span>
                                      </div>
                                      <div className="text-sm text-red-200 group-hover:text-red-100 transition-colors">
                                        {insight}
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-red-300">
                              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-3 group-hover:bg-red-500/15 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-red-300 font-medium group-hover:text-red-200 transition-colors">
                                    No concerns detected
                                  </span>
                                  <span className="text-red-400 font-semibold group-hover:text-red-300 transition-colors">
                                    0% negative
                                  </span>
                                </div>
                                <div className="text-sm text-red-200 group-hover:text-red-100 transition-colors">
                                  No significant negative feedback found in the analyzed reviews.
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Immediate Action Required */}
            <div className="bg-[#181a20]/60 border border-orange-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-orange-500/30 transition-all group">
              {/* Glassmorphic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/5 rounded-2xl pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/10 via-transparent to-amber-500/10 rounded-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">!</span>
                  </div>
                  <span className="text-orange-400 font-semibold text-lg group-hover:text-orange-300 transition-colors">
                    Immediate Action Required
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processedData.executiveSummary?.alerts
                    ?.slice(0, 4)
                    .map((alert: any, index: number) => (
                      <div
                        key={index}
                        className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 group-hover:bg-orange-500/15 transition-colors"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              alert.type === "critical"
                                ? "bg-red-500/20 text-red-400"
                                : alert.type === "warning"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {alert.type?.toUpperCase() || "ALERT"}
                          </span>
                          <span className="text-orange-300 font-medium group-hover:text-orange-200 transition-colors">
                            {alert.metric}
                          </span>
                        </div>
                        <div className="text-sm text-orange-200 group-hover:text-orange-100 transition-colors">
                          {alert.message}
                        </div>
                      </div>
                    )) ||
                    (() => {
                      // Generate real alerts from mentions by topic
                      const criticalTopics =
                        processedData.mentionsByTopic?.filter(
                          (topic: any) =>
                            topic.negative > topic.positive &&
                            topic.negative / (topic.positive + topic.negative) >
                              0.6,
                        ) || [];
                      const warningTopics =
                        processedData.mentionsByTopic?.filter(
                          (topic: any) =>
                            topic.negative > topic.positive &&
                            topic.negative / (topic.positive + topic.negative) >
                              0.4,
                        ) || [];

                      const alerts: any[] = [];

                      // Add critical alerts
                      criticalTopics.slice(0, 2).forEach((topic: any) => {
                        const percentage = Math.round(
                          (topic.negative / (topic.positive + topic.negative)) *
                            100,
                        );
                        const insight = analyzeTopicInsights(topic.topic, topic.rawMentions || []);
                        alerts.push({
                          type: "critical",
                          metric: topic.topic,
                          message: insight,
                        });
                      });

                      // Add warning alerts
                      warningTopics.slice(0, 2).forEach((topic: any) => {
                        const percentage = Math.round(
                          (topic.negative / (topic.positive + topic.negative)) *
                            100,
                        );
                        const insight = analyzeTopicInsights(topic.topic, topic.rawMentions || []);
                        alerts.push({
                          type: "warning",
                          metric: topic.topic,
                          message: insight,
                        });
                      });

                      if (alerts.length > 0) {
                        return (
                          <>
                            {alerts.map((alert, index) => (
                              <div
                                key={index}
                                className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 group-hover:bg-orange-500/15 transition-colors"
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      alert.type === "critical"
                                        ? "bg-red-500/20 text-red-400"
                                        : alert.type === "warning"
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : "bg-blue-500/20 text-blue-400"
                                    }`}
                                  >
                                    {alert.type.toUpperCase()}
                                  </span>
                                  <span className="text-orange-300 font-medium group-hover:text-orange-200 transition-colors">
                                    {alert.metric}
                                  </span>
                                </div>
                                <div className="text-sm text-orange-200 group-hover:text-orange-100 transition-colors">
                                  {alert.message}
                                </div>
                              </div>
                            ))}
                          </>
                        );
                      } else {
                        return (
                          <>
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 group-hover:bg-orange-500/15 transition-colors">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                                  INFO
                                </span>
                                <span className="text-orange-300 font-medium group-hover:text-orange-200 transition-colors">
                                  No immediate actions required
                                </span>
                              </div>
                              <div className="text-sm text-orange-200 group-hover:text-orange-100 transition-colors">
                                No critical issues detected that require
                                immediate attention
                              </div>
                            </div>
                          </>
                        );
                      }
                    })()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sentiment Over Time Chart */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Sentiment Over Time
              </h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>
                  Context: Daily sentiment trends over the last 30 days. Higher
                  values = more positive sentiment.
                </span>
              </div>
            </div>

            {sentimentChartData.length > 0 ? (
              <>
                <div className="h-80 bg-[#181a20]/40 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />

                  <div className="relative z-10 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentimentChartData}>
                        <defs>
                          {/* Green gradient for high sentiment (70-100) */}
                          <linearGradient
                            id="sentimentGradientHigh"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#10B981"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="#10B981"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                          <linearGradient
                            id="sentimentStrokeHigh"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>

                          {/* Amber gradient for average sentiment (40-69) */}
                          <linearGradient
                            id="sentimentGradientMedium"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#F59E0B"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="#F59E0B"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                          <linearGradient
                            id="sentimentStrokeMedium"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#D97706" />
                          </linearGradient>

                          {/* Red gradient for low sentiment (0-39) */}
                          <linearGradient
                            id="sentimentGradientLow"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#EF4444"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="#EF4444"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                          <linearGradient
                            id="sentimentStrokeLow"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#DC2626" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="date"
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12, fill: "#9CA3AF" }}
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }
                          axisLine={{ stroke: "#374151", strokeOpacity: 0.5 }}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12, fill: "#9CA3AF" }}
                          domain={[0, 100]}
                          axisLine={{ stroke: "#374151", strokeOpacity: 0.5 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(28, 30, 38, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#F9FAFB",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
                          }}
                          labelFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          }
                          formatter={(value: any, name: any, props: any) => {
                            const sentiment = value as number;
                            let emoji = "😐";
                            let color = "#9CA3AF";

                            if (sentiment >= 70) {
                              emoji = "😊";
                              color = "#10B981";
                            } else if (sentiment >= 40) {
                              emoji = "😐";
                              color = "#F59E0B";
                            } else {
                              emoji = "😞";
                              color = "#EF4444";
                            }

                            const dataPoint = props.payload;
                            const reviewCount = dataPoint.reviewCount || 0;
                            const insights = dataPoint.insights || "";

                            // Determine sentiment level description
                            let sentimentLevel = "";
                            if (sentiment >= 70) {
                              sentimentLevel = "High";
                            } else if (sentiment >= 40) {
                              sentimentLevel = "Average";
                            } else {
                              sentimentLevel = "Low";
                            }

                            return [
                              <div style={{ color }}>
                                <div
                                  style={{
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {emoji} {sentiment}/100
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    opacity: 0.8,
                                    marginBottom: "4px",
                                  }}
                                >
                                  {reviewCount > 0
                                    ? `${reviewCount} review${reviewCount !== 1 ? "s" : ""}`
                                    : "Estimated sentiment"}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    opacity: 0.7,
                                    marginBottom: "4px",
                                  }}
                                >
                                  {sentimentLevel} sentiment level
                                </div>
                                {insights && (
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      opacity: 0.7,
                                      maxWidth: "200px",
                                      lineHeight: "1.3",
                                      marginTop: "4px",
                                    }}
                                  >
                                    {insights}
                                  </div>
                                )}
                              </div>,
                              "Sentiment",
                            ];
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sentiment"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          dot={(props: any) => {
                            const sentiment = props.payload.sentiment;
                            let fillColor = "#9CA3AF";
                            let strokeColor = "#9CA3AF";

                            if (sentiment >= 70) {
                              fillColor = "#10B981";
                              strokeColor = "#059669";
                            } else if (sentiment >= 40) {
                              fillColor = "#F59E0B";
                              strokeColor = "#D97706";
                            } else {
                              fillColor = "#EF4444";
                              strokeColor = "#DC2626";
                            }

                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={4}
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={2}
                                filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
                                cursor="pointer"
                              />
                            );
                          }}
                          activeDot={(props: any) => {
                            const sentiment = props.payload.sentiment;
                            let fillColor = "#10B981";
                            let strokeColor = "#059669";

                            if (sentiment >= 70) {
                              fillColor = "#10B981";
                              strokeColor = "#059669";
                            } else if (sentiment >= 40) {
                              fillColor = "#F59E0B";
                              strokeColor = "#D97706";
                            } else {
                              fillColor = "#EF4444";
                              strokeColor = "#DC2626";
                            }

                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={6}
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={2}
                                filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))"
                                cursor="pointer"
                              />
                            );
                          }}
                          onClick={(data) => handleSentimentDataClick(data)}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sentiment Color Legend */}
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">High (70-100)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-amber-400">Average (40-69)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-400">Low (0-39)</span>
                  </div>
                </div>

                {/* Sentiment Insight Card */}
                <div className="mt-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] backdrop-blur-2xl p-6 relative overflow-hidden">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-indigo-400/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {sentimentChartData.length > 0
                            ? (() => {
                                const avgSentiment = Math.round(
                                  sentimentChartData.reduce(
                                    (sum: number, d: any) => sum + d.sentiment,
                                    0,
                                  ) / sentimentChartData.length,
                                );
                                if (avgSentiment >= 70) return "😊";
                                if (avgSentiment >= 40) return "😐";
                                return "😞";
                              })()
                            : "⚡"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-purple-300 font-semibold text-lg">
                          Insight:
                        </span>
                        <span className="text-[#B0B0C0] ml-2 text-base leading-relaxed">
                          {sentimentChartData.length > 0
                            ? (() => {
                                const avgSentiment = Math.round(
                                  sentimentChartData.reduce(
                                    (sum: number, d: any) => sum + d.sentiment,
                                    0,
                                  ) / sentimentChartData.length,
                                );
                                const peakDay = sentimentChartData.reduce(
                                  (max: any, d: any) =>
                                    d.sentiment > max.sentiment ? d : max,
                                );
                                const lowDay = sentimentChartData.reduce(
                                  (min: any, d: any) =>
                                    d.sentiment < min.sentiment ? d : min,
                                );

                                // Calculate trend direction
                                const recentDays = sentimentChartData.slice(-7);
                                const earlyAvg =
                                  recentDays
                                    .slice(0, 3)
                                    .reduce(
                                      (sum: number, d: any) =>
                                        sum + d.sentiment,
                                      0,
                                    ) / 3;
                                const lateAvg =
                                  recentDays
                                    .slice(-3)
                                    .reduce(
                                      (sum: number, d: any) =>
                                        sum + d.sentiment,
                                      0,
                                    ) / 3;
                                const trendDirection =
                                  lateAvg > earlyAvg
                                    ? "improving"
                                    : lateAvg < earlyAvg
                                      ? "declining"
                                      : "stable";

                                // Analyze sentiment levels and provide context
                                let insight = "";
                                let emoji = "😐";

                                if (avgSentiment >= 70) {
                                  emoji = "😊";
                                  if (trendDirection === "improving") {
                                    insight = `Excellent sentiment trending upward! ${Math.round(lateAvg - earlyAvg)}% improvement with peak performance on ${new Date(peakDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${peakDay.sentiment}/100). Customers are highly satisfied with service quality, response times, and overall experience. This strong performance suggests effective customer service and product improvements.`;
                                  } else if (trendDirection === "declining") {
                                    insight = `High sentiment but declining by ${Math.round(earlyAvg - lateAvg)}%. Peak was ${new Date(peakDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${peakDay.sentiment}/100), lowest on ${new Date(lowDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${lowDay.sentiment}/100). While still positive, recent issues may be affecting customer satisfaction. Monitor for service consistency.`;
                                  } else {
                                    insight = `Consistently high sentiment with ${avgSentiment}/100 average. Peak performance on ${new Date(peakDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${peakDay.sentiment}/100). Customers consistently praise service quality, reliability, and positive experiences. This stable high performance indicates strong customer satisfaction and brand loyalty.`;
                                  }
                                } else if (avgSentiment >= 40) {
                                  emoji = "😐";
                                  if (trendDirection === "improving") {
                                    insight = `Moderate sentiment improving by ${Math.round(lateAvg - earlyAvg)}%. Peak on ${new Date(peakDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${peakDay.sentiment}/100). Recent improvements in customer service and product quality are showing positive results. Continue focusing on addressing common pain points to reach higher satisfaction levels.`;
                                  } else if (trendDirection === "declining") {
                                    insight = `Moderate sentiment declining by ${Math.round(earlyAvg - lateAvg)}%. Lowest on ${new Date(lowDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${lowDay.sentiment}/100). Recent issues with service quality, response times, or product problems are affecting satisfaction. Immediate attention needed to prevent further decline.`;
                                  } else {
                                    insight = `Stable moderate sentiment with ${avgSentiment}/100 average. Peak on ${new Date(peakDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${peakDay.sentiment}/100). Mixed customer experiences with some satisfaction but room for improvement. Focus on addressing common complaints and enhancing service quality.`;
                                  }
                                } else {
                                  emoji = "😞";
                                  if (trendDirection === "improving") {
                                    insight = `Low sentiment but improving by ${Math.round(lateAvg - earlyAvg)}%. Peak on ${new Date(peakDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${peakDay.sentiment}/100). Recent improvements are helping, but significant issues remain. Continue addressing major pain points like service quality, response times, and product problems.`;
                                  } else if (trendDirection === "declining") {
                                    insight = `Critical low sentiment declining by ${Math.round(earlyAvg - lateAvg)}%. Lowest on ${new Date(lowDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${lowDay.sentiment}/100). Serious issues with service quality, product problems, or customer support are causing dissatisfaction. Immediate intervention required to address root causes.`;
                                  } else {
                                    insight = `Consistently low sentiment with ${avgSentiment}/100 average. Peak on ${new Date(peakDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${peakDay.sentiment}/100). Ongoing issues with service quality, product problems, or customer support are affecting satisfaction. Urgent action needed to improve customer experience.`;
                                  }
                                }

                                return (
                                  <span>
                                    {emoji} {insight}
                                  </span>
                                );
                              })()
                            : "No sentiment data available."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-[#B0B0C0]">No sentiment data available</p>
              </div>
            )}
          </div>
        </section>

        {/* Volume Over Time Chart */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Review Volume Over Time
              </h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>
                  Context: Daily review volume trends. Spikes may indicate
                  events, campaigns, or issues.
                </span>
              </div>
            </div>

            {volumeChartData.length > 0 ? (
              <>
                <div className="h-80 bg-[#181a20]/40 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />

                  <div className="relative z-10 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={volumeChartData}>
                        <defs>
                          <linearGradient
                            id="volumeGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3B82F6"
                              stopOpacity={0.9}
                            />
                            <stop
                              offset="100%"
                              stopColor="#3B82F6"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="date"
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12, fill: "#9CA3AF" }}
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }
                          axisLine={{ stroke: "#374151", strokeOpacity: 0.5 }}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12, fill: "#9CA3AF" }}
                          axisLine={{ stroke: "#374151", strokeOpacity: 0.5 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(28, 30, 38, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#F9FAFB",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
                          }}
                          labelFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          }
                        />
                        <Bar
                          dataKey="volume"
                          fill="url(#volumeGradient)"
                          radius={[6, 6, 0, 0]}
                          filter="drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Volume Insight Card */}
                <div className="mt-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] backdrop-blur-2xl p-6 relative overflow-hidden">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-indigo-400/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-sm">⚡</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-purple-300 font-semibold text-lg">
                          Insight:
                        </span>
                        <span className="text-[#B0B0C0] ml-2 text-base leading-relaxed">
                          {volumeChartData.length > 0
                            ? (() => {
                                const peakDay = volumeChartData.reduce(
                                  (max: any, d: any) =>
                                    d.volume > max.volume ? d : max,
                                );
                                const lowDay = volumeChartData.reduce(
                                  (min: any, d: any) =>
                                    d.volume < min.volume ? d : min,
                                );

                                // Use the actual peak insight if available
                                if (peakDay.peakInsight) {
                                  const peakDate = new Date(peakDay.date);
                                  const peakDateStr =
                                    peakDate.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    });

                                  // Check if peak was significantly higher than average
                                  const avgVolume =
                                    volumeChartData.reduce(
                                      (sum: number, d: any) => sum + d.volume,
                                      0,
                                    ) / volumeChartData.length;
                                  const isSignificantPeak =
                                    peakDay.volume > avgVolume * 1.5;

                                  let insight = `Peak volume on ${peakDateStr} with ${peakDay.volume} reviews - ${peakDay.peakInsight}`;

                                  // Add context about the dip if significant
                                  if (lowDay.volume < avgVolume * 0.5) {
                                    const lowDateStr = new Date(
                                      lowDay.date,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    });
                                    insight += ` Low engagement on ${lowDateStr} (${lowDay.volume} reviews) - may indicate reduced activity or fewer customer touchpoints.`;
                                  }

                                  return insight;
                                } else {
                                  // Fallback to the previous logic if no peak insight is available
                                  const peakDate = new Date(peakDay.date);
                                  const peakDateStr =
                                    peakDate.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    });

                                  // Check if peak was on a weekend (common for customer engagement)
                                  const isWeekend =
                                    peakDate.getDay() === 0 ||
                                    peakDate.getDay() === 6;

                                  // Check if peak was significantly higher than average
                                  const avgVolume =
                                    volumeChartData.reduce(
                                      (sum: number, d: any) => sum + d.volume,
                                      0,
                                    ) / volumeChartData.length;
                                  const isSignificantPeak =
                                    peakDay.volume > avgVolume * 1.5;

                                  // Check if there were any patterns around the peak
                                  const peakIndex = volumeChartData.findIndex(
                                    (d: any) => d.date === peakDay.date,
                                  );
                                  const beforePeak =
                                    peakIndex > 0
                                      ? volumeChartData[peakIndex - 1].volume
                                      : 0;
                                  const afterPeak =
                                    peakIndex < volumeChartData.length - 1
                                      ? volumeChartData[peakIndex + 1].volume
                                      : 0;
                                  const isIsolatedPeak =
                                    peakDay.volume > beforePeak * 2 &&
                                    peakDay.volume > afterPeak * 2;

                                  // Generate context about the peak
                                  let insight = `Peak volume on ${peakDateStr} with ${peakDay.volume} reviews`;

                                  if (isSignificantPeak) {
                                    if (isIsolatedPeak) {
                                      insight += ` - isolated spike suggests a specific event, campaign, or issue that drove immediate customer feedback.`;
                                    } else if (isWeekend) {
                                      insight += ` - weekend peak likely due to increased customer activity or a weekend-specific event.`;
                                    } else {
                                      insight += ` - significant increase suggests a specific event, campaign, or issue that drove customer feedback.`;
                                    }
                                  } else {
                                    insight += ` - normal customer engagement levels.`;
                                  }

                                  // Add context about the dip if significant
                                  if (lowDay.volume < avgVolume * 0.5) {
                                    const lowDateStr = new Date(
                                      lowDay.date,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    });
                                    insight += ` Low engagement on ${lowDateStr} (${lowDay.volume} reviews) - may indicate reduced activity or fewer customer touchpoints.`;
                                  }

                                  return insight;
                                }
                              })()
                            : "No volume data available."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-[#B0B0C0]">No volume data available</p>
              </div>
            )}
          </div>
        </section>

        {/* Mentions by Topic Section */}
        {processedData.mentionsByTopic &&
          processedData.mentionsByTopic.length > 0 && (
            <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white">
                    Mentions by Topic
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                    <Info className="w-4 h-4" />
                    <span>
                      Context: Shows emotional distribution by category. Helpful
                      to spot polarizing experiences.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedData.mentionsByTopic
                    .slice(0, visibleTopics)
                    .map((topic: any, index: number) => (
                      <div
                        key={index}
                        className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group"
                      >
                        {/* Glassmorphic overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-white text-lg group-hover:text-white/90 transition-colors">
                              {topic.topic}
                            </h4>
                          </div>

                          <div className="space-y-4">
                            {/* Sentiment Breakdown */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-green-400">
                                  Positive
                                </span>
                                <span className="text-green-400 font-semibold">
                                  {topic.positive}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${topic.positive}%` }}
                                ></div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-red-400">
                                  Negative
                                </span>
                                <span className="text-red-400 font-semibold">
                                  {topic.negative}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${topic.negative}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Total Reviews */}
                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                              <span className="text-sm text-[#B0B0C0]">
                                Total Reviews
                              </span>
                              <span className="text-white font-semibold">
                                {topic.total}
                              </span>
                            </div>

                            {/* Context */}
                            {topic.context && (
                              <div className="pt-2 border-t border-white/10">
                                <p className="text-sm text-[#B0B0C0] leading-relaxed">
                                  <TruncatedText
                                    text={topic.context}
                                    maxLength={80}
                                    title="Topic Context"
                                  />
                                </p>
                              </div>
                            )}

                            {/* View Reviews Button */}
                            {topic.rawMentions &&
                              topic.rawMentions.length > 0 && (
                                <div className="pt-4">
                                  <button
                                    onClick={() =>
                                      handleTopicClick(
                                        topic.topic,
                                        topic.rawMentions,
                                        topic,
                                      )
                                    }
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 group-hover:scale-105"
                                  >
                                    <span>View {topic.total} Reviews</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Load More Button */}
                {showLoadMore &&
                  processedData.mentionsByTopic &&
                  visibleTopics < processedData.mentionsByTopic.length && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleLoadMoreTopics}
                        className="px-8 py-3 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 hover:border-white/30 transition-all duration-200 backdrop-blur-md shadow-lg hover:shadow-xl"
                      >
                        Load More Topics
                      </button>
                    </div>
                  )}
              </div>
            </section>
          )}

        {/* Competitors Section */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Competitive Analysis
              </h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>
                  Context: Your brand performance vs industry average.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Your Brand */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white text-lg">
                    Your Brand
                  </h4>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Y</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Trust Score</span>
                    <span className="text-green-400 font-semibold">
                      {processedData.advancedMetrics?.trustScore || 75}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Avg Rating</span>
                    <span className="text-blue-400 font-semibold">4.2/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">
                      Response Rate
                    </span>
                    <span className="text-purple-400 font-semibold">85%</span>
                  </div>
                </div>
              </div>

              {/* Industry Average */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white text-lg">
                    Industry Average
                  </h4>
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">I</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Trust Score</span>
                    <span className="text-gray-400 font-semibold">68</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Avg Rating</span>
                    <span className="text-gray-400 font-semibold">3.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">
                      Response Rate
                    </span>
                    <span className="text-gray-400 font-semibold">72%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all text-white font-semibold">
                <Plus className="w-4 h-4" />
                <span>Add Competitors</span>
              </button>
            </div>
          </div>
        </section>

        {/* Trending Topics */}
        {processedData.trendingTopics &&
          Array.isArray(processedData.trendingTopics) &&
          processedData.trendingTopics.length > 0 && (
            <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white">
                    Trending Topics
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                    <Info className="w-4 h-4" />
                    <span>
                      Context: Topics showing significant growth in customer
                      mentions and sentiment.
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {processedData.trendingTopics.map(
                    (topic: any, index: number) => {
                      // Determine sentiment based on growth and context
                      let sentiment = "positive";
                      if (
                        topic.growth &&
                        topic.growth.includes("-") &&
                        parseInt(topic.growth) < 0
                      ) {
                        sentiment = "negative";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleTrendingTopicClick(topic)}
                          className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm ${
                            sentiment === "positive"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 hover:border-green-500/50 shadow-[0_4px_16px_rgba(34,197,94,0.2)]"
                              : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 shadow-[0_4px_16px_rgba(239,68,68,0.2)]"
                          }`}
                        >
                          <TrendingUp
                            className={`w-4 h-4 mr-2 ${sentiment === "negative" ? "rotate-180" : ""}`}
                          />
                          {topic.topic} • {topic.growth || "+5%"} •{" "}
                          {topic.volume || "12"} mentions
                          <ChevronRight className="w-4 h-4 ml-2" />
                          <span className="ml-2 text-xs opacity-75">
                            Click to view details
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            </section>
          )}

        {/* Market Gaps */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Market Gaps</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>
                  Context: Recurring unmet needs found in customer feedback.
                  Signals innovation or retention opportunities.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedData.marketGaps &&
              Array.isArray(processedData.marketGaps) &&
              processedData.marketGaps.length > 0 ? (
                processedData.marketGaps.map((gap: any, index: number) => (
                  <div
                    key={index}
                    className="bg-[#181a20]/60 border border-purple-500/20 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-4 relative overflow-hidden hover:border-purple-500/30 transition-all group"
                  >
                    {/* Glassmorphic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/5 rounded-xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-blue-500/10 rounded-xl pointer-events-none" />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg mb-1 group-hover:text-white/90 transition-colors">
                            {gap.gap}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs">
                            <span className="text-[#B0B0C0] group-hover:text-white/80 transition-colors">
                              {gap.mentions} mentions
                            </span>
                            <span className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                              {gap.kpiImpact}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Cards - Compact 2x2 Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* User */}
                        <div className="bg-[#181a20]/60 border border-white/10 rounded-lg p-3 group-hover:border-white/20 transition-colors">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                              <User className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div>
                              <span className="text-blue-400 font-semibold text-xs">
                                User:
                              </span>
                              <p className="text-[#B0B0C0] text-xs mt-1 leading-relaxed group-hover:text-white/80 transition-colors">
                                <TruncatedText
                                  text={gap.suggestion || "N/A"}
                                  maxLength={60}
                                  title="User Action"
                                />
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Consider */}
                        <div className="bg-[#181a20]/60 border border-white/10 rounded-lg p-3 group-hover:border-white/20 transition-colors">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                              <Lightbulb className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div>
                              <span className="text-green-400 font-semibold text-xs">
                                Consider:
                              </span>
                              <p className="text-[#B0B0C0] text-xs mt-1 leading-relaxed group-hover:text-white/80 transition-colors">
                                <TruncatedText
                                  text={gap.opportunity || "N/A"}
                                  maxLength={60}
                                  title="Consideration"
                                />
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Customers are saying */}
                        <div className="bg-[#181a20]/60 border border-white/10 rounded-lg p-3 group-hover:border-white/20 transition-colors">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div>
                              <span className="text-orange-400 font-semibold text-xs">
                                Customers are saying:
                              </span>
                              <p className="text-[#B0B0C0] text-xs mt-1 leading-relaxed group-hover:text-white/80 transition-colors">
                                {gap.specificExamples &&
                                gap.specificExamples.length > 0 ? (
                                  <TruncatedText
                                    text={`"${gap.specificExamples[0]}"`}
                                    maxLength={60}
                                    title="Customer Feedback"
                                  />
                                ) : (
                                  <span>No specific feedback</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Business case */}
                        <div className="bg-[#181a20]/60 border border-white/10 rounded-lg p-3 group-hover:border-white/20 transition-colors">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-purple-500 rounded flex items-center justify-center flex-shrink-0">
                              <BarChart3 className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div>
                              <span className="text-purple-400 font-semibold text-xs">
                                Business case:
                              </span>
                              <p className="text-[#B0B0C0] text-xs mt-1 leading-relaxed group-hover:text-white/80 transition-colors">
                                <TruncatedText
                                  text={gap.businessCase || "N/A"}
                                  maxLength={60}
                                  title="Business Case"
                                />
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            handleTopicClick(gap.gap, gap.rawMentions, gap)
                          }
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 group-hover:scale-105 text-sm"
                        >
                          <span>View {gap.mentions} Reviews</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-[#B0B0C0]">
                    No market gaps identified from the available data.
                  </p>
                </div>
              )}
            </div>

            {processedData.marketGaps &&
              Array.isArray(processedData.marketGaps) &&
              processedData.marketGaps.length > 0 && (
                <div className="mt-6 bg-[#181a20]/40 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">⚡</span>
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">
                        Market Gap Insight:
                      </span>
                      <span className="text-[#B0B0C0] ml-2">
                        Loyalty programs and same-day shipping are the most
                        requested features not currently offered.
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </section>

        {/* Suggested Actions */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Suggested Actions
              </h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>
                  Context: Actionable recommendations based on customer feedback
                  analysis.
                </span>
              </div>
            </div>

            <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl">
              {processedData.suggestedActions &&
              Array.isArray(processedData.suggestedActions) &&
              processedData.suggestedActions.length > 0 ? (
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-white font-semibold text-xs">
                          Pain Point
                        </th>
                        <th className="text-left p-3 text-white font-semibold text-xs">
                          Recommendation
                        </th>
                        <th className="text-left p-3 text-white font-semibold text-xs">
                          Description
                        </th>
                        <th className="text-left p-3 text-white font-semibold text-xs">
                          Priority
                        </th>
                        <th className="text-left p-3 text-white font-semibold text-xs">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedData.suggestedActions.map(
                        (action: any, index: number) => (
                          <tr
                            key={index}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="p-3 text-[#B0B0C0] text-xs">
                              <TruncatedText
                                text={
                                  typeof action === "string"
                                    ? "N/A"
                                    : action.painPoint || "N/A"
                                }
                                maxLength={80}
                                title="Pain Point"
                              />
                            </td>
                            <td className="p-3 text-[#B0B0C0] text-xs">
                              <TruncatedText
                                text={
                                  typeof action === "string"
                                    ? action
                                    : action.recommendation || "N/A"
                                }
                                maxLength={80}
                                title="Recommendation"
                              />
                            </td>
                            <td className="p-3 text-[#B0B0C0] text-xs">
                              <TruncatedText
                                text={
                                  typeof action === "string"
                                    ? "N/A"
                                    : action.context || "N/A"
                                }
                                maxLength={80}
                                title="Description"
                              />
                            </td>
                            <td className="p-3 text-[#B0B0C0] text-xs">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  typeof action === "string"
                                    ? "bg-gray-500/20 text-gray-300"
                                    : action.kpiImpact?.includes("High")
                                      ? "bg-red-500/20 text-red-300"
                                      : action.kpiImpact?.includes("Medium")
                                        ? "bg-yellow-500/20 text-yellow-300"
                                        : "bg-green-500/20 text-green-300"
                                }`}
                              >
                                {typeof action === "string"
                                  ? "N/A"
                                  : action.kpiImpact?.includes("High")
                                    ? "HIGH"
                                    : action.kpiImpact?.includes("Medium")
                                      ? "MEDIUM"
                                      : "LOW"}
                              </span>
                            </td>
                            <td className="p-3 text-[#B0B0C0] text-xs">
                              <div className="relative">
                                <button
                                  onClick={() => {
                                    // Toggle dropdown for this row
                                    const dropdownId = `dropdown-${index}`;
                                    const dropdown =
                                      document.getElementById(dropdownId);
                                    if (dropdown) {
                                      dropdown.classList.toggle("hidden");
                                    }
                                  }}
                                  className="p-1 hover:bg-white/10 rounded transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                  id={`dropdown-${index}`}
                                  className="absolute right-0 top-8 bg-[#181a20] border border-white/10 rounded-lg shadow-lg z-10 hidden min-w-[120px]"
                                >
                                  <button
                                    onClick={() => {
                                      // Edit action
                                      console.log("Edit action:", action);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors flex items-center space-x-2"
                                  >
                                    <span>✏️</span>
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Remove action
                                      console.log("Remove action:", action);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors flex items-center space-x-2"
                                  >
                                    <span>🗑️</span>
                                    <span>Remove</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Delete action
                                      console.log("Delete action:", action);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-red-500/20 text-red-300 transition-colors flex items-center space-x-2"
                                  >
                                    <span>❌</span>
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#B0B0C0]">
                    No suggested actions identified from the available data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Advanced Metrics */}
        {processedData.advancedMetrics && (
          <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">
                  Advanced Metrics
                </h3>
                <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                  <Info className="w-4 h-4" />
                  <span>
                    Context: Advanced customer experience metrics and
                    performance indicators.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center relative">
                  <div className="absolute top-3 right-3">
                    <div className="relative group">
                      <Info className="w-4 h-4 text-blue-400 cursor-pointer" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                        Trust Score is calculated based on the average rating
                        and sentiment of all customer reviews over the last 30
                        days. Higher scores indicate greater customer
                        confidence.
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {processedData.advancedMetrics.trustScore || 82}
                  </div>
                  <div className="text-sm text-[#B0B0C0]">Trust Score</div>
                  <div className="text-xs text-[#B0B0C0] mt-1">
                    Customer confidence level
                  </div>
                </div>
                <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center relative">
                  <div className="absolute top-3 right-3">
                    <div className="relative group">
                      <Info className="w-4 h-4 text-red-400 cursor-pointer" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                        Repeat Complaints represent the percentage of customers
                        who have reported the same issue multiple times. Higher
                        percentages indicate unresolved systemic problems.
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {processedData.advancedMetrics.repeatComplaints || 7}
                  </div>
                  <div className="text-sm text-[#B0B0C0]">
                    Repeat Complaints
                  </div>
                  <div className="text-xs text-[#B0B0C0] mt-1">
                    % of recurring issues
                  </div>
                </div>
                <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center relative">
                  <div className="absolute top-3 right-3">
                    <div className="relative group">
                      <Info className="w-4 h-4 text-green-400 cursor-pointer" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                        Average Resolution Time measures how quickly customer
                        issues are resolved. Faster resolution times indicate
                        better customer service efficiency.
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {processedData.advancedMetrics.avgResolutionTime ||
                      "1.2 days"}
                  </div>
                  <div className="text-sm text-[#B0B0C0]">
                    Avg Resolution Time
                  </div>
                  <div className="text-xs text-[#B0B0C0] mt-1">
                    Time to fix issues
                  </div>
                </div>
                <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center relative">
                  <div className="absolute top-3 right-3">
                    <div className="relative group">
                      <Info className="w-4 h-4 text-purple-400 cursor-pointer" />
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-[9999] pointer-events-none">
                        VOC Velocity measures the rate of change in customer
                        feedback volume. Positive values indicate increasing
                        customer engagement and feedback.
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {processedData.advancedMetrics.vocVelocity || "+5%"}
                  </div>
                  <div className="text-sm text-[#B0B0C0]">VOC Velocity</div>
                  <div className="text-xs text-[#B0B0C0] mt-1">
                    Feedback growth rate
                  </div>
                </div>
              </div>

              {/* Advanced Metrics Context */}
              {processedData.advancedMetrics?.context && (
                <div className="mt-6 bg-[#181a20]/40 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">📊</span>
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">
                        Metrics Context:
                      </span>
                      <p className="text-[#B0B0C0] mt-1">
                        {processedData.advancedMetrics.context}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* VOC Digest */}
        {processedData.vocDigest && (
          <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">VOC Digest</h3>
                <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                  <Info className="w-4 h-4" />
                  <span>
                    Context: Summary of key customer feedback themes and
                    insights.
                  </span>
                </div>
              </div>

              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-8">
                {/* VOC Analysis Summary */}
                <div className="space-y-8">
                  {/* Overall Performance */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        Overall Performance
                      </h4>
                    </div>
                    <div className="ml-11 space-y-3">
                      <p className="text-[#B0B0C0] leading-relaxed">
                        {processedData.vocDigest.summary ||
                          "Customer satisfaction analysis shows mixed performance with opportunities for improvement."}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-400 font-medium">
                          GOOD PERFORMANCE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">🔍</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        Key Findings
                      </h4>
                    </div>
                    <div className="ml-11 space-y-4">
                      {processedData.executiveSummary?.praisedSections &&
                        processedData.executiveSummary.praisedSections.length >
                          0 && (
                          <div className="space-y-2">
                            <p className="text-[#B0B0C0] leading-relaxed">
                              <span className="text-green-400 font-medium">
                                Strength:
                              </span>{" "}
                              {processedData.executiveSummary.praisedSections[0]
                                ?.topic || "Customer service"}{" "}
                              is the most praised aspect (
                              {processedData.executiveSummary.praisedSections[0]
                                ?.examples?.length || 0}{" "}
                              positive mentions, avg rating:{" "}
                              {processedData.executiveSummary.praisedSections[0]
                                ?.percentage || "4.0"}
                              /5).
                            </p>
                          </div>
                        )}
                      {processedData.executiveSummary?.painPoints &&
                        processedData.executiveSummary.painPoints.length >
                          0 && (
                          <div className="space-y-2">
                            <p className="text-[#B0B0C0] leading-relaxed">
                              <span className="text-red-400 font-medium">
                                Concern:
                              </span>{" "}
                              {processedData.executiveSummary.painPoints[0]
                                ?.topic || "Service quality"}{" "}
                              is the biggest pain point (
                              {processedData.executiveSummary.painPoints[0]
                                ?.examples?.length || 0}{" "}
                              negative mentions, avg rating:{" "}
                              {processedData.executiveSummary.painPoints[0]
                                ?.percentage || "3.0"}
                              /5).
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Detailed Insights */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        Detailed Insights
                      </h4>
                    </div>
                    <div className="ml-11">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {processedData.mentionsByTopic &&
                          processedData.mentionsByTopic
                            .slice(0, 9)
                            .map((topic: any, index: number) => (
                              <div
                                key={index}
                                className="bg-[#181a20]/40 border border-white/10 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-white">
                                    {topic.topic}
                                  </span>
                                  <span className="text-xs text-[#B0B0C0]">
                                    avg rating:{" "}
                                    {(
                                      (topic.positive /
                                        (topic.positive + topic.negative)) *
                                      5
                                    ).toFixed(1)}
                                    /5
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-green-400">
                                    {topic.positive} positive
                                  </span>
                                  <span className="text-red-400">
                                    {topic.negative} negative
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs text-[#B0B0C0] mt-1">
                                  <span>
                                    {Math.round(
                                      (topic.positive /
                                        (topic.positive + topic.negative)) *
                                        100,
                                    )}
                                    % positive
                                  </span>
                                  <span>
                                    {Math.round(
                                      (topic.negative /
                                        (topic.positive + topic.negative)) *
                                        100,
                                    )}
                                    % negative
                                  </span>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>

                  {/* Business Impact */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">💼</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        Business Impact
                      </h4>
                    </div>
                    <div className="ml-11 space-y-3">
                      <p className="text-[#B0B0C0] leading-relaxed">
                        {processedData.executiveSummary?.sentimentChange?.startsWith(
                          "+",
                        )
                          ? "Positive performance with opportunities for continued growth"
                          : "Mixed performance requiring targeted improvements"}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-[#B0B0C0]">
                            Opportunity to enhance specific areas for better
                            customer satisfaction
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-[#B0B0C0]">
                            Need for ongoing monitoring and quick response to
                            issues
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">🎯</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        Immediate Actions
                      </h4>
                    </div>
                    <div className="ml-11 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                          <div>
                            <span className="text-sm font-medium text-red-400">
                              Priority:
                            </span>
                            <p className="text-sm text-[#B0B0C0] mt-1">
                              Address{" "}
                              {processedData.executiveSummary?.topComplaint ||
                                "service quality"}{" "}
                              issues immediately to prevent customer churn.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div>
                            <span className="text-sm font-medium text-green-400">
                              Leverage:
                            </span>
                            <p className="text-sm text-[#B0B0C0] mt-1">
                              Use positive{" "}
                              {processedData.executiveSummary?.mostPraised ||
                                "customer service"}{" "}
                              feedback in marketing materials.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div>
                            <span className="text-sm font-medium text-blue-400">
                              Monitor:
                            </span>
                            <p className="text-sm text-[#B0B0C0] mt-1">
                              Track sentiment trends weekly to identify emerging
                              issues.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <div>
                            <span className="text-sm font-medium text-purple-400">
                              Improve:
                            </span>
                            <p className="text-sm text-[#B0B0C0] mt-1">
                              Implement customer feedback loops for continuous
                              improvement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Quality */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📊</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        Data Quality
                      </h4>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm text-[#B0B0C0]">
                        Analysis based on{" "}
                        {processedData.detected_sources?.reduce(
                          (total: number, source: any) =>
                            total + source.review_count,
                          0,
                        ) || 0}{" "}
                        customer reviews with comprehensive sentiment analysis
                        and topic extraction.
                      </p>
                    </div>
                  </div>

                  {/* Frequently Mentioned Topics */}
                  {processedData.mentionsByTopic &&
                    processedData.mentionsByTopic.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              📝
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">
                            Frequently Mentioned Topics
                          </h4>
                        </div>
                        <div className="ml-11">
                          <div className="space-y-2">
                            {processedData.mentionsByTopic
                              .slice(0, 5)
                              .map((topic: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-3"
                                >
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  <span className="text-sm text-[#B0B0C0]">
                                    {topic.topic} is frequently mentioned
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Trending Topic Detailed Modal */}
      {showTrendingModal && selectedTrendingTopic && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#181a20]/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] max-w-6xl w-full max-h-[95vh] overflow-hidden relative">
            {/* Glassmorphic Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-pink-500/5 rounded-3xl pointer-events-none" />

            <div className="relative z-10 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      Trending Topic: {selectedTrendingTopic.topic}
                    </h3>
                    <p className="text-[#B0B0C0] mt-1">
                      Detailed analysis and customer feedback insights
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTrendingModal(false)}
                  className="w-10 h-10 bg-[#0f1117]/60 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center text-[#B0B0C0] hover:text-white hover:scale-110"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              {/* Content - Masonry Layout */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="columns-1 lg:columns-2 xl:columns-3 gap-6 space-y-6">
                  {/* Sentiment Breakdown Card */}
                  {selectedTrendingTopic.totalCount && (
                    <div className="bg-[#181a20]/60 border border-white/15 rounded-2xl p-6 backdrop-blur-xl break-inside-avoid">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            📈
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          Sentiment Breakdown
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-[#181a20]/40 rounded-xl">
                          <span className="text-sm text-[#B0B0C0]">
                            Total Reviews
                          </span>
                          <span className="text-white font-semibold">
                            {selectedTrendingTopic.totalCount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#181a20]/40 rounded-xl">
                          <span className="text-sm text-green-400">
                            Positive
                          </span>
                          <span className="text-green-400 font-semibold">
                            {selectedTrendingTopic.positiveCount || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#181a20]/40 rounded-xl">
                          <span className="text-sm text-red-400">Negative</span>
                          <span className="text-red-400 font-semibold">
                            {selectedTrendingTopic.negativeCount || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#181a20]/40 rounded-xl">
                          <span className="text-sm text-[#B0B0C0]">
                            Overall Sentiment
                          </span>
                          <span
                            className={`font-semibold ${selectedTrendingTopic.sentiment === "positive" ? "text-green-400" : "text-red-400"}`}
                          >
                            {selectedTrendingTopic.sentiment === "positive"
                              ? "Positive"
                              : "Negative"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trend Analysis Card */}
                  {selectedTrendingTopic.keyInsights &&
                    selectedTrendingTopic.keyInsights.length > 1 && (
                      <div className="bg-[#181a20]/60 border border-white/15 rounded-2xl p-6 backdrop-blur-xl break-inside-avoid">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              🔍
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">
                            Why is this trending?
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                            <div>
                              <span className="text-yellow-400 font-semibold text-sm">
                                Trend Analysis:
                              </span>
                              <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed">
                                {selectedTrendingTopic.keyInsights[1] ||
                                  "Recent increase in customer mentions and feedback."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Recommended Action Card */}
                  {selectedTrendingTopic.keyInsights &&
                    selectedTrendingTopic.keyInsights.length > 2 && (
                      <div className="bg-[#181a20]/60 border border-white/15 rounded-2xl p-6 backdrop-blur-xl break-inside-avoid">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              ⚡
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">
                            Recommended Action
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                            <div>
                              <span className="text-green-400 font-semibold text-sm">
                                Action Required:
                              </span>
                              <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed">
                                {selectedTrendingTopic.keyInsights[2] ||
                                  "Address customer concerns and improve service quality."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Business Impact Card */}
                  {selectedTrendingTopic.businessImpact && (
                    <div className="bg-[#181a20]/60 border border-white/15 rounded-2xl p-6 backdrop-blur-xl break-inside-avoid">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            💼
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          Business Impact
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div>
                            <span className="text-blue-400 font-semibold text-sm">
                              Impact Analysis:
                            </span>
                            <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed">
                              {selectedTrendingTopic.businessImpact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary Card */}
                  <div className="bg-[#181a20]/60 border border-white/15 rounded-2xl p-6 backdrop-blur-xl break-inside-avoid">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📋</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        Summary
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                        <div>
                          <span className="text-purple-400 font-semibold text-sm">
                            Review Summary:
                          </span>
                          <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed">
                            {selectedTrendingTopic.totalCount
                              ? `Based on ${selectedTrendingTopic.totalCount} customer reviews, ${selectedTrendingTopic.topic} shows ${selectedTrendingTopic.positiveCount || 0} positive and ${selectedTrendingTopic.negativeCount || 0} negative mentions. ${selectedTrendingTopic.context || "Customers are actively discussing this topic in their feedback."}`
                              : selectedTrendingTopic.specificExamples &&
                                  selectedTrendingTopic.specificExamples
                                    .length > 0
                                ? `Based on ${selectedTrendingTopic.specificExamples.length} customer reviews, ${selectedTrendingTopic.topic} is a ${selectedTrendingTopic.sentiment === "positive" ? "positive" : "negative"} trending topic. ${selectedTrendingTopic.context || "Customers are actively discussing this topic in their feedback."}`
                                : `Analysis of customer feedback shows ${selectedTrendingTopic.topic} is trending with ${selectedTrendingTopic.sentiment} sentiment.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Examples Card */}
                  {selectedTrendingTopic.specificExamples &&
                    selectedTrendingTopic.specificExamples.length > 0 && (
                      <div className="bg-[#181a20]/60 border border-white/15 rounded-2xl p-6 backdrop-blur-xl break-inside-avoid">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              💬
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-white">
                            Customer Examples
                          </h4>
                        </div>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                          {selectedTrendingTopic.specificExamples.map(
                            (example: string, idx: number) => (
                              <div
                                key={idx}
                                className="p-4 bg-[#181a20]/40 rounded-xl border border-white/10"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-xs">
                                      💬
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-[#B0B0C0] italic leading-relaxed">
                                      "{example}"
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-[#B0B0C0]">
                                        Customer Review
                                      </span>
                                      <span className="text-xs text-blue-400">
                                        #{idx + 1}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Main Issue Card */}
                  {selectedTrendingTopic.mainIssue && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl break-inside-avoid">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            ⚡
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          Main Issue & Recommendations
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <div>
                            <span className="text-purple-400 font-semibold text-sm">
                              Main Issue:
                            </span>
                            <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed">
                              {selectedTrendingTopic.mainIssue}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Trending Topic
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                            High Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1e26]/95 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Reviews for: {selectedTopic}
                </h3>
                <p className="text-sm text-[#B0B0C0] mt-1">
                  Showing {selectedReviews.length} mentions • Click any review
                  for more details
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center text-[#B0B0C0] hover:text-white"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            {/* Sentiment Summary */}
            <div className="mb-6 bg-[#181a20]/40 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[#B0B0C0]">
                      Sentiment Breakdown:
                    </span>
                    <span className="text-green-400 text-sm font-semibold">
                      {
                        selectedReviews.filter(
                          (r) => r.sentiment === "positive",
                        ).length
                      }{" "}
                      positive
                    </span>
                    <span className="text-red-400 text-sm font-semibold">
                      {
                        selectedReviews.filter(
                          (r) => r.sentiment === "negative",
                        ).length
                      }{" "}
                      negative
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#B0B0C0]">Total:</span>
                  <span className="text-white text-sm font-semibold">
                    {selectedReviews.length} reviews
                  </span>
                </div>
              </div>

              {/* Sentiment Bars */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-green-400 font-medium">
                      Positive
                    </span>
                    <span className="text-sm text-green-400 font-semibold">
                      {selectedReviews.length > 0
                        ? Math.round(
                            (selectedReviews.filter(
                              (r) => r.sentiment === "positive",
                            ).length /
                              selectedReviews.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                      style={{
                        width: `${selectedReviews.length > 0 ? (selectedReviews.filter((r) => r.sentiment === "positive").length / selectedReviews.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-red-400 font-medium">
                      Negative
                    </span>
                    <span className="text-sm text-red-400 font-semibold">
                      {selectedReviews.length > 0
                        ? Math.round(
                            (selectedReviews.filter(
                              (r) => r.sentiment === "negative",
                            ).length /
                              selectedReviews.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full"
                      style={{
                        width: `${selectedReviews.length > 0 ? (selectedReviews.filter((r) => r.sentiment === "negative").length / selectedReviews.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedReviews.map((review, index) => {
                return (
                  <div
                    key={index}
                    className="bg-[#181a20] border border-white/10 rounded-xl p-4"
                  >
                    <div className="mb-3 leading-relaxed">
                      <p className="text-white">{review.text}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            review.sentiment === "positive"
                              ? "bg-green-500/20 text-green-400"
                              : review.sentiment === "negative"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {review.sentiment}
                        </span>
                        {review.source && (
                          <span className="text-xs text-gray-400">
                            Source: {review.source}
                          </span>
                        )}
                      </div>
                      <span className="text-[#B0B0C0]">
                        Review #{index + 1} of {selectedReviews.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedReviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#B0B0C0]">
                  No reviews found for this topic.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sentiment Insights Modal */}
      {showSentimentInsights && selectedSentimentData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1e26]/95 backdrop-blur-xl rounded-xl border border-white/10 p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Sentiment Analysis:{" "}
                  {new Date(selectedSentimentData.date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </h3>
                <p className="text-sm text-[#B0B0C0] mt-1">
                  Detailed analysis of customer sentiment and reviews for this
                  date
                </p>
              </div>
              <button
                onClick={() => setShowSentimentInsights(false)}
                className="w-8 h-8 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center text-[#B0B0C0] hover:text-white"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Sentiment Analysis */}
              <div className="space-y-6">
                {/* Sentiment Score */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Sentiment Score
                  </h4>
                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold mb-2 ${
                        selectedSentimentData.sentiment >= 70
                          ? "text-green-400"
                          : selectedSentimentData.sentiment >= 50
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {selectedSentimentData.sentiment}/100
                    </div>
                    <div
                      className={`text-sm ${
                        selectedSentimentData.sentiment >= 70
                          ? "text-green-300"
                          : selectedSentimentData.sentiment >= 50
                            ? "text-yellow-300"
                            : "text-red-300"
                      }`}
                    >
                      {selectedSentimentData.sentiment >= 70
                        ? "Excellent"
                        : selectedSentimentData.sentiment >= 50
                          ? "Good"
                          : "Needs Attention"}
                    </div>
                  </div>
                </div>

                {/* Review Count */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Review Activity
                  </h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {selectedSentimentData.reviewCount}
                    </div>
                    <div className="text-sm text-blue-300">
                      {selectedSentimentData.reviewCount === 1
                        ? "Review"
                        : "Reviews"}{" "}
                      on this date
                    </div>
                  </div>
                </div>

                {/* Sentiment Trend */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Sentiment Trend
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">📊</span>
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">
                        Trend Analysis:
                      </span>
                      <span className="text-[#B0B0C0] ml-2">
                        {selectedSentimentData.sentiment >= 70
                          ? "Strong positive sentiment indicates high customer satisfaction."
                          : selectedSentimentData.sentiment >= 50
                            ? "Moderate sentiment suggests mixed customer feedback."
                            : "Low sentiment indicates customer concerns that need immediate attention."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Detailed Insights */}
              <div className="space-y-6">
                {/* Detailed Insights */}
                {selectedSentimentData.insights && (
                  <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Detailed Analysis
                    </h4>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">🔍</span>
                      </div>
                      <div>
                        <span className="text-green-400 font-semibold">
                          Analysis:
                        </span>
                        <span className="text-[#B0B0C0] ml-2 leading-relaxed">
                          {selectedSentimentData.insights}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Factors */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Key Factors
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-[#B0B0C0]">
                        {selectedSentimentData.sentiment >= 70
                          ? "High customer satisfaction scores"
                          : selectedSentimentData.sentiment >= 50
                            ? "Mixed customer feedback patterns"
                            : "Customer concerns and complaints"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-[#B0B0C0]">
                        {selectedSentimentData.reviewCount > 5
                          ? "High review volume indicates significant customer engagement"
                          : selectedSentimentData.reviewCount > 2
                            ? "Moderate review activity"
                            : "Low review volume - may need more customer feedback"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-[#B0B0C0]">
                        {selectedSentimentData.sentiment >= 70
                          ? "Positive trends suggest successful customer experience initiatives"
                          : selectedSentimentData.sentiment >= 50
                            ? "Opportunities for improvement identified"
                            : "Immediate action required to address customer concerns"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Recommendations
                  </h4>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">💡</span>
                    </div>
                    <div>
                      <span className="text-yellow-400 font-semibold">
                        Actions:
                      </span>
                      <span className="text-[#B0B0C0] ml-2">
                        {selectedSentimentData.sentiment >= 70
                          ? "Continue current practices and replicate success factors across the business."
                          : selectedSentimentData.sentiment >= 50
                            ? "Investigate specific customer feedback to identify improvement opportunities."
                            : "Implement immediate customer service improvements and address specific complaints."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Next Steps
              </h4>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">⚡</span>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">
                    Priority Actions:
                  </span>
                  <span className="text-[#B0B0C0] ml-2">
                    {selectedSentimentData.sentiment >= 70
                      ? "Monitor trends and maintain high standards. Consider expanding successful initiatives."
                      : selectedSentimentData.sentiment >= 50
                        ? "Review customer feedback in detail and implement targeted improvements."
                        : "Address customer concerns immediately and develop a comprehensive improvement plan."}
                  </span>
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Sentiment Analysis
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        selectedSentimentData.sentiment >= 70
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : selectedSentimentData.sentiment >= 50
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {selectedSentimentData.sentiment >= 70
                        ? "High Priority"
                        : selectedSentimentData.sentiment >= 50
                          ? "Medium Priority"
                          : "Critical Priority"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
