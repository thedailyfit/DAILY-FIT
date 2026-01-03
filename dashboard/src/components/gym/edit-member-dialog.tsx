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
import { Loader2, Edit } from "lucide-react";

interface EditGymMemberDialogProps {
    member: any; // Using any for flexibility until type is strictly defined
    isOpen: boolean;
    onClose: () => void;
}

export function EditGymMemberDialog({ member, isOpen, onClose }: EditGymMemberDialogProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: member?.name || "",
        phone: member?.phone || member?.whatsapp_id || "",
        email: member?.email || "",
        gender: member?.gender || "",
        age: member?.age?.toString() || "",
        height_cm: member?.height_cm?.toString() || "",
        weight_kg: member?.weight_kg?.toString() || "",
        goal: member?.goal || "General Fitness",
        monthly_fee: member?.monthly_fee?.toString() || "",
        cardio_fee: member?.cardio_fee?.toString() || "",
        area: member?.area || "",
        status: member?.status || "Active"
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
            const memberData = {
                name: formData.name,
                whatsapp_id: formData.phone,
                phone: formData.phone,
                email: formData.email,
                gender: formData.gender,
                age: formData.age ? parseInt(formData.age) : null,
                height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
                weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
                goal: formData.goal,
                monthly_fee: formData.monthly_fee ? parseFloat(formData.monthly_fee) : 0,
                status: formData.status
                // Note: cardio_fee and area would be updated here if we have columns
            };

            const { error } = await supabase
                .from('members')
                .update(memberData)
                .eq('member_id', member.id);

            if (error) {
                console.error('Error updating member:', error);
                alert('Failed to update member.');
            } else {
                onClose();
                router.refresh();
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
                <DialogHeader>
                    <DialogTitle>Edit Member: {member.name}</DialogTitle>
                    <DialogDescription>
                        Update the member's details and status.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">WhatsApp</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => handleValueChange("status", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                    <SelectItem value="Blocked">Blocked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={formData.gender} onValueChange={(val) => handleValueChange("gender", val)}>
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
                            <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input id="height" name="height_cm" type="number" value={formData.height_cm} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" name="weight_kg" type="number" value={formData.weight_kg} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Fitness Goal</Label>
                        <Select value={formData.goal} onValueChange={(val) => handleValueChange("goal", val)}>
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
                            <Input id="monthly_fee" name="monthly_fee" type="number" value={formData.monthly_fee} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cardio_fee">Cardio/Extra (₹)</Label>
                            <Input id="cardio_fee" name="cardio_fee" type="number" value={formData.cardio_fee} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="area">Area/Location</Label>
                        <Input id="area" name="area" value={formData.area} onChange={handleChange} />
                    </div>

                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-black text-white hover:bg-zinc-800">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
