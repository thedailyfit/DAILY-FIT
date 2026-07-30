"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 30 minutes in milliseconds
const SESSION_TIMEOUT = 30 * 60 * 1000;
// Show warning 5 minutes before timeout
const WARNING_BEFORE = 5 * 60 * 1000;

export function SessionTimeout() {
    const [showWarning, setShowWarning] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        let timeoutTimer: NodeJS.Timeout;
        let warningTimer: NodeJS.Timeout;

        const resetTimers = () => {
            clearTimeout(timeoutTimer);
            clearTimeout(warningTimer);

            warningTimer = setTimeout(() => {
                setShowWarning(true);
            }, SESSION_TIMEOUT - WARNING_BEFORE);

            timeoutTimer = setTimeout(async () => {
                await handleLogout();
            }, SESSION_TIMEOUT);
        };

        // Reset timers on user interaction
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, resetTimers);
        });

        // Initialize timers
        resetTimers();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetTimers);
            });
            clearTimeout(timeoutTimer);
            clearTimeout(warningTimer);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        document.cookie = 'dailyfit_demo_auth=; path=/; max-age=0';
        document.cookie = 'dailyfit_demo_email=; path=/; max-age=0';
        document.cookie = 'dailyfit_role=; path=/; max-age=0';
        router.push('/login');
    };

    const handleStayLoggedIn = () => {
        setShowWarning(false);
        // Timers will automatically reset due to the mouse click on this button
    };

    return (
        <Dialog open={showWarning} onOpenChange={setShowWarning}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Session Expiring Soon</DialogTitle>
                    <DialogDescription>
                        Your session will expire in a few minutes due to inactivity. Would you like to stay logged in?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                    <Button onClick={handleStayLoggedIn}>Stay Logged In</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
