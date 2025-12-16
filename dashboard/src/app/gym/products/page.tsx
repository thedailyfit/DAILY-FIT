"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, Plus, Tag, Search, Package, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GymProductsPage() {
    const [products, setProducts] = useState([
        { id: 1, name: "Whey Protein (2lbs)", price: 49.99, category: "Supplements", stock: 12, image: "💊" },
        { id: 2, name: "Yoga Class (10 Pack)", price: 150.00, category: "Classes", stock: 999, image: "🧘‍♀️" },
        { id: 3, name: "Pre-Workout Shot", price: 3.50, category: "Supplements", stock: 45, image: "⚡" },
    ]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", stock: "" });

    const handleAddProduct = () => {
        const product = {
            id: products.length + 1,
            name: newProduct.name,
            price: parseFloat(newProduct.price) || 0,
            category: newProduct.category || "General",
            stock: parseInt(newProduct.stock) || 0,
            image: "📦"
        };
        setProducts([...products, product]);
        setIsAddOpen(false);
        setNewProduct({ name: "", price: "", category: "", stock: "" });
    };

    return (
        <main className="p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products & Inventory</h1>
                    <p className="text-slate-500">Manage your gym's retail store, supplements, and class packs.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-violet-600 hover:bg-violet-700 shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Add New Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Create a new item to sell to your members.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="e.g. Protein Bar"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input
                                    id="price"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    type="number"
                                    className="col-span-3"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Input
                                    id="category"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Supplements, Gear..."
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stock" className="text-right">Stock</Label>
                                <Input
                                    id="stock"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    type="number"
                                    className="col-span-3"
                                    placeholder="100"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleAddProduct}>Save Product</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Inventory Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center">
                            <DollarSign className="w-5 h-5 mr-1 text-emerald-500" />
                            {products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Low Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center">
                            <Package className="w-5 h-5 mr-1 text-amber-500" />
                            {products.filter(p => p.stock < 15).length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Top Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center">
                            <Tag className="w-5 h-5 mr-1 text-violet-500" />
                            Supplements
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Area */}
            <div className="grid gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input className="pl-10 bg-white border-slate-200" placeholder="Search inventory..." />
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Render Products */}
                    {products.map((p) => (
                        <Card key={p.id} className="overflow-hidden bg-white border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group">
                            <div className="h-40 bg-slate-50 flex items-center justify-center relative">
                                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{p.image}</span>
                                {p.stock < 20 && (
                                    <Badge variant="secondary" className="absolute top-2 right-2 bg-amber-100 text-amber-700 hover:bg-amber-100">
                                        Low Stock
                                    </Badge>
                                )}
                            </div>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base font-semibold">{p.name}</CardTitle>
                                        <CardDescription className="text-xs mt-1">{p.category}</CardDescription>
                                    </div>
                                    <div className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded text-sm">
                                        ${p.price.toFixed(2)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="text-xs text-slate-500 flex justify-between items-center bg-slate-50 p-2 rounded">
                                    <span>Available</span>
                                    <span className="font-semibold text-slate-700">{p.stock} units</span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button className="w-full bg-white text-violet-600 border border-violet-200 hover:bg-violet-50" size="sm">
                                    Quick Sell
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {/* Quick Add Card */}
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center min-h-[300px] hover:border-violet-400 hover:bg-violet-50/50 transition-all group"
                    >
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                            <Plus className="h-6 w-6 text-slate-400 group-hover:text-violet-600" />
                        </div>
                        <h3 className="font-medium text-slate-600 group-hover:text-violet-700">Add New Product</h3>
                        <p className="text-xs text-slate-400 mt-1">Inventory or Service</p>
                    </button>
                </div>
            </div>
        </main>
    );
}
