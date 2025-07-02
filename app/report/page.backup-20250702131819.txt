'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  Share2, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  Bell,
  Plus,
  ExternalLink,
  Zap,
  AlertTriangle,
  Wand2,
  Activity
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

export default function VOCReport() {
  // Add company/industry toggle state
  const companies = [
    { key: 'coffee', label: 'Coffee Shop', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ) },
    { key: 'hotel', label: 'Hotel', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ) },
    { key: 'restaurant', label: 'Restaurant', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
      </svg>
    ) },
    { key: 'saas', label: 'SaaS Business', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ) },
    { key: 'gambling', label: 'Online Gambling', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
      </svg>
    ) },
    { key: 'ecommerce', label: 'Ecommerce', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.5 19h9a2 2 0 001.85-1.3L17 13M7 13V6h10v7" />
      </svg>
    ) },
    { key: 'telco', label: 'Telco', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 8.5A6.5 6.5 0 0112 2a6.5 6.5 0 0110 6.5c0 7.5-10 13-10 13S2 16 2 8.5z" />
      </svg>
    ) },
  ];
  const [selectedCompany, setSelectedCompany] = useState('coffee');

  // Demo data for each company/industry
  const demoData = {
    coffee: {
      businessName: 'Brewed Awakenings',
      businessUrl: 'https://brewedawakenings.com',
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalReviews: 892,
      topicCategories: ['Espresso Quality', 'Atmosphere', 'Service', 'Pastries', 'Pricing'],
      competitors: ['Bean Scene', 'Java House', 'Cafe Central', 'Mocha Magic', 'Perk Up'],
      competitorColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
      youColor: '#a855f7',
      industryColor: '#9CA3AF',
      dataSources: {
        current: [
          { name: 'Google Reviews', status: 'active', reviews: 512, lastSync: '1 hour ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) },
          { name: 'Yelp', status: 'active', reviews: 380, lastSync: '3 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ) }
        ],
        available: [
          { name: 'TripAdvisor', price: 19, description: 'Travel & cafe reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) },
          { name: 'Facebook', price: 14, description: 'Social media reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ) }
        ]
      },
      executiveSummary: {
        sentimentChange: '+9%',
        volumeChange: '+15%',
        mostPraised: 'Espresso Quality',
        topComplaint: 'Wait Time',
        overview: 'Customers love the espresso and pastries, but long wait times during peak hours are a recurring issue.',
        alerts: [
          { type: 'warning', message: 'Wait time complaints up 18%', metric: 'Wait Time' },
          { type: 'info', message: 'Atmosphere praised for coziness', metric: 'Atmosphere' }
        ]
      },
      keyInsights: [
        { insight: 'Espresso quality praised in 60% of reviews', direction: 'up', mentions: 120, platforms: ['Google'], impact: 'high', reviews: [ { text: 'Best espresso in town!', topic: 'Espresso Quality', sentiment: 'positive' }, { text: 'Love the rich flavor of their coffee.', topic: 'Espresso Quality', sentiment: 'positive' } ] },
        { insight: 'Wait time complaints up during weekends', direction: 'down', mentions: 45, platforms: ['Yelp'], impact: 'medium', reviews: [ { text: 'Had to wait 20 minutes for my order.', topic: 'Wait Time', sentiment: 'negative' } ] },
        { insight: 'Atmosphere is a major draw', direction: 'up', mentions: 80, platforms: ['Google'], impact: 'medium', reviews: [ { text: 'Cozy and relaxing vibe.', topic: 'Atmosphere', sentiment: 'positive' } ] }
      ],
      sentimentOverTime: [
        { month: 'Jan', business: 78, competitorA: 72, competitorB: 75, competitorC: 70 },
        { month: 'Feb', business: 80, competitorA: 74, competitorB: 76, competitorC: 72 },
        { month: 'Mar', business: 82, competitorA: 75, competitorB: 77, competitorC: 73 },
        { month: 'Apr', business: 81, competitorA: 76, competitorB: 78, competitorC: 74 },
        { month: 'May', business: 84, competitorA: 77, competitorB: 79, competitorC: 75 },
        { month: 'Jun', business: 86, competitorA: 78, competitorB: 80, competitorC: 76 }
      ],
      mentionsByTopic: [
        { topic: 'Espresso Quality', positive: 70, neutral: 20, negative: 10, total: 100 },
        { topic: 'Atmosphere', positive: 65, neutral: 25, negative: 10, total: 100 },
        { topic: 'Service', positive: 60, neutral: 30, negative: 10, total: 100 },
        { topic: 'Pastries', positive: 55, neutral: 35, negative: 10, total: 100 },
        { topic: 'Pricing', positive: 50, neutral: 30, negative: 20, total: 100 }
      ],
      trendingTopics: [
        { topic: 'Seasonal Drinks', increase: '+20%', sources: ['Google'], sentiment: 'positive' },
        { topic: 'Outdoor Seating', increase: '+12%', sources: ['Yelp'], sentiment: 'positive' },
        { topic: 'Wait Time', increase: '+15%', sources: ['Yelp'], sentiment: 'negative' }
      ],
      volumeOverTime: [
        { week: 'W1', volume: 30, platform: 'Google' },
        { week: 'W2', volume: 35, platform: 'Google' },
        { week: 'W3', volume: 32, platform: 'Yelp' },
        { week: 'W4', volume: 40, platform: 'Google' },
        { week: 'W5', volume: 38, platform: 'Yelp' },
        { week: 'W6', volume: 45, platform: 'Google' },
        { week: 'W7', volume: 42, platform: 'Google' },
        { week: 'W8', volume: 50, platform: 'Yelp' }
      ],
      competitorComparison: [
        { topic: 'Espresso Quality', you: 90, competitors: [80, 85, 78, 82], industryAvg: 82, comment: 'Your espresso is a local favorite.' },
        { topic: 'Atmosphere', you: 85, competitors: [80, 82, 79, 81], industryAvg: 81, comment: 'Atmosphere is a major draw for customers.' },
        { topic: 'Service', you: 80, competitors: [78, 80, 77, 79], industryAvg: 78, comment: 'Service is friendly and consistent.' },
        { topic: 'Pastries', you: 75, competitors: [70, 72, 68, 74], industryAvg: 72, comment: 'Pastries are well-liked, but room to innovate.' },
        { topic: 'Pricing', you: 70, competitors: [68, 72, 65, 69], industryAvg: 69, comment: 'Pricing is competitive for the area.' }
      ],
      marketGaps: [
        { gap: 'No mobile ordering', mentions: 12, suggestion: 'Implement a mobile app for pre-orders.' },
        { gap: 'Limited vegan options', mentions: 8, suggestion: 'Add more plant-based pastries.' }
      ],
      advancedMetrics: {
        trustScore: 82,
        repeatComplaints: 7,
        avgResolutionTime: '1.2 days',
        vocVelocity: '+5%'
      },
      suggestedActions: [
        'Launch a mobile ordering app',
        'Expand vegan pastry selection',
        'Offer loyalty rewards for frequent customers'
      ],
      vocDigest: {
        summary: 'Espresso quality and cozy atmosphere drive positive sentiment. Wait times are a pain point on weekends.',
        highlights: ['Espresso praised in 60% of reviews', 'Wait time complaints up 18%', 'Atmosphere draws new customers']
      }
    },
    hotel: {
      businessName: 'Grand Stay Hotel',
      businessUrl: 'https://grandstay.com',
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalReviews: 1342,
      topicCategories: ['Room Cleanliness', 'Check-in', 'Amenities', 'Breakfast', 'Location'],
      competitors: ['Hotel Luxe', 'Urban Inn', 'Seaside Suites', 'Skyline Hotel', 'Palace Resort'],
      competitorColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
      youColor: '#a855f7',
      industryColor: '#9CA3AF',
      dataSources: {
        current: [
          { name: 'Booking.com', status: 'active', reviews: 700, lastSync: '2 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ) },
          { name: 'TripAdvisor', status: 'active', reviews: 642, lastSync: '1 hour ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) }
        ],
        available: [
          { name: 'Expedia', price: 22, description: 'Travel reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          ) },
          { name: 'Google Reviews', price: 18, description: 'Hotel reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) }
        ]
      },
      executiveSummary: {
        sentimentChange: '+12%',
        volumeChange: '+18%',
        mostPraised: 'Room Cleanliness',
        topComplaint: 'Check-in',
        overview: 'Guests praise the cleanliness and amenities, but check-in delays are a recurring complaint.',
        alerts: [
          { type: 'warning', message: 'Check-in complaints up 10%', metric: 'Check-in' },
          { type: 'info', message: 'Breakfast buffet highly rated', metric: 'Breakfast' }
        ]
      },
      keyInsights: [
        { insight: 'Room cleanliness praised in 70% of reviews', direction: 'up', mentions: 200, platforms: ['Booking.com'], impact: 'high', reviews: [ { text: 'Rooms were spotless and fresh.', topic: 'Room Cleanliness', sentiment: 'positive' } ] },
        { insight: 'Check-in delays during weekends', direction: 'down', mentions: 60, platforms: ['TripAdvisor'], impact: 'medium', reviews: [ { text: 'Had to wait 30 minutes to check in.', topic: 'Check-in', sentiment: 'negative' } ] },
        { insight: 'Breakfast buffet is a highlight', direction: 'up', mentions: 90, platforms: ['Booking.com'], impact: 'medium', reviews: [ { text: 'Best hotel breakfast I have had.', topic: 'Breakfast', sentiment: 'positive' } ] }
      ],
      sentimentOverTime: [
        { month: 'Jan', business: 80, competitorA: 75, competitorB: 78, competitorC: 74 },
        { month: 'Feb', business: 82, competitorA: 77, competitorB: 79, competitorC: 76 },
        { month: 'Mar', business: 85, competitorA: 78, competitorB: 80, competitorC: 77 },
        { month: 'Apr', business: 84, competitorA: 79, competitorB: 81, competitorC: 78 },
        { month: 'May', business: 87, competitorA: 80, competitorB: 82, competitorC: 79 },
        { month: 'Jun', business: 89, competitorA: 81, competitorB: 83, competitorC: 80 }
      ],
      mentionsByTopic: [
        { topic: 'Room Cleanliness', positive: 75, neutral: 15, negative: 10, total: 100 },
        { topic: 'Check-in', positive: 50, neutral: 30, negative: 20, total: 100 },
        { topic: 'Amenities', positive: 70, neutral: 20, negative: 10, total: 100 },
        { topic: 'Breakfast', positive: 80, neutral: 10, negative: 10, total: 100 },
        { topic: 'Location', positive: 65, neutral: 25, negative: 10, total: 100 }
      ],
      trendingTopics: [
        { topic: 'Rooftop Bar', increase: '+18%', sources: ['TripAdvisor'], sentiment: 'positive' },
        { topic: 'Check-in', increase: '+10%', sources: ['Booking.com'], sentiment: 'negative' },
        { topic: 'Breakfast', increase: '+14%', sources: ['Booking.com'], sentiment: 'positive' }
      ],
      volumeOverTime: [
        { week: 'W1', volume: 50, platform: 'Booking.com' },
        { week: 'W2', volume: 55, platform: 'TripAdvisor' },
        { week: 'W3', volume: 52, platform: 'Booking.com' },
        { week: 'W4', volume: 60, platform: 'TripAdvisor' },
        { week: 'W5', volume: 58, platform: 'Booking.com' },
        { week: 'W6', volume: 65, platform: 'TripAdvisor' },
        { week: 'W7', volume: 62, platform: 'Booking.com' },
        { week: 'W8', volume: 70, platform: 'TripAdvisor' }
      ],
      competitorComparison: [
        { topic: 'Room Cleanliness', you: 92, competitors: [85, 88, 84, 87], industryAvg: 87, comment: 'Your rooms are the cleanest in the area.' },
        { topic: 'Check-in', you: 70, competitors: [75, 78, 74, 77], industryAvg: 75, comment: 'Check-in delays are a pain point.' },
        { topic: 'Amenities', you: 88, competitors: [80, 85, 82, 86], industryAvg: 83, comment: 'Amenities are a strong differentiator.' },
        { topic: 'Breakfast', you: 90, competitors: [85, 88, 84, 87], industryAvg: 86, comment: 'Breakfast buffet is a highlight.' },
        { topic: 'Location', you: 80, competitors: [78, 80, 77, 79], industryAvg: 78, comment: 'Location is convenient for most guests.' }
      ],
      marketGaps: [
        { gap: 'No mobile check-in', mentions: 15, suggestion: 'Implement mobile check-in to reduce wait times.' },
        { gap: 'Limited vegan breakfast options', mentions: 10, suggestion: 'Add more plant-based breakfast items.' }
      ],
      advancedMetrics: {
        trustScore: 88,
        repeatComplaints: 5,
        avgResolutionTime: '1.0 days',
        vocVelocity: '+7%'
      },
      suggestedActions: [
        'Launch mobile check-in feature',
        'Expand vegan breakfast options',
        'Promote rooftop bar in marketing'
      ],
      vocDigest: {
        summary: 'Room cleanliness and breakfast buffet drive positive sentiment. Check-in delays are a recurring issue.',
        highlights: ['Rooms praised in 70% of reviews', 'Check-in complaints up 10%', 'Breakfast buffet highly rated']
      }
    },
    restaurant: {
      businessName: 'The Tasty Table',
      businessUrl: 'https://tastytable.com',
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalReviews: 1105,
      topicCategories: ['Food Quality', 'Service', 'Ambience', 'Wait Time', 'Pricing'],
      competitors: ['Bistro 21', 'Urban Eats', 'Dine Fine', 'Fork & Spoon', 'Savory Spot'],
      competitorColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
      youColor: '#a855f7',
      industryColor: '#9CA3AF',
      dataSources: {
        current: [
          { name: 'Google Reviews', status: 'active', reviews: 600, lastSync: '2 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) },
          { name: 'Yelp', status: 'active', reviews: 505, lastSync: '1 hour ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ) }
        ],
        available: [
          { name: 'OpenTable', price: 16, description: 'Restaurant reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-4 4m4-4l4 4m-4 4v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4m6 0H8m6 0l4-4m-4 4l-4-4" />
            </svg>
          ) },
          { name: 'Facebook', price: 14, description: 'Social media reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ) }
        ]
      },
      executiveSummary: {
        sentimentChange: '+7%',
        volumeChange: '+12%',
        mostPraised: 'Food Quality',
        topComplaint: 'Wait Time',
        overview: 'Diners love the food and ambience, but long wait times are a recurring complaint.',
        alerts: [
          { type: 'warning', message: 'Wait time complaints up 15%', metric: 'Wait Time' },
          { type: 'info', message: 'Ambience praised for decor', metric: 'Ambience' }
        ]
      },
      keyInsights: [
        { insight: 'Food quality praised in 65% of reviews', direction: 'up', mentions: 150, platforms: ['Google'], impact: 'high', reviews: [ { text: 'Best steak I have had!', topic: 'Food Quality', sentiment: 'positive' } ] },
        { insight: 'Wait time complaints up on weekends', direction: 'down', mentions: 50, platforms: ['Yelp'], impact: 'medium', reviews: [ { text: 'Waited 30 minutes for a table.', topic: 'Wait Time', sentiment: 'negative' } ] },
        { insight: 'Ambience is a major draw', direction: 'up', mentions: 90, platforms: ['Google'], impact: 'medium', reviews: [ { text: 'Beautiful decor and lighting.', topic: 'Ambience', sentiment: 'positive' } ] }
      ],
      sentimentOverTime: [
        { month: 'Jan', business: 75, competitorA: 70, competitorB: 73, competitorC: 68 },
        { month: 'Feb', business: 77, competitorA: 72, competitorB: 75, competitorC: 70 },
        { month: 'Mar', business: 79, competitorA: 73, competitorB: 76, competitorC: 71 },
        { month: 'Apr', business: 78, competitorA: 74, competitorB: 77, competitorC: 72 },
        { month: 'May', business: 81, competitorA: 75, competitorB: 78, competitorC: 73 },
        { month: 'Jun', business: 83, competitorA: 76, competitorB: 79, competitorC: 74 }
      ],
      mentionsByTopic: [
        { topic: 'Food Quality', positive: 72, neutral: 18, negative: 10, total: 100 },
        { topic: 'Service', positive: 65, neutral: 25, negative: 10, total: 100 },
        { topic: 'Ambience', positive: 68, neutral: 22, negative: 10, total: 100 },
        { topic: 'Wait Time', positive: 40, neutral: 30, negative: 30, total: 100 },
        { topic: 'Pricing', positive: 55, neutral: 30, negative: 15, total: 100 }
      ],
      trendingTopics: [
        { topic: 'Outdoor Seating', increase: '+15%', sources: ['Yelp'], sentiment: 'positive' },
        { topic: 'Wait Time', increase: '+12%', sources: ['Google'], sentiment: 'negative' },
        { topic: 'Ambience', increase: '+10%', sources: ['Google'], sentiment: 'positive' }
      ],
      volumeOverTime: [
        { week: 'W1', volume: 40, platform: 'Google' },
        { week: 'W2', volume: 45, platform: 'Yelp' },
        { week: 'W3', volume: 42, platform: 'Google' },
        { week: 'W4', volume: 50, platform: 'Yelp' },
        { week: 'W5', volume: 48, platform: 'Google' },
        { week: 'W6', volume: 55, platform: 'Yelp' },
        { week: 'W7', volume: 52, platform: 'Google' },
        { week: 'W8', volume: 60, platform: 'Yelp' }
      ],
      competitorComparison: [
        { topic: 'Food Quality', you: 88, competitors: [80, 85, 78, 82], industryAvg: 83, comment: 'Your food quality is a major differentiator.' },
        { topic: 'Service', you: 80, competitors: [78, 80, 77, 79], industryAvg: 78, comment: 'Service is friendly and consistent.' },
        { topic: 'Ambience', you: 85, competitors: [80, 82, 79, 81], industryAvg: 81, comment: 'Ambience is a major draw for diners.' },
        { topic: 'Wait Time', you: 60, competitors: [68, 72, 65, 69], industryAvg: 69, comment: 'Wait times are a pain point.' },
        { topic: 'Pricing', you: 70, competitors: [68, 72, 65, 69], industryAvg: 69, comment: 'Pricing is competitive for the area.' }
      ],
      marketGaps: [
        { gap: 'No online reservations', mentions: 10, suggestion: 'Implement online reservation system.' },
        { gap: 'Limited gluten-free options', mentions: 7, suggestion: 'Add more gluten-free menu items.' }
      ],
      advancedMetrics: {
        trustScore: 80,
        repeatComplaints: 8,
        avgResolutionTime: '1.5 days',
        vocVelocity: '+6%'
      },
      suggestedActions: [
        'Launch online reservation system',
        'Expand gluten-free menu',
        'Promote outdoor seating in marketing'
      ],
      vocDigest: {
        summary: 'Food quality and ambience drive positive sentiment. Wait times are a recurring issue.',
        highlights: ['Food praised in 65% of reviews', 'Wait time complaints up 15%', 'Ambience draws new customers']
      }
    },
    saas: {
      businessName: 'Acme Corp',
      businessUrl: 'https://acme.com',
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalReviews: 1247,
      topicCategories: ['Support', 'UX', 'Pricing', 'Features', 'Integrations'],
      competitors: ['Comp A', 'Comp B', 'Comp C', 'Comp D', 'Comp E'],
      competitorColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
      youColor: '#a855f7',
      industryColor: '#9CA3AF',
      dataSources: {
        current: [
          { name: 'G2', status: 'active', reviews: 450, lastSync: '2 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) },
          { name: 'Capterra', status: 'active', reviews: 380, lastSync: '1 hour ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ) }
        ],
        available: [
          { name: 'Trustpilot', price: 20, description: 'Business reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ) },
          { name: 'Reddit', price: 15, description: 'Community discussions', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          ) }
        ]
      },
      executiveSummary: {
        sentimentChange: '+14%',
        volumeChange: '+22%',
        mostPraised: 'Shipping speed',
        topComplaint: 'Return policy',
        overview: 'Customer sentiment has improved significantly this quarter, with shipping speed being the most praised aspect. However, return policy complaints remain a concern that needs immediate attention.',
        alerts: [
          { type: 'warning', message: 'Return complaints increased 25% this month', metric: 'Returns' },
          { type: 'info', message: 'Support response time improved 40%', metric: 'Support' }
        ]
      },
      keyInsights: [
        { insight: 'Returns complaints rose 25% this quarter', direction: 'down', mentions: 89, platforms: ['Google'], impact: 'high', reviews: [ { text: 'The return process is too complicated and takes forever', topic: 'Returns', sentiment: 'negative' }, { text: 'Had to wait 3 weeks for my refund, unacceptable', topic: 'Returns', sentiment: 'negative' }, { text: 'Return policy needs to be simplified', topic: 'Returns', sentiment: 'negative' } ] },
        { insight: 'Support response time praised after April improvements', direction: 'up', mentions: 67, platforms: ['Reddit'], impact: 'medium', reviews: [ { text: 'Customer service team responded within 2 hours, amazing!', topic: 'Support', sentiment: 'positive' }, { text: 'Support was very helpful and quick to resolve my issue', topic: 'Support', sentiment: 'positive' }, { text: 'Great improvement in response times', topic: 'Support', sentiment: 'positive' } ] },
        { insight: 'Pricing frequently compared to Competitor A', direction: 'neutral', mentions: 45, platforms: ['Reddit'], impact: 'medium', reviews: [ { text: 'Prices are reasonable compared to Competitor A', topic: 'Pricing', sentiment: 'neutral' }, { text: 'Good value for money, better than alternatives', topic: 'Pricing', sentiment: 'positive' }, { text: 'Pricing is competitive in the market', topic: 'Pricing', sentiment: 'neutral' } ] },
        { insight: 'Mobile app features highly requested', direction: 'up', mentions: 123, platforms: ['Google Play'], impact: 'high', reviews: [ { text: 'Love the new mobile app features, much better now!', topic: 'Mobile App', sentiment: 'positive' }, { text: 'The mobile app is fantastic and easy to use', topic: 'Mobile App', sentiment: 'positive' }, { text: 'Mobile app improvements are exactly what I needed', topic: 'Mobile App', sentiment: 'positive' } ] }
      ],
      sentimentOverTime: [
        { month: 'Jan', business: 72, competitorA: 68, competitorB: 70, competitorC: 65 },
        { month: 'Feb', business: 75, competitorA: 69, competitorB: 71, competitorC: 66 },
        { month: 'Mar', business: 78, competitorA: 70, competitorB: 72, competitorC: 67 },
        { month: 'Apr', business: 76, competitorA: 71, competitorB: 73, competitorC: 68 },
        { month: 'May', business: 79, competitorA: 72, competitorB: 74, competitorC: 69 },
        { month: 'Jun', business: 81, competitorA: 73, competitorB: 75, competitorC: 70 }
      ],
      mentionsByTopic: [
        { topic: 'Support', positive: 65, neutral: 20, negative: 15, total: 100 },
        { topic: 'UX', positive: 78, neutral: 15, negative: 7, total: 100 },
        { topic: 'Returns', positive: 45, neutral: 25, negative: 30, total: 100 },
        { topic: 'Pricing', positive: 55, neutral: 30, negative: 15, total: 100 },
        { topic: 'Shipping', positive: 85, neutral: 10, negative: 5, total: 100 }
      ],
      trendingTopics: [
        { topic: 'Mobile App', increase: '+15%', sources: ['Google Play'], sentiment: 'positive' },
        { topic: 'Customer Service', increase: '+8%', sources: ['Reddit'], sentiment: 'positive' },
        { topic: 'Return Process', increase: '+25%', sources: ['Google'], sentiment: 'negative' },
        { topic: 'Pricing', increase: '+5%', sources: ['Reddit'], sentiment: 'neutral' },
        { topic: 'Shipping Speed', increase: '+12%', sources: ['Google'], sentiment: 'positive' }
      ],
      volumeOverTime: [
        { week: 'W1', volume: 45, platform: 'Google' },
        { week: 'W2', volume: 52, platform: 'Google' },
        { week: 'W3', volume: 48, platform: 'Google' },
        { week: 'W4', volume: 67, platform: 'Google' },
        { week: 'W5', volume: 58, platform: 'Google' },
        { week: 'W6', volume: 73, platform: 'Google' },
        { week: 'W7', volume: 62, platform: 'Google' },
        { week: 'W8', volume: 89, platform: 'Google' }
      ],
      competitorComparison: [
        { topic: 'Shipping', you: 85, competitors: [72, 78, 65, 70, 74], industryAvg: 71, comment: "You're winning on Quality — by a mile." },
        { topic: 'Customer Service', you: 78, competitors: [65, 82, 58, 75, 69], industryAvg: 70, comment: "Customers mention slow delivery 2x more often with Comp A." },
        { topic: 'Delivery', you: 68, competitors: [82, 71, 88, 69, 73], industryAvg: 77, comment: "Comp C leads in delivery speed." },
        { topic: 'Pricing', you: 72, competitors: [75, 68, 80, 73, 70], industryAvg: 74, comment: "Pricing is competitive across the board." },
        { topic: 'Returns', you: 88, competitors: [70, 85, 62, 78, 80], industryAvg: 74, comment: "Your return process is superior." }
      ],
      marketGaps: [
        { gap: 'No loyalty program', mentions: 23, suggestion: 'Implement tiered rewards system' },
        { gap: 'Lack of same-day shipping', mentions: 18, suggestion: 'Partner with local delivery services' },
        { gap: 'No HubSpot integration', mentions: 15, suggestion: 'Add CRM integration options' },
        { gap: 'Limited payment options', mentions: 10, suggestion: 'Add Apple Pay, PayPal' }
      ],
      advancedMetrics: {
        trustScore: 78,
        repeatComplaints: 12,
        avgResolutionTime: '2.3 days',
        vocVelocity: '+8%'
      },
      suggestedActions: [
        'Improve return policy UX with clearer instructions',
        'Add live chat support to pricing page',
        'Implement mobile app feature requests',
        'Create loyalty program to reduce churn'
      ],
      vocDigest: {
        summary: 'This month: Support improved 12%, Shipping flagged for delays, Competitor A gained 8% sentiment.',
        highlights: ['Support team response time down 40%', 'Mobile app requests up 25%', 'Return complaints stable']
      }
    },
    gambling: {
      businessName: 'Lucky Spin Online',
      businessUrl: 'https://luckyspin.com',
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalReviews: 2104,
      topicCategories: ['Deposit', 'Bonus', 'Withdraw', 'Casino', 'Sportsbook', 'Poker'],
      competitors: ['Spin Palace', 'Jackpot City', 'BetZone', 'Casino Royale', 'WinBig'],
      competitorColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
      youColor: '#a855f7',
      industryColor: '#9CA3AF',
      dataSources: {
        current: [
          { name: 'Trustpilot', status: 'active', reviews: 1200, lastSync: '3 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ) },
          { name: 'Reddit', status: 'active', reviews: 600, lastSync: '2 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          ) },
          { name: 'X (Twitter)', status: 'active', reviews: 304, lastSync: '1 hour ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ) }
        ],
        available: [
          { name: 'Casino.org', price: 25, description: 'Casino reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
            </svg>
          ) },
          { name: 'Google Reviews', price: 18, description: 'General reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) }
        ]
      },
      executiveSummary: {
        sentimentChange: '+6%',
        volumeChange: '+10%',
        mostPraised: 'Bonus',
        topComplaint: 'Withdraw',
        overview: 'Players love the generous bonuses and casino variety, but slow withdrawal times are a recurring complaint.',
        alerts: [
          { type: 'warning', message: 'Withdrawal complaints up 12%', metric: 'Withdraw' },
          { type: 'info', message: 'Bonus system highly praised', metric: 'Bonus' }
        ]
      },
      keyInsights: [
        { insight: 'Bonus system praised in 65% of reviews', direction: 'up', mentions: 400, platforms: ['Trustpilot'], impact: 'high', reviews: [ { text: 'Best bonuses online!', topic: 'Bonus', sentiment: 'positive' } ] },
        { insight: 'Withdrawal delays during weekends', direction: 'down', mentions: 180, platforms: ['Reddit'], impact: 'medium', reviews: [ { text: 'Waited 5 days for my withdrawal.', topic: 'Withdraw', sentiment: 'negative' } ] },
        { insight: 'Casino games variety is a major draw', direction: 'up', mentions: 250, platforms: ['X'], impact: 'medium', reviews: [ { text: 'Amazing selection of slots and table games!', topic: 'Casino', sentiment: 'positive' } ] }
      ],
      sentimentOverTime: [
        { month: 'Jan', business: 70, competitorA: 65, competitorB: 68, competitorC: 63 },
        { month: 'Feb', business: 72, competitorA: 67, competitorB: 69, competitorC: 65 },
        { month: 'Mar', business: 74, competitorA: 68, competitorB: 70, competitorC: 66 },
        { month: 'Apr', business: 73, competitorA: 69, competitorB: 71, competitorC: 67 },
        { month: 'May', business: 76, competitorA: 70, competitorB: 72, competitorC: 68 },
        { month: 'Jun', business: 78, competitorA: 71, competitorB: 73, competitorC: 69 }
      ],
      mentionsByTopic: [
        { topic: 'Deposit', positive: 75, neutral: 20, negative: 5, total: 100 },
        { topic: 'Bonus', positive: 80, neutral: 15, negative: 5, total: 100 },
        { topic: 'Withdraw', positive: 45, neutral: 25, negative: 30, total: 100 },
        { topic: 'Casino', positive: 70, neutral: 20, negative: 10, total: 100 },
        { topic: 'Sportsbook', positive: 65, neutral: 25, negative: 10, total: 100 },
        { topic: 'Poker', positive: 60, neutral: 30, negative: 10, total: 100 }
      ],
      trendingTopics: [
        { topic: 'New Slots', increase: '+18%', sources: ['Trustpilot'], sentiment: 'positive' },
        { topic: 'Withdrawal Speed', increase: '+12%', sources: ['Reddit'], sentiment: 'negative' },
        { topic: 'Welcome Bonus', increase: '+15%', sources: ['X'], sentiment: 'positive' }
      ],
      volumeOverTime: [
        { week: 'W1', volume: 60, platform: 'Trustpilot' },
        { week: 'W2', volume: 65, platform: 'Reddit' },
        { week: 'W3', volume: 62, platform: 'X' },
        { week: 'W4', volume: 70, platform: 'Trustpilot' },
        { week: 'W5', volume: 68, platform: 'Reddit' },
        { week: 'W6', volume: 75, platform: 'X' },
        { week: 'W7', volume: 72, platform: 'Trustpilot' },
        { week: 'W8', volume: 80, platform: 'Reddit' }
      ],
      competitorComparison: [
        { topic: 'Deposit', you: 85, competitors: [80, 82, 78, 81], industryAvg: 81, comment: 'Your deposit process is fast and reliable.' },
        { topic: 'Bonus', you: 90, competitors: [80, 85, 78, 82], industryAvg: 83, comment: 'Your bonus system is a major differentiator.' },
        { topic: 'Withdraw', you: 60, competitors: [68, 72, 65, 69], industryAvg: 69, comment: 'Withdrawal speed is a pain point.' },
        { topic: 'Casino', you: 85, competitors: [80, 82, 79, 81], industryAvg: 81, comment: 'Casino variety is a major draw for players.' },
        { topic: 'Sportsbook', you: 75, competitors: [78, 80, 77, 79], industryAvg: 78, comment: 'Sportsbook is competitive for the area.' },
        { topic: 'Poker', you: 70, competitors: [68, 72, 65, 69], industryAvg: 69, comment: 'Poker room has room for improvement.' }
      ],
      marketGaps: [
        { gap: 'No live chat support', mentions: 18, suggestion: 'Implement live chat for faster support.' },
        { gap: 'Limited payment options', mentions: 12, suggestion: 'Add more payment methods.' }
      ],
      advancedMetrics: {
        trustScore: 75,
        repeatComplaints: 10,
        avgResolutionTime: '2.0 days',
        vocVelocity: '+4%'
      },
      suggestedActions: [
        'Improve withdrawal processing speed',
        'Add live chat support',
        'Expand payment options'
      ],
      vocDigest: {
        summary: 'Bonus system and casino variety drive positive sentiment. Withdrawal speed is a recurring issue.',
        highlights: ['Bonus praised in 65% of reviews', 'Withdrawal complaints up 12%', 'Casino variety highly rated']
      }
    },
    ecommerce: {
      businessName: 'Shoply Online',
      businessUrl: 'https://shoply.com',
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalReviews: 3200,
      topicCategories: ['Shipping', 'Returns', 'Product Quality', 'Customer Service', 'Pricing', 'Website UX'],
      competitors: ['MegaMart', 'QuickCart', 'BuyNow', 'Shopster', 'Dealz'],
      competitorColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
      youColor: '#a855f7',
      industryColor: '#9CA3AF',
      dataSources: {
        current: [
          { name: 'Trustpilot', status: 'active', reviews: 1800, lastSync: '2 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          ) },
          { name: 'Google Reviews', status: 'active', reviews: 900, lastSync: '1 hour ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          ) },
          { name: 'Reddit', status: 'active', reviews: 500, lastSync: '3 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
          ) }
        ],
        available: [
          { name: 'Facebook', price: 14, description: 'Social media reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          ) }
        ]
      },
      executiveSummary: {
        sentimentChange: '+8%',
        volumeChange: '+12%',
        mostPraised: 'Shipping',
        topComplaint: 'Returns',
        overview: 'Customers love fast shipping, but returns process is a pain point. Product quality is a growing strength.',
        alerts: [
          { type: 'warning', message: 'Return complaints up 15%', metric: 'Returns' },
          { type: 'info', message: 'Shipping praised for speed', metric: 'Shipping' }
        ]
      },
      keyInsights: [
        { insight: 'Shipping speed praised in 70% of reviews', direction: 'up', mentions: 300, platforms: ['Trustpilot'], impact: 'high', reviews: [ { text: 'Got my order in 1 day!', topic: 'Shipping', sentiment: 'positive' } ] },
        { insight: 'Returns process is a pain point', direction: 'down', mentions: 120, platforms: ['Google'], impact: 'medium', reviews: [ { text: 'Returns took too long.', topic: 'Returns', sentiment: 'negative' } ] },
        { insight: 'Product quality is improving', direction: 'up', mentions: 200, platforms: ['Reddit'], impact: 'medium', reviews: [ { text: 'Quality is much better than last year.', topic: 'Product Quality', sentiment: 'positive' } ] }
      ],
      sentimentOverTime: [
        { month: 'Jan', business: 75, competitorA: 70, competitorB: 72, competitorC: 68 },
        { month: 'Feb', business: 77, competitorA: 72, competitorB: 73, competitorC: 70 },
        { month: 'Mar', business: 79, competitorA: 73, competitorB: 74, competitorC: 71 },
        { month: 'Apr', business: 78, competitorA: 74, competitorB: 75, competitorC: 72 },
        { month: 'May', business: 81, competitorA: 75, competitorB: 76, competitorC: 73 },
        { month: 'Jun', business: 83, competitorA: 76, competitorB: 77, competitorC: 74 }
      ],
      mentionsByTopic: [
        { topic: 'Shipping', positive: 80, neutral: 15, negative: 5, total: 100 },
        { topic: 'Returns', positive: 40, neutral: 30, negative: 30, total: 100 },
        { topic: 'Product Quality', positive: 70, neutral: 20, negative: 10, total: 100 },
        { topic: 'Customer Service', positive: 60, neutral: 25, negative: 15, total: 100 },
        { topic: 'Pricing', positive: 55, neutral: 30, negative: 15, total: 100 },
        { topic: 'Website UX', positive: 65, neutral: 25, negative: 10, total: 100 }
      ],
      trendingTopics: [
        { topic: 'Express Shipping', increase: '+22%', sources: ['Trustpilot'], sentiment: 'positive' },
        { topic: 'Return Policy', increase: '+15%', sources: ['Google'], sentiment: 'negative' },
        { topic: 'Mobile App', increase: '+10%', sources: ['Reddit'], sentiment: 'positive' }
      ],
      volumeOverTime: [
        { week: 'W1', volume: 80, platform: 'Trustpilot' },
        { week: 'W2', volume: 85, platform: 'Google' },
        { week: 'W3', volume: 82, platform: 'Reddit' },
        { week: 'W4', volume: 90, platform: 'Trustpilot' },
        { week: 'W5', volume: 88, platform: 'Google' },
        { week: 'W6', volume: 95, platform: 'Reddit' },
        { week: 'W7', volume: 92, platform: 'Trustpilot' },
        { week: 'W8', volume: 100, platform: 'Google' }
      ],
      competitorComparison: [
        { topic: 'Shipping', you: 92, competitors: [85, 88, 84, 87], industryAvg: 87, comment: 'Your shipping is the fastest in the segment.' },
        { topic: 'Returns', you: 60, competitors: [75, 78, 74, 77], industryAvg: 75, comment: 'Returns process is a pain point.' },
        { topic: 'Product Quality', you: 88, competitors: [80, 85, 82, 86], industryAvg: 83, comment: 'Product quality is a strong differentiator.' },
        { topic: 'Customer Service', you: 80, competitors: [85, 88, 84, 87], industryAvg: 86, comment: 'Customer service is competitive.' },
        { topic: 'Pricing', you: 70, competitors: [78, 80, 77, 79], industryAvg: 78, comment: 'Pricing is competitive for the area.' },
        { topic: 'Website UX', you: 85, competitors: [80, 82, 79, 81], industryAvg: 81, comment: 'Website UX is a major draw for customers.' }
      ],
      marketGaps: [
        { gap: 'No live chat support', mentions: 18, suggestion: 'Implement live chat for faster support.' },
        { gap: 'Limited payment options', mentions: 12, suggestion: 'Add more payment methods.' }
      ],
      advancedMetrics: {
        trustScore: 90,
        repeatComplaints: 6,
        avgResolutionTime: '1.1 days',
        vocVelocity: '+6%'
      },
      suggestedActions: [
        'Improve returns process',
        'Add live chat support',
        'Expand payment options'
      ],
      vocDigest: {
        summary: 'Shipping speed and product quality drive positive sentiment. Returns process is a recurring issue.',
        highlights: ['Shipping praised in 70% of reviews', 'Return complaints up 15%', 'Product quality highly rated']
      }
    },
    telco: {
      businessName: 'ConnectTel',
      businessUrl: 'https://connecttel.com',
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalReviews: 4100,
      topicCategories: ['Network Coverage', 'Customer Service', 'Pricing', 'Data Speed', 'Billing', 'Device Support'],
      competitors: ['TeleMax', 'GlobalCom', 'NetLink', 'SignalPro', 'WaveTel'],
      competitorColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
      youColor: '#a855f7',
      industryColor: '#9CA3AF',
      dataSources: {
        current: [
          { name: 'Trustpilot', status: 'active', reviews: 2000, lastSync: '2 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          ) },
          { name: 'Google Reviews', status: 'active', reviews: 1200, lastSync: '1 hour ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          ) },
          { name: 'Reddit', status: 'active', reviews: 900, lastSync: '3 hours ago', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
          ) }
        ],
        available: [
          { name: 'Facebook', price: 14, description: 'Social media reviews', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          ) }
        ]
      },
      executiveSummary: {
        sentimentChange: '+5%',
        volumeChange: '+9%',
        mostPraised: 'Network Coverage',
        topComplaint: 'Billing',
        overview: 'Network coverage is a major strength, but billing issues are a recurring complaint. Data speed is improving.',
        alerts: [
          { type: 'warning', message: 'Billing complaints up 10%', metric: 'Billing' },
          { type: 'info', message: 'Network coverage praised', metric: 'Network Coverage' }
        ]
      },
      keyInsights: [
        { insight: 'Network coverage praised in 75% of reviews', direction: 'up', mentions: 400, platforms: ['Trustpilot'], impact: 'high', reviews: [ { text: 'Great coverage even in rural areas.', topic: 'Network Coverage', sentiment: 'positive' } ] },
        { insight: 'Billing issues are a pain point', direction: 'down', mentions: 180, platforms: ['Google'], impact: 'medium', reviews: [ { text: 'Billing errors every month.', topic: 'Billing', sentiment: 'negative' } ] },
        { insight: 'Data speed is improving', direction: 'up', mentions: 250, platforms: ['Reddit'], impact: 'medium', reviews: [ { text: 'Much faster data speeds lately.', topic: 'Data Speed', sentiment: 'positive' } ] }
      ],
      sentimentOverTime: [
        { month: 'Jan', business: 70, competitorA: 65, competitorB: 68, competitorC: 63 },
        { month: 'Feb', business: 72, competitorA: 67, competitorB: 69, competitorC: 65 },
        { month: 'Mar', business: 74, competitorA: 68, competitorB: 70, competitorC: 66 },
        { month: 'Apr', business: 73, competitorA: 69, competitorB: 71, competitorC: 67 },
        { month: 'May', business: 76, competitorA: 70, competitorB: 72, competitorC: 68 },
        { month: 'Jun', business: 78, competitorA: 71, competitorB: 73, competitorC: 69 }
      ],
      mentionsByTopic: [
        { topic: 'Network Coverage', positive: 85, neutral: 10, negative: 5, total: 100 },
        { topic: 'Customer Service', positive: 60, neutral: 25, negative: 15, total: 100 },
        { topic: 'Pricing', positive: 55, neutral: 30, negative: 15, total: 100 },
        { topic: 'Data Speed', positive: 70, neutral: 20, negative: 10, total: 100 },
        { topic: 'Billing', positive: 40, neutral: 30, negative: 30, total: 100 },
        { topic: 'Device Support', positive: 65, neutral: 25, negative: 10, total: 100 }
      ],
      trendingTopics: [
        { topic: '5G Rollout', increase: '+18%', sources: ['Trustpilot'], sentiment: 'positive' },
        { topic: 'Billing Errors', increase: '+12%', sources: ['Google'], sentiment: 'negative' },
        { topic: 'Unlimited Data', increase: '+15%', sources: ['Reddit'], sentiment: 'positive' }
      ],
      volumeOverTime: [
        { week: 'W1', volume: 100, platform: 'Trustpilot' },
        { week: 'W2', volume: 105, platform: 'Google' },
        { week: 'W3', volume: 102, platform: 'Reddit' },
        { week: 'W4', volume: 110, platform: 'Trustpilot' },
        { week: 'W5', volume: 108, platform: 'Google' },
        { week: 'W6', volume: 115, platform: 'Reddit' },
        { week: 'W7', volume: 112, platform: 'Trustpilot' },
        { week: 'W8', volume: 120, platform: 'Google' }
      ],
      competitorComparison: [
        { topic: 'Network Coverage', you: 95, competitors: [85, 88, 84, 87], industryAvg: 87, comment: 'Your network coverage is the best in the segment.' },
        { topic: 'Customer Service', you: 70, competitors: [75, 78, 74, 77], industryAvg: 75, comment: 'Customer service is a pain point.' },
        { topic: 'Pricing', you: 60, competitors: [80, 85, 82, 86], industryAvg: 83, comment: 'Pricing is a challenge.' },
        { topic: 'Data Speed', you: 88, competitors: [80, 85, 82, 86], industryAvg: 83, comment: 'Data speed is a strong differentiator.' },
        { topic: 'Billing', you: 55, competitors: [78, 80, 77, 79], industryAvg: 78, comment: 'Billing is a recurring issue.' },
        { topic: 'Device Support', you: 85, competitors: [80, 82, 79, 81], industryAvg: 81, comment: 'Device support is a major draw for customers.' }
      ],
      marketGaps: [
        { gap: 'No eSIM support', mentions: 18, suggestion: 'Implement eSIM for easier device switching.' },
        { gap: 'Limited international roaming', mentions: 12, suggestion: 'Expand roaming agreements.' }
      ],
      advancedMetrics: {
        trustScore: 80,
        repeatComplaints: 9,
        avgResolutionTime: '1.5 days',
        vocVelocity: '+5%'
      },
      suggestedActions: [
        'Improve billing process',
        'Expand eSIM support',
        'Enhance international roaming'
      ],
      vocDigest: {
        summary: 'Network coverage and data speed drive positive sentiment. Billing is a recurring issue.',
        highlights: ['Coverage praised in 75% of reviews', 'Billing complaints up 10%', 'Data speed highly rated']
      }
    }
  };

  // Use the selected company's data for the report
  const reportData = demoData[selectedCompany];
  const competitorNames = reportData.competitors;
  const competitorColors = reportData.competitorColors;
  const youColor = reportData.youColor;
  const industryColor = reportData.industryColor;

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedMentions, setSelectedMentions] = useState<string | null>(null)
  const [showAddSource, setShowAddSource] = useState(false)
  const [showShareDropdown, setShowShareDropdown] = useState(false)
  // Add toggle state
  const [comparisonView, setComparisonView] = useState<'bar' | 'table'>('bar');

  const [presentMode, setPresentMode] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const audioRef = useRef(null);
  const scrollCooldown = useRef({});

  // Section map
  const sectionMap = [
    { time: 2, id: 'sources-section' },
    { time: 8, id: 'executive-summary' },
    { time: 16, id: 'key-insights' },
    { time: 24, id: 'sentiment-chart' },
    { time: 32, id: 'mentions-topic' },
    { time: 40, id: 'trending-topics' },
    { time: 48, id: 'volume-over-time' },
    { time: 55, id: 'competitor-summary' },
    { time: 65, id: 'share-of-voice' },
    { time: 70, id: 'category-comparison' },
    { time: 82, id: 'market-gaps' },
    { time: 88, id: 'advanced-metrics' },
    { time: 94, id: 'suggested-actions' },
    { time: 99, id: 'digest' }
  ];

  // Preload audio
  useEffect(() => {
    if (presentMode && audioRef.current) {
      setAudioLoading(true);
      const audio = audioRef.current;
      const onCanPlay = () => {
        setAudioLoading(false);
        setAudioReady(true);
      };
      audio.addEventListener('canplaythrough', onCanPlay, { once: true });
      audio.load();
      return () => audio.removeEventListener('canplaythrough', onCanPlay);
    }
  }, [presentMode]);

  // Scroll logic
  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;
    const audio = audioRef.current;
    let lastSection = null;
    const onTimeUpdate = () => {
      const current = audio.currentTime;
      let found = null;
      for (let i = sectionMap.length - 1; i >= 0; i--) {
        if (current >= sectionMap[i].time) {
          found = sectionMap[i];
          break;
        }
      }
      if (found && lastSection !== found.id && !scrollCooldown.current[found.id]) {
        const el = document.getElementById(found.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setActiveSection(found.id);
          scrollCooldown.current[found.id] = true;
          setTimeout(() => { scrollCooldown.current[found.id] = false; }, 2000);
        }
        lastSection = found.id;
      }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [isPlaying]);

  // Present button handler
  const handlePresent = () => {
    setPresentMode(true);
    setAudioLoading(true);
    setAudioReady(false);
    setPaused(false);
    setStopped(false);
    setActiveSection(null);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 500);
  };
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPaused(true);
      setIsPlaying(false);
    }
  };
  const handleResume = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPaused(false);
      setIsPlaying(true);
    }
  };
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setStopped(true);
      setIsPlaying(false);
      setPresentMode(false);
      setActiveSection(null);
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-yellow-400" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
            />
          ))}
        </div>
        <span className="text-sm text-gray-300 ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117]/80 text-[#f3f4f6] font-sans relative overflow-x-hidden">
      <audio ref={audioRef} src="/assets/coffee-case-study.mp3" preload="auto" hidden />
      {/* Enhanced Background - Matching Landing Page */}
      <div className="fixed inset-0 -z-10">
        {/* Radial gradient/vignette for depth */}
        <div className="absolute inset-0 bg-[#0f1117]" />
        <div className="absolute inset-0 bg-gradient-radial" />
        {/* More visible animated flowing gradient */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
        {/* One major glow per quadrant, harmonized indigo-aqua */}
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/20 to-transparent blur-2xl opacity-30" />
        {/* Top Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
      </div>
      {/* Header - Matching Landing Page Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#1c1e26]/50 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="Execli" className="h-7 w-auto py-1" />
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-lg font-semibold text-white">VOC Report</h1>
              <p className="text-sm text-[#B0B0C0]">{reportData.businessName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 relative">
            {/* Share Button with Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] text-[#B0B0C0] hover:text-white"
                onClick={() => setShowShareDropdown((v) => !v)}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              {showShareDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1c1e26]/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50">
                  <button className="w-full flex items-center px-4 py-3 hover:bg-white/10 transition-colors text-left text-[#B0B0C0] hover:text-white" onClick={() => {/* handle copy link */}}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
                    Copy Link
                  </button>
                  <button className="w-full flex items-center px-4 py-3 hover:bg-white/10 transition-colors text-left text-[#B0B0C0] hover:text-white" onClick={() => {/* handle PDF */}}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                    Download PDF
                  </button>
                  <button className="w-full flex items-center px-4 py-3 hover:bg-white/10 transition-colors text-left text-[#B0B0C0] hover:text-white" onClick={() => {/* handle Slack */}}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                    Connect with Slack
                  </button>
                </div>
              )}
            </div>
            {/* Present Button */}
            {!presentMode && (
              <button 
                onClick={handlePresent}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 text-black rounded-full transition-all duration-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] hover:bg-white/90 font-medium"
              >
                <Wand2 className="w-4 h-4" />
                <span>Present</span>
              </button>
            )}
            {presentMode && (
              <>
                {audioLoading && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#181a20] text-white rounded-full shadow-lg">
                    <svg className="animate-spin w-5 h-5 text-[#a855f7]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="#a855f7" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    Loading audio...
                  </div>
                )}
                {audioReady && !isPlaying && !paused && !stopped && (
                  <button onClick={handlePresent} className="px-6 py-2 rounded-full bg-white text-black font-semibold shadow-lg hover:bg-gray-200 transition-all">Start Presentation</button>
                )}
                {isPlaying && (
                  <button onClick={handlePause} className="px-6 py-2 rounded-full bg-[#a855f7] text-white font-semibold shadow-lg hover:bg-[#8b5cf6] transition-all">Pause</button>
                )}
                {paused && (
                  <button onClick={handleResume} className="px-6 py-2 rounded-full bg-[#a855f7] text-white font-semibold shadow-lg hover:bg-[#8b5cf6] transition-all">Resume</button>
                )}
                {(isPlaying || paused) && (
                  <button onClick={handleStop} className="px-6 py-2 rounded-full bg-[#23263a] text-white font-semibold shadow-lg hover:bg-[#181a20] transition-all">Stop</button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Industry Toggle Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {companies.map((company) => (
            <button
              key={company.key}
              onClick={() => setSelectedCompany(company.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-base transition-all duration-200 border shadow-sm
                ${selectedCompany === company.key
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-[#181a20]/70 text-[#B0B0C0] border-white/10 hover:bg-[#23263a] hover:text-white'}
              `}
              style={{ minWidth: 160 }}
            >
              <span className="text-xl">{company.icon}</span>
              <span>{company.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Report Info */}
        <div className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Voice of Customer Report</h2>
                <p className="text-[#B0B0C0] mt-2">Generated on {reportData.generatedAt}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">{reportData.businessName}</p>
                  <p className="text-sm text-[#B0B0C0]">{reportData.businessUrl}</p>
                </div>
              </div>
            </div>
            
            {/* Active Sources */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Active Sources</h3>
                <button 
                  onClick={() => setShowAddSource(!showAddSource)}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 text-[#B0B0C0] hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Source</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportData.dataSources.current.map((source, index) => (
                  <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{source.icon}</span>
                        <div>
                          <h5 className="font-semibold text-white">{source.name}</h5>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-[#B0B0C0]">{source.status}</span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#B0B0C0]" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#B0B0C0]">{source.reviews} reviews</span>
                      <span className="text-[#B0B0C0]">Last sync: {source.lastSync}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Live Monitor CTA */}
              <div className="mt-6 p-6 bg-[#1c1e26]/60 backdrop-blur-md rounded-xl border border-[#3b82f6]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-lg">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Live Monitor</h4>
                      <p className="text-[#B0B0C0]">Get real-time insights and alerts every 24 hours</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg font-medium">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Sources Modal */}
        {showAddSource && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1c1e26]/95 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Add New Sources</h3>
                  <p className="text-sm text-[#B0B0C0]">Expand your VOC insights with additional integrations</p>
                </div>
                <button 
                  onClick={() => setShowAddSource(false)}
                  className="w-8 h-8 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center text-[#B0B0C0] hover:text-white"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-4 p-3 bg-[#0f1117]/60 backdrop-blur-md rounded-lg border border-white/5">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4" />
                  <span>1 source included free • Additional sources $19-39/month</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.dataSources.available.map((source, index) => (
                  <div key={index} className="bg-[#0f1117]/60 backdrop-blur-md rounded-lg p-4 border border-white/5 hover:border-[#a855f7]/50 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{source.icon}</span>
                        <div>
                          <h5 className="font-medium">{source.name}</h5>
                          <p className="text-xs text-gray-400">{source.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold bg-gradient-to-r from-[#a855f7] to-pink-500 bg-clip-text text-transparent">${source.price}</div>
                        <div className="text-xs text-gray-400">/month</div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 btn-primary rounded-lg transition-all duration-200 shadow-lg">
                      Add Integration
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-[#0f1117]/60 backdrop-blur-md rounded-lg border border-white/5">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Info className="w-4 h-4" />
                  <span>Need a custom integration? Contact our team for enterprise solutions.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary */}
        <section
          id="executive-summary"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'executive-summary' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Executive Summary</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: This section summarizes the quarter's customer sentiment and volume shifts across all review platforms.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{reportData.executiveSummary.sentimentChange}</div>
                <div className="text-sm text-[#B0B0C0]">Sentiment Change</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#3b82f6] mb-2">{reportData.executiveSummary.volumeChange}</div>
                <div className="text-sm text-[#B0B0C0]">Volume Change</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="text-xl font-semibold text-green-400 mb-2">{reportData.executiveSummary.mostPraised}</div>
                <div className="text-sm text-[#B0B0C0]">Most Praised</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="text-xl font-semibold text-red-400 mb-2">{reportData.executiveSummary.topComplaint}</div>
                <div className="text-sm text-[#B0B0C0]">Top Complaint</div>
              </div>
            </div>
            
            <p className="text-[#B0B0C0] leading-relaxed mb-6 text-lg">{reportData.executiveSummary.overview}</p>
            
            {/* Alerts */}
            {reportData.executiveSummary.alerts.length > 0 && (
              <div className="space-y-4">
                {reportData.executiveSummary.alerts.map((alert, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl border ${
                    alert.type === 'warning' 
                      ? 'bg-red-500/10 border-red-500/20 text-red-300' 
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                  }`}>
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    ) : (
                      <Info className="w-6 h-6 text-blue-400" />
                    )}
                    <div>
                      <span className="font-semibold text-lg">{alert.message}</span>
                      <span className="text-sm opacity-75 ml-2">({alert.metric})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Key Insights */}
        <section
          id="key-insights"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'key-insights' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Key Insights</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Key trends surfaced by clustering user feedback across time and source.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.keyInsights.map((insight, index) => (
                <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                  <div className="flex items-start space-x-4">
                    {getDirectionIcon(insight.direction)}
                    <div className="flex-1">
                      <p className="font-semibold mb-3 text-white text-lg">{insight.insight}</p>
                      <div className="flex items-center space-x-4 text-sm text-[#B0B0C0]">
                        <button 
                          onClick={() => setSelectedMentions(selectedMentions === insight.insight ? null : insight.insight)}
                          className="text-[#22d3ee] hover:text-cyan-300 transition-colors font-semibold"
                        >
                          {insight.mentions} mentions
                        </button>
                        <div className="flex space-x-2">
                          {insight.platforms.map((platform, pIndex) => (
                            <span key={pIndex} className="px-3 py-1 bg-[#23263a]/80 backdrop-blur-md rounded-lg text-xs border border-white/10 text-white font-semibold">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedMentions === insight.insight && (
                    <div className="mt-6 p-4 bg-[#1c1e26]/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                      <h4 className="font-semibold mb-4 text-white">Sample Reviews:</h4>
                      <div className="space-y-3">
                        {insight.reviews.map((review, rIndex) => (
                          <div key={rIndex} className="text-sm">
                            <span className="text-gray-400">"{review.text}"</span>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-3 py-1 rounded-lg text-xs ${getSentimentColor(review.sentiment)} bg-[#0f1117]/60 backdrop-blur-md border border-white/10`}>
                                {review.topic}
                              </span>
                              <span className={`text-xs ${getSentimentColor(review.sentiment)}`}>
                                {review.sentiment}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sentiment Over Time */}
        <section
          id="sentiment-chart"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'sentiment-chart' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Sentiment Over Time</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Track overall tone of reviews per brand over time. Spikes may indicate launches, incidents, or viral feedback.</span>
              </div>
            </div>
            
            <div className="h-96 bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6 relative overflow-hidden">
              {/* Blue glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-[#8b5cf6]/5 rounded-xl"></div>
              <div className="relative z-10 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={reportData.sentimentOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(24,26,32,0.92)',
                        border: '1.5px solid #a855f7',
                        borderRadius: '18px',
                        color: '#fff',
                        boxShadow: '0 0 32px 0 #a855f7, 0 2px 24px 0 #232b4d',
                        backdropFilter: 'blur(12px)',
                        padding: '18px',
                        fontWeight: 500
                      }}
                    />
                    <Line type="monotone" dataKey="business" stroke="url(#blueGradient)" strokeWidth={3} />
                    <Line type="monotone" dataKey="competitorA" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="competitorB" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="competitorC" stroke="#f59e0b" strokeWidth={2} />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 shadow-inner">
              <Zap className="w-5 h-5 text-[#a855f7]" />
              <span className="text-sm text-[#a855f7] font-medium">Insight:</span>
              <span className="text-sm text-white">Sentiment is trending upward since March, with a notable spike in May after the product update.</span>
            </div>
          </div>
        </section>

        {/* Mentions by Topic */}
        <section
          id="mentions-topic"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'mentions-topic' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Mentions by Topic</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Shows emotional distribution by category. Helpful to spot polarizing experiences.</span>
              </div>
            </div>
            
            <div className="h-96 bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6 relative overflow-hidden">
              {/* Blue glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-[#8b5cf6]/5 rounded-xl"></div>
              <div className="relative z-10 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.mentionsByTopic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="topic" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(24,26,32,0.92)',
                        border: '1.5px solid #a855f7',
                        borderRadius: '18px',
                        color: '#fff',
                        boxShadow: '0 0 32px 0 #a855f7, 0 2px 24px 0 #232b4d',
                        backdropFilter: 'blur(12px)',
                        padding: '18px',
                        fontWeight: 500
                      }}
                    />
                    <Bar dataKey="positive" stackId="a" fill="url(#positiveGradient)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="neutral" stackId="a" fill="url(#neutralGradient)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="negative" stackId="a" fill="url(#negativeGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 shadow-inner">
              <Zap className="w-5 h-5 text-[#a855f7]" />
              <span className="text-sm text-[#a855f7] font-medium">Insight:</span>
              <span className="text-sm text-white">Support and UX are the most positively discussed topics, while Returns have the highest negative sentiment.</span>
            </div>
          </div>
        </section>

        {/* Trending Topics */}
        <section
          id="trending-topics"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'trending-topics' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Trending Topics</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Trending keywords based on sudden spikes in mentions or sentiment shifts.</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {reportData.trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTopic(selectedTopic === topic.topic ? null : topic.topic)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 backdrop-blur-md border ${
                    selectedTopic === topic.topic
                      ? 'bg-gradient-to-r from-[#a855f7] via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : `bg-[#0f1117]/60 ${getSentimentColor(topic.sentiment)} border-white/10 hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/10`
                  }`}
                >
                  {topic.topic} {topic.increase}
                </button>
              ))}
            </div>
            
            {selectedTopic && (
              <div className="mt-6 p-6 bg-[#0f1117]/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                <h4 className="font-semibold mb-4 text-white">Sample Reviews for "{selectedTopic}"</h4>
                <div className="text-sm text-gray-400 space-y-3">
                  <p>"The {selectedTopic.toLowerCase()} is fantastic! Really improved my experience."</p>
                  <p>"Love the new {selectedTopic.toLowerCase()} features, much better now."</p>
                  <p>"{selectedTopic} could use some improvements, but getting there."</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 shadow-inner">
              <Zap className="w-5 h-5 text-[#a855f7]" />
              <span className="text-sm text-[#a855f7] font-medium">Insight:</span>
              <span className="text-sm text-white">Mobile App and Customer Service are trending up, while Return Process is a growing concern.</span>
            </div>
          </div>
        </section>

        {/* Volume Over Time */}
        <section
          id="volume-over-time"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'volume-over-time' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Volume Over Time</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Peaks can reflect social media virality, PR campaigns, or seasonal events.</span>
              </div>
            </div>
            
            <div className="h-96 bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6 relative overflow-hidden">
              {/* Purple glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 to-pink-500/5 rounded-xl"></div>
              <div className="relative z-10 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={reportData.volumeOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="week" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(24,26,32,0.92)',
                        border: '1.5px solid #a855f7',
                        borderRadius: '18px',
                        color: '#fff',
                        boxShadow: '0 0 32px 0 #a855f7, 0 2px 24px 0 #232b4d',
                        backdropFilter: 'blur(12px)',
                        padding: '18px',
                        fontWeight: 500
                      }}
                    />
                    <Line type="monotone" dataKey="volume" stroke="url(#volumeGradient)" strokeWidth={3} />
                    <defs>
                      <linearGradient id="volumeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 shadow-inner">
              <Zap className="w-5 h-5 text-[#a855f7]" />
              <span className="text-sm text-[#a855f7] font-medium">Insight:</span>
              <span className="text-sm text-white">Volume peaked in W8, likely due to a campaign or event. W4 also saw a spike, possibly from a viral post. Monitor these periods for repeatable drivers of engagement.</span>
            </div>
          </div>
        </section>

        {/* Competitor Comparison */}
        <section
          id="competitor-summary"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'competitor-summary' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Competitor Comparison</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: See how you stack up across review themes against selected competitors.</span>
              </div>
            </div>

            {/* Callout Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
                <span>🔥</span>
                <span>You're trending higher on sentiment</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm">
                <span>⚠️</span>
                <span>Falling behind in volume</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm">
                <span>🥇</span>
                <span>You win in Support. Keep it up</span>
              </div>
            </div>

            {/* Side-by-Side Snapshot Table */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Your Brand vs Competitors</h4>
              <div className="overflow-x-auto bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 text-gray-300 font-semibold">Metric</th>
                      <th className="text-center py-4 text-gray-300 font-semibold">You</th>
                      <th className="text-center py-4 text-gray-300 font-semibold">Comp A</th>
                      <th className="text-center py-4 text-gray-300 font-semibold">Comp B</th>
                      <th className="text-center py-4 text-gray-300 font-semibold">Comp C</th>
                      <th className="text-center py-4 text-gray-300 font-semibold">Comp D</th>
                      <th className="text-center py-4 text-gray-300 font-semibold">Industry Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white font-semibold">Avg Rating</td>
                      <td className="py-4 text-center text-white">4.2★</td>
                      <td className="py-4 text-center text-white">3.9★</td>
                      <td className="py-4 text-center text-white">4.1★</td>
                      <td className="py-4 text-center text-white">3.7★</td>
                      <td className="py-4 text-center text-white">4.0★</td>
                      <td className="py-4 text-center text-gray-400">3.9★</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white font-semibold">Reviews (Last 30d)</td>
                      <td className="py-4 text-center text-white">287</td>
                      <td className="py-4 text-center text-white">421</td>
                      <td className="py-4 text-center text-white">156</td>
                      <td className="py-4 text-center text-white">298</td>
                      <td className="py-4 text-center text-white">203</td>
                      <td className="py-4 text-center text-gray-400">273</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white font-semibold">Sentiment Score</td>
                      <td className="py-4 text-center text-white">72%</td>
                      <td className="py-4 text-center text-white">61%</td>
                      <td className="py-4 text-center text-white">68%</td>
                      <td className="py-4 text-center text-white">55%</td>
                      <td className="py-4 text-center text-white">64%</td>
                      <td className="py-4 text-center text-gray-400">62%</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white font-semibold">Response Rate</td>
                      <td className="py-4 text-center text-white">94%</td>
                      <td className="py-4 text-center text-white">78%</td>
                      <td className="py-4 text-center text-white">85%</td>
                      <td className="py-4 text-center text-white">72%</td>
                      <td className="py-4 text-center text-white">81%</td>
                      <td className="py-4 text-center text-gray-400">79%</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-white font-semibold">Top Themes</td>
                      <td className="py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs">Support</span>
                          <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs">Quality</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs">Delivery</span>
                          <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-400 text-xs">Pricing</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs">Support</span>
                          <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 text-xs">UX</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs">Delivery</span>
                          <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-400 text-xs">Returns</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs">Support</span>
                          <span className="px-2 py-1 bg-gray-500/20 border border-gray-500/30 rounded text-gray-400 text-xs">Quality</span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-gray-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Share of Voice Graph */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Share of Voice</h4>
              <p className="text-sm text-gray-400 mb-4">% of customer conversations in your market</p>
              <div className="bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#a855f7] rounded"></div>
                    <span className="text-white font-medium text-sm">Your Brand (28%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#3b82f6] rounded"></div>
                    <span className="text-white font-medium text-sm">Comp A (35%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#10b981] rounded"></div>
                    <span className="text-white font-medium text-sm">Comp B (18%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#f59e0b] rounded"></div>
                    <span className="text-white font-medium text-sm">Comp C (12%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#ef4444] rounded"></div>
                    <span className="text-white font-medium text-sm">Comp D (7%)</span>
                  </div>
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div className="bg-[#a855f7] h-full" style={{ width: '28%' }}></div>
                  <div className="bg-[#3b82f6] h-full" style={{ width: '35%' }}></div>
                  <div className="bg-[#10b981] h-full" style={{ width: '18%' }}></div>
                  <div className="bg-[#f59e0b] h-full" style={{ width: '12%' }}></div>
                  <div className="bg-[#ef4444] h-full" style={{ width: '7%' }}></div>
                </div>
                <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 shadow-inner">
                  <Zap className="w-5 h-5 text-[#a855f7]" />
                  <span className="text-sm text-[#a855f7] font-medium">Insight:</span>
                  <span className="text-sm text-white">You own 28% of review conversations in your category — Comp A leads with 35%. Time to make some noise.</span>
                </div>
              </div>
            </div>

            {/* Category-Level Comparison */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Category-Level Comparison</h4>
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-400 items-center">
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-2 rounded" style={{background: youColor}}></span> You</div>
                {competitorNames.map((name, i) => (
                  <div key={name} className="flex items-center gap-1"><span className="inline-block w-4 h-2 rounded" style={{background: competitorColors[i]}}></span> {name}</div>
                ))}
                <div className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{background: industryColor}}></span> Industry Avg</div>
              </div>
              <div className="space-y-6">
                {[
                  {
                    theme: 'Product Quality',
                    you: 85,
                    competitors: [72, 78, 65, 70, 74],
                    industryAvg: 71,
                    comment: "You're winning on Quality — by a mile."
                  },
                  {
                    theme: 'Customer Service',
                    you: 78,
                    competitors: [65, 82, 58, 75, 69],
                    industryAvg: 70,
                    comment: "Customers mention slow delivery 2x more often with Comp A."
                  },
                  {
                    theme: 'Delivery',
                    you: 68,
                    competitors: [82, 71, 88, 69, 73],
                    industryAvg: 77,
                    comment: "Comp C leads in delivery speed."
                  },
                  {
                    theme: 'Pricing',
                    you: 72,
                    competitors: [75, 68, 80, 73, 70],
                    industryAvg: 74,
                    comment: "Pricing is competitive across the board."
                  },
                  {
                    theme: 'Returns',
                    you: 88,
                    competitors: [70, 85, 62, 78, 80],
                    industryAvg: 74,
                    comment: "Your return process is superior."
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-white font-semibold">{item.theme}</h5>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-white">You: {item.you}%</span>
                        <span className="text-gray-400">Industry Avg: {item.industryAvg}%</span>
                      </div>
                    </div>
                    <div className="mb-3 space-y-2">
                      {/* You Bar */}
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-xs text-gray-400">You</span>
                        <div className="relative flex-1 h-4 rounded-full bg-[#23263a]">
                          <div className="absolute left-0 top-0 h-4 rounded-full" style={{width: `${item.you}%`, background: youColor}}></div>
                          <span className="absolute right-2 top-0 text-xs text-white font-bold">{item.you}%</span>
                        </div>
                      </div>
                      {/* Competitor Bars */}
                      {item.competitors.map((score, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-20 text-xs text-gray-400">{competitorNames[i]}</span>
                          <div className="relative flex-1 h-4 rounded-full bg-[#23263a]">
                            <div className="absolute left-0 top-0 h-4 rounded-full" style={{width: `${score}%`, background: competitorColors[i]}}></div>
                            <span className="absolute right-2 top-0 text-xs text-white font-bold">{score}%</span>
                          </div>
                        </div>
                      ))}
                      {/* Industry Avg Bar */}
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-xs text-gray-400">Industry Avg</span>
                        <div className="relative flex-1 h-4 rounded-full bg-[#23263a]">
                          <div className="absolute left-0 top-0 h-4 rounded-full" style={{width: `${item.industryAvg}%`, background: industryColor}}></div>
                          <span className="absolute right-2 top-0 text-xs text-white font-bold">{item.industryAvg}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 shadow-inner">
                      <Zap className="w-5 h-5 text-[#a855f7]" />
                      <span className="text-sm text-[#a855f7] font-medium">Insight:</span>
                      <span className="text-sm text-white">{item.comment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Market Gaps */}
        <section
          id="market-gaps"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'market-gaps' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Market Gaps</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Recurring unmet needs found in customer feedback. Signals innovation or retention opportunities.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.marketGaps.map((gap, index) => (
                <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <Lightbulb className="w-6 h-6 text-[#a855f7] mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3 text-white text-lg">{gap.gap}</h4>
                      <p className="text-sm text-gray-400 mb-3">{gap.mentions} mentions</p>
                      <p className="text-sm text-[#a855f7] font-medium">{gap.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 shadow-inner">
              <Zap className="w-5 h-5 text-[#a855f7]" />
              <span className="text-sm text-[#a855f7] font-medium">Insight:</span>
              <span className="text-sm text-white">Loyalty programs and same-day shipping are the most requested features not currently offered.</span>
            </div>
          </div>
        </section>

        {/* Advanced Metrics */}
        <section
          id="advanced-metrics"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'advanced-metrics' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Advanced Metrics</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Quantitative signals to benchmark service performance and reliability.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-[#a855f7]" />
                </div>
                <div className="text-3xl font-bold text-[#a855f7] mb-2">{reportData.advancedMetrics.trustScore}</div>
                <div className="text-sm text-gray-400">Trust Score</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-red-400 mb-2">{reportData.advancedMetrics.repeatComplaints}%</div>
                <div className="text-sm text-gray-400">Repeat Complaints</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{reportData.advancedMetrics.avgResolutionTime}</div>
                <div className="text-sm text-gray-400">Avg Resolution Time</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">{reportData.advancedMetrics.vocVelocity}</div>
                <div className="text-sm text-gray-400">VOC Velocity</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 shadow-inner">
              <Zap className="w-5 h-5 text-[#a855f7]" />
              <span className="text-sm text-[#a855f7] font-medium">Insight:</span>
              <span className="text-sm text-white">Trust Score is high, but repeat complaints indicate room for improvement in customer experience.</span>
            </div>
          </div>
        </section>

        {/* Suggested Actions */}
        <section
          id="suggested-actions"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'suggested-actions' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Suggested Actions</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: AI-suggested actions based on dominant complaints, gaps, or sentiment declines.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.suggestedActions.map((action, index) => (
                <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                    <p className="font-semibold text-white text-lg">{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VOC Digest */}
        <section
          id="digest"
          className={`bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden transition-all duration-500 ${activeSection === 'digest' ? 'ring-4 ring-[#22d3ee]/60 ring-offset-2 z-20' : ''}`}
        >
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">VOC Digest</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: An internal digest for quick sharing with product, marketing, or CX teams.</span>
              </div>
            </div>
            
            <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#a855f7] via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-3 text-white text-lg">Monthly Summary</h4>
                  <p className="text-gray-300 mb-4 text-lg">{reportData.vocDigest.summary}</p>
                  <div className="space-y-2">
                    {reportData.vocDigest.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-[#a855f7] rounded-full"></div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-lg transition-all duration-200 shadow-lg hover:bg-gray-100 font-medium">
                  <Share2 className="w-4 h-4" />
                  <span>Share with Team</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-[#1c1e26]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 shadow-lg text-[#B0B0C0] hover:text-white">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}