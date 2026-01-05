"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag, MoreHorizontal } from "lucide-react";

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
        <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-all group relative">
            <div className="absolute top-3 right-3 z-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            <div className="h-40 bg-secondary relative flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground group-hover:scale-110 group-hover:text-primary transition-all duration-500" />
                <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase font-bold tracking-wider">
                        {product.category}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-2">{product.name}</h3>
                    <span className="font-black text-primary text-lg">${product.price}</span>
                </div>
                <p className="text-muted-foreground text-xs line-clamp-2 mb-3 h-8">{product.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className={product.stock > 0 ? "text-emerald-400" : "text-destructive"}>
                        {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs"
                    onClick={handleBroadcast}
                >
                    <MessageCircle className="mr-2 h-3 w-3" /> Broadcast Deal
                </Button>
            </CardFooter>
        </Card>
    );
}
