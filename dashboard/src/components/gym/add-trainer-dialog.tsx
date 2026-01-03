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
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";

export function AddTrainerDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        shift_start: "",
        shift_end: "",
        salary: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();

        try {
            // Generate a unique performance code
            const performance_code = `TR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

            const trainerData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                shift_start: formData.shift_start,
                shift_end: formData.shift_end,
                salary: formData.salary ? parseFloat(formData.salary) : 0,
                status: 'Active',
                performance_code: performance_code
            };

            const { error } = await supabase.from('trainers').insert(trainerData);

            if (error) {
                console.error('Error adding trainer:', error);
                alert('Failed to add trainer.');
            } else {
                setOpen(false);
                setFormData({ name: "", email: "", phone: "", shift_start: "", shift_end: "", salary: "" });
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
                    <UserPlus className="mr-2 h-4 w-4" /> Add Trainer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Trainer</DialogTitle>
                    <DialogDescription>
                        Create a staff profile.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Alice Fit" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="alice@gym.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="shift_start">Shift Start</Label>
                            <Input id="shift_start" name="shift_start" type="time" value={formData.shift_start} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shift_end">Shift End</Label>
                            <Input id="shift_end" name="shift_end" type="time" value={formData.shift_end} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="salary">Monthly Salary ($)</Label>
                        <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="2000" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Trainer'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
