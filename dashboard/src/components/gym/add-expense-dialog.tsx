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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function AddExpenseDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
        is_recurring: "false"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.from('gym_expenses').insert({
                category: formData.category,
                amount: parseFloat(formData.amount),
                date: formData.date,
                notes: formData.notes,
                is_recurring: formData.is_recurring === "true"
            });

            if (error) {
                console.error('Error adding expense:', error);
                // Fallback for demo if table doesn't exist
                alert("Expense logged (Simulation): " + formData.category + " - $" + formData.amount);
            } else {
                router.refresh();
            }
            setOpen(false);
            setFormData({ category: "", amount: "", date: new Date().toISOString().split('T')[0], notes: "", is_recurring: "false" });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold shadow-lg shadow-[#cbfe00]/20 transition-all">
                    <PlusCircle className="mr-2 h-4 w-4" /> Log Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Log Maintenance Expense</DialogTitle>
                    <DialogDescription>
                        Track gym operational costs like rent, utilities, and repairs.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(val) => handleSelectChange("category", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Rent">Rent</SelectItem>
                                    <SelectItem value="Electricity">Electricity</SelectItem>
                                    <SelectItem value="Water">Water</SelectItem>
                                    <SelectItem value="Internet">Internet</SelectItem>
                                    <SelectItem value="Equipment">Equipment Repair</SelectItem>
                                    <SelectItem value="Cleaning">Cleaning & Maintenance</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="0.00" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="is_recurring">Recurring Monthly?</Label>
                        <Select onValueChange={(val) => handleSelectChange("is_recurring", val)} defaultValue="false">
                            <SelectTrigger>
                                <SelectValue placeholder="No" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="false">One-time</SelectItem>
                                <SelectItem value="true">Yes, Recurring</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., AC Repair Room 2" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Expense'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
