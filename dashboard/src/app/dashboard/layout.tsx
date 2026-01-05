import { TrainerSidebar } from "@/components/dashboard/trainer-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorTrail } from "@/components/cursor-trail";
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { Info } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // Enforce Trial Logic
        const { data: gym } = await supabase.from('gyms').select('created_at, subscription_status').eq('owner_id', user.id).single();

        // If created > 7 days ago AND status == 'trial', force upgrade
        // Or if status is 'new' (no mandate), force mandate
        // For simulation, we check if they visited mandate. We'll assume 'active' means mandate done.

        if (gym) {
            const trialDays = 7;
            const created = new Date(gym.created_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - created.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isTrialExpired = diffDays > trialDays && gym.subscription_status === 'trial';

            // If really strict, we'd redirect. For now, let's show a sticky banner.
            // If status is "inactive", redirect to pricing
            if (gym.subscription_status === 'inactive') {
                // redirect('/dashboard/subscription') // Uncomment to enforce strict lock
            }
        }
    }

    return (
        <ThemeProvider>
            <CursorTrail />
            <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
                <TrainerSidebar />
                <div className="flex-1 flex flex-col h-screen overflow-auto relative">
                    {/* Trial Banner */}
                    {/* <div className="bg-orange-500 text-white text-xs font-bold p-1 text-center">
                        TRIAL MODE: 5 Days Remaining. <span className="underline cursor-pointer">Upgrade Now</span>
                     </div> */}

                    {/* Subtle gradient only at very top for depth - responsive to theme */}
                    <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-0" />
                    <div className="relative z-10 min-h-full p-2">
                        {children}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
