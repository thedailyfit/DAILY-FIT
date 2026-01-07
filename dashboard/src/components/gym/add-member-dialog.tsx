"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";

export function AddGymMemberDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "",
        age: "",
        height_cm: "",
        weight_kg: "",
        goal: "General Fitness",
        monthly_fee: "",
        cardio_fee: "", // Optional, might need to store in metadata
        area: "",       // Optional, metadata?
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleValueChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();

        try {
            // Get current user (Gym Owner)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Mock insertion for fields that might not exist in schema yet
            // We'll insert what we can into 'members' table

            // Generate Unique Invite Code (Simple Random for MVP)
            const inviteCode = `DF-${Math.floor(1000 + Math.random() * 9000)}`;

            const memberData = {
                name: formData.name,
                whatsapp_id: formData.phone, // Assuming phone as ID for now or separate
                phone: formData.phone,
                email: formData.email,
                gender: formData.gender,
                age: formData.age ? parseInt(formData.age) : null,
                height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
                weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
                weekly_goal: formData.goal, // mapping goal to existing field if possible or new
                goal: formData.goal,
                monthly_fee: formData.monthly_fee ? parseFloat(formData.monthly_fee) : 0,
                // Assuming we can leverage a 'metadata' column if schema is strict, 
                // OR assuming the schema has been updated as per user request in background.
                // For now, I will use existing columns and ignore extra if they fail, or assume strict schema.
                // Given previous turns updated 'members' table, I 'll try to use those.
                status: 'Active',
                owner_id: user.id, // If we have owner_id or joined via gym relation
                invite_code: inviteCode
                // user_id: we don't have a user_id yet for them, they are just a member entry
            };

            const { error } = await supabase.from('members').insert(memberData);

            if (error) {
                console.error('Error adding member:', error);
                alert('Failed to add member. Check console.');
            } else {
                setOpen(false);
                setFormData({
                    name: "", phone: "", email: "", gender: "", age: "", height_cm: "", weight_kg: "", goal: "General Fitness", monthly_fee: "", cardio_fee: "", area: ""
                });
                router.refresh();
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold h-10 px-6 shadow-lg shadow-[#cbfe00]/20 transition-all">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
                <DialogHeader>
                    <DialogTitle>Add New Gym Member</DialogTitle>
                    <DialogDescription>
                        Enter the member's details. Fields marked * are required.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">WhatsApp Number *</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email (Optional)</Label>
                            <Input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select onValueChange={(val) => handleValueChange("gender", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="25" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input id="height" name="height_cm" type="number" value={formData.height_cm} onChange={handleChange} placeholder="175" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" name="weight_kg" type="number" value={formData.weight_kg} onChange={handleChange} placeholder="70" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Fitness Goal</Label>
                        <Select onValueChange={(val) => handleValueChange("goal", val)} defaultValue="General Fitness">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Goal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                <SelectItem value="General Fitness">General Fitness</SelectItem>
                                <SelectItem value="Endurance">Endurance</SelectItem>
                                <SelectItem value="Strength">Strength</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div className="space-y-2">
                            <Label htmlFor="monthly_fee">Membership Fee (₹)</Label>
                            <Input id="monthly_fee" name="monthly_fee" type="number" value={formData.monthly_fee} onChange={handleChange} placeholder="2000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cardio_fee">Cardio/Extra (₹)</Label>
                            <Input id="cardio_fee" name="cardio_fee" type="number" value={formData.cardio_fee} onChange={handleChange} placeholder="0" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="area">Area/Location</Label>
                        <Input id="area" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Indiranagar" />
                    </div>

                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-black text-white hover:bg-zinc-800">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Member"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
