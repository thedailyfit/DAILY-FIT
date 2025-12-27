"use client";

import { cn } from "@/lib/utils";

// Actually, let's build a raw framer motion one to be unrelated to any missing UI lib.

import { motion } from "framer-motion";

const reviews = [
    {
        name: "Rajesh Kumar",
        username: "@rajesh_peakfitness",
        body: "DailyFit changed how I run my gym. The AI answers locally in Hinglish, my clients love it!",
        img: "https://avatar.vercel.sh/rajesh",
    },
    {
        name: "Sarah Jenkins",
        username: "@sarah_fit",
        body: "I used to spend 3 hours on diet plans. Now the AI does it in seconds 🤯",
        img: "https://avatar.vercel.sh/sarah",
    },
    {
        name: "Amit Patel",
        username: "@iron_pump_gym",
        body: "The automated fee reminders saved me ₹50k in lost revenue last month alone.",
        img: "https://avatar.vercel.sh/amit",
    },
    {
        name: "Priya Sharma",
        username: "@priya_yoga",
        body: "My leads are followed up instantly. I wake up to booked demos every morning.",
        img: "https://avatar.vercel.sh/priya",
    },
    {
        name: "Mike Tyson (Not that one)",
        username: "@mike_gym_delhi",
        body: "Best investment for my gym. The dashboard is sleek and the support is 10/10.",
        img: "https://avatar.vercel.sh/mike",
    },
    {
        name: "Sneha Reddy",
        username: "@sneha_crossfit",
        body: "Upselling supplements has never been easier. The AI just knows what to suggest.",
        img: "https://avatar.vercel.sh/sneha",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-6",
                // light styles
                "border-gray-950/10 bg-gray-950/5 hover:bg-gray-950/10",
                // dark styles
                "dark:border-white/10 dark:bg-card/40 dark:hover:bg-card/60"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-gray-300">{body}</blockquote>
        </figure>
    );
};

export function ReviewMarquee() {
    return (
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl">
            <div className="text-center mb-10 z-10">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">Trusted by 500+ Gym Owners</h2>
                <p className="text-gray-400 mt-2">Don't just take our word for it.</p>
            </div>

            {/* Marquee Row 1 (Left) */}
            <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    className="flex gap-4 pr-4"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                >
                    {[...firstRow, ...firstRow, ...firstRow].map((review, idx) => (
                        <ReviewCard key={idx} {...review} />
                    ))}
                </motion.div>
            </div>

            {/* Marquee Row 2 (Right) */}
            <div className="flex w-full overflow-hidden mt-6 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    className="flex gap-4 pr-4"
                    aria-hidden="true"
                    initial={{ x: "-50%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                >
                    {[...secondRow, ...secondRow, ...secondRow].map((review, idx) => (
                        <ReviewCard key={idx} {...review} />
                    ))}
                </motion.div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
    );
}
