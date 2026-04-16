"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle, Shield, Settings2, Loader2, Save } from "lucide-react";
import { AnimatedPage, PopupCard, SlideIn } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

interface GymSettings {
    gymName: string;
    location: string;
    timezone: string;
    currency: string;
    billingEmail: string;
    taxId: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
}

const planFeatures: Record<string, string[]> = {
    starter: ["20 Members", "Basic Analytics", "2 Staff Accounts", "Email Support"],
    pro: ["100 Members", "Advanced Analytics", "5 Staff Accounts", "WhatsApp Integration"],
    enterprise: ["Unlimited Members", "Full Analytics Suite", "50 Staff Accounts", "Priority Support"]
};

const planPricing: Record<string, string> = {
    starter: "$29",
    pro: "$59",
    enterprise: "$149"
};

export default function GymSettingsPage() {
    const [settings, setSettings] = useState<GymSettings>({
        gymName: '',
        location: '',
        timezone: '',
        currency: 'INR (₹)',
        billingEmail: '',
        taxId: '',
        subscriptionPlan: 'pro',
        subscriptionStatus: 'active'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: gym } = await supabase
                .from('gyms')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (gym) {
                setSettings({
                    gymName: gym.gym_name || '',
                    location: gym.location || gym.city || '',
                    timezone: gym.timezone || 'Asia/Kolkata (IST)',
                    currency: gym.currency || 'INR (₹)',
                    billingEmail: gym.billing_email || user.email || '',
                    taxId: gym.tax_id || '',
                    subscriptionPlan: gym.subscription_plan || gym.subscription_tier || 'pro',
                    subscriptionStatus: gym.subscription_status || 'active'
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('gyms')
                .update({
                    gym_name: settings.gymName,
                    location: settings.location,
                    timezone: settings.timezone,
                    currency: settings.currency,
                    billing_email: settings.billingEmail,
                    tax_id: settings.taxId
                })
                .eq('owner_id', user.id);

            if (error) throw error;
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const currentPlan = settings.subscriptionPlan || 'pro';
    const features = planFeatures[currentPlan] || planFeatures.pro;
    const price = planPricing[currentPlan] || '$59';

    if (loading) {
        return (
            <AnimatedPage>
                <div className="p-8 flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AnimatedPage>
        );
    }

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
                                    <Shield className="h-6 w-6 text-primary" /> {currentPlan.toUpperCase()} Plan
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">Everything you need to run your gym.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            <span className="text-sm text-foreground">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">Total</span>
                                        <span className="text-xl font-bold text-foreground">{price}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href="/gym/billing" className="w-full">
                                    <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">Manage Subscription</Button>
                                </Link>
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
                                        <div className="font-bold text-foreground">
                                            {settings.subscriptionStatus === 'active' ? 'Payment Active' : 'No payment method'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {settings.subscriptionStatus === 'active' ? 'Auto-renew enabled' : 'Add a payment method'}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="ml-auto text-primary">Edit</Button>
                                </PopupCard>

                                <div className="space-y-2">
                                    <Label className="text-foreground">Billing Email</Label>
                                    <Input
                                        value={settings.billingEmail}
                                        onChange={(e) => setSettings({ ...settings, billingEmail: e.target.value })}
                                        className="bg-secondary border-border text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Tax ID (GST/VAT)</Label>
                                    <Input
                                        value={settings.taxId}
                                        onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                                        placeholder="Enter your GST/VAT number"
                                        className="bg-secondary border-border text-foreground"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                </div>

                {/* Gym Preferences */}
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
                                    <Input
                                        value={settings.gymName}
                                        onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                                        className="bg-secondary border-border text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Location</Label>
                                    <Input
                                        value={settings.location}
                                        onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                                        className="bg-secondary border-border text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Timezone</Label>
                                    <Input
                                        value={settings.timezone}
                                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                        className="bg-secondary border-border text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Currency</Label>
                                    <Input
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        className="bg-secondary border-border text-foreground"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </Card>
                </SlideIn>
            </div>
        </AnimatedPage>
    );
}
