// Test the sentiment analysis logic
const positiveWords = ['good', 'great', 'love', 'excellent', 'amazing', 'perfect', 'easy', 'quick', 'fast', 'smooth', 'simple', 'helpful', 'fantastic', 'outstanding', 'wonderful', 'awesome', 'reliable', 'trustworthy', 'professional', 'responsive', 'efficient', 'convenient', 'satisfied', 'happy', 'pleased', 'impressed', 'recommend', 'best', 'top', 'superior'];
const negativeWords = ['bad', 'terrible', 'hate', 'problem', 'issue', 'waiting', 'delay', 'locked', 'predatory', 'unfair', 'dangerous', 'warn', 'serious', 'no resolution', 'ridiculous', 'scam', 'ignoring', 'no response', 'bot', 'cheat', 'rigged', 'poor', 'awful', 'disappointed', 'worst', 'cheap', 'broken', 'slow', 'unhelpful', 'unresponsive', 'useless', 'rude', 'expensive', 'overpriced', 'costly', 'high', 'late', 'delayed', 'never arrived', 'difficult', 'confusing', 'complicated', 'reject', 'frustrated', 'annoyed', 'angry', 'upset', 'disgusted', 'horrible', 'nightmare'];

// Sample reviews that might be in the database
const sampleReviews = [
  "Great customer service, deposit and withdrawals that I've had so far have been without problem. So far so good!",
  "STAY AWAY POKER PLAYERS. Unless you're don't mind playing for a buck or two stay far far away from this site.",
  "betonline is scam. i deposit money to betonline very easy but i withdraw money they make hard to me",
  "Be careful they fake after I win, they just took my money. With no explanation",
  "Absolutely awful and predatory. They take a full 24 hours to update any winnings you have.",
  "Easy in and out withdrawal. Awesome poker site. Highly recommended.",
  "Unlike other gambling sites betonline gives great promotions to let you sample the games",
  "The support team was incredibly quick to respond and resolved my issue efficiently.",
  "I was really impressed with how helpful the customer service representative was.",
  "Their customer support is top-notch, always there when you need them."
];

console.log('🔍 Testing sentiment analysis logic...\n');

sampleReviews.forEach((review, index) => {
  const text = review.toLowerCase();
  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;
  
  console.log(`Review ${index + 1}: "${review}"`);
  console.log(`Positive words: ${positiveCount} (${positiveWords.filter(word => text.includes(word)).join(', ')})`);
  console.log(`Negative words: ${negativeCount} (${negativeWords.filter(word => text.includes(word)).join(', ')})`);
  
  // Test the old logic
  const oldPositive = positiveCount > negativeCount;
  const oldNegative = negativeCount > positiveCount;
  
  // Test the new logic
  const newPositive = positiveCount > 0 && positiveCount >= negativeCount;
  const newNegative = negativeCount > 0 && negativeCount >= positiveCount;
  
  console.log(`Old logic - Positive: ${oldPositive}, Negative: ${oldNegative}`);
  console.log(`New logic - Positive: ${newPositive}, Negative: ${newNegative}`);
  console.log('---\n');
});

// Test with more realistic reviews
const realisticReviews = [
  "Great customer service and easy withdrawals",
  "Terrible experience, they stole my money",
  "Good site but slow withdrawals",
  "Amazing promotions and helpful support",
  "Scam site, avoid at all costs",
  "Excellent games and fast payouts",
  "Poor customer service and hidden fees",
  "Love the variety of games available",
  "Awful experience, lost all my money",
  "Best online casino I've used"
];

console.log('🔍 Testing with more realistic reviews...\n');

realisticReviews.forEach((review, index) => {
  const text = review.toLowerCase();
  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;
  
  const newPositive = positiveCount > 0 && positiveCount >= negativeCount;
  const newNegative = negativeCount > 0 && negativeCount >= positiveCount;
  
  console.log(`Review ${index + 1}: "${review}"`);
  console.log(`Positive: ${newPositive}, Negative: ${newNegative}`);
  console.log(`Words: +${positiveCount} -${negativeCount}`);
  console.log('---\n');
}); 