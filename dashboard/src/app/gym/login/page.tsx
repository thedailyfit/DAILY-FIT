"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function GymLoginPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep("otp");
        }, 1500);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // In real app, redirect here
            window.location.href = "/gym";
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#cbfe00] rounded-full blur-[120px] opacity-10"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-5"></div>
            </div>

            <Card className="w-full max-w-md bg-neutral-900 border-neutral-800 text-white shadow-2xl relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-[#cbfe00] rounded-xl flex items-center justify-center text-black">
                            <Dumbbell className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tighter uppercase">Gym Owner Portal</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Secure access for gym administrators.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "email" ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-neutral-300">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@gym.com"
                                    className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-[#cbfe00]"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-[#cbfe00] text-black hover:bg-[#b0dc00] font-bold" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Email"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="bg-green-900/20 border border-green-900/50 p-3 rounded-lg flex items-center gap-2 text-green-500 text-sm mb-4">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>OTP sent to {email}</span>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-neutral-300">Enter Verification Code</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="1 2 3 4 5 6"
                                    className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-[#cbfe00] text-center tracking-[0.5em] font-mono text-lg"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-[#cbfe00] text-black hover:bg-[#b0dc00] font-bold" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Login"}
                            </Button>
                            <Button type="button" variant="ghost" className="w-full text-neutral-500 hover:text-white" onClick={() => setStep("email")}>
                                Go Back
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="justify-center flex-col gap-2 border-t border-neutral-800 pt-6">
                    <div className="text-xs text-neutral-500">
                        Protected by DailyFit Secure Auth
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
