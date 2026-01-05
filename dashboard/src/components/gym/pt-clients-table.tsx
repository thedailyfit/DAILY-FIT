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
import { Card } from "@/components/ui/card";

interface PtClientsTableProps {
    clients: GymMember[];
    trainers: any[];
    dietPlans: any[];
    workoutPlans: any[];
}

export function PtClientsTable({ clients, trainers, dietPlans, workoutPlans }: PtClientsTableProps) {
    const [selectedClient, setSelectedClient] = useState<GymMember | null>(null);
    const [assignOpen, setAssignOpen] = useState(false);
    const [assignType, setAssignType] = useState<"trainer" | "plan">("trainer");
    const [selectedTrainerId, setSelectedTrainerId] = useState("");
    const [selectedDietId, setSelectedDietId] = useState("");
    const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleOpenAssign = (client: GymMember, type: "trainer" | "plan") => {
        setSelectedClient(client);
        setAssignType(type);
        setAssignOpen(true);
    };

    const handleSaveAssignment = async () => {
        setLoading(true);
        const supabase = createClient();
        try {
            if (assignType === "trainer") {
                console.log(`Assigning trainer ${selectedTrainerId} to client ${selectedClient?.id}`);
                alert(`Trainer assigned! (Simulated)`);
            } else {
                console.log(`Assigning Diet ${selectedDietId} / Workout ${selectedWorkoutId}`);
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
        <Card className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">{assignType === 'trainer' ? 'Assign Trainer' : 'Assign Program'}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Manage PT details for {selectedClient?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {assignType === 'trainer' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Trainer</label>
                                <Select onValueChange={setSelectedTrainerId}>
                                    <SelectTrigger className="bg-secondary border-border text-foreground">
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
                                    <label className="text-sm font-medium text-foreground">Diet Plan</label>
                                    <Select onValueChange={setSelectedDietId}>
                                        <SelectTrigger className="bg-secondary border-border text-foreground">
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
                                    <label className="text-sm font-medium text-foreground">Workout Plan</label>
                                    <Select onValueChange={setSelectedWorkoutId}>
                                        <SelectTrigger className="bg-secondary border-border text-foreground">
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
                        <Button onClick={handleSaveAssignment} disabled={loading} className="bg-primary text-primary-foreground">
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader>
                    <TableRow className="border-border bg-secondary hover:bg-secondary">
                        <TableHead className="font-bold text-muted-foreground uppercase text-xs">Client</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-xs">Assigned Trainer</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-xs">Status</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-xs">Current Program</TableHead>
                        <TableHead className="font-bold text-muted-foreground uppercase text-xs text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id} className="hover:bg-accent border-border">
                            <TableCell>
                                <div className="font-bold text-foreground">{client.name}</div>
                                <div className="text-xs text-muted-foreground">{client.goal}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="border-dashed border-border text-muted-foreground font-normal">
                                    No Trainer
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">PT Active</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="text-xs space-y-1">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Utensils className="h-3 w-3" /> None
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Dumbbell className="h-3 w-3" /> None
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-accent" onClick={() => handleOpenAssign(client, 'trainer')}>
                                        <UserPlus className="h-3 w-3 mr-1" /> Trainer
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-accent" onClick={() => handleOpenAssign(client, 'plan')}>
                                        <Dumbbell className="h-3 w-3 mr-1" /> Program
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
