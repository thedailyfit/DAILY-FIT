"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical, FlaskConical, Target, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function TrainerDashboard() {
    const activeClients = [
        { id: 1, name: "Sarah Jenkins", plan: "Weight Loss Protocol", progress: 75, status: "On Track", lastCheckin: "2 hours ago" },
        { id: 2, name: "Mike Ross", plan: "Muscle Gain Phase 2", progress: 30, status: "Needs Attention", lastCheckin: "1 day ago" },
        { id: 3, name: "Jessica Pearson", plan: "Marathon Prep", progress: 90, status: "On Track", lastCheckin: "5 mins ago" },
        { id: 4, name: "Harvey Specter", plan: "Maintenance", progress: 100, status: "Completed", lastCheckin: "3 days ago" },
    ];

    return (
        <main className="p-8 max-w-7xl mx-auto space-y-6">

            {/* Header: Clean & White */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Active Monitoring</h1>
                    <p className="text-slate-500 text-sm">Real-time status of your assigned clients.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white border-slate-200 text-slate-700">
                        <FlaskConical className="w-4 h-4 mr-2" /> Evaluation Mode
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Client
                    </Button>
                </div>
            </div>

            {/* Filter Bar (Stax Style) */}
            <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input className="pl-10 border-none shadow-none focus-visible:ring-0" placeholder="Search projects or clients..." />
                </div>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <div className="flex gap-2 pr-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">Status: All</Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">Sort: Recent</Badge>
                </div>
            </div>

            {/* Main Content Area: The List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Current Project / Plan</th>
                            <th className="px-6 py-4">Progress Status</th>
                            <th className="px-6 py-4">Inference Metrics</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeClients.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        {client.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-slate-400" />
                                        {client.plan}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${client.status === 'Needs Attention' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${client.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500">{client.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                    {client.status === 'Needs Attention'
                                        ? <span className="text-amber-600 flex items-center gap-1">⚠️ Low Adherence</span>
                                        : <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Optimal</span>
                                    }
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {client.lastCheckin}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {activeClients.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No clients found.
                    </div>
                )}
            </div>
        </main>
    );
}
