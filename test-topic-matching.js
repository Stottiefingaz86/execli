// Test the topic matching logic
const testReviews = [
  "Very little wins or bonuses now since the jackpots came into play, seeing a lot of people saying the same in chat rooms etc and empty spins on a lot of the games, hardly see jackpots won on temple or parade and now phoenix has gone that way too , the arcade games used to be really good and I still enjoy them and play within my means but the site has changed and not for the better",
  "Often the same winners which I understand some people are lucky but I am aware on the chat people are soon shut down by chat masters if they mention it They have reduced picture bingo from three choices to just one now it just doesn't have the feeling and atmosphere it used too maybe it depends on the chat master but for new members or those that don't spend hours everyday on the site the chat tends to be more between the chat host and regulars rather than inclusion of everyone unfortunately"
];

const coreTopics = [
  'Deposits', 'Withdrawals', 'Casino Games', 'Arcade Games', 'Bingo', 'Jackpots',
  'Customer Service', 'Bonuses', 'Mobile App', 'Website', 'Verification', 
  'Trust', 'Security', 'Payment Methods', 'Games', 'Support',
  'Casino', 'Slots', 'Blackjack', 'Roulette', 'Live Casino',
  'Bonus', 'Promotions', 'Rewards', 'Loyalty', 'VIP', 'Tournaments',
  'Cash Out', 'Payout Speed', 'Game Variety', 'Chat Rooms', 'Winners',
  'User Experience', 'Interface', 'Navigation', 'Loading Speed', 'Mobile Experience'
];

console.log('🔍 Testing topic matching logic...');
console.log('='.repeat(50));

testReviews.forEach((review, index) => {
  console.log(`\n📝 Review ${index + 1}:`);
  console.log(`"${review.substring(0, 100)}..."`);
  
  const text = review.toLowerCase();
  
  console.log('\n🎯 Topics found:');
  
  coreTopics.forEach(topicName => {
    let matches = false;
    
    if (topicName === 'Arcade Games') {
      matches = text.includes('arcade') || text.includes('bingo') || text.includes('picture bingo') || 
                text.includes('temple') || text.includes('parade') || text.includes('phoenix') ||
                text.includes('jackpot') || text.includes('jackpots') || text.includes('spin') || 
                text.includes('spins') || text.includes('win') || text.includes('wins');
    } else if (topicName === 'Bingo') {
      matches = text.includes('bingo') || text.includes('picture bingo') || text.includes('chat') || 
                text.includes('chat master') || text.includes('chat host') || text.includes('regulars');
    } else if (topicName === 'Jackpots') {
      matches = text.includes('jackpot') || text.includes('jackpots') || text.includes('mega jackpot') || 
                text.includes('mini jackpot') || text.includes('progressive') || text.includes('win');
    } else if (topicName === 'Chat Rooms') {
      matches = text.includes('chat') || text.includes('chat master') || text.includes('chat host') || 
                text.includes('regulars') || text.includes('chat rooms') || text.includes('chat room');
    } else if (topicName === 'Winners') {
      matches = text.includes('winner') || text.includes('winners') || text.includes('win') || 
                text.includes('wins') || text.includes('lucky') || text.includes('lucky people');
    } else {
      matches = text.includes(topicName.toLowerCase());
    }
    
    if (matches) {
      console.log(`   ✅ ${topicName}`);
    }
  });
  
  console.log('   ' + '-'.repeat(40));
}); 