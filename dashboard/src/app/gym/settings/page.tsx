
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle, Shield } from "lucide-react";

export default function GymSettingsPage() {
    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div>
                <h1 className="text-3xl font-black text-[#212121] uppercase tracking-tighter">Settings</h1>
                <p className="text-zinc-500 font-medium">Manage your gym subscription and billing.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-[#cbfe00] shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#cbfe00] text-black text-xs font-bold px-3 py-1">CURRENT PLAN</div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Shield className="h-6 w-6 text-black" /> PRO Plan
                        </CardTitle>
                        <CardDescription>Everything you need to run your gym.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Unlimited Members</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Advanced Analytics</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">5 Staff Accounts</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">WhatsApp Integration</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-zinc-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-zinc-500">Total</span>
                                <span className="text-xl font-bold">$99<span className="text-sm font-normal text-zinc-400">/mo</span></span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-black text-white hover:bg-zinc-800">Manage Subscription</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Billing Information</CardTitle>
                        <CardDescription>Payment method and history.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <CreditCard className="h-8 w-8 text-zinc-400" />
                            <div>
                                <div className="font-bold">Visa ending in 4242</div>
                                <div className="text-xs text-zinc-500">Expires 12/2025</div>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-auto text-blue-600">Edit</Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Billing Email</Label>
                            <Input defaultValue="billing@ironpumpgym.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Tax ID (GST/VAT)</Label>
                            <Input defaultValue="GSTIN-123456789" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline">Update Billing Details</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
