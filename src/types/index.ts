export interface InstagramAccount {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  category: string;
  website: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  engagementRate: number; // e.g., 5.8 (%)
  storyReach: number;
  profileViewsWeek: number;
  websiteClicksWeek: number;
}

export type ContentStatus = 'published' | 'scheduled' | 'draft' | 'archived';
export type MediaType = 'image' | 'carousel' | 'video';

export interface Post {
  id: string;
  mediaUrl: string;
  carouselUrls?: string[];
  mediaType: MediaType;
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  reachCount: number;
  impressionsCount: number;
  postedAt: string;
  status: ContentStatus;
  scheduledFor?: string;
  hashtags: string[];
  location?: string;
  taggedUsers?: string[];
}

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  watchTimeSeconds: number;
  completionRate: number; // e.g. 74 (%)
  audioTitle: string;
  duration: string; // e.g. "0:30"
  postedAt: string;
  status: ContentStatus;
  viralityScore: number; // 0-100
}

export type SentimentType = 'positive' | 'question' | 'neutral' | 'spam' | 'negative';
export type CommentStatus = 'unread' | 'replied' | 'flagged' | 'hidden';

export interface CommentItem {
  id: string;
  postId: string;
  postThumbnail: string;
  postCaption: string;
  username: string;
  userAvatar: string;
  userHandle: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  sentiment: SentimentType;
  status: CommentStatus;
  replyText?: string;
  repliedAt?: string;
  isPinned?: boolean;
}

export type ScheduleItemType = 'post' | 'reel' | 'story' | 'carousel';
export type ScheduleStatus = 'scheduled' | 'draft' | 'publishing' | 'published';

export interface ScheduledPost {
  id: string;
  type: ScheduleItemType;
  mediaUrl: string;
  carouselUrls?: string[];
  caption: string;
  scheduledDateTime: string; // ISO string
  status: ScheduleStatus;
  hashtags: string[];
  location?: string;
  firstComment?: string;
  audioTitle?: string;
}

export interface FollowerGrowthPoint {
  date: string;
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
}

export interface HourlyActivity {
  day: string; // Mon, Tue, etc.
  hours: number[]; // 0-23 intensity (0-100)
}

export interface Demographics {
  ageGroups: { range: string; percentage: number }[];
  gender: { female: number; male: number; nonBinary: number };
  topCountries: { country: string; flag: string; percentage: number }[];
  topCities: { city: string; country: string; percentage: number }[];
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerKeywords: string[];
  replyTemplate: string;
  isActive: boolean;
  actionType: 'reply_dm' | 'reply_comment' | 'hide_comment' | 'flag_review';
  executionCount: number;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'growth' | 'comment' | 'schedule' | 'system';
  isRead: boolean;
}
