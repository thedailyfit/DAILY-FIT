"use client";

import { usePathname, useRouter } from "next/navigation";
import { GymSidebar } from "@/components/gym/gym-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorTrail } from "@/components/cursor-trail";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GymLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const isAuthPage = pathname === "/gym/login" || pathname === "/gym/signup";
    const isBillingPage = pathname === "/gym/billing";

    const [subscription, setSubscription] = useState<{
        status: string;
        plan: string;
        trial_ends_at: string | null;
        days_left: number | null;
    }>({ status: 'trial', plan: 'basic', trial_ends_at: null, days_left: null });
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        if (!isAuthPage) fetchSubscription();
    }, [isAuthPage]);

    const fetchSubscription = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: gym } = await supabase
                .from('gyms')
                .select('subscription_status, subscription_plan, trial_ends_at')
                .eq('owner_id', user.id)
                .single();

            if (gym) {
                let daysLeft = null;
                if (gym.trial_ends_at) {
                    const end = new Date(gym.trial_ends_at);
                    const now = new Date();
                    daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                }

                setSubscription({
                    status: gym.subscription_status || 'trial',
                    plan: gym.subscription_plan || 'basic',
                    trial_ends_at: gym.trial_ends_at,
                    days_left: daysLeft
                });
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider>
            <CursorTrail />
            {isAuthPage ? (
                children
            ) : (
                <div className="flex min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
                    <GymSidebar />
                    <div className="flex-1 flex flex-col h-screen overflow-auto relative">
                        {/* Trial Banner */}
                        {!loading && subscription.status === 'trial' && !isBillingPage && (
                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 flex items-center justify-between shadow-lg sticky top-0 z-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-1 rounded-full">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-bold">
                                        Your trial ends in <span className="underline decoration-2 underline-offset-2">{subscription.days_left ?? 30} days</span>. 
                                        Upgrade to Pro for full access.
                                    </p>
                                </div>
                                <Link href="/gym/billing">
                                    <Button size="sm" variant="secondary" className="font-bold text-xs h-8 bg-white text-orange-600 hover:bg-zinc-100 border-none">
                                        Upgrade Now <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Subtle gradient only at very top for depth - responsive to theme */}
                        <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-0" />
                        <div className="relative z-10 min-h-full p-2">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </ThemeProvider>
    );
}
