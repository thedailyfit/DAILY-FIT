import { AddProductDialog } from "@/components/gym/add-product-dialog";
import { ProductCard } from "@/components/gym/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Package, Send } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop & Add-ons | DailyFit Gym Admin",
    description: "Manage inventory and upsell products.",
};

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
        <div className="flex-1 space-y-4 p-8 pt-6 bg-[#e6e6e6] min-h-screen text-black">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tight uppercase text-[#212121]">Pro Shop</h2>
                    <p className="text-zinc-500">Inventory management & member upselling.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <AddProductDialog />
                </div>
            </div>

            {/* Shop Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-[#212121] border-none shadow-xl text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Total Value</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-[#cbfe00]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">$4,250</div>
                        <p className="text-xs text-[#cbfe00] mt-1">Est. Revenue</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Physical Stock</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#212121]">{totalStock} units</div>
                        <p className="text-xs text-zinc-400 mt-1">Across {products.length} SKUs</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Low Stock Alert</CardTitle>
                        <Star className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#212121]">{lowStockItems} Items</div>
                        <p className="text-xs text-zinc-400 mt-1">Need re-ordering</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}

                {/* Call to Action for Broadcast */}
                <Card className="border-dashed border-2 border-zinc-300 bg-transparent flex flex-col items-center justify-center p-6 text-center hover:bg-zinc-200/50 transition-colors cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Send className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-black text-lg">Broadcast Blast</h3>
                    <p className="text-xs text-zinc-500 mt-2 max-w-[200px]">Send a bulk promotional message to all 500+ active members on WhatsApp.</p>
                </Card>
            </div>
        </div>
    );
}
