// Test script to check data generation
const testReviews = [
  {
    text: "The poker games are rigged and full of bots. I can't believe how unfair this is.",
    rating: 1,
    source: "Trustpilot"
  },
  {
    text: "Withdrawals are so slow, it takes forever to get my money. Very frustrating.",
    rating: 2,
    source: "Trustpilot"
  },
  {
    text: "Great customer service, they helped me quickly with my deposit issue.",
    rating: 5,
    source: "Trustpilot"
  },
  {
    text: "The bonuses are amazing and the games are fair. Love this platform!",
    rating: 5,
    source: "Trustpilot"
  },
  {
    text: "Deposit fees are too high, and the payment methods are limited.",
    rating: 2,
    source: "Trustpilot"
  },
  {
    text: "Mobile app crashes constantly, very annoying when trying to play.",
    rating: 1,
    source: "Trustpilot"
  },
  {
    text: "Website is slow and confusing to navigate. Needs improvement.",
    rating: 2,
    source: "Trustpilot"
  },
  {
    text: "Verification process is too complicated and takes too long.",
    rating: 2,
    source: "Trustpilot"
  },
  {
    text: "Trust this platform completely, they are honest and reliable.",
    rating: 5,
    source: "Trustpilot"
  },
  {
    text: "Security is excellent, I feel safe with my money here.",
    rating: 5,
    source: "Trustpilot"
  }
];

// Simulate the generateMentionsByTopic function
function generateMentionsByTopic(reviews, businessName) {
  console.log(`generateMentionsByTopic: Processing ${reviews.length} reviews for ${businessName}`);
  
  const coreTopics = [
    'Deposits', 'Withdrawals', 'Poker', 'Casino Games', 'Sports Betting', 
    'Customer Service', 'Bonuses', 'Mobile App', 'Website', 'Verification', 
    'Trust', 'Security', 'Payment Methods', 'Games', 'Support'
  ];
  
  return coreTopics.map(topicName => {
    const topicReviews = reviews.filter(r => {
      const text = r.text.toLowerCase();
      const topicLower = topicName.toLowerCase();
      
      if (topicName === 'Deposits') {
        return text.includes('deposit') || text.includes('payment') || text.includes('pay') || 
               text.includes('fund') || text.includes('add money') || text.includes('credit');
      } else if (topicName === 'Withdrawals') {
        return text.includes('withdrawal') || text.includes('payout') || text.includes('cash out') || 
               text.includes('get money') || text.includes('receive money') || text.includes('money out');
      } else if (topicName === 'Poker') {
        return text.includes('poker') || text.includes('texas hold') || text.includes('tournament') || 
               text.includes('cash game') || text.includes('poker room') || text.includes('holdem');
      } else if (topicName === 'Casino Games') {
        return text.includes('casino') || text.includes('slot') || text.includes('game') || 
               text.includes('blackjack') || text.includes('roulette') || text.includes('baccarat');
      } else if (topicName === 'Sports Betting') {
        return text.includes('sport') || text.includes('betting') || text.includes('bet') || 
               text.includes('football') || text.includes('basketball') || text.includes('odds');
      } else if (topicName === 'Customer Service') {
        return text.includes('service') || text.includes('support') || text.includes('help') || 
               text.includes('assistance') || text.includes('staff') || text.includes('agent');
      } else if (topicName === 'Bonuses') {
        return text.includes('bonus') || text.includes('promotion') || text.includes('reward') || 
               text.includes('offer') || text.includes('deal') || text.includes('free');
      } else if (topicName === 'Mobile App') {
        return text.includes('mobile') || text.includes('app') || text.includes('phone') || 
               text.includes('android') || text.includes('ios') || text.includes('download');
      } else if (topicName === 'Website') {
        return text.includes('website') || text.includes('site') || text.includes('platform') || 
               text.includes('interface') || text.includes('navigation') || text.includes('design');
      } else if (topicName === 'Verification') {
        return text.includes('verification') || text.includes('kyc') || text.includes('identity') || 
               text.includes('document') || text.includes('proof') || text.includes('verified');
      } else if (topicName === 'Trust') {
        return text.includes('trust') || text.includes('reliable') || text.includes('honest') || 
               text.includes('legitimate') || text.includes('reputable') || text.includes('credible');
      } else if (topicName === 'Security') {
        return text.includes('secure') || text.includes('safe') || text.includes('protection') || 
               text.includes('fraud') || text.includes('scam') || text.includes('hack');
      } else if (topicName === 'Payment Methods') {
        return text.includes('payment') || text.includes('method') || text.includes('option') || 
               text.includes('card') || text.includes('paypal') || text.includes('bank');
      } else if (topicName === 'Games') {
        return text.includes('game') || text.includes('play') || text.includes('gaming') || 
               text.includes('entertainment') || text.includes('fun') || text.includes('enjoy');
      } else if (topicName === 'Support') {
        return text.includes('support') || text.includes('help') || text.includes('assistance') || 
               text.includes('contact') || text.includes('service') || text.includes('staff');
      }
      
      return text.includes(topicLower);
    });
    
    console.log(`Topic ${topicName}: Found ${topicReviews.length} reviews`);
    
    const positiveReviews = topicReviews.filter(r => (r.rating || 0) >= 4);
    const negativeReviews = topicReviews.filter(r => (r.rating || 0) <= 2);
    
    const positive = positiveReviews.length;
    const negative = negativeReviews.length;
    const total = topicReviews.length;
    
    const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
    const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;
    
    return {
      topic: topicName,
      positive: positivePercent,
      negative: negativePercent,
      total: total,
      rawMentions: topicReviews.slice(0, 5).map(r => r.text)
    };
  }).filter(topic => topic.total > 0);
}

// Simulate the generateTrendingTopics function
function generateTrendingTopics(reviews) {
  const coreTopics = ['Deposits', 'Withdrawals', 'Poker', 'Casino Games', 'Sports Betting', 'Customer Service', 'Bonuses', 'Mobile App', 'Website', 'Verification', 'Trust', 'Security'];
  
  return coreTopics.slice(0, 8).map(topic => {
    const topicReviews = reviews.filter(r => {
      const text = r.text.toLowerCase();
      return text.includes(topic.toLowerCase()) || 
             text.includes(topic.toLowerCase().replace(' ', '')) ||
             text.includes(topic.toLowerCase().replace(' ', '_'));
    });
    
    const positiveReviews = topicReviews.filter(r => (r.rating || 0) >= 4);
    const negativeReviews = topicReviews.filter(r => (r.rating || 0) <= 2);
    
    const positiveCount = positiveReviews.length;
    const negativeCount = negativeReviews.length;
    const totalCount = topicReviews.length;
    
    const sentimentRatio = totalCount > 0 ? positiveCount / totalCount : 0;
    const growth = sentimentRatio > 0.6 ? `+${Math.floor(sentimentRatio * 50) + 10}%` : 
                   sentimentRatio < 0.4 ? `-${Math.floor((1 - sentimentRatio) * 30) + 5}%` : 
                   `+${Math.floor(Math.random() * 20) + 5}%`;
    
    const sentiment = positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral';
    const volume = totalCount.toString();
    
    return {
      topic,
      growth,
      sentiment,
      volume,
      keyInsights: totalCount > 0 ? [`${positiveCount} positive mentions`, `${negativeCount} negative mentions`, `${Math.round((positiveCount / totalCount) * 100)}% positive sentiment`] : ['Limited data available'],
      rawMentions: topicReviews.slice(0, 3).map(r => r.text),
      positiveCount,
      negativeCount,
      totalCount
    };
  });
}

// Simulate the generateMarketGaps function
function generateMarketGaps(reviews) {
  const coreTopics = ['Deposits', 'Withdrawals', 'Poker', 'Casino Games', 'Sports Betting', 'Customer Service', 'Bonuses', 'Mobile App', 'Website', 'Verification', 'Trust', 'Security'];
  const negativeReviews = reviews.filter(r => (r.rating || 0) <= 2);
  
  const gaps = coreTopics.map(topic => {
    const topicNegativeReviews = negativeReviews.filter(r => {
      const text = r.text.toLowerCase();
      return text.includes(topic.toLowerCase()) || 
             text.includes(topic.toLowerCase().replace(' ', '')) ||
             text.includes(topic.toLowerCase().replace(' ', '_'));
    });
    
    const mentions = topicNegativeReviews.length;
    
    return {
      gap: topic,
      mentions,
      suggestion: `Improve ${topic} experience`,
      kpiImpact: `Improve ${topic} satisfaction by 40%`,
      priority: mentions > 2 ? 'High' : mentions > 0 ? 'Medium' : 'Low'
    };
  });
  
  return gaps
    .filter(gap => gap.mentions > 0)
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 5);
}

// Test the functions
console.log('=== TESTING DATA GENERATION ===');
console.log('Test reviews:', testReviews.length);

const mentionsByTopic = generateMentionsByTopic(testReviews, 'Test Company');
console.log('\n=== MENTIONS BY TOPIC ===');
console.log(mentionsByTopic);

const trendingTopics = generateTrendingTopics(testReviews);
console.log('\n=== TRENDING TOPICS ===');
console.log(trendingTopics);

const marketGaps = generateMarketGaps(testReviews);
console.log('\n=== MARKET GAPS ===');
console.log(marketGaps); 