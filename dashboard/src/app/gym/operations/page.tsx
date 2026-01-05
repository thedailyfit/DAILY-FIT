"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedPage, SlideIn, PopupCard } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Clock, Target, Building2, Save, MapPin, Phone, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function GymOperationsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert("Settings saved successfully!");
        }, 1000);
    };

    return (
        <AnimatedPage>
            <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Operations & Goals</h1>
                        <p className="text-muted-foreground font-medium">Manage facility details, timings, and business targets.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher variant="gym" />
                        <Button onClick={handleSave} disabled={loading} className="bg-primary text-primary-foreground hover:opacity-90">
                            <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Gym Details */}
                    <SlideIn direction="left" delay={0.1}>
                        <Card className="bg-card border-border shadow-lg h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground"><Building2 className="h-5 w-5 text-primary" /> Facility Details</CardTitle>
                                <CardDescription>Basic information about your gym.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Gym Name</Label>
                                    <Input placeholder="DailyFit Gym" defaultValue="DailyFit Gym" className="bg-secondary border-border" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Owner Name</Label>
                                        <Input placeholder="John Smith" defaultValue="John Smith" className="bg-secondary border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contact Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input className="pl-9 bg-secondary border-border" placeholder="+1 234 567 890" defaultValue="+91 98765 43210" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9 bg-secondary border-border" placeholder="123 Fitness St, Workout City" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Website / Social Link</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9 bg-secondary border-border" placeholder="https://instagram.com/dailyfit" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    {/* Operating Hours */}
                    <SlideIn direction="right" delay={0.2}>
                        <Card className="bg-card border-border shadow-lg h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground"><Clock className="h-5 w-5 text-primary" /> Operating Hours</CardTitle>
                                <CardDescription>Set your opening and closing times.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Weekday Open</Label>
                                        <Input type="time" defaultValue="05:00" className="bg-secondary border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Weekday Close</Label>
                                        <Input type="time" defaultValue="22:00" className="bg-secondary border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Weekend Open</Label>
                                        <Input type="time" defaultValue="08:00" className="bg-secondary border-border" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Weekend Close</Label>
                                        <Input type="time" defaultValue="20:00" className="bg-secondary border-border" />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-border">
                                    <Label>Peak Hours (for Analytics)</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label className="text-xs text-muted-foreground mb-1 block">Morning Peak</Label>
                                            <Input type="time" defaultValue="07:00" className="bg-secondary border-border" />
                                        </div>
                                        <div className="flex-1">
                                            <Label className="text-xs text-muted-foreground mb-1 block">Evening Peak</Label>
                                            <Input type="time" defaultValue="18:00" className="bg-secondary border-border" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    {/* Business Goals */}
                    <SlideIn direction="up" delay={0.3} className="md:col-span-2">
                        <Card className="bg-card border-border shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground"><Target className="h-5 w-5 text-primary" /> Monthly Goals & Targets</CardTitle>
                                <CardDescription>Set targets to track progress on the dashboard.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Revenue Target ($)</Label>
                                        <Input type="number" defaultValue="50000" className="bg-secondary border-border" />
                                        <p className="text-xs text-muted-foreground">Monthly revenue goal.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Members Target</Label>
                                        <Input type="number" defaultValue="50" className="bg-secondary border-border" />
                                        <p className="text-xs text-muted-foreground">Target sign-ups per month.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>PT Conversion Target (%)</Label>
                                        <Input type="number" defaultValue="10" className="bg-secondary border-border" />
                                        <p className="text-xs text-muted-foreground">% of members converting to PT.</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Automatic Goal Adjustments</Label>
                                        <p className="text-sm text-muted-foreground">Increase targets by 5% automatically if achieved for 3 consecutive months.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                </div>
            </div>
        </AnimatedPage>
    );
}
