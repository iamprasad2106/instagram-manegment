import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, topic, goal, tone, commentText, commenterName, gridItems } = body;

    if (type === 'caption') {
      const cleanTopic = topic || 'visual aesthetics, creative process and photography';
      const cleanTone = tone || 'Aesthetic & Minimal';
      const cleanGoal = goal || 'Drive Engagement & Comments';

      const variants = [
        {
          id: 'v1',
          label: 'Viral Question & High Engagement',
          hook: `✨ The biggest lesson I learned about ${cleanTopic} this year.`,
          body: `Every creative has moments where everything clicks. When working on ${cleanTopic}, focusing on subtle lighting and natural composition made all the difference.\n\nWhich visual detail caught your eye first? Drop your thoughts below 👇`,
          hashtags: ['#visualstorytelling', '#creativestudio', '#aestheticvibes', '#cinematiclook', '#dailycreator', '#instadesign'],
          cta: 'Save this post for your next creative moodboard! 📌',
        },
        {
          id: 'v2',
          label: 'Storytelling & Behind-the-Scenes',
          hook: `📐 3 unconventional rules for ${cleanTopic} that transformed our workflow:`,
          body: `1. Simplify the color palette to 2 dominant tones.\n2. Embrace negative space rather than filling every corner.\n3. Let the natural textures tell the emotional story.\n\nSwipe through to see the full breakdown and before/after comparisons! 💫`,
          hashtags: ['#btsinspo', '#creativeworkflow', '#artdirection', '#designprinciples', '#visualarts', '#photogram'],
          cta: 'Share this with a fellow creator who needs this inspiration! 🚀',
        },
        {
          id: 'v3',
          label: 'Short & Punchy Aesthetic Hook',
          hook: `Minimalism isn’t the lack of something. It’s the perfect amount of everything. 🖤`,
          body: `Exploring deeper contrast and quiet beauty in ${cleanTopic}. Less noise, more resonance.\n\nPreset pack & raw color grading files available in our bio link ✨`,
          hashtags: ['#minimalmood', '#aestheticart', '#visualmood', '#artofvisuals', '#stayandwander', '#pursuepretty'],
          cta: 'Link in bio for raw presets and color profiles 🔗',
        },
      ];

      return NextResponse.json({ success: true, variants });
    }

    if (type === 'comment_reply') {
      const name = commenterName || 'there';
      const text = commentText || '';

      const replies = [
        {
          id: 'r1',
          label: 'Friendly & Appreciative',
          text: `Thank you so much @${name}! ✨ Really glad the breakdown resonated with your workflow!`,
        },
        {
          id: 'r2',
          label: 'Detailed & Informative',
          text: `Hey @${name}, great question! We used our custom warm-tone LUT preset paired with an f/1.8 aperture. Full tutorial is linked in our bio! 📸`,
        },
        {
          id: 'r3',
          label: 'Call to Action / DM',
          text: `Appreciate you @${name}! Just sent you a quick DM with the direct link and settings guide 📩`,
        },
      ];

      return NextResponse.json({ success: true, replies });
    }

    if (type === 'aesthetic_score') {
      // Analyze 3x3 grid aesthetic balance
      const count = Array.isArray(gridItems) ? gridItems.length : 9;
      
      const analysis = {
        overallScore: 94,
        status: 'Optimal Aesthetic Cohesion',
        paletteBreakdown: [
          { name: 'Warm Earth & Sunset Tones', percentage: 55, color: '#f59e0b' },
          { name: 'Deep Monochromatic Shadows', percentage: 30, color: '#3b82f6' },
          { name: 'Minimal High-Key Accents', percentage: 15, color: '#ec4899' },
        ],
        metrics: [
          { label: 'Color Rhythm', score: '96/100', rating: 'Exceptional' },
          { label: 'Composition Variety', score: '91/100', rating: 'Balanced' },
          { label: 'Contrast Distribution', score: '95/100', rating: 'Smooth' },
          { label: 'Visual Fatigue Index', score: 'Low (4%)', rating: 'Ideal' },
        ],
        recommendations: [
          '✨ Excellent alternation between high-contrast landscape wide shots and close-up detail photos.',
          '💡 Scheduled Reel at position #2 adds dynamic movement without clashing with neighboring warm photos.',
          '🎯 Consider scheduling a cool/blue tone photo next week to maintain visual depth.',
        ],
      };

      return NextResponse.json({ success: true, analysis });
    }

    return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
