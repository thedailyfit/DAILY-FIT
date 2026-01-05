"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Dumbbell, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GymAdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate login delay
        setTimeout(() => {
            setIsLoading(false);
            router.push("/gym");
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="absolute top-4 right-4 z-50">
                <ThemeSwitcher variant="gym" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-4 z-10"
            >
                <div className="text-center mb-8 space-y-2">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 ring-1 ring-primary/20"
                    >
                        <Dumbbell className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                        Gym Owner <span className="text-primary">Portal</span>
                    </h1>
                    <p className="text-muted-foreground">Secure access to your DailyFit facility dashboard.</p>
                </div>

                <Card className="border-border bg-card shadow-2xl backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access the admin panel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@dailyfit.com"
                                        className="pl-9 bg-secondary border-border"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-9 bg-secondary border-border"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground font-bold h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Access Dashboard <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 border-t border-border pt-6 bg-secondary/50">
                        <div className="text-xs text-center text-muted-foreground relative pl-3">
                            <span className="absolute left-0 top-0.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /></span>
                            Secure 256-bit SSL Encrypted Connection
                        </div>
                        <div className="text-xs text-center opacity-70">
                            Don't have an owner account? <a href="#" className="font-bold hover:underline">Partner with us</a>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
