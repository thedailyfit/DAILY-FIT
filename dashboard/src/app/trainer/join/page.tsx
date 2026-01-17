"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Dumbbell, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

function JoinContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const inviteId = searchParams.get("invite");
    const gymId = searchParams.get("gym");

    const [isLoading, setIsLoading] = useState(false);
    const [inviteData, setInviteData] = useState<any>(null);
    const [gymName, setGymName] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const supabase = createClient();

    useEffect(() => {
        if (inviteId) {
            validateInvite();
        }
    }, [inviteId]);

    const validateInvite = async () => {
        try {
            // Fetch invite details
            const { data: staff, error } = await supabase
                .from('staff')
                .select('*, gyms:gym_id(gym_name)')
                .eq('id', inviteId)
                .single();

            if (error || !staff) {
                setError("Invalid or expired invite link.");
                return;
            }

            if (staff.auth_id) {
                setError("This invite has already been used.");
                return;
            }

            setInviteData(staff);
            setGymName(staff.gyms?.gym_name || 'Your Gym');
        } catch (err) {
            setError("Failed to validate invite.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // 1. Create auth user with the email from invite
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: inviteData.email,
                password: formData.password,
                options: {
                    data: { full_name: inviteData.name, role: 'pro_trainer' }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Failed to create account");

            // 2. Link auth_id to staff record
            const { error: updateError } = await supabase
                .from('staff')
                .update({ auth_id: authData.user.id })
                .eq('id', inviteId);

            if (updateError) throw updateError;

            // 3. Redirect to trainer dashboard
            router.push('/trainer');

        } catch (err: any) {
            console.error('Join error:', err);
            setError(err.message || "Failed to complete signup.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!inviteId) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Invalid Link</h2>
                <p className="text-muted-foreground mt-2">Please use the invite link provided by your gym owner.</p>
            </div>
        );
    }

    if (error && !inviteData) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-bold text-destructive">Error</h2>
                <p className="text-muted-foreground mt-2">{error}</p>
                <Link href="/trainer/login">
                    <Button className="mt-4">Go to Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-4 z-10"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase mb-2">
                    You're Invited!
                </h1>
                <p className="text-muted-foreground">
                    Join <span className="font-bold text-primary">{gymName}</span> as a trainer
                </p>
            </div>

            <Card className="border-border bg-card shadow-2xl">
                <CardHeader>
                    <CardTitle>Complete Your Account</CardTitle>
                    <CardDescription>
                        {inviteData?.name && `Welcome, ${inviteData.name}!`} Set a password to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={inviteData?.email || ''} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label>Create Password</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}

                        <Button type="submit" className="w-full font-bold h-11" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating Account...</>
                            ) : (
                                "Join as Trainer"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t py-4">
                    <span className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/trainer/login" className="text-primary font-bold hover:underline">Log in</Link>
                    </span>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default function TrainerJoinPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute top-4 right-4 z-50">
                <ThemeSwitcher variant="gym" />
            </div>
            <Suspense fallback={<div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>}>
                <JoinContent />
            </Suspense>
        </div>
    );
}
