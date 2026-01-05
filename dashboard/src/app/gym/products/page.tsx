"use client";

import { AddProductDialog } from "@/components/gym/add-product-dialog";
import { ProductCard } from "@/components/gym/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Package, Send } from "lucide-react";
import { AnimatedPage, PopupCard, SlideIn, AnimatedList } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

// Mock Data
const products = [
    { id: "1", name: "Whey Protein Isolate (Chocolate)", category: "Supplement", price: 65, stock: 12, description: "25g Protein per serving. Best seller.", image: "" },
    { id: "2", name: "DailyFit Lifting Straps", category: "Gear", price: 15, stock: 45, description: "Heavy duty padded straps for deadlifts.", image: "" },
    { id: "3", name: "Fat Loss 4-Week Plan", category: "Plan", price: 49, stock: 999, description: "Digital PDF + Video Guide.", image: "" },
    { id: "4", name: "Pre-Workout (Fruit Punch)", category: "Supplement", price: 35, stock: 8, description: "High caffeine energy booster.", image: "" },
    { id: "5", name: "DailyFit Branded T-Shirt", category: "Merchandise", price: 25, stock: 0, description: "Cotton blend, athletic fit.", image: "" },
];

export default function ProductsPage() {
    const totalStock = products.reduce((acc, curr) => acc + (curr.category !== 'Plan' ? curr.stock : 0), 0);
    const lowStockItems = products.filter(p => p.stock < 10 && p.category !== 'Plan').length;

    return (
        <AnimatedPage>
            <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase text-foreground">Upsell Product Add-ons</h2>
                        <p className="text-muted-foreground">Inventory management & member upselling.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher variant="gym" />
                        <AddProductDialog />
                    </div>
                </div>

                {/* Shop Stats */}
                <AnimatedList className="grid gap-4 md:grid-cols-3">
                    <PopupCard delay={0.1} className="bg-card border border-border shadow-lg rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Value</span>
                            <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-3xl font-black text-foreground">$4,250</div>
                        <p className="text-xs text-primary font-bold mt-1">Est. Revenue</p>
                    </PopupCard>

                    <PopupCard delay={0.2} className="bg-card border border-border shadow-lg rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Physical Stock</span>
                            <Package className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="text-3xl font-black text-foreground">{totalStock} units</div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">Across {products.length} SKUs</p>
                    </PopupCard>

                    <PopupCard delay={0.3} className="bg-card border border-border shadow-lg rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Low Stock Alert</span>
                            <Star className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="text-3xl font-black text-foreground">{lowStockItems} Items</div>
                        <p className="text-xs text-amber-400 font-bold mt-1">Need re-ordering</p>
                    </PopupCard>
                </AnimatedList>

                {/* Products Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product, index) => (
                        <SlideIn key={product.id} direction="up" delay={0.1 + index * 0.05}>
                            <ProductCard product={product} />
                        </SlideIn>
                    ))}

                    {/* Broadcast CTA */}
                    <SlideIn direction="up" delay={0.4}>
                        <Card className="border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center p-6 text-center hover:bg-primary/10 transition-colors cursor-pointer group">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Send className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-foreground text-lg">Broadcast Blast</h3>
                            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Send a bulk promotional message to all 500+ active members on WhatsApp.</p>
                        </Card>
                    </SlideIn>
                </div>
            </div>
        </AnimatedPage>
    );
}
