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
import { Badge } from "@/components/ui/badge";
import { UserPlus, Dumbbell, Utensils } from "lucide-react";
import { GymMember } from "@/types/gym-member";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface PtClientsTableProps {
    clients: GymMember[]; // Assuming GymMembers can be PT clients
    trainers: any[]; // Need Trainer type
    dietPlans: any[];
    workoutPlans: any[];
}

export function PtClientsTable({ clients, trainers, dietPlans, workoutPlans }: PtClientsTableProps) {
    const [selectedClient, setSelectedClient] = useState<GymMember | null>(null);
    const [assignOpen, setAssignOpen] = useState(false);
    const [assignType, setAssignType] = useState<"trainer" | "plan">("trainer");

    // Assignment State
    const [selectedTrainerId, setSelectedTrainerId] = useState("");
    const [selectedDietId, setSelectedDietId] = useState("");
    const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleOpenAssign = (client: GymMember, type: "trainer" | "plan") => {
        setSelectedClient(client);
        setAssignType(type);
        setAssignOpen(true);
        // Reset selections
        // In real app, pre-fill with existing values
    };

    const handleSaveAssignment = async () => {
        setLoading(true);
        const supabase = createClient();
        try {
            if (assignType === "trainer") {
                // Update member's assigned trainer
                // Assuming 'trainer_id' column or metadata
                // For now, mocking success or using metadata update
                console.log(`Assigning trainer ${selectedTrainerId} to client ${selectedClient?.id}`);
                const { error } = await supabase
                    .from('members')
                    .update({
                        // trainer_id: selectedTrainerId // If column exists
                    })
                    .eq('member_id', selectedClient?.id);
                // Since column might not exist, we just simulate
                alert(`Trainer assigned! (Simulated)`);
            } else {
                // Assign Plan
                console.log(`Assigning Diet ${selectedDietId} / Workout ${selectedWorkoutId}`);
                // Logic to insert into client_programs would go here
                alert(`Plans assigned! (Simulated)`);
            }
            setAssignOpen(false);
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-md border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{assignType === 'trainer' ? 'Assign Trainer' : 'Assign Program'}</DialogTitle>
                        <DialogDescription>
                            manage PT details for {selectedClient?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {assignType === 'trainer' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Trainer</label>
                                <Select onValueChange={setSelectedTrainerId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a trainer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trainers.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Diet Plan</label>
                                    <Select onValueChange={setSelectedDietId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose diet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {dietPlans.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Workout Plan</label>
                                    <Select onValueChange={setSelectedWorkoutId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose workout" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {workoutPlans.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveAssignment} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader className="bg-zinc-50">
                    <TableRow>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Client</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Assigned Trainer</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Status</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs">Current Program</TableHead>
                        <TableHead className="font-bold text-zinc-500 uppercase text-xs text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id} className="hover:bg-zinc-50">
                            <TableCell>
                                <div className="font-bold text-slate-900">{client.name}</div>
                                <div className="text-xs text-zinc-500">{client.goal}</div>
                            </TableCell>
                            <TableCell>
                                {/* Mock check for assigned trainer */}
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-dashed border-zinc-300 text-zinc-400 font-normal">
                                        No Trainer
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">PT Active</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="text-xs space-y-1">
                                    <div className="flex items-center gap-1 text-zinc-600">
                                        <Utensils className="h-3 w-3" /> None
                                    </div>
                                    <div className="flex items-center gap-1 text-zinc-600">
                                        <Dumbbell className="h-3 w-3" /> None
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleOpenAssign(client, 'trainer')}>
                                        <UserPlus className="h-3 w-3 mr-1" /> Trainer
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleOpenAssign(client, 'plan')}>
                                        <Dumbbell className="h-3 w-3 mr-1" /> Program
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
