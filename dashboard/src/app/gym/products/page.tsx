import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShoppingBag, Plus, Tag } from "lucide-react";
import Image from "next/image"; // Assuming we might use Next.js Image

export default function GymProductsPage() {
    const products = [
        { id: 1, name: "Whey Protein (2lbs)", price: "$49.99", category: "Supplements", stock: 12 },
        { id: 2, name: "Yoga Class (10 Pack)", price: "$150.00", category: "Classes", stock: 999 },
        { id: 3, name: "Pre-Workout Shot", price: "$3.50", category: "Supplements", stock: 45 },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Products & Add-ons</h1>
                        <p className="text-slate-500">Sell supplements, class packs, and gear.</p>
                    </div>
                    <Button className="bg-violet-600 hover:bg-violet-700"><Plus className="mr-2 h-4 w-4" /> Create New Product</Button>
                </header>

                <div className="grid md:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-40 bg-slate-200 flex items-center justify-center">
                                <ShoppingBag className="h-10 w-10 text-slate-400" />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{p.name}</CardTitle>
                                    <span className="font-bold text-lg text-green-600">{p.price}</span>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                    <Tag className="h-3 w-3" /> {p.category}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600">Stock Available: <strong>{p.stock}</strong></p>
                            </CardContent>
                            <CardFooter className="bg-slate-50 p-4">
                                <Button className="w-full" variant="outline">Sell to Member</Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {/* New Product Placeholder */}
                    <Card className="border-dashed border-2 border-slate-300 bg-transparent flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors h-full min-h-[300px]">
                        <Plus className="h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="font-bold text-slate-500">Add New Item</h3>
                    </Card>
                </div>
            </main>
        </div>
    );
}
