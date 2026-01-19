"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
    Home,
    Users,
    MessageSquare,
    Dumbbell,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Calendar,
    FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const navigation = [
    { name: "Dashboard", href: "/trainer", icon: Home },
    { name: "My Clients", href: "/trainer/clients", icon: Users },
    { name: "Messages", href: "/trainer/messages", icon: MessageSquare },
    { name: "Gym Plans", href: "/trainer/plans", icon: FileText },
    { name: "Schedule", href: "/trainer/schedule", icon: Calendar },
    { name: "Workouts", href: "/trainer/workouts", icon: Dumbbell },
    { name: "Profile", href: "/trainer/profile", icon: User },
];

export function TrainerSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [trainerName, setTrainerName] = useState("Trainer");
    const [clientCount, setClientCount] = useState(0);
    const clientLimit = 10; // Pro Plan trainer limit

    const supabase = createClient();

    useEffect(() => {
        fetchTrainerInfo();
    }, []);

    const fetchTrainerInfo = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get trainer info from staff table
            const { data: staff } = await supabase
                .from('staff')
                .select('name, id')
                .eq('auth_id', user.id)
                .single();

            if (staff) {
                setTrainerName(staff.name || 'Trainer');

                // Count assigned clients
                const { count } = await supabase
                    .from('members')
                    .select('*', { count: 'exact', head: true })
                    .eq('assigned_trainer_id', staff.id);

                setClientCount(count || 0);
            }
        } catch (error) {
            console.error('Error fetching trainer info:', error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/trainer/login';
    };

    return (
        <aside
            className={cn(
                "flex flex-col h-screen border-r border-border bg-card transition-all duration-300 relative",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo/Brand */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                {!collapsed && (
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-primary">
                            DAILYFIT
                        </h1>
                        <p className="text-xs text-muted-foreground">Pro Trainer</p>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </div>

            {/* Client Limit Indicator */}
            {!collapsed && (
                <div className="p-4 border-b border-border">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Clients</span>
                        <span className="font-bold">{clientCount}/{clientLimit}</span>
                    </div>
                    <Progress value={(clientCount / clientLimit) * 100} className="h-2" />
                    {clientCount >= clientLimit && (
                        <p className="text-xs text-destructive mt-1">Limit reached</p>
                    )}
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && (
                                <span className="font-medium">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                    {!collapsed && <span className="text-sm font-medium truncate">{trainerName}</span>}
                    <ThemeSwitcher variant="gym" />
                </div>
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={cn("w-full justify-start gap-2 text-muted-foreground hover:text-destructive", collapsed && "justify-center")}
                >
                    <LogOut className="h-4 w-4" />
                    {!collapsed && "Sign Out"}
                </Button>
            </div>
        </aside>
    );
}
