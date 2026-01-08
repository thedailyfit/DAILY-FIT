"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Dumbbell, UserPlus, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

function GymSignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refCode = searchParams.get("ref") || "";

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        gymName: "",
        email: "",
        password: "",
        referralCode: refCode
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();

        try {
            // 1. Sign Up User
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { full_name: formData.name } // Metadata
                }
            });

            if (error) throw error;
            if (!data.user) throw new Error("No user created");

            // 2. Create 'Gym' Record with Referral Logic
            // Generate a 5-digit alphanumeric code for NEW trainer
            const myNewRefCode = `TR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

            const gymData = {
                gym_id: data.user.id,
                owner_name: formData.name,
                gym_name: formData.gymName,
                referral_code: myNewRefCode,
                referred_by_code: formData.referralCode || null,
                subscription_status: 'trial'
            };

            const { error: gymError } = await supabase.from('gyms').insert(gymData);

            if (gymError) {
                console.error("Gym creation error:", gymError);
                // Continue anyway, auth worked
            }

            // Success
            router.push("/gym");

        } catch (error: any) {
            console.error("Signup error:", error);
            alert(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-4 z-10"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase mb-2">
                    Get Started with <span className="text-primary">DailyFit</span>
                </h1>
                <p className="text-muted-foreground">Create your Gym Owner account.</p>
            </div>

            <Card className="border-border bg-card shadow-2xl backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Start your 14-day free trial.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Gym / Brand Name</Label>
                            <Input name="gymName" placeholder="Iron Fitness" value={formData.gymName} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input name="email" type="email" placeholder="john@gym.com" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                        </div>

                        {/* Referral Section */}
                        <div className="pt-2">
                            <Label className="text-primary font-bold">Referral Code (Optional)</Label>
                            <Input
                                name="referralCode"
                                placeholder="e.g. TR-8291"
                                value={formData.referralCode}
                                onChange={handleChange}
                                className="border-primary/30 focus-visible:ring-primary/50"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">If invited by another trainer.</p>
                        </div>

                        <Button type="submit" className="w-full font-bold h-11" disabled={isLoading}>
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t py-4">
                    <span className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/gym/login" className="text-primary font-bold hover:underline">Log in</Link>
                    </span>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default function GymSignupPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute top-4 right-4 z-50">
                <ThemeSwitcher variant="gym" />
            </div>
            <Suspense fallback={<div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading signup...</div>}>
                <GymSignupContent />
            </Suspense>
        </div>
    );
}
