
import { CreateLeadFormDialog } from "@/components/gym/create-lead-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, UserPlus, Phone, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default async function GymLeadsPage() {
    const supabase = createClient();

    // Mock Leads Data (Simulating WhatsApp Webhook Store)
    const leads = [
        { id: 1, name: "Rahul Sharma", phone: "+91 9876543210", query: "What is the annual membership fee?", source: "WhatsApp", status: "Replied by AI", time: "10m ago" },
        { id: 2, name: "Priya Singh", phone: "+91 9123456780", query: "Do you have Zumba classes?", source: "Instagram", status: "Pending", time: "2h ago" },
        { id: 3, name: "Amit Patel", phone: "+91 9988776655", query: "I want to join tomorrow.", source: "WhatsApp", status: "Converted", time: "1d ago" },
    ];

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#212121] uppercase tracking-tighter">Leads & Enquiries</h1>
                    <p className="text-zinc-500 font-medium">Capture and convert potential members.</p>
                </div>
                <div>
                    <CreateLeadFormDialog />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Active Lead Forms */}
                <Card className="md:col-span-1 shadow-sm border-zinc-200 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Active Campaigns</CardTitle>
                        <CardDescription>Generated lead forms</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-zinc-50 rounded border border-zinc-100 flex justify-between items-center">
                            <div>
                                <div className="font-bold text-sm">New Year Special</div>
                                <div className="text-xs text-zinc-500">12 clicks • 4 leads</div>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                        </div>
                        <div className="p-3 bg-zinc-50 rounded border border-zinc-100 flex justify-between items-center">
                            <div>
                                <div className="font-bold text-sm">Summer Body</div>
                                <div className="text-xs text-zinc-500">45 clicks • 8 leads</div>
                            </div>
                            <Badge variant="outline" className="bg-zinc-100 text-zinc-500 border-zinc-200">Ended</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Incoming Enquiries Stream */}
                <Card className="md:col-span-2 shadow-sm border-zinc-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Recent Enquiries
                        </CardTitle>
                        <CardDescription>Real-time messages from WhatsApp & Social</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {leads.map((lead) => (
                                <div key={lead.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-zinc-50 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                                        {lead.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">{lead.name}</h4>
                                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> {lead.phone} • {lead.source}
                                                </p>
                                            </div>
                                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {lead.time}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-zinc-700 bg-zinc-100 p-2 rounded w-fit">
                                            "{lead.query}"
                                        </div>
                                        <div className="mt-2 flex gap-2 items-center">
                                            {lead.status === 'Replied by AI' && (
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 gap-1">
                                                    <Bot className="h-3 w-3" /> Auto-Replied
                                                </Badge>
                                            )}
                                            {lead.status === 'Converted' && (
                                                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                                                    Converted
                                                </Badge>
                                            )}
                                            {lead.status === 'Pending' && (
                                                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-100">
                                                    Action Needed
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Button size="sm" variant="outline">Chat</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
