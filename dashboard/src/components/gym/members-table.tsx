"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, MessageSquare, Edit, Trash, DollarSign } from "lucide-react";
import { GymMember } from "@/types/gym-member";
import { EditGymMemberDialog } from "./edit-member-dialog";
// import { SendPaymentReminder } from "./send-payment-reminder"; // Future

interface GymMembersTableProps {
    members: GymMember[];
}

export function GymMembersTable({ members }: GymMembersTableProps) {
    const [selectedMember, setSelectedMember] = useState<GymMember | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleEdit = (member: GymMember) => {
        setSelectedMember(member);
        setIsEditOpen(true);
    };

    const handlePaymentReminder = (member: GymMember) => {
        // Logic to trigger whatsapp template
        console.log("Send payment reminder to", member.name);
        alert(`Payment reminder sent to ${member.name} via WhatsApp!`);
    };

    // Helper to format currency
    const fmt = (amount?: number) =>
        amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount) : '-';

    return (
        <div className="rounded-md border border-zinc-200 bg-white shadow-sm overflow-hidden">
            {selectedMember && (
                <EditGymMemberDialog
                    member={selectedMember}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                />
            )}

            <Table>
                <TableHeader className="bg-zinc-50">
                    <TableRow>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Member</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Goal</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Fees</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Stats (H/W/BMI)</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Location</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Status</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No members found. Add your first member!
                            </TableCell>
                        </TableRow>
                    ) : (
                        members.map((m) => {
                            const bmi = (m.height_cm && m.weight_kg)
                                ? (m.weight_kg / ((m.height_cm / 100) ** 2)).toFixed(1)
                                : 'N/A';

                            return (
                                <TableRow key={m.id} className="hover:bg-zinc-50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{m.name}</span>
                                            <span className="text-xs text-slate-500">{m.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-medium bg-zinc-100 px-2 py-1 rounded-full text-zinc-700">
                                            {m.goal || 'General'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            <div className="font-bold text-emerald-600">{fmt(m.monthly_fee)}/mo</div>
                                            {m.cardio_fee && m.cardio_fee > 0 && (
                                                <div className="text-zinc-500">+ {fmt(m.cardio_fee)} cardio</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-zinc-600">
                                            <span title="Age">{m.age || '-'}y</span> •
                                            <span title="Height">{m.height_cm || '-'}cm</span> •
                                            <span title="Weight">{m.weight_kg || '-'}kg</span>
                                            <div className="font-bold text-black mt-1">BMI: {bmi}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-zinc-600 max-w-[100px] truncate" title={m.area}>
                                        {m.area || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={
                                            m.status === 'Active'
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-[#212121] text-white hover:bg-black"
                                        }>
                                            {m.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600" onClick={() => handlePaymentReminder(m)} title="Send Bill">
                                                <DollarSign className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(m)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handlePaymentReminder(m)}>
                                                        <MessageSquare className="mr-2 h-4 w-4" /> Send Reminder
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash className="mr-2 h-4 w-4" /> Remove Member
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
