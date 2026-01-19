"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    User,
    Mail,
    Phone,
    Building2,
    Bell,
    Shield,
    Save,
    Camera,
    Award
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TrainerProfilePage() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        gymName: '',
        bio: '',
        specialization: '',
        experience: ''
    });
    const [notifications, setNotifications] = useState({
        newMessages: true,
        clientUpdates: true,
        weeklyReports: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get trainer info from staff table
            const { data: staff } = await supabase
                .from('staff')
                .select('*, gyms:gym_id(gym_name)')
                .eq('auth_id', user.id)
                .single();

            if (staff) {
                setProfile({
                    name: staff.name || '',
                    email: staff.email || user.email || '',
                    phone: staff.whatsapp_notification_number || '',
                    gymName: staff.gyms?.gym_name || '',
                    bio: staff.bio || '',
                    specialization: staff.specialization || '',
                    experience: staff.experience_years || ''
                });
            }

        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('staff')
                .update({
                    name: profile.name,
                    whatsapp_notification_number: profile.phone,
                    bio: profile.bio,
                    specialization: profile.specialization,
                    experience_years: profile.experience
                })
                .eq('auth_id', user.id);

            // Show success toast (you can add toast library)
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading profile...</div>;
    }

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                    <User className="h-8 w-8 text-primary" />
                    My Profile
                </h1>
                <p className="text-muted-foreground mt-1">Manage your trainer profile and preferences</p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                    {profile.name?.charAt(0)?.toUpperCase() || 'T'}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="outline"
                                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{profile.name || 'Trainer'}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Building2 className="h-4 w-4" />
                                {profile.gymName || 'No gym assigned'}
                            </CardDescription>
                            <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-200">
                                <Award className="h-3 w-3 mr-1" />
                                Pro Trainer
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                    className="pl-9 bg-muted"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">WhatsApp Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                                id="experience"
                                value={profile.experience}
                                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                                placeholder="e.g., 5"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                            id="specialization"
                            value={profile.specialization}
                            onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                            placeholder="e.g., Weight Training, HIIT, Yoga"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="Tell clients about yourself..."
                            className="w-full min-h-[100px] p-3 rounded-md border bg-background resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>New Messages</Label>
                            <p className="text-sm text-muted-foreground">Get notified when clients message you</p>
                        </div>
                        <Switch
                            checked={notifications.newMessages}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, newMessages: checked })}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Client Updates</Label>
                            <p className="text-sm text-muted-foreground">Progress updates and check-ins</p>
                        </div>
                        <Switch
                            checked={notifications.clientUpdates}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, clientUpdates: checked })}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Weekly Reports</Label>
                            <p className="text-sm text-muted-foreground">Summary of client activity</p>
                        </div>
                        <Switch
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
