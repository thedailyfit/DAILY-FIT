import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Users, DollarSign, Building, Settings } from "lucide-react";

export default function SuperAdminDashboard() {
    // Mock Data (Connect to 'gyms' table later)
    const gyms = [
        { id: 1, name: "Gold's Gym Metro", owner: "John Doe", status: "Active", trainers: 12, revenue: "$1,200" },
        { id: 2, name: "FitBit Studio", owner: "Sarah Smith", status: "Active", trainers: 5, revenue: "$500" },
        { id: 3, name: "Iron Pumpers", owner: "Mike Tyson", status: "Past Due", trainers: 20, revenue: "$0" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:block">
                <div className="mb-8 flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-500 rounded flex items-center justify-center font-bold">A</div>
                    <span className="text-lg font-bold">DailyFit Admin</span>
                </div>
                <nav className="space-y-4">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-indigo-400 bg-white/10">
                            <Activity className="mr-2 h-4 w-4" /> Overview
                        </Button>
                    </Link>
                    <Link href="/admin/payments">
                        <Button variant="ghost" className="w-full justify-start hover:text-white hover:bg-white/10">
                            <DollarSign className="mr-2 h-4 w-4" /> Revenue
                        </Button>
                    </Link>
                    <Link href="/admin/support">
                        <Button variant="ghost" className="w-full justify-start hover:text-white hover:bg-white/10">
                            <Settings className="mr-2 h-4 w-4" /> Support
                        </Button>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Platform Overview</h1>
                        <p className="text-slate-500">Welcome back, Super Admin.</p>
                    </div>
                    <Button>+ Add New Gym</Button>
                </header>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue (MRR)</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$12,450</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Gyms</CardTitle>
                            <Building className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">42</div>
                            <p className="text-xs text-muted-foreground">3 pending onboarding</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">156</div>
                            <p className="text-xs text-muted-foreground">Across all gyms</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Gyms Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registered Gyms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Gym Name</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Trainers</TableHead>
                                    <TableHead>Revenue/mo</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {gyms.map((gym) => (
                                    <TableRow key={gym.id}>
                                        <TableCell className="font-medium">{gym.name}</TableCell>
                                        <TableCell>{gym.owner}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${gym.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {gym.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{gym.trainers}</TableCell>
                                        <TableCell>{gym.revenue}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
