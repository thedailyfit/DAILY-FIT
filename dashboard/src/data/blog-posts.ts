export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    author: string;
    category: string;
    heroImage: string; // We'll use CSS gradients/patterns if no URL
    content: {
        type: 'header' | 'paragraph' | 'list' | 'quote' | 'visual';
        text?: string;
        items?: string[];
        visualType?: 'retention-chart' | 'loop-cycle' | 'workload-chart' | 'whatsapp-automation' | 'comparison-table';
        caption?: string;
    }[];
    seo: {
        keywords: string[];
        metaDescription: string;
        schemaData?: any;
    }
};

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "why-most-gyms-lose-members-after-30-days",
        title: "Why Most Gyms Lose Members After 30 Days",
        excerpt: "Retention issues are rarely caused by facilities. They are caused by a lack of daily feedback. Discover the 'Month 1 Cliff' and how to fix it.",
        date: "October 24, 2025",
        readTime: "6 min read",
        author: "DailyFit Team",
        category: "Retention Strategy",
        heroImage: "bg-gradient-to-br from-red-900 via-black to-black",
        seo: {
            keywords: ["gym retention", "member churn", "fitness business", "DailyFit AI"],
            metaDescription: "Most gym members quit after 30 days due to a lack of feedback. Learn how automated daily engagement solves this."
        },
        content: [
            { type: 'header', text: "The Month 1 Cliff" },
            { type: 'paragraph', text: "New members start with high motivation. By week 3, they are confused. By day 30, they quit. This pattern destroys gym profitability." },
            { type: 'visual', visualType: 'retention-chart', caption: "The Retention Drop-off curve." },
            { type: 'paragraph', text: "The solution? Daily feedback. When a member knows exactly what to do every day, they stay." },
            { type: 'header', text: "Automating Daily Contact" },
            { type: 'paragraph', text: "You can't text 500 members manually. But AI can. DailyFit AI sends workouts and checks in on WhatsApp every morning." }
        ]
    },
    {
        slug: "ai-for-personal-trainers-scale-without-burnout",
        title: "AI for Personal Trainers: Manage 50+ Clients Without Burnout",
        excerpt: "Hit the ceiling at 15 clients? See how AI automation handles the busywork so you can focus on coaching and double your income.",
        date: "October 28, 2025",
        readTime: "8 min read",
        author: "Akhilesh Reddy",
        category: "Trainer Productivity",
        heroImage: "bg-gradient-to-br from-green-900 via-black to-black",
        seo: {
            keywords: ["personal trainer scaling", "online coaching business", "AI fitness tools"],
            metaDescription: "Scale your personal training business to 50+ clients without burnout using DailyFit AI automation."
        },
        content: [
            { type: 'header', text: "The 15-Client Trap" },
            { type: 'paragraph', text: "Most trainers burn out at 15 clients. The admin work—checking logs, sending plans—takes over." },
            { type: 'visual', visualType: 'workload-chart', caption: "Manual vs AI Workload" },
            { type: 'paragraph', text: "DailyFit AI handles the delivery and tracking. You just handle the coaching and high-level strategy." }
        ]
    },
    {
        slug: "what-is-ai-fitness-automation",
        title: "What Is AI Fitness Automation for Gyms?",
        excerpt: "It's not about robot trainers. It's about automating the repetitive 'nudge' that keeps members active. Learn how it works.",
        date: "November 2, 2025",
        readTime: "5 min read",
        author: "DailyFit Team",
        category: "AI Technology",
        heroImage: "bg-gradient-to-br from-blue-900 via-black to-black",
        seo: {
            keywords: ["AI fitness automation", "gym automation", "fitness tech trends"],
            metaDescription: "AI fitness automation handles daily member check-ins, workout delivery, and habit tracking automatically."
        },
        content: [
            { type: 'header', text: "Automation vs. Replacement" },
            { type: 'paragraph', text: "AI doesn't replace the human connection. It enhances it by removing the data-entry work. Imagine if every member got a 'Good job!' text when they hit a PR, instantly." },
            { type: 'visual', visualType: 'loop-cycle', caption: "The Daily Automation Loop" },
            { type: 'header', text: "How It Works" },
            { type: 'paragraph', text: "The system connects to WhatsApp. It sends the day's plan at 6 AM. It asks for a log at 8 PM. If they miss it, it nudges them. The trainer sees a dashboard of who is active and who is slipping." }
        ]
    },
    {
        slug: "why-whatsapp-beats-fitness-apps",
        title: "Why WhatsApp Beats Custom Fitness Apps",
        excerpt: "Nobody wants to download another app. Discover why WhatsApp automation has 10x higher engagement rates than dedicated gym apps.",
        date: "November 5, 2025",
        readTime: "4 min read",
        author: "DailyFit Team",
        category: "Marketing",
        heroImage: "bg-gradient-to-br from-purple-900 via-black to-black",
        seo: {
            keywords: ["fitness apps vs whatsapp", "gym marketing", "member engagement rates"],
            metaDescription: "Why building a custom gym app is a waste of money compared to using WhatsApp automation."
        },
        content: [
            { type: 'header', text: "The 'App Fatigue' Problem" },
            { type: 'paragraph', text: "The average gym app has a 12% open rate. WhatsApp has a 98% open rate. If you want members to see your workouts, go where they already are." },
            { type: 'visual', visualType: 'comparison-table', caption: "App vs WhatsApp Engagement" },
            { type: 'header', text: "Friction Kills Consistency" },
            { type: 'paragraph', text: "Logging into an app, remembering the password, navigating menus... it's friction. WhatsApp is instant. Low friction means high compliance." }
        ]
    }
];
