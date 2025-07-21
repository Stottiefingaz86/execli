import { NextRequest, NextResponse } from 'next/server';

// Fallback keyword-based classification function
const classifyTopicWithKeywords = (text: string, availableTopics: string[]): string => {
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

export async function POST(request: NextRequest) {
  try {
    const { text, availableTopics } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.log('OpenAI API key not available, using keyword classification');
      const classifiedTopic = classifyTopicWithKeywords(text, availableTopics);
      return NextResponse.json({ topic: classifiedTopic });
    }

    // Use OpenAI for classification
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const prompt = `You are an expert at analyzing customer reviews and categorizing them into specific topics. 

Available topics: ${availableTopics.join(', ')}

Review text: "${text}"

Please analyze this review and classify it into the most appropriate topic from the available list. Consider the context, meaning, and intent of the review, not just keywords.

Rules:
- If the review mentions multiple topics, choose the PRIMARY topic being discussed
- Consider the overall context and what the customer is actually talking about
- "other" should only be used if the review doesn't fit any specific topic
- Be precise and accurate in classification

Respond with ONLY the topic name from the available list, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a precise topic classification expert. Respond with only the topic name from the provided list."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for consistent classification
      max_tokens: 50
    });

    const classifiedTopic = completion.choices[0]?.message?.content?.trim().toLowerCase();

    // Validate the response is one of the available topics
    if (!availableTopics.includes(classifiedTopic)) {
      console.warn(`AI returned invalid topic: ${classifiedTopic}, defaulting to "other"`);
      return NextResponse.json({ topic: "other" });
    }

    return NextResponse.json({ topic: classifiedTopic });

  } catch (error) {
    console.error('Topic classification error:', error);
    // Fall back to keyword classification
    const { text, availableTopics } = await request.json();
    const classifiedTopic = classifyTopicWithKeywords(text, availableTopics);
    return NextResponse.json({ topic: classifiedTopic });
  }
} 