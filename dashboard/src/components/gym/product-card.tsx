"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image?: string;
}

export function ProductCard({ product }: { product: Product }) {
    const handleBroadcast = () => {
        const message = `💪 Special Deal! Get ${product.name} for just $${product.price}. Available at the gym desk!`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Card className="bg-[#212121] border-none text-white overflow-hidden hover:shadow-2xl transition-all group relative">
            <div className="absolute top-3 right-3 z-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-black/50 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            <div className="h-40 bg-zinc-800 relative flex items-center justify-center">
                {/* Placeholder for Product Image */}
                <ShoppingBag className="h-12 w-12 text-zinc-600 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-md border-none text-[10px] uppercase font-bold tracking-wider">
                        {product.category}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2">{product.name}</h3>
                    <span className="font-black text-[#cbfe00] text-lg">${product.price}</span>
                </div>
                <p className="text-zinc-400 text-xs line-clamp-2 mb-3 h-8">{product.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <span className={product.stock > 0 ? "text-emerald-500" : "text-red-500"}>
                        {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full bg-white text-black hover:bg-zinc-200 font-bold text-xs"
                    onClick={handleBroadcast}
                >
                    <MessageCircle className="mr-2 h-3 w-3" /> Broadcast Deal
                </Button>
            </CardFooter>
        </Card>
    );
}
