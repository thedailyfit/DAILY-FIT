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
import { PlusCircle, Loader2, PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddProductDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
            alert(`Product Added: ${formData.name}`);
            router.refresh();
            setFormData({ name: "", category: "", price: "", stock: "", description: "" });
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold shadow-lg shadow-[#cbfe00]/20 transition-all">
                    <PackagePlus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Add New Product</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Add inventory items like supplements, gear, or digital plans.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-neutral-300">Product Name</Label>
                        <Input
                            id="name" name="name"
                            value={formData.name} onChange={handleChange}
                            placeholder="e.g., Gold Standard Whey"
                            className="bg-neutral-950 border-neutral-800 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-neutral-300">Category</Label>
                            <Select onValueChange={(val) => handleSelectChange("category", val)}>
                                <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                    <SelectItem value="Supplement">Supplement</SelectItem>
                                    <SelectItem value="Gear">Gear / Equipment</SelectItem>
                                    <SelectItem value="Merchandise">Merchandise</SelectItem>
                                    <SelectItem value="Plan">Digital Plan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-neutral-300">Price ($)</Label>
                            <Input
                                id="price" name="price" type="number"
                                value={formData.price} onChange={handleChange}
                                className="bg-neutral-950 border-neutral-800 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stock" className="text-neutral-300">Stock Quantity</Label>
                        <Input
                            id="stock" name="stock" type="number"
                            value={formData.stock} onChange={handleChange}
                            className="bg-neutral-950 border-neutral-800 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-neutral-300">Short Description</Label>
                        <Input
                            id="description" name="description"
                            value={formData.description} onChange={handleChange}
                            placeholder="Flavor, Size, Benefits..."
                            className="bg-neutral-950 border-neutral-800 text-white"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-[#cbfe00] text-black hover:bg-[#b0dc00]">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Product'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
