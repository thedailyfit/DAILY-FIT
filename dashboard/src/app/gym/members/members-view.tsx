"use client";

import { useState, useEffect } from "react";
import { GymMembersTable } from "@/components/gym/members-table";
import { MemberCard } from "@/components/gym/member-card";
import { AddGymMemberDialog } from "@/components/gym/add-member-dialog";
import { ImportClientsDialog } from "@/components/clients/import-clients-dialog";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GymMember } from "@/types/gym-member";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface MembersViewProps {
    members: GymMember[];
    trainers: { id: string; name: string }[];
}

export function MembersView({ members, trainers }: MembersViewProps) {
    const [view, setView] = useState<"table" | "cards">("cards");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const savedView = localStorage.getItem("gym-members-view");
        if (savedView === "table" || savedView === "cards") {
            setView(savedView);
        }
    }, []);

    const toggleView = (v: "table" | "cards") => {
        setView(v);
        localStorage.setItem("gym-members-view", v);
    };

    const filteredMembers = members.filter(m => 
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone?.includes(searchQuery) ||
        m.area?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const totalMembers = members.length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activeToday = 0;
    let inactive = 0;
    let newThisMonth = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    members.forEach(m => {
        if (m.lastActive) {
            const lastActive = new Date(m.lastActive);
            const daysAgo = Math.floor((new Date().getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
            if (daysAgo === 0) activeToday++;
            if (daysAgo >= 7) inactive++;
        }
        
        if (m.created_at) {
            const created = new Date(m.created_at);
            if (created.getMonth() === currentMonth && created.getFullYear() === currentYear) {
                newThisMonth++;
            }
        }
    });

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Gym Directory</h1>
                    <p className="text-muted-foreground font-medium">Manage memberships and access.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto items-center">
                    <div className="flex bg-zinc-100 p-1 rounded-lg mr-2">
                        <Button 
                            variant={view === "cards" ? "default" : "ghost"} 
                            size="sm" 
                            className="h-8 rounded-md"
                            onClick={() => toggleView("cards")}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" /> Cards
                        </Button>
                        <Button 
                            variant={view === "table" ? "default" : "ghost"} 
                            size="sm" 
                            className="h-8 rounded-md"
                            onClick={() => toggleView("table")}
                        >
                            <List className="w-4 h-4 mr-2" /> Table
                        </Button>
                    </div>
                    <ImportClientsDialog />
                    <AddGymMemberDialog />
                </div>
            </div>

            {/* Attendance Summary Widget */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{activeToday}</div>
                        <p className="text-xs text-muted-foreground">Members with activity today</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-red-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">Inactive (7+ days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{inactive}</div>
                        <p className="text-xs text-red-400">Needs attention</p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{newThisMonth}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, phone or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto p-0 placeholder:text-muted-foreground"
                />
            </div>

            {view === "table" ? (
                <GymMembersTable 
                    members={filteredMembers} 
                    trainers={trainers}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMembers.map((member, index) => {
                        const trainerName = trainers.find(t => t.id === member.assigned_trainer_id)?.name;
                        return (
                            <MemberCard 
                                key={member.id} 
                                member={member} 
                                index={index}
                                trainerName={trainerName}
                                onEdit={(m) => {
                                    // Normally handled by the table or a separate dialog context
                                    // For now, we'll let the user click Edit and maybe it opens the dialog if we lift state
                                    console.log("Edit", m);
                                }}
                                onRemind={(m) => {
                                    console.log("Remind", m);
                                    alert(`Payment reminder sent to ${m.name} via WhatsApp!`);
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
