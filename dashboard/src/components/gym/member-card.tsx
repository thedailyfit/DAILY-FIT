import { GymMember } from "@/types/gym-member";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UserCheck, MessageSquare, Edit, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberCardProps {
    member: GymMember;
    index: number;
    trainerName?: string;
    onEdit: (member: GymMember) => void;
    onRemind: (member: GymMember) => void;
}

export function MemberCard({ member, index, trainerName, onEdit, onRemind }: MemberCardProps) {
    const isActive = member.status === 'Active';
    
    const lastActiveDate = member.lastActive ? new Date(member.lastActive) : null;
    let lastActiveText = "Never";
    let lastActiveColor = "text-zinc-500";
    
    if (lastActiveDate) {
        const daysAgo = Math.floor((new Date().getTime() - lastActiveDate.getTime()) / (1000 * 3600 * 24));
        if (daysAgo === 0) {
            lastActiveText = "Today";
            lastActiveColor = "text-emerald-500";
        } else if (daysAgo === 1) {
            lastActiveText = "Yesterday";
            lastActiveColor = "text-emerald-500";
        } else if (daysAgo < 3) {
            lastActiveText = `${daysAgo} days ago`;
            lastActiveColor = "text-emerald-500";
        } else if (daysAgo < 7) {
            lastActiveText = `${daysAgo} days ago`;
            lastActiveColor = "text-yellow-500";
        } else {
            lastActiveText = `${daysAgo} days ago`;
            lastActiveColor = "text-red-500";
        }
    }

    const fmt = (amount?: number) =>
        amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount) : '-';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="rounded-2xl bg-card border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-5 flex flex-col gap-4 relative overflow-hidden backdrop-blur-sm"
        >
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-xl font-bold text-zinc-700">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        isActive ? "bg-green-500" : "bg-red-500"
                    )} />
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-none">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{member.phone}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Membership</span>
                    <span className="font-medium text-sm">
                        {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Assigned PT</span>
                    {trainerName ? (
                        <div className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-primary" />
                            <span className="font-medium text-sm truncate">{trainerName}</span>
                        </div>
                    ) : (
                        <Badge variant="secondary" className="w-fit text-[10px] px-1.5 py-0">No PT</Badge>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Fee (Monthly)</span>
                    <span className="font-bold text-emerald-600">{fmt(member.monthly_fee)}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <span className="text-xs text-muted-foreground">Last Active</span>
                    <span className={cn("font-medium text-sm", lastActiveColor)}>{lastActiveText}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border/50">
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => onEdit(member)}>
                    <Edit className="w-3 h-3 mr-1.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => onRemind(member)}>
                    <MessageSquare className="w-3 h-3 mr-1.5" /> Remind
                </Button>
            </div>
        </motion.div>
    );
}
