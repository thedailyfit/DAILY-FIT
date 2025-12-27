"use client";

import { cn } from "@/lib/utils";

// Actually, let's build a raw framer motion one to be unrelated to any missing UI lib.

import { motion } from "framer-motion";

const reviews = [
    {
        name: "Alex Thompson",
        username: "@alex_strength_lab",
        body: "The automation here is insane. My retention went up 20% in the first month.",
        img: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        name: "Sarah Jenkins",
        username: "@sarah_fit_studio",
        body: "Finally software that understands fitness. The AI diet plans are actually good.",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "David Chen",
        username: "@chen_gyms_asia",
        body: "Managing 3 locations was a nightmare. DailyFit centralized everything on WhatsApp.",
        img: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
        name: "Elena Rodriguez",
        username: "@elena_pilates",
        body: "My clients love the instant responses. It feels premium and professional.",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        name: "Marcus Johnson",
        username: "@mj_performance",
        body: "Revenue tracking is crystal clear now. I know exactly who owes fees instantly.",
        img: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
        name: "Priya Sharma",
        username: "@priya_yoga_mumbai",
        body: "Best support team ever. They actually listen to feature requests.",
        img: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
        name: "James Wilson",
        username: "@jw_crossfit",
        body: "The onboarding flow for new members is so smooth. No more paperwork.",
        img: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
        name: "Sophie Anderson",
        username: "@sophie_lifts",
        body: "I've tried 5 different gym apps. This is the only one that stuck.",
        img: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
        name: "Omar Farooq",
        username: "@omar_iron_gym",
        body: "The WhatsApp integration is a game changer for the Middle East market.",
        img: "https://randomuser.me/api/portraits/men/54.jpg",
    },
];

const firstRow = reviews.slice(0, 3);
const secondRow = reviews.slice(3, 6);
const thirdRow = reviews.slice(6, 9);

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
        <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl py-12">
            <div className="text-center mb-10 z-10">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">Loved by Gym Owners Worldwide</h2>
                <p className="text-gray-400 mt-2">From Mumbai to Miami, fitness businesses run on DailyFit.</p>
            </div>

            {/* Marquee Row 1 */}
            <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    className="flex gap-4 pr-4"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                >
                    {[...firstRow, ...firstRow, ...firstRow, ...firstRow].map((review, idx) => (
                        <ReviewCard key={idx} {...review} />
                    ))}
                </motion.div>
            </div>

            {/* Marquee Row 2 */}
            <div className="flex w-full overflow-hidden mt-6 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    className="flex gap-4 pr-4"
                    initial={{ x: "-50%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                >
                    {[...secondRow, ...secondRow, ...secondRow, ...secondRow].map((review, idx) => (
                        <ReviewCard key={idx} {...review} />
                    ))}
                </motion.div>
            </div>

            {/* Marquee Row 3 */}
            <div className="flex w-full overflow-hidden mt-6 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    className="flex gap-4 pr-4"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 35, ease: "linear", repeat: Infinity }}
                >
                    {[...thirdRow, ...thirdRow, ...thirdRow, ...thirdRow].map((review, idx) => (
                        <ReviewCard key={idx} {...review} />
                    ))}
                </motion.div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
    );
}
