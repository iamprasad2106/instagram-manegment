import { prisma } from './prisma';
import {
  mockAccounts,
  mockPosts,
  mockReels,
  mockComments,
  mockScheduledPosts,
  mockAutomationRules,
  mockNotifications,
} from '../data/mockData';

export async function seedDatabase() {
  console.log('Seeding SQLite database with rich creator dummy datasets...');

  // Check if accounts already exist
  const existingCount = await prisma.account.count();
  if (existingCount > 0) {
    console.log(`Database already contains ${existingCount} accounts. Skipping full re-seed.`);
    return;
  }

  // 1. Seed Accounts
  for (const acc of mockAccounts) {
    await prisma.account.create({
      data: {
        id: acc.id,
        username: acc.username,
        fullName: acc.fullName,
        avatarUrl: acc.avatarUrl,
        bio: acc.bio,
        category: acc.category,
        website: acc.website,
        isVerified: acc.isVerified,
        followersCount: acc.followersCount,
        followingCount: acc.followingCount,
        postsCount: acc.postsCount,
        engagementRate: acc.engagementRate,
        storyReach: acc.storyReach,
        profileViewsWeek: acc.profileViewsWeek,
        websiteClicksWeek: acc.websiteClicksWeek,
      },
    });
  }

  const primaryAccountId = mockAccounts[0].id;

  // 2. Seed Posts
  for (const post of mockPosts) {
    await prisma.post.create({
      data: {
        id: post.id,
        accountId: primaryAccountId,
        mediaUrl: post.mediaUrl,
        carouselUrls: post.carouselUrls ? JSON.stringify(post.carouselUrls) : null,
        mediaType: post.mediaType,
        caption: post.caption,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        sharesCount: post.sharesCount,
        savesCount: post.savesCount,
        reachCount: post.reachCount,
        impressionsCount: post.impressionsCount,
        postedAt: new Date(post.postedAt),
        status: post.status,
        hashtags: JSON.stringify(post.hashtags),
        location: post.location,
        taggedUsers: post.taggedUsers ? JSON.stringify(post.taggedUsers) : null,
      },
    });
  }

  // 3. Seed Reels
  for (const reel of mockReels) {
    await prisma.reel.create({
      data: {
        id: reel.id,
        accountId: primaryAccountId,
        videoUrl: reel.videoUrl,
        thumbnailUrl: reel.thumbnailUrl,
        caption: reel.caption,
        viewsCount: reel.viewsCount,
        likesCount: reel.likesCount,
        commentsCount: reel.commentsCount,
        sharesCount: reel.sharesCount,
        savesCount: reel.savesCount,
        watchTimeSeconds: reel.watchTimeSeconds,
        completionRate: reel.completionRate,
        audioTitle: reel.audioTitle,
        duration: reel.duration,
        postedAt: new Date(reel.postedAt),
        status: reel.status,
        viralityScore: reel.viralityScore,
      },
    });
  }

  // 4. Seed Comments
  for (const comment of mockComments) {
    await prisma.comment.create({
      data: {
        id: comment.id,
        accountId: primaryAccountId,
        postId: comment.postId,
        postThumbnail: comment.postThumbnail,
        postCaption: comment.postCaption,
        username: comment.username,
        userAvatar: comment.userAvatar,
        userHandle: comment.userHandle,
        text: comment.text,
        likesCount: comment.likesCount,
        isLiked: comment.isLiked,
        sentiment: comment.sentiment,
        status: comment.status,
        replyText: comment.replyText,
        repliedAt: comment.repliedAt,
        isPinned: comment.isPinned ?? false,
        timeAgo: comment.createdAt,
      },
    });
  }

  // 5. Seed Scheduled Posts
  for (const sched of mockScheduledPosts) {
    await prisma.scheduledPost.create({
      data: {
        id: sched.id,
        accountId: primaryAccountId,
        type: sched.type,
        mediaUrl: sched.mediaUrl,
        carouselUrls: sched.carouselUrls ? JSON.stringify(sched.carouselUrls) : null,
        caption: sched.caption,
        scheduledDateTime: new Date(sched.scheduledDateTime),
        status: sched.status,
        hashtags: JSON.stringify(sched.hashtags),
        location: sched.location,
        firstComment: sched.firstComment,
        audioTitle: sched.audioTitle,
      },
    });
  }

  // 6. Seed Automation Rules
  for (const rule of mockAutomationRules) {
    await prisma.automationRule.create({
      data: {
        id: rule.id,
        accountId: primaryAccountId,
        name: rule.name,
        triggerKeywords: JSON.stringify(rule.triggerKeywords),
        replyTemplate: rule.replyTemplate,
        isActive: rule.isActive,
        actionType: rule.actionType,
        executionCount: rule.executionCount,
      },
    });
  }

  // 7. Seed Notifications
  for (const notif of mockNotifications) {
    await prisma.notification.create({
      data: {
        id: notif.id,
        accountId: primaryAccountId,
        title: notif.title,
        message: notif.message,
        timeAgo: notif.timeAgo,
        type: notif.type,
        isRead: notif.isRead,
      },
    });
  }

  console.log('Database seeded successfully!');
}
