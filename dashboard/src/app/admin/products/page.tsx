"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Package, Truck, Info } from "lucide-react";

export default function AdminProductsPage() {
    const products = [
        { id: 1, name: "DailyFit Branded Protein (Wholesale)", price: "₹1,200", stock: 500, category: "Supplements", status: "Active" },
        { id: 2, name: "Gym Equipment Package A", price: "₹2,50,000", stock: 5, category: "Equipment", status: "Active" },
        { id: 3, name: "Staff Uniform (Polo)", price: "₹450", stock: 200, category: "Merchandise", status: "Low Stock" },
    ];

    return (
        <main className="p-8 space-y-8 bg-slate-50 min-h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">B2B Product Store</h1>
                    <p className="text-slate-500">Manage products you sell directly to Gym Owners (Franchise/Wholesale).</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Create Wholesale Item
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* B2B Stats */}
                <Card className="bg-white border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Wholesale Revenue</CardTitle>
                        <Package className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹55,000</div>
                        <p className="text-xs text-slate-400 mt-1">This month</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Orders</CardTitle>
                        <Truck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-slate-400 mt-1">Shipping pending</p>
                    </CardContent>
                </Card>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input className="pl-10 bg-white" placeholder="Search wholesale items..." />
                    </div>
                </div>

                <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => (
                        <Card key={p.id} className="group hover:border-indigo-300 hover:shadow-md transition-all">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between">
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">{p.category}</Badge>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${p.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <CardTitle className="text-lg mt-2">{p.name}</CardTitle>
                                <CardDescription>Wholesale Price: <span className="font-bold text-slate-900">{p.price}</span></CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-0">
                                <Button variant="outline" className="w-full">Manage Stock ({p.stock})</Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {/* Add Placeholder */}
                    <button className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-400 hover:text-indigo-600">
                        <Plus className="h-8 w-8 mb-2" />
                        <span className="font-medium">Add New Item</span>
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex gap-3 text-blue-800 text-sm items-start">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    <strong>Note:</strong> Products added here will be visible to Gym Owners in their "Marketplace" section (Future Feature).
                    Currently, this inventory tracks what you manually sell to them.
                </p>
            </div>
        </main>
    );
}
