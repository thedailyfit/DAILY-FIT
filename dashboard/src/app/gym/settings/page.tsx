"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle, Shield, Settings2 } from "lucide-react";
import { AnimatedPage, PopupCard, SlideIn } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function GymSettingsPage() {
    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Settings</h1>
                        <p className="text-muted-foreground font-medium">Manage your gym subscription and billing.</p>
                    </div>
                    <ThemeSwitcher variant="gym" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Current Plan */}
                    <SlideIn direction="left" delay={0.1}>
                        <Card className="border-2 border-primary bg-card shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1">CURRENT PLAN</div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
                                    <Shield className="h-6 w-6 text-primary" /> PRO Plan
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">Everything you need to run your gym.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {["Unlimited Members", "Advanced Analytics", "5 Staff Accounts", "WhatsApp Integration"].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span className="text-sm text-foreground">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">Total</span>
                                        <span className="text-xl font-bold text-foreground">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">Manage Subscription</Button>
                            </CardFooter>
                        </Card>
                    </SlideIn>

                    {/* Billing Information */}
                    <SlideIn direction="right" delay={0.2}>
                        <Card className="bg-card border-border shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-foreground">Billing Information</CardTitle>
                                <CardDescription className="text-muted-foreground">Payment method and history.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <PopupCard delay={0.3} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-secondary">
                                    <CreditCard className="h-8 w-8 text-primary" />
                                    <div>
                                        <div className="font-bold text-foreground">Visa ending in 4242</div>
                                        <div className="text-xs text-muted-foreground">Expires 12/2025</div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="ml-auto text-primary">Edit</Button>
                                </PopupCard>

                                <div className="space-y-2">
                                    <Label className="text-foreground">Billing Email</Label>
                                    <Input defaultValue="billing@dailyfit.com" className="bg-secondary border-border text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Tax ID (GST/VAT)</Label>
                                    <Input defaultValue="GSTIN-123456789" className="bg-secondary border-border text-foreground" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="border-border text-foreground hover:bg-accent">Update Billing Details</Button>
                            </CardFooter>
                        </Card>
                    </SlideIn>
                </div>

                {/* Additional Settings */}
                <SlideIn direction="up" delay={0.3}>
                    <Card className="bg-card border-border shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Settings2 className="h-5 w-5 text-primary" /> Preferences
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">Customize your dashboard experience.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-foreground">Gym Name</Label>
                                    <Input defaultValue="DailyFit Fitness" className="bg-secondary border-border text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Location</Label>
                                    <Input defaultValue="New York, NY" className="bg-secondary border-border text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Timezone</Label>
                                    <Input defaultValue="America/New_York (EST)" className="bg-secondary border-border text-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Currency</Label>
                                    <Input defaultValue="USD ($)" className="bg-secondary border-border text-foreground" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary text-primary-foreground hover:opacity-90">Save Changes</Button>
                        </CardFooter>
                    </Card>
                </SlideIn>
            </div>
        </AnimatedPage>
    );
}
