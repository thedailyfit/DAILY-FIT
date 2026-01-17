"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Dumbbell, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function TrainerLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (authError) throw authError;

            // Verify this user is a staff member
            const { data: staff } = await supabase
                .from('staff')
                .select('id, role')
                .eq('auth_id', data.user?.id)
                .single();

            if (!staff) {
                await supabase.auth.signOut();
                setError("This account is not registered as a trainer. Please contact your gym owner.");
                return;
            }

            // Success - redirect to trainer dashboard
            router.push('/trainer');

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute top-4 right-4 z-50">
                <ThemeSwitcher variant="gym" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-4 z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Dumbbell className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase mb-2">
                        Trainer Login
                    </h1>
                    <p className="text-muted-foreground">Access your trainer dashboard</p>
                </div>

                <Card className="border-border bg-card shadow-2xl">
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your clients.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="trainer@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}

                            <Button type="submit" className="w-full font-bold h-11" disabled={isLoading}>
                                {isLoading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing In...</>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t py-4 flex-col gap-2">
                        <span className="text-sm text-muted-foreground">
                            Gym Owner? <Link href="/gym/login" className="text-primary font-bold hover:underline">Login here</Link>
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Solo Trainer? <Link href="/login" className="text-primary font-bold hover:underline">Basic login</Link>
                        </span>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
