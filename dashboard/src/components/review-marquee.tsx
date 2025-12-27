"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const reviews = [
    // ROW 1 - USA / UK Focus
    {
        name: "James Miller",
        username: "@jm_fitness_nyc",
        body: "The AI agent handles my leads 24/7. I wake up to 5 new signups every morning.",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Sarah Williams",
        username: "@sarah_yoga_london",
        body: "Finally, an AI that understands British English! My clients love the WhatsApp updates.",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Michael Chen",
        username: "@iron_forge_sf",
        body: "Automation is the future. DailyFit saves me 20 hours a week on admin.",
        img: "https://randomuser.me/api/portraits/men/86.jpg",
    },
    {
        name: "Emma Davis",
        username: "@emma_pilates_manchester",
        body: "The fee reminders are polite but effective. Collection rate is up 100%.",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        name: "Robert Taylor",
        username: "@bob_gym_texas",
        body: "Best decision for my franchise. The dashboard reports are crystal clear.",
        img: "https://randomuser.me/api/portraits/men/11.jpg",
    },

    // ROW 2 - Middle East / Asia Focus
    {
        name: "Omar Al-Fayed",
        username: "@omar_profitness_dubai",
        body: "The WhatsApp bot is genius. It speaks like a real receptionist.",
        img: "https://randomuser.me/api/portraits/men/33.jpg",
    },
    {
        name: "Priya Patel",
        username: "@priya_strength_mumbai",
        body: "Managing 500 members was impossible. DailyFit made it easy.",
        img: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
        name: "Arjun Singh",
        username: "@arjun_power_delhi",
        body: "My trainers love the AI workout generator. Saves them so much typing.",
        img: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
        name: "Fatima Khan",
        username: "@fatima_wellness_qatar",
        body: "Secure, fast, and reliable. The best gym software in the market.",
        img: "https://randomuser.me/api/portraits/women/90.jpg",
    },
    {
        name: "Wei Zhang",
        username: "@wei_gym_singapore",
        body: "The integration with local payments is seamless. Highly recommended.",
        img: "https://randomuser.me/api/portraits/men/22.jpg",
    },

    // ROW 3 - Mixed / Tech Focus
    {
        name: "Lisa Anderson",
        username: "@lisa_fit_la",
        body: "I was skeptical about AI, but this is different. It's actually helpful.",
        img: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    {
        name: "David Wilson",
        username: "@dw_cardio_chicago",
        body: "The onboarding flow is slick. Clients are impressed immediately.",
        img: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    {
        name: "Sofia Rodriguez",
        username: "@sofia_dance_miami",
        body: "Support team is amazing. They helped me migrate data in 1 day.",
        img: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
        name: "Ryan Cooper",
        username: "@cooper_strength_uk",
        body: "It pays for itself. One retained member covers the monthly cost.",
        img: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
        name: "Anita Gupta",
        username: "@anita_yoga_bangalore",
        body: "Simple interface, powerful AI. Exactly what Indian gym owners need.",
        img: "https://randomuser.me/api/portraits/women/31.jpg",
    },

    // ROW 4 - New User Focus
    {
        name: "Tom Harris",
        username: "@tom_box_london",
        body: "The 'Before & After' photo tracking is a client favorite.",
        img: "https://randomuser.me/api/portraits/men/91.jpg",
    },
    {
        name: "Lucas Silva",
        username: "@lucas_gym_brazil",
        body: "Works perfectly on mobile. I run my gym from the beach.",
        img: "https://randomuser.me/api/portraits/men/29.jpg",
    },
    {
        name: "Emily Clark",
        username: "@emily_spin_sydney",
        body: "The automated birthday wishes are such a nice touch. Clients love it.",
        img: "https://randomuser.me/api/portraits/women/52.jpg",
    },
    {
        name: "Hassan Ahmed",
        username: "@hassan_gym_egypt",
        body: "Finally, no more manual spreadsheets. This saved my sanity.",
        img: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
        name: "Jessica Lee",
        username: "@jess_canvas_toronto",
        body: "The AI agent feels human. It even uses emojis correctly!",
        img: "https://randomuser.me/api/portraits/women/61.jpg",
    },

    // ROW 5 - Enterprise / Multi-location
    {
        name: "Mark Stevens",
        username: "@mark_elite_fitness",
        body: "We run 12 locations on DailyFit. The centralized dashboard is gold.",
        img: "https://randomuser.me/api/portraits/men/50.jpg",
    },
    {
        name: "Rachel Green",
        username: "@rachel_studio_nyc",
        body: "My reception staff can finally focus on people, not phone calls.",
        img: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    {
        name: "Carlos Mendez",
        username: "@carlos_power_madrid",
        body: "The diet plan generator is better than my nutritionist.",
        img: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
        name: "Sophie Turner",
        username: "@sophie_gym_paris",
        body: "Elegance and power. The interface is beautiful.",
        img: "https://randomuser.me/api/portraits/women/88.jpg",
    },
    {
        name: "Kevin O'Connor",
        username: "@kevin_fit_dublin",
        body: "Top class software. Cheers to the team!",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    }
];

// Slice into 5 rows
const chunkSize = 5;
const row1 = reviews.slice(0, 5);
const row2 = reviews.slice(5, 10);
const row3 = reviews.slice(10, 15);
const row4 = reviews.slice(15, 20);
const row5 = reviews.slice(20, 25);

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
            <blockquote className="mt-2 text-sm text-gray-300 leading-relaxed">{body}</blockquote>
        </figure>
    );
};

export function ReviewMarquee() {
    return (
        <div className="relative flex flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl py-24">
            <div className="text-center mb-12 z-10">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 mb-4">Loved by 2,000+ Gym Owners</h2>
                <p className="text-gray-400 text-lg">From London to Mumbai, the world runs on DailyFit.</p>
            </div>

            {/* Helper to render rows */}
            {[row1, row2, row3, row4, row5].map((row, i) => (
                <div key={i} className={`flex w-full overflow-hidden mb-6 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]`}>
                    <motion.div
                        className="flex gap-4 pr-4"
                        initial={{ x: i % 2 === 0 ? "-50%" : "0%" }} // Alternate direction visuals
                        animate={{ x: i % 2 === 0 ? "0%" : "-50%" }}
                        transition={{ duration: 30 + (i * 5), ease: "linear", repeat: Infinity }}
                    >
                        {[...row, ...row, ...row, ...row].map((review, idx) => (
                            <ReviewCard key={idx} {...review} />
                        ))}
                    </motion.div>
                </div>
            ))}

            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
    );
}
