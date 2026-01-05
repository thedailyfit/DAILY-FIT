
import { CreateTicketDialog } from "@/components/gym/create-ticket-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function GymSupportPage() {
    const tickets = [
        { id: 'T-101', subject: 'Payment failed for Oct', type: 'Billing', status: 'Resolved', date: '2024-10-05' },
        { id: 'T-102', subject: 'Feature request: Dark mode', type: 'Feature', status: 'In Progress', date: '2024-11-12' },
    ];

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#212121] uppercase tracking-tighter">Support & Help</h1>
                    <p className="text-zinc-500 font-medium">Get assistance from the DailyFit team.</p>
                </div>
                <div>
                    <CreateTicketDialog />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ticket History</CardTitle>
                    <CardDescription>Track the status of your requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-medium">{t.id}</TableCell>
                                    <TableCell>{t.subject}</TableCell>
                                    <TableCell>{t.type}</TableCell>
                                    <TableCell>{t.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs font-bold text-zinc-600">Super Admin</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="secondary" className={
                                            t.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }>
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
